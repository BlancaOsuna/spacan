-- creating a new table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    celular VARCHAR(20) NOT NULL,
    pass VARCHAR(100) NOT NULL
);

-- Crear la tabla 'citas'
CREATE TABLE customer(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_du INT NOT NULL,
    nombre_mascota VARCHAR(100) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    raza VARCHAR(50),
    fecha_cita DATE NOT NULL,
    hora_cita TIME NOT NULL,
    user_id INT,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE (fecha_cita, hora_cita)
);

-- to show all tables
show tables;

