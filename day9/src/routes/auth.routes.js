const express = require("express")
const userModel=require("..user.model.js")

const authRouter=express.Router()

authRouter.post("/register",async(req,res)=>{
    const {email,name,password} = req.body
})

module.exports=authRouter