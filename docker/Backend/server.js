import express from "express";
const app=express();
const port=3000;
app.get("/",(req,res)=>{
    res.status(200).json({message:"Hellow world"});
})
app.get("/data",(req,res)=>{
    const data={
        name:"John Doe",
        age:30,
        email:"john.doe@example.com"
    };
    res.status(200).json(data);
});
app.listen(port,()=>{
    `server is running on port ${port} `;
})