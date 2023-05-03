const express = require("express");
const fs = require("fs");
const app = express();
const bodyParser = require('body-parser');
const { env } = require("process");
const PORT = process.env.PORT || 3000;

const { Pool } = require('pg');

//const pool = new Pool({
//    user: 'badmintonbattledev_user',
//    host: 'dpg-ch8r7jtgk4qeoo787770-a',
//    database: 'badmintonbattledev',
//    password: '0NXUyac9pz4BrAOVn36pnZgR4ChJYh85',
//    port: 5432, // or your specific port number
//});

//pool.query('SELECT NOW()', (err, res) => {
//    if (err) {
//        console.log('Error connecting to the database:', err);
//    } else {
//        console.log('Successfully connected to the database:', res.rows[0]);
//    }
//    pool.end();
//});

const db = new Pool({
    user: 'badmintonbattledev_user',
    host: 'dpg-ch8r7jtgk4qeoo787770-a',
    database: 'badmintonbattledev',
    password: '0NXUyac9pz4BrAOVn36pnZgR4ChJYh85',
    port: 5432, // or your specific port number
});

db.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.log('Error connecting to the database:', err);
    } else {
        console.log('Successfully connected to the database:', res.rows[0]);
    }
    //db.end();
});

////db.query('CREATE TABLE employees (name TEXT, age INTEGER, email TEXT, phone TEXT)',(err, res) => {
////        if (err) {
////            console.error(err);
////            return;
////        }
////        console.log('employees table created successfully');
////    }
////);
 //create a new employee record
const newEmployee = {
    name: "John Doe",
    age: 30,
    email: "john.doe@example.com",
    phone: "555-1234"
};

// insert the new employee record into the database


// retrieve employee records from the database
//db.query("SELECT * FROM employees", (err, res) => {
//    if (err) {
//        console.error(err);
//        return;
//    }
//    console.log(res.rows);
//});


//console.log("test DB action stop here");


app.use(bodyParser.text())




app.get("/", (req, res) => {
    res.send('Hello node');
    
    res.end();

}
)

app.get("/info", (req, response) => {


    db.query("SELECT * FROM employees", (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(res.rows);
        response.send(res.rows)
    });


    //res.write('Hello employee');
    fs.readFile('employee.txt', 'utf8', function (err, data) {
        if (err) {
            console.error(err);
        } else {

            console.log('the loaded data is ');
            console.log(data);
            //res.contentType = 'text/html';
            response.send('<pre>' + data + '</pre>');
            response.end();
        }
    });
  

}
)

app.get("/info/deleteall", (req, res) => {

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

app.post("/info", (req, res) => {

    //console.log(`receiving data}`);
  // Retrieve employee data from request body
    const newLine = req.body;

    let decodedNewLine = decodeURIComponent(newLine); 
    console.log('the transfered data is ');
    console.log(decodedNewLine);

    db.query("INSERT INTO employees(name, age, email, phone) VALUES($1, $2, $3, $4)", [newEmployee.name, newEmployee.age, newEmployee.email, newEmployee.phone], (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("New employee added to the database");
    });
  
    fs.appendFile('employee.txt', decodedNewLine + '\n',(err) => {
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
