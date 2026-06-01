const express=require("express")
const authRouter=express.Router()
const userModel=require("../models/user.model")
const crypto=require("crypto")
const jwt=require("jsonwebtoken")

authRouter.post("/register",async(req,res)=>{
    const {email,name,password} = req.body

    const isUserExist=await userModel.findOne({ email })

    if(isUserExist){
        return res.status(409).json({
            "message":"User Already Exist"
        })
    }

    const user= await userModel.create({
        name,email,password:crypto.createHash('sha256').update(password).digest('hex')
    })

    const token=jwt.sign({
        id:user._id,
    },process.env.JWT_SECRET,{expiresIn:"1h"})

    res.cookie("token",token)
    res.status(201).json({
        "message":"user registered successfully",user
    })
})

authRouter.get("/get-me",async(req,res)=>{
    const token=req.cookies.token
    const decoded=jwt.verify(token,process.env.JWT_SECRET)
    console.log(decoded )
    const user=await userModel.findById(decoded.id)
    res.json({
        "name":user.name,
        "email":user.email
    })
})

authRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body

    const user= await userModel.findOne({email})
    if(!user){
        res.status(404).json({
            "message":"user not found"
        })
    }

    const hash = crypto.createHash('sha256').update(password).digest('hex')

    const isPasswordCorrect=hash==user.password

    if(!isPasswordCorrect){
        return res.status(401).json({
            "message":"Incorrect Password"
        })
    }

    const token=jwt.sign({
        id:user._id
    },process.env.JWT_SECRET,{expiresIn:"1h"})
    res.cookie("token",token)

    res.json({
        "message":"user logged in successfully",
        user:{
            name:user.name,
            email:user.email
        }
    })
})

module.exports=authRouter