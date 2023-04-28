const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(express.json());

app.post("/employees", (req, res) => {
  // Retrieve employee data from request body
  const newEmployee = req.body;

  // Read existing employee data from JSON file
  const data = JSON.parse(fs.readFileSync("employee.json"));

  // Add new employee to employee data array
  data.push(newEmployee);

  // Write updated data back to JSON file
  fs.writeFileSync("employee.json", JSON.stringify(data));

  // Send successful response
  res.status(201).send("New employee added");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
