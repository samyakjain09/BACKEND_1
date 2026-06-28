import mongoose from "mongoose";

function connectToDb(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Database connected succesfully");
        
    })
    .catch((err)=>{
        console.error("MongoDB connection failed:",err)
    })
}
export default connectToDb


// 

//  