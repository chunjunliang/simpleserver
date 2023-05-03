const express = require('express')
const bodyParser = require('body-parser')

const app = express()

// Use the body-parser middleware to parse plain text payloads
app.use(bodyParser.text())

app.post('/myroute', function (req, res) {
    console.log(req.body)
    res.send('Data received')
})

app.listen(3000, function () {
    console.log('Server listening on port 3000')
})