const express = require("express")
const app = express()

app.get('/',(req,res)=>{
    res.send("hello world")
})
app.get('/about',(req,res)=>{
    res.send("hello world")
})
app.get('/courses',(req,res)=>{
    res.send("hello world")
})

app.listen(3000)

