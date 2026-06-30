const express=require("express")
const cookieParser=require("cookie-parser")
const authRoutes=require("./routes/auth.routes")
const cors=require("cors")
const songRoutes=require("./routes/song.routes")
const path = require("path");

const app=express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://moodify-1zy5.onrender.com"
  ],
  credentials: true
}));

app.use("/api/auth",authRoutes)
app.use("/api/songs",songRoutes)

app.use(express.static(path.join(__dirname, "../../Frontend/dist")));

app.get(/.*/, (req, res, next) => {
  if (req.path.startsWith("/api/")) return next();

  res.sendFile(path.join(__dirname, "../../Frontend/dist/index.html"));
});

module.exports=app