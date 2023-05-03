const express = require("express");
const fs = require("fs");
const app = express();
const bodyParser = require('body-parser');
const { env } = require("process");
const PORT = process.env.PORT || 3000;


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
