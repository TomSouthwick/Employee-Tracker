// get the client
const mysql = require("mysql2");

// create the connection to database
const connection = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "P@ssw0rd",
  database: "business_db",
});

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
      if (answers.action === "Add Employee") {
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

const promptAddEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "first name",
        message: "What is the employee's first name?",
      },
      {
        type: "input",
        name: "first name",
        message: "What is the employee's last name?",
      },
      {
        type: "input",
        name: "role id",
        message: "what is the role ID for this employee?",
      },
      {
        type: "list",
        name: "role",
        choices: function () {
          // Pushing all existing role titles into an array for user to select from
          const roleArray = [];
          for (let i = 0; i < res.length; i++) {
            roleArray.push(res[i].title);
          }
          return roleArray;
        },
        message: "What is the employee's role?",
      },
    ])
    .then(function (answer) {
      let roleID;
      for (let j = 0; j < res.length; j++) {
        if (res[j].title == answer.role) {
          roleID = res[j].id;
        }
      }
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
