import { Server } from "socket.io";


let io;
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

export function initSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin(origin, callback) {
                if (!origin || allowedOrigins.includes(origin)) {
                    return callback(null, true);
                }

                return callback(new Error("Not allowed by Socket.IO CORS"));
            },
            credentials: true,
        }
    })

    console.log("Socket.io server is RUNNING")

    io.on("connection", (socket) => {
        console.log("A user connected: " + socket.id)
    })
}

export function getIO() {
    if (!io) {
        throw new Error("Socket.io not initialized")
    }

    return io
}
