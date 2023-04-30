const express = require("express");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const { env } = require("process");

//app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    res.setHeader('Content-Type', 'application/json') //example: set header
    next();
});

app.get("/", (req, res) => {
    res.write('Hello node');
    res.end();

}
)

app.get("/employees", (req, res) => {
    res.write('Hello employee');
    res.end();

}
)

app.post("/employees", (req, res) => {

    //console.log(`receiving data}`);
  // Retrieve employee data from request body
    const newEmployee = req.body;


    console.log('the transfered data is ');
    console.log(newEmployee);
    //res.send('Data received');

  // Read existing employee data from JSON file
    const data = JSON.parse(fs.readFileSync("employee.json"));
    console.log('the loaded data is ');
    console.log(data);

  // Add new employee to employee data array
  data.push(newEmployee);

  // Write updated data back to JSON file
  fs.writeFileSync("employee.json", JSON.stringify(data));

  // Send successful response
  res.status(201).send("New employee added");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
