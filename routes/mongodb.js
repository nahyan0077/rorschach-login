const mongoose = require('mongoose');

mongoose.connect('mongodb://0.0.0.0:27017/mydatabase')
.then(()=>{
    console.log("Database Connected");
}).catch(()=>{
    console.log("Failed to connect to database");
})

const loginSchema = new mongoose.Schema({
    name:{
        type:String,
        required:false
    },
    password:{
        type:String,
        required:false
    },
    email:{
        type:String,
        required:false
    }
})

const collection = new mongoose.model("collection1",loginSchema)


module.exports=collection