const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());

// Database Connecion With MongoDB
mongoose.connect("mongodb+srv://aastha:aasthap0210@cluster0.7mdbjip.mongodb.net/DIVA")

//API Creation

app.get("/",(req,res)=>{
    res.send("Express App is Running")
})

// Image Storage Engine

const storage = multer.diskStorage({
    destination: './upload/images',
    filename:(req,file,cb)=>{
        return cb(null,'${file.fieldname}_${Date.now()}${path.extname(file.originalname)}')
    }
}) 

app.listen(port,(error)=>{
    if (!error) {
        console.log("Server Running on Port "+port) 
    }
    else
    {
        console.log("Error HEllo: "+error)
    }
})




