// get the client
const mysql = require("mysql2");

// create the connection to database
const connection = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "P@ssw0rd",
  database: "business_db",
});

const roles = () => {
  return getRoles().then((roles) => {
    return roles.map((d) => {
      return {
        name: d.title,
        value: d.id,
      };
    });
  });
};

// employee sql query

const insertEmployee = (first_name, last_name, role_id, manager_id) => {
  connection.query(
    "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)",
    [first_name, last_name, role_id, manager_id],
    (error, results) => {
      if (error) console.log({ error: error });
      else console.log("employee added!");
    }
  );
};

const insertDepartment = (department_name) => {
  connection.query(
    "INSERT INTO department (department_name) VALUES (?)",
    [department_name],
    (error, results) => {
      if (error) console.log({ error: error });
      else console.log("department added!");
    }
  );
};

const insertRole = (role_name, salary, department_id) => {
  console.log("attempting to insert role");
  connection.query(
    "INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)",
    [role_name, salary, department_id],
    (error, results) => {
      if (error) console.log({ error: error });
      else console.log("role added");
    }
  );
};

const updateEmployeesRole = (employee_id, role_id) => {
  // console.log(role_id);
  connection.query(
    "UPDATE employee SET role_id = (?) WHERE id = (?);",
    [role_id, employee_id],
    (error, results) => {
      if (error) console.log({ error: error });
      else console.log("role updated");
    }
  );
};

const getEmployees = () => {
  return connection
    .promise()
    .execute("SELECT * FROM employee")
    .then((result) => {
      const rows = result[0];
      const cols = result[1];

      return rows;
    });
};

const getDepartments = () => {
  return connection
    .promise()
    .execute("SELECT * FROM department")
    .then((result) => {
      const rows = result[0];
      const cols = result[1];

      return rows;
    });
};

const getRoles = () => {
  return connection
    .promise()
    .execute(
      "SELECT roles.id, roles.salary, roles.title, department.department_name FROM roles JOIN department ON department_id = department.id"
    )
    .then((result) => {
      const rows = result[0];
      const cols = result[1];

      return rows;
    });
};

// getRoles().then((depts) => {
//   console.log(depts);
// });

// insertDepartment("Engineering");

// with placeholder
// connection.query(
//   "SELECT * FROM `table` WHERE `name` = ? AND `age` > ?",
//   ["Page", 45],
//   function (err, results) {
//     console.log(results);
//   }
// );

("use strict");
const inquirer = require("inquirer");

const mainPrompt = () => {
  inquirer
    .prompt({
      type: "list",
      name: "action",
      message: "What do you want to do?",
      choices: [
        "View all employees",
        "Add an employee",
        "Update employee role",
        "View all roles",
        "Add Role",
        "View all departments",
        "Add department",
      ],
    })
    .then((answers) => {
      if (answers.action === "Add department") {
        promptAddDepartment();
      }
      if (answers.action === "Update employee role") {
        promptChangeRole();
      }
      if (answers.action === "Add Role") {
        promptAddRole();
      }
      if (answers.action === "Add an employee") {
        promptAddEmployee();
      }
      if (answers.action === "View all departments") {
        getDepartments().then((depts) => {
          console.log(depts);
          mainPrompt();
        });
      }
      if (answers.action === "View all roles") {
        getRoles().then((roles) => {
          console.log(roles);
          mainPrompt();
        });
      }
      if (answers.action === "View all employees") {
        getEmployees().then((employees) => {
          console.log(employees);
          mainPrompt();
        });
      }

      // inquirer.prompt({
      //   type: "list",
      //   name: "beverage",
      //   message: "And your favorite beverage?",
      //   choices: ["Pepsi", "Coke", "7up", "Mountain Dew", "Red Bull"],
      //   });
    });
};

mainPrompt();

const promptAddEmployee = async () => {
  // Get roles
  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "What is the employee's first name?",
      },
      {
        type: "input",
        name: "last_name",
        message: "What is the employee's last name?",
      },
      {
        type: "list",
        name: "role",
        // should have the roles already present
        choices: await roles(),
        message: "What is the employee's role?",
      },
      {
        type: "list",
        name: "manager_id",
        message: "Which manager do you report to?",
        choices: function () {
          return getEmployees().then((employee) => {
            return employee.map((d) => {
              return {
                name: d.first_name + " " + d.last_name,
                value: d.id,
              };
            });
          });
        },
      },
    ])
    .then((answers) => {
      console.log(answers);
      insertEmployee(
        answers.first_name,
        answers.last_name,
        answers.role,
        answers.manager_id
      );
      mainPrompt();
    });
};

const promptAddRole = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "role",
        message: "Which role do you wish to add?",
      },
      {
        type: "number",
        name: "salary",
        message: "What is the remuneration for this role?",
      },
      {
        type: "list",
        name: "department",
        message: "Which department do you wish to add?",
        choices: function () {
          return getDepartments().then((depts) => {
            return depts.map((d) => {
              return {
                name: d.department_name,
                value: d.id,
              };
            });
          });
        },
      },
    ])
    .then((answers) => {
      console.log(answers);
      insertRole(answers.role, answers.salary, answers.department);
      mainPrompt();
    });
};

const promptChangeRole = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "employee_id",
        message: "Which employee's role do you wish to change?",
        choices: function () {
          return getEmployees().then((employee) => {
            return employee.map((d) => {
              return {
                name: d.first_name + " " + d.last_name,
                value: d.id,
              };
            });
          });
        },
      },
      {
        type: "list",
        name: "role_id",
        // should have the roles already present
        choices: function () {
          return getRoles().then((roles) => {
            return roles.map((d) => {
              return {
                name: d.title,
                value: d.id,
              };
            });
          });
        },
        message: "What is the employee's new role?",
      },
    ])
    .then((answers) => {
      console.log(answers);
      updateEmployeesRole(answers.employee_id, answers.role_id);
      mainPrompt();
    });
};

const promptAddDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message: "What is the department's name",
      },
    ])
    .then((answers) => {
      insertDepartment(answers.department);

      mainPrompt();
    });
};
