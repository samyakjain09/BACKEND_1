import express from 'express'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.route.js'
import chatRouter from './routes/chat.route.js'
import morgan from 'morgan'
import cors from 'cors'
import path from 'path'


const app  = express()
app.set('trust proxy', 1)


// Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
app.use(morgan("dev"))
app.use(cors({
    origin: [process.env.CLIENT_URL, "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}))

app.use(express.static("./public"))



app.use("/api/auth", authRouter)
app.use("/api/chats", chatRouter)

app.use((req, res) => {
    res.sendFile(path.resolve("public", "index.html"));
});



export default app