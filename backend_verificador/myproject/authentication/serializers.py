from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'full_name', 'phone', 'email', 'username', 'password', 'password2', 'role')

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Las contraseñas no coinciden.")
        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            full_name=validated_data['full_name'],
            phone=validated_data['phone'],
            password=validated_data['password'],
            role=validated_data.get('role', 'verificador')  # Por defecto es verificador
        )
        return user

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'full_name', 'phone', 'email', 'username', 'role')
        read_only_fields = ('id',)

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Agregar claims personalizados
        token['username'] = user.username
        token['email'] = user.email
        token['role'] = user.role
        token['full_name'] = user.full_name
        token['is_admin'] = user.role == 'admin'  # Agregar flag de admin
        
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Agregar datos adicionales a la respuesta
        data['username'] = self.user.username
        data['email'] = self.user.email
        data['role'] = self.user.role
        data['full_name'] = self.user.full_name
        data['is_admin'] = self.user.role == 'admin'  # Agregar flag de admin
        return data