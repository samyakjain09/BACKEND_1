import {Router} from "express"
import { RegisterUser } from "../controllers/auth.controller.js"
const authRouter=Router()

authRouter.post("/Register",RegisterUser)
export default authRouter