import jwt from "jsonwebtoken"

export async function authUser(req,res,next) {
    const token=req.cookies.token
    if(!token){
        return res.status(401).json({
            message:"unauthorized",
            success:false,
            err:"no token provided"
        })
    }
    try{
        const decorded=jwt.verify(token,process.env.JWT_SECRET)
        req.user=decorded;
        next();
    }catch(err){
        res.status(401).json({
            message:"unauthorized",
            success:false,
            err:"Invalid Token"
        })
    }


}