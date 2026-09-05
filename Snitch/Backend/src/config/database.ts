import mongoose from "mongoose"
import { throwDeprecation } from "node:process"
export const connectToDb=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
    }catch(error){
        console.log("Error connecting to database",error)
            throw error
    }
}