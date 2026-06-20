import {body,validationResult} from "express-validator"
const validate=(req,res,next)=>{
            const errors=validationResult(req)
            if (errors.isEmpty()){
                return next()
            }
            res.status(400).json({
                error:errors.array()
            })
        }


export const RegisterValidation=[
        body("username").isString().withMessage("username must be string"),
        validate
    ]