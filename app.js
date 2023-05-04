const express = require("express");
const fs = require("fs");
const app = express();
const bodyParser = require('body-parser');
const { env } = require("process");
const PORT = process.env.PORT || 3000;

const { Pool } = require('pg');



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


const newEmployee = {
    name: "John Doe",
    age: 30,
    email: "john.doe@example.com",
    phone: "555-1234"
};

let userData="hello database";



app.use(bodyParser.text())




app.get("/", (req, res) => {
    res.send('Hello node');
    
    res.end();

}
)

app.get("/info", (req, response) => {


    db.query("SELECT * FROM UserInfo ORDER BY id DESC LIMIT 3", (err, result) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(result.rows);
        response.json(result.rows);
        //userData = JSON.stringify(res.rows);
        //response.send(userData);
        response.end();
        
        //response.send('data is loaded from the database')
    });
     

}
)

//app.get('/info', (req, res) => {
//    // Create a new PostgreSQL pool
//    const pool = new Pool(dbConfig);

//    // Execute the SELECT query to get the last three rows from the "UserInfo" table
//    const query = 'SELECT * FROM UserInfo ORDER BY id DESC LIMIT 3';
//    pool.query(query)
//        .then((result) => {
//            // If the query is successful, send the result as a JSON response
//            res.json(result.rows);
//        })
//        .catch((err) => {
//            // If there's an error, send a 500 error response
//            console.error(err);
//            res.status(500).send('Internal Server Error');
//        })
//        .finally(() => {
//            // Release the client back to the pool when the request is finished
//            pool.end();
//        });
//});



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
    const inputArray = decodedNewLine.split(',');
    const userObject = {
        deviceID: inputArray[0],
        username: inputArray[1],
        country: inputArray[2],
        ipaddress: inputArray[3],        
        timenow: inputArray[4],
        stage: inputArray[5],
        ping: inputArray[6]        
    };

    //        "INSERT INTO userinfo(name, age, email, phone) VALUES($1, $2, $3, $4)"

    db.query("INSERT INTO UserInfo (deviceID,username, country,ipaddress,timenow,stage,ping) VALUES($1, $2, $3, $4, $5, $6, $7)", [userObject.deviceID, userObject.username, userObject.country, userObject.ipaddress, userObject.timenow, userObject.stage, userObject.ping], (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("New employee added to the database");
    });
  
    //fs.appendFile('employee.txt', decodedNewLine + '\n',(err) => {
    //    if(err) {
    //        console.error(err);
    //        return;
    //    }
    //    console.log('New line added to file.');
    //});
    ////console.log('New line added to file.');
    res.send("New employee added to the database");
    res.end();
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
