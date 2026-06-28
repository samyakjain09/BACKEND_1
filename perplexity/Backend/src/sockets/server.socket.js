import { Server } from 'socket.io'

let io;

/**
 * Initializes a Socket.IO server with the given HTTP server.
 * The server is configured to allow requests from the origin
 * "http://localhost:5173" with credentials enabled.
 * When a user connects, a log message is printed with the user's ID.
 * @param {http.Server} httpServer - The HTTP server to bind the Socket.IO server to.
 */
export function initSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            credentials: true,
        }
    })
    console.log("Socket.io server is running");


    io.on("connection", (socket) => {
        console.log("a user connected" + socket.id);
    })
}

/**
 * Returns the initialized Socket.IO server instance.
 * Throws an error if the server is not initialized.
 * @returns {Server} The initialized Socket.IO server instance.
 * @throws {Error} If the server is not initialized.
 */
export function getIO() {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io
}