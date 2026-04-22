const mongoose=require("mongoose")
function connectToDb(){
    mongoose.connect("mongodb+srv://samyakjain1p_db_user:samyakjain@cluster0.okowpf3.mongodb.net/day8"
        .then("databse is connected")
    )
}