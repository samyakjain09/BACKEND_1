const jwt=require("jsonwebtoken")
async function identifyUser(req,res,next){
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

    req.user=decorded

    next()
}

module.exports=identifyUser

