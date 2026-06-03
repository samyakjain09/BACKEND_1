const userModel = require("../models/user.model")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")

async function registerController(req,res){
    const {email,username,password,bio,profileImage}=req.body

    // const isUserExistByEmail=await userModel.findone({email})

    // if(isUserExistByEmail){
    //     res.status(409).json({
    //         "message":"email already exist"
    //     })
    // }

    // const isUserExistByusername=await userModel.findone({username})

    // if(isUserExistByusername){
    //     res.status(409).json({
    //         "message":"username already exist"
    //     })
    // }

    const isUserExist=await userModel.findOne({
        $or: [
            {email},{username}
        ]
    })

    if(isUserExist){
        res.status(409).json({
            "message":"user Already Exist" + (isUserExist.email==email ? "email already Exist" : "Username Already Exist")
        })
    }

    const hash = await bcrypt.hash(password,10)
    const user=await userModel.create({
        username,password:hash,profileImage,email,bio
    })

    const token = jwt.sign({
        id:user._id
    },process.env.JWT_SECRET,{expiresIn:"1d"})

    res.cookie("token",token)

    res.status(201).json({
        message:"user registered successfully",
        user:{
            email:user.email,
            username:user.username,
            bio:user.bio,
            profileImage:user.profileImage
        }
    })

}


async function loginController(req,res){
    const {username,email,password} = req.body

    const user=await userModel.findOne({
        $or:[{username : username},{email:email}]
    })
    if(!user){
        return res.status(404).json({
            message:"user not found"
        })
    }

    const isPasswordValid=await bcrypt.compare(password,user.password)

    if(!isPasswordValid){
        return res.status(401).json({
            message:"password invalid"
        })
    }

    const token=jwt.sign({
        id:user._id
    },process.env.JWT_SECRET,{expiresIn:"1d"})

    res.cookie("token",token)

    res.status(200).json({
        message:"user looged in successfully",
        user:{
            username:user.username,
            email:user.email,
            bio:user.bio,
            profileImage:user.profileImage
        }
    })

}

module.exports={
    registerController,
    loginController
}