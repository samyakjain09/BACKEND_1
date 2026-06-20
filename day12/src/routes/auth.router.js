import {Router} from "express"
import { RegisterUser } from "../controllers/auth.controller.js"
import {body,validationResult} from "express-validator"
import { RegisterValidation } from "../validation/auth.validation.js"
const authRouter=Router()

authRouter.post("/Register",
    RegisterValidation
    ,RegisterUser)
export default authRouter   