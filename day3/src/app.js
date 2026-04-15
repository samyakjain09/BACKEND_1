const express= require("express")
const app=express()

app.use(express.json())


const notes = [
   
]



app.post("/notes",(req,res)=>{
    console.log(req.body)
    notes.push(req.body)
    console.log(notes)
    res.send("note created")
})

app.get("/notes",(req,res)=>{
    res.send(notes)
})


app.delete("/notes/:index",(req,res)=>{
    delete notes[req.params.index]
    console.log("notes deleted successfully")
})

app.patch("/notes/:index",(req,res)=>{
    notes[req.params.index].description=req.body.test_description
    console.log("description updated succesfully")
    
})



module.exports=app