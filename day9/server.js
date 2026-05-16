const { connect } = require("mongoose")
const app=require("./src/app")
require("dotenv").config()
const connectToDb=require("./src/config/database")

connectToDb()

app.listen(3000,()=>{
    console.log("server is running on port 3000")
})

console.log("test");