const express= require("express")
const app=express()


const notes = [
    {
        title:"test1",
        description:"description1"
    }
]

app.get("/",(req,res)=>{
    res.send("hello world")
})



module.exports=app