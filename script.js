// get the client
const mysql = require("mysql2");

// create the connection to database
const connection = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "P@ssw0rd",
  database: "business_db",
});

// employee sql query

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

const insertRole = (role_name, department_id, salary) => {
  console.log("attempting to insert role");
  connection.query(
    "INSERT INTO role (title, department_id, salary) VALUES (?,?,?)",
    [role_name, department_id, salary],
    (error, results) => {
      if (error) console.log({ error: error });
      else console.log("role added");
    }
  );
};

const getDepartments = () => {
  return connection
    .promise()
    .execute("SELECT * FROM `department`")
    .then((result) => {
      const rows = result[0];
      const cols = result[1];

      return rows;
    });
};
const getRoles = () => {
  return connection
    .promise()
    .execute("SELECT * FROM `role`")
    .then((result) => {
      const rows = result[0];
      const cols = result[1];

      return rows;
    });
};

getRoles().then((depts) => {
  console.log(depts);
});

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
        getRoles().then((depts) => {
          console.log(depts);
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
    ])
    .then(function (answer) {
      // Insert query

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
          [
            {
              name: "engineering",
              value: 1,
            },
          ];
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
      insertRole(answers.role, answers.department, answers.salary);
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
