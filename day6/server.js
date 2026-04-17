const app = require("./src/app")
const mongoose = require("mongoose")

function connectToDb(){
    mongoose.connect("mongodb+srv://samyakjain1p_db_user:samyakjain@cluster0.okowpf3.mongodb.net/day6").then(()=>{
        console.log("connected to database")
    })
}

connectToDb()

app.listen(3000,()=>{
    console.log("server is running on port 3000")
})