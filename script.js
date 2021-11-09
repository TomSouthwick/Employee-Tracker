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
    }
  );
};
insertDepartment("Engineering");

// simple query
connection.query("SELECT * FROM `department`", function (err, results, fields) {
  console.log(results); // results contains rows returned by server
});

// with placeholder
// connection.query(
//   "SELECT * FROM `table` WHERE `name` = ? AND `age` > ?",
//   ["Page", 45],
//   function (err, results) {
//     console.log(results);
//   }
// );
