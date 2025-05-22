-- Actualizar el primer verificador
UPDATE authentication_customuser 
SET first_name = 'John',
    last_name = 'Doe'
WHERE email = 'john.doe@example.com' AND role = 'verificador';

-- Actualizar el segundo verificador
UPDATE authentication_customuser 
SET first_name = 'Grisel',
    last_name = 'Verificador'
WHERE email = 'grisel@gmail.com' AND role = 'verificador'; 