const express = require("express");
const fs = require("fs");
const app = express();
const bodyParser = require('body-parser');
const { env } = require("process");
const PORT = process.env.PORT || 3000;

const { Pool } = require('pg');

const pool = new Pool({
    user: 'badmintonbattledev_user',
    host: 'postgres://badmintonbattledev_user:0NXUyac9pz4BrAOVn36pnZgR4ChJYh85@dpg-ch8r7jtgk4qeoo787770-a/badmintonbattledev',
    database: 'badmintonbattledev_user',
    password: '0NXUyac9pz4BrAOVn36pnZgR4ChJYh85',
    port: 5432, // or your specific port number
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.log('Error connecting to the database:', err);
    } else {
        console.log('Successfully connected to the database:', res.rows[0]);
    }
    pool.end();
});


app.use(bodyParser.text())




app.get("/", (req, res) => {
    res.send('Hello node');
    
    res.end();

}
)

app.get("/info", (req, res) => {
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
