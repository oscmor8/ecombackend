const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const validator = require("validator"); // Import the validator library

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON requests

const db = mysql.createConnection({
  host: "us-cdbr-east-06.cleardb.net",
  user: "bb1bd03098cda2",
  password: "d0adc67f",
  database: "heroku_4452ddd73aec511",
});

db.connect((error) => {
  if (error) {
    console.log("Error connecting to the database: ", error);
  } else {
    console.log("Connected to the database");
  }
});

app.post("/submit", (req, res) => {
  const { firstName, lastName, email, number, message } = req.body;

  // Perform additional server-side validation here
  if (!firstName || !lastName || !email || !number || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .json({ error: "Please enter a valid email address." });
  }

  const sql =
    "INSERT INTO contact (first_name, last_name, email, number, message) VALUES (?, ?, ?, ?, ?)";
  const values = [firstName, lastName, email, number, message];

  db.query(sql, values, (error, result) => {
    if (error) {
      console.error("Error inserting data: ", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json({ message: "Data inserted successfully" });
    }
  });
});

app.get("/cars", (req, res) => {
  db.query("SELECT * FROM cars", (error, results) => {
    if (error) {
      console.error("Error retriving car data: ", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(results);
    }
  });
});
app.get("/carsid", (req, res) => {
  const carIds = [1, 3, 5, 6, 8];

  db.query(
    `SELECT * FROM cars WHERE car_id IN (${carIds.join(",")})`,
    (error, results) => {
      if (error) {
        console.error("Error retrieving car data: ", error);
        res.status(500).json({ error: "Internal server error" });
      } else {
        res.json(results);
      }
    }
  );
});

app.listen(8000, () => {
  console.log("Connected to backend");
});
