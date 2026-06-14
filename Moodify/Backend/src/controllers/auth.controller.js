const userModel=require("../models/user.model")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const blacklistModel=require("../models/blacklist.model")
const redis=require("../config/cache")

async function registerUser(req,res){
    const {username,email,password}=req.body;

    const isAlreadyExist=await userModel.findOne({
        $or:[
            {email},{username}
        ]
    })

    if(isAlreadyExist){
        return res.status(400).json({
            message:"user with the same email or username is Exist"
        })
    }

    const hash=await bcrypt.hash(password,10)

    const user=await userModel.create({
        username,email,password:hash
    })

    const token=jwt.sign({
        id:user._id,
        username:user.username
    },process.env.JWT_SECRET,{expiresIn:"3d"})

    res.cookie("token",token)
    res.status(201).json({
        message:"user Registered Successfully",
        user:{
            username:user.username,
            id:user._id,
            email:user.email
        }
    })
}

async function loginUser(req,res) {
    const {email,password,username}=req.body

    const user=await userModel.findOne({
        $or:[{email},{username}]
    }).select("+password")
    if(!user){
        return res.status(400).json({
            message:"Invalid Credentials"
        })
    }

    const isPasswordValid=await bcrypt.compare(password,user.password)

    if(!isPasswordValid){
        return res.status(400).json({
            message:'Invalid Credentials'
        })
    }

    const token = jwt.sign({
        id:user._id,
        username:user.username
    },process.env.JWT_SECRET,{expiresIn:'3d'})

    res.cookie("token",token)

    res.status(200).json({
        message:"User Logged in Successfully",user:{
            username:user.username,
            id:user._id,
            email:user.email
        }
    })

}

async function getMe(req,res) {
    const user=await userModel.findById(req.user.id)

    res.status(200).json({
        message:"User Fetched Successfully",user
    })
}

async function logoutUser(req,res) {
    const token=req.cookies.token

    res.clearCookie("token")

    await redis.set(token,Date.now().toString(),"Ex",60*60)

    res.status(200).json({
        message:"logout Successfully    "
    })
}


module.exports={registerUser,loginUser,getMe,logoutUser}