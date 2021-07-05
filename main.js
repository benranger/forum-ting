const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Post = require('./db_models/post');
const fs = require('fs');
const path = require('path');
const aws = require('aws-sdk');
const PORT = process.env.PORT || 5000;

//DB Config
const mongoose = require('mongoose');
const { resolveNaptr } = require('dns');
if (process.env.connString===undefined) process.env.connString = fs.readFileSync(path.normalize(__dirname+'/connectionString.txt'), 'utf8');
mongoose.connect(process.env.connString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result)=> {
        console.log("Database connected");
        app.listen(PORT);
    }).catch((err) => console.log(err));

app.set('view engine', 'ejs');
let urlEncodedParser = bodyParser.urlencoded({ extended: false });

app.use("/css/stylesheet.css", function(req, res) {
    let stylesheet = fs.readFileSync(path.normalize(__dirname+"/views/css/stylesheet.css"), 'utf8');
    res.setHeader('Content-Type', 'text/css');
    res.send(stylesheet); 
});

app.use('/favicon.ico', express.static('views/img/favicon.ico'));

app.get('/', function(req, res) {
    Post.find().then((result) => {
        res.render("index", {results: result.reverse()});
    }).catch((err) =>{console.log(err)});
});

app.post('/', urlEncodedParser, function(req, res) {
    
    if (req.body["message"]!=null) {
        let tempName = "Anonymous";
        if (req.body["name"]!=null && req.body["name"]!='') {
            tempName = req.body["name"];
        }
        console.log(`New Post: ${tempName}: ${req.body["message"]}`);
        let date = new Date();
        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const post = new Post({
            name: tempName,
            message: req.body["message"],
            date: `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
        });
        post.save().then((result) => {

            Post.find().then((result) => {
                res.render("index", {results: result.reverse()});
            }).catch((err) =>{console.log(err)});
        }).catch((err) => {console.log(err)});
    }
    else {
        Post.find().then((result) => {
            res.render("index", {results: result.reverse()});
        }).catch((err) =>{console.log(err)});
    }
});