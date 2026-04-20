const mongoose= require("mongoose")

function connectToDb(){
    mongoose.connect(process.env.Mongo_URI)
    .then(()=>{
        console.log("server is connected")
    })
}

module.exports=connectToDb