const express=require('express');
const app=express();
app.use(express.json());
app.get('/',(req,res)=>{
    res.send('Hello World');
});
app.get('/api/data',(req,res)=>{
    res.send('Hello API Data');
});

export default app;