INSERT INTO department (department_name)
VALUES ("Engineering");

insert into roles (title, salary, department_id)
VALUES ("Tech Lead", 300000, 1);

insert into roles (title, salary, department_id)
VALUES ("Full Stack Developer", 100000, 1);

insert into employee (first_name, last_name, role_id)
VALUES ("Ben", "Jovie", 1);

insert into employee (first_name, last_name, role_id, manager_id)
VALUES ("David", "Subordinate", 2, 1);

-- INSERT INTO department
-- VALUES (department_name);