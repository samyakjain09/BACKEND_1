const express=require("express")
const app = express()
const noteModel=require("./models/notes.models")

app.use(express.json())

app.post("/notes",async(req,res)=>{
    const {title,description}= req.body

    const note=await noteModel.create({
        title,description
    })

    res.status(201).json({
        "message":"Note Created Succesfully",note
    })
})


app.get("/notes",async(req,res)=>{
    const notes=await noteModel.find()

    res.status(200).json({
        "mesaage":"Notes feched Successfully ",notes
    })
})


module.exports=app