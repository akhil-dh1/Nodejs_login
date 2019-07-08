
const Joi = require('@hapi/joi');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');

app.set('view engine','ejs');
//app.use(express.json());
app.use(bodyParser.json())
var jsonParser = bodyParser.json(); 
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'Courses'
});

app.get('/', (req, res) =>
{
    res.sendFile(__dirname + '/home.html');    
});

app.get('/login', (req, res) =>
{
    res.sendFile(__dirname + '/login.html');    
});

app.get('/register', (req, res) =>
{
    res.sendFile(__dirname + '/register.html');    
});

app.post('/login', urlencodedParser, function (req, res) {
    db.connect((err)=> {
        if(err){
            throw err;
        }
        else
            console.log('Mysql connected.........');
    });
    
    let sql = "SELECT * FROM `Login`";
    db.query(sql, (err,result)=>{
        if(err)
        {
            throw err;
        }
        else
        {
            sql = `SELECT ID,Name,Password FROM Login WHERE Name='${req.body.name}'`;    
            //console.log(result);
            db.query(sql, (err,result)=>{
                if(err) throw err;
                else{
                    if(result[0].Name == req.body.name && result[0].Password == req.body.pwd)
                    {
                        res.render('welcome', {Name : req.body.name, ID : result[0].ID});
                    }
                    else
                    {
                        res.send('Wrong password');
                    }
                }
            });
        }
    });
    
    //res.send('welcome, ' + req.body.name)
})

app.post('/register', urlencodedParser, function (req, res) {
    db.connect((err)=> {
        if(err){
            throw err;
        }
        else
            console.log('Mysql connected.........');
    });
    let sql = `INSERT INTO Login (Name,Password) VALUES ('${req.body.name}','${req.body.pwd}')`;
    
    db.query(sql, (err,result)=>{
        if(err)
        {
            throw err;
        }
        else
        {
            sql = `SELECT ID FROM Login WHERE Name='${req.body.name}'`;
            //console.log(sql);
            db.query(sql, (err,result)=>{
                if(err) throw err;
                else
                {
                    //console.log(result[0].ID);
                    res.render('welcome', {Name : req.body.name, ID : result[0].ID});
                }
            })
        }
    });    
})

const port = 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});