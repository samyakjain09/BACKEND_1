const app=require("./src/app")
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

require("dotenv").config()

const connectToDb=require("./src/config/database")

connectToDb()

app.listen(3000,()=>{
    console.log("server is running on port 3000")
})