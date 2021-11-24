DROP DATABASE IF EXISTS business_db;
CREATE DATABASE business_db;

USE business_db;

CREATE TABLE department (
    id INT AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(30),
    PRIMARY KEY (id)
);

CREATE TABLE roles (
    id INT AUTO_INCREMENT NOT NULL,
     PRIMARY KEY (id),
    title VARCHAR(30),
    salary DECIMAL(10,2),
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department (id)
    ON DELETE SET NULL
);

CREATE TABLE employee (
    id INT AUTO_INCREMENT NOT NULL,
    PRIMARY KEY (id),
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES roles (id),
    manager_id INT,
    FOREIGN KEY (manager_id) REFERENCES employee (id)
);

