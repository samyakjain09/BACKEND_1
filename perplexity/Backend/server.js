import "dotenv/config"
import app from "./src/app.js"
import connectToDb from "./src/config/database.js"
import http from "http"
import { initSocket } from "./src/sockets/server.socket.js"

const PORT = process.env.PORT || 3000
const httpServer=http.createServer(app)

initSocket(httpServer)

connectToDb()
            .catch((err)=>{
                console.error("MongoDb connection Failed:",err)
                process.exit(1)
            })

httpServer.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})
