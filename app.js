const express = require("express");
const fs = require("fs");
const app = express();
const bodyParser = require('body-parser');
const { env } = require("process");
const PORT = process.env.PORT || 3000;

const { Pool } = require('pg');

const dbConfig = {
    user: 'badmintonbattledev_user',
    host: 'dpg-ch8r7jtgk4qeoo787770-a',
    database: 'badmintonbattledev',
    password: '0NXUyac9pz4BrAOVn36pnZgR4ChJYh85',
    port: 5432, // or your specific port number
};

const db = new Pool(dbConfig);


db.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.log('Error connecting to the database:', err);
    } else {
        console.log('Successfully connected to the database:', res.rows[0]);
    }
    //db.end();
});


app.use(bodyParser.text())




app.get("/", (req, res) => {
    res.send('Hello node');
    
    res.end();

}
)

app.get("/info/:id", (req, res) => {

    //const id = req.params.id; // Get the id parameter from the route

    //db.query("SELECT * FROM UserInfo ORDER BY id LIMIT 10 offset ", (err, result) => {
    //    if (err) {
    //        console.error(err);
    //        return;
    //    }
    //    console.log(result.rows);
    //    response.json(result.rows);
    //    //userData = JSON.stringify(res.rows);
    //    //response.send(userData);
    //    response.end();

    //});

    const { id } = req.params;

    // Calculate the offset based on the id parameter
    const offset = id * 20;

    const query = `
    SELECT * FROM UserInfo
    ORDER BY id
    OFFSET $1
    LIMIT 20
  `;

    db.query(query, [offset])
        .then(result => res.json(result.rows))
        .catch(error => {
            console.error(error);
            res.status(500).send('Internal server error');
    });
})




app.get("/deleteall", (req, res) => {
    db.query("DELETE FROM userinfo", (err, result) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(result.rows);
        res.send("All records is deleted!");
        res.end;
        }
    )}
)


app.get("/inputdata", (req, res) => {
    // read the CSV data from file
    const csvData = fs.readFileSync('fulldb.csv', 'utf8');

    // remove any empty lines from the CSV data
    //const cleanedCsvData = csvData.replace(/^\s*[\r\n]/gm, "");

    // split the CSV data into rows
    const rows = csvData.split('\n');

    // iterate over the rows and insert each row into the IP2Country table
    for (let i = 0; i < rows.length; i++) {
        const cols = rows[i].split(',');

        const ipStart = parseInt(cols[0]);
        const ipEnd = parseInt(cols[1]);
        const countryCode = cols[2];
        const countryName = cols[3];

        const query = {
            text: 'INSERT INTO IP2Country(ip_start, ip_end, country_code, country_name) VALUES($1, $2, $3, $4)',
            values: [ipStart, ipEnd, countryCode, countryName],
        };

        db.query(query, (err, res) => {
            if (err) {
                console.error(err.stack);
            } else {
                console.log(`Inserted row ${i + 1} into IP2Country table`);
            }
        });
    }


    res.send("All IP2Country Data is input into the database!");
    res.end;


   
})


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

// Release the pool when the application exits
process.on('exit', () => {
    db.end();
});
