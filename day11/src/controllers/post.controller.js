const postModel=require("../models/post.model")
const ImageKit=require("@imagekit/nodejs")
const {toFile}=require("@imagekit/nodejs")
const { Folders } = require("@imagekit/nodejs/resources/index.js")
const jwt=require("jsonwebtoken")


const imageKit=new ImageKit({
    privateKey:process.env.IMAGEKIT_PRIVATE_KEY
})

async function createPostController(req,res){
    console.log(req.body,req.file)

    const token=req.cookies.token
    if(!token){
        return res.status(401).json({
            message:"Token not provided,unauthorized access"
        })
    }
    let decorded=null
    try{
        decorded=jwt.verify(token,process.env.JWT_SECRET)
    }catch(err){
        res.status(401).json({
            message:"User not Authorized"
        })
    }


    console.log(decorded)

    const file = await imageKit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), "file"),
        fileName: "image",
        folder: "/cohort2"
})

    const post = await postModel.create({
        caption:req.body.caption,
        imgUrl:file.url,
        user:decorded.id
    })
    res.status(201).json({
        message:"post created successfully",post
    })
}

async function getPostController(req,res){
    const token = req.cookies.token

    if(!token){
        res.status(401).json({
            message:"Unauthorized access"
        })
    }

    let decorded
    try{
        decorded=jwt.verify(token,process.env.JWT_SECRET)
    }catch(err){
        res.status(401).json({
            message:"Token Invalid"
        })
    }

    const userId=decorded.id

    const posts=await postModel.find({
        user:userId
    })

    res.status(200).json({
        message:"Posts Fetched Successfully",posts
    })
}

async function getPostDetailsController(req,res){
    const token =req.cookies.token

    if(!token){
        res.status(401).json({
            message:"Unauthorized access"
        })
    }

    let decorded
    try{
        decorded=jwt.verify(token,process.env.JWT_SECRET)
    }catch(err){
        res.status(401).json({
            message:"invalid Token"
        })
    }

    const userId=decorded.id
    const postId=req.params.postId

    const post = await postModel.findById(postId)

    if(!post){
        return res.status(404).json({
            message:"Post not Found"
        })
    }

    const isValidUser=post.user.toString()===userId

    if(!isValidUser){
        return res.status(403).json({
            message:"Forbidden Content"
        })
    }

    return res.status(200).json({
        message:"post Feched Successfully"
    })

}

module.exports={createPostController,getPostController,getPostDetailsController}