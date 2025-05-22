from django.urls import path
from .views import RegisterView, MyTokenObtainPairView, UserListView, UserDetailView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', MyTokenObtainPairView.as_view(), name='login'),
    path('users/', UserListView.as_view(), name='user-list'),  # Nueva ruta para listar usuario
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
]