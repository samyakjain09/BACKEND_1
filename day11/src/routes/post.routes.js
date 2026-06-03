const express=require("express")
const postRouter=express.Router()
const postController=require("../controllers/post.controller")

postRouter.post("/",postController.createPostController)

module.exports=postRouter