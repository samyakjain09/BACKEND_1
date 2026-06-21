import app from "./src/app.js"
import "dotenv/config"
import connectToDb from "./src/config/database.js"
import { testAi } from "./src/services/ai.services.js";

testAi();


connectToDb()
            .catch((err)=>{
                console.error("MongoDb connection Failed:",err)
                process.exit(1)
            })

app.listen(3000,()=>{
    console.log("server is running on port 3000")
})