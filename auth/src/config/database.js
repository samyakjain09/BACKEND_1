const mongoose=require("mongoose")

function connectDb(){
    mongoose.connect(process.env.MONGO_URI)
        .then(()=>{
            console.log("connected to DB")
        })
}

module.exports=connectDb