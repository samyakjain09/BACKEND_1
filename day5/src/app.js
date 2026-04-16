const express=require("express")
const app = express()

const notes = []

app.use(express.json())

app.post("/notes",(req,res)=>{
    notes.push(req.body)

    res.status(201).json({
        message:"Notes created successfully"
    })
})


app.get("/notes",(req,res)=>{
    res.status(200).json({
        notes:notes
    })
})

app.delete("/notes/:index",(req,res)=>{
    delete notes[req.params.index]
    res.status(204).json({
        message:"note deleted"
    })
})


module.exports=app;