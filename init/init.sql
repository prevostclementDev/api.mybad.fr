-- ###################################
--             INIT DB
-- ####################################

-- Création de la DB
DROP DATABASE IF EXISTS badminton;
CREATE DATABASE badminton;

-- Utilisation de la BD créée
USE badminton;

-- ############ Table des terrains de badminton ###############
CREATE TABLE badminton_courts (
    name VARCHAR(1) UNIQUE,
    id TINYINT PRIMARY KEY AUTO_INCREMENT
);

-- Valeur de base
INSERT INTO badminton_courts (name) VALUES
    ("A"),
    ("B"),
    ("C"),
    ("D");

-- ############ Table des terrain invalide ############
CREATE TABLE badminton_court_unavailability (
    id MEDIUMINT PRIMARY KEY AUTO_INCREMENT,
    id_court TINYINT,
    start_date_unavailability DATE,
    end_date_unavailability DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME DEFAULT NULL
);

-- ############ Table des horaires possible de reservation ############
CREATE TABLE badminton_hourly (
    id MEDIUMINT PRIMARY KEY AUTO_INCREMENT,
    day VARCHAR(3),
    openTime TIME DEFAULT NULL,
    closeTime TIME DEFAULT NULL
);

-- Valeur de base
INSERT INTO badminton_hourly (day, openTime, closeTime) VALUES
    ('Mon', '10:00:00', '22:00:00'),
    ('Tue', '10:00:00', '22:00:00'),
    ('Wed', '10:00:00', '22:00:00'),
    ('Thu', '10:00:00', '22:00:00'),
    ('Fri', '10:00:00', '22:00:00'),
    ('Sat', '10:00:00', '22:00:00'),
    ('Sun', null, null);

-- ############ Table d'options générique ############
CREATE TABLE badminton_options (
    id MEDIUMINT PRIMARY KEY AUTO_INCREMENT,
    opt_key VARCHAR(255),
    opt_value VARCHAR(255)
);
-- Valeur de base
INSERT INTO badminton_options ( opt_key , opt_value ) VALUES ('reservationTime','00:45:00');

-- ############  Table contenant toutes les reservation ############
CREATE TABLE badminton_reservations (
    id MEDIUMINT PRIMARY KEY AUTO_INCREMENT,
    id_court TINYINT,
    slot TINYINT,
    date DATE,
    id_user MEDIUMINT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME DEFAULT NULL
);

-- ############ Table contenant tous les utilisateurs ############
CREATE TABLE badminton_users (
    id MEDIUMINT PRIMARY KEY AUTO_INCREMENT,
    pseudo VARCHAR(255) UNIQUE,
    mdp VARCHAR(500),
    type ENUM('user', 'admin'),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME DEFAULT NULL
);

-- Valeur de base
INSERT INTO badminton_users (pseudo,mdp,type) VALUES
    ('admybad','$2b$10$sLUj9MqvZ8rLab9onzY9SOxNATghR6kTd60fD4/EHpLhbN/6nzA0y','admin');
    -- mdp : admybad