const express=require("express")
const authController=require("../controllers/auth.controller")
const authMiddleware=require("../middlewares/auth.middleware")
const router=express.Router()

router.post("/register",authController.registerUser)

router.post("/login",authController.loginUser)

router.post("/get-me",authMiddleware.authUser,authController.getMe)

router.post("/logout",authController.logoutUser)



module.exports=router