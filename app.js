const express = require("express");
const fs = require("fs");
const app = express();
const bodyParser = require('body-parser');
const { env } = require("process");
const PORT = process.env.PORT || 3000;


app.use(bodyParser.text())
//const cors = require('cors');

// Allow all origins
//app.use(cors());

//// Allow specific origins
//app.use(cors({
//    origin: 'http://localhost:3000/employees'
//}));

// Allow multiple origins
//app.use(cors({
//    origin: ['http://example.com', 'http://localhost:3000/employees']
//}));

//app.use(express.static("public"));
//app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(function (req, res, next) {
//    res.setHeader('Content-Type', 'application/json') //example: set header
//    next();
//});

app.get("/", (req, res) => {
    res.send('Hello node');
    
    res.end();

}
)

app.get("/employees", (req, res) => {
    //res.write('Hello employee');
    fs.readFile('employee.txt', 'utf8', function (err, data) {
        if (err) {
            console.error(err);
        } else {

            console.log('the loaded data is ');
            console.log(data);
            //res.contentType = 'text/html';
            res.send('<pre>' + data + '</pre>');
            res.end();
        }
    });

    

}
)

app.get("/employees/deleteall", (req, res) => {

    // Create an empty object to overwrite the contents of the file
    let emptyObject = "";

    // Convert the object to a JSON string
    //let emptyJsonData = JSON.stringify(emptyObject);

    // Write the empty JSON string to the file
    fs.writeFile('employee.txt', emptyObject, err => {
        if (err) throw err;
        console.log('All records deleted successfully!');
        res.send('All records deleted successfully!');
        res.end();
    });
    

}
)

app.post("/employees", (req, res) => {

    //console.log(`receiving data}`);
  // Retrieve employee data from request body
    const newLine = req.body;


   // console.log('the transfered data is ');
   // console.log(newLine);
   // //res.send('Data received');

   // // Read existing employee data from JSON file
   //// let data = JSON.parse(fs.readFileSync("employee.txt"));

   // fs.readFile('employee.txt', 'utf8', function (err, data) {
   //     if (err) {
   //         console.error(err);
   //     } else {

   //         console.log('the loaded data is ');
   //         console.log(data);
   //     }
   // });
    
    //console.log(data);

    // Add the new object to the array
    //data.records.push(newEmployee);


  // Add new employee to employee data array
  //data.push(newEmployee);

  // Write updated data back to JSON file
  //fs.writeFileSync("employee.json", JSON.stringify(data));

  //// Send successful response
  //  //res.status(201).send("New employee added");
  //  res.status(201).send(data);

  //  console.log('the final data is ');
  //  console.log(data);
    //const newLine = 'This is a new line of text.';

    // Append the new line of text to the file
    fs.appendFile('employee.txt', newLine + '\n',(err) => {
        if(err) {
            console.error(err);
            return;
        }
        console.log('New line added to file.');
    });
    //console.log('New line added to file.');
    res.end();
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
