const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        unique:[true,"username already exist"],
        required:[true,"username is required"]
    },
    email:{
        type:String,
        unique:[true,"email already registered"],
        required:[true,"Email is required"]
    },
    password:{
        type:String,
        required:[true,"password is required"]
    },
    bio:String,
    profileImage:{
        type:String,
        default:"https://ik.imagekit.io/samyakjain/default%20user%20image%20insta.png"
    },
})



const userModel=mongoose.model("users",userSchema)

module.exports=userModel