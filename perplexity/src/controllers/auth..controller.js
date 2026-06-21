import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken"
import { sendEmail } from "../services/mail.services.js";

export async function register(req,res) {
    const {email,username,password}=req.body

    const isUserAlreadyExist=await userModel.findOne({
        $or:[{username},{email}]
    })

    if (isUserAlreadyExist){
        return res.status(400).json({
            message:"user with this email or password already exists",
            success:false,
            err:"user already exists"
        })
    }

    const user=await userModel.create({username,email,password})
    const emailVerificationToken=jwt.sign({
        email:user.email
    },process.env.JWT_SECRET)

    await sendEmail({
        to:email,
        subject:"welcome to Perplexity",
        html:`<p>Hi ${username},</p>
            <p>Thank you for registering at perplexity .We are exited to have you on board! </p>
            <p>To get started, please verify your email address by clicking the link below:</p>
            <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
            <p>Best regards,</p><p>The Perplexity Team</p>`
        
    })

    res.status(201).json({
        message:"user registered successfully",
        success:true,
        user:{
            _id:user._id,
            username:user.username,
            email:user.email
        }
    })
}

export async function login(req,res) {
    const {email,password}=req.body;
    const user =await userModel.findOne({email})

    if(!user){
        return res.status(400).json({
            message:"invalid email or password",
            success:false,
            err:"user not found"
        })
    }

    const isPasswordMatch=await user.comparePassword(password);
    if(!isPasswordMatch){
        return res.status(400).json({
            message:"invalid email or password",
            success:false,
            err:"user not found"
        })
    }
    if(!user.verified){
        return res.status(400).json({
            message:"Please verify your Email before LoggedIn",
            success:false,
            err:"Email not verified"
        })
    }

    const token = jwt.sign({
        id:user._id,
        username:user.username,
    },process.env.JWT_SECRET,{expiresIn:"7d"})

    res.cookie("token",token)
    res.status(200).json({
        message:"Login Successful",
        success:true,
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}

export async function getMe(req,res){
    const userId=req.user.id
    const user =await userModel.findById(userId).select("-password")
    if(!user){
        return res.status(401).json({
            message:"user not found",
            success:false,
            err:"user not found"
        })
    }

    res.status(200).json({
        message:"user details fetched successfully",
        success:true,
        user
    })
}

export async function verifyEmail(req,res) {
    const {token}=req.query
    try{
        const decorded=jwt.verify(token,process.env.JWT_SECRET)
    
    
    const user=await userModel.findOne({email:decorded.email})
    if(!user){
        return res.status(400).json({
            message:"invalid Token",
            success:false,
            err:"user not found"
        })
    }

    user.verified=true
    await user.save()
    const html=`<p>Hi ${user.username},</p>
    <p>Your email has been successfully verified. You can now log in to your account and start using our services.</p>
    <a href="http://localhost:3000/login">Login to Perplexity</a>
    <p>Best regards,</p><p>The Perplexity Team</p>`
    return res.send(html)

    }catch(err){
        res.status(400).json({
            message:'Invalid or expired token',
            success:false,
            err:err.message
        })
    }
}