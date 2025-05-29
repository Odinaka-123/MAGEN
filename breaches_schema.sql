-- SQL schema for the breaches table with a description field
CREATE TABLE breaches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    password VARCHAR(255),
    breach_status VARCHAR(50),
    breach_source VARCHAR(255),
    breach_timestamp DATETIME,
    description TEXT
);
