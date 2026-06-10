const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Username is required"],
        unique:[true,"username already Taken"]
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:[true,"Email is already Registered"]
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        select:false
    }
})
const userModel=mongoose.model("user",userSchema)
module.exports=userModel