const mongoose = require('mongoose');

mongoose.connect('mongodb://0.0.0.0:27017/mydatabase')
.then(()=>{
    console.log("ProdDatabase Connected");
}).catch(()=>{
    console.log("Failed to connect to database");
})

const loginSchema = new mongoose.Schema({
    image:{
        type:String,
    },
    name:{
        type:String
    },
    price:{
        type:Number
    }
})

const prodCollection = new mongoose.model("products",loginSchema)


module.exports=prodCollection