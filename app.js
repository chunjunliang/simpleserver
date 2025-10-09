const express = require("express");
const fs = require("fs");
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const { env } = require("process");
const PORT = process.env.PORT || 3000;

const { Pool } = require('pg');

const dbConfig = {
    user: process.env.DB_USER || 'badmintonbattledev_user',
    host: process.env.DB_HOST || 'dpg-ch8r7jtgk4qeoo787770-a',
    database: process.env.DB_NAME || 'badmintonbattledev',
    password: process.env.DB_PASSWORD || '0NXUyac9pz4BrAOVn36pnZgR4ChJYh85',
    port: process.env.DB_PORT || 5432,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
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

// 静态文件服务
app.use(express.static('.'));

// 配置文件存储
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // 文件存储目录
    },
    filename: function (req, file, cb) {
        // 使用时间戳和原文件名
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        // 只允许JSON文件
        if (file.mimetype === 'application/json' || path.extname(file.originalname) === '.json') {
            cb(null, true);
        } else {
            cb(new Error('只允许上传JSON文件'));
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 限制文件大小为10MB
    }
});

// 确保uploads目录存在
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}




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

// 文件上传端点
app.post('/upload', upload.single('jsonFile'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: '没有上传文件' });
        }

        // 验证JSON格式
        const filePath = req.file.path;
        const fileContent = fs.readFileSync(filePath, 'utf8');
        
        try {
            JSON.parse(fileContent);
        } catch (error) {
            // 删除无效文件
            fs.unlinkSync(filePath);
            return res.status(400).json({ error: '文件格式错误，请确保是有效的JSON文件' });
        }

        res.json({
            message: '文件上传成功',
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size,
            path: req.file.path
        });
    } catch (error) {
        console.error('上传错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 获取文件列表
app.get('/files', (req, res) => {
    try {
        const files = fs.readdirSync(uploadsDir).map(filename => {
            const filePath = path.join(uploadsDir, filename);
            const stats = fs.statSync(filePath);
            return {
                filename: filename,
                size: stats.size,
                uploadTime: stats.mtime,
                downloadUrl: `/download/${filename}`
            };
        });
        
        res.json(files);
    } catch (error) {
        console.error('获取文件列表错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 文件下载端点
app.get('/download/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(uploadsDir, filename);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: '文件不存在' });
        }
        
        res.download(filePath, filename);
    } catch (error) {
        console.error('下载错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 删除文件端点
app.delete('/files/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(uploadsDir, filename);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: '文件不存在' });
        }
        
        fs.unlinkSync(filePath);
        res.json({ message: '文件删除成功' });
    } catch (error) {
        console.error('删除错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Release the pool when the application exits
process.on('exit', () => {
    db.end();
});
