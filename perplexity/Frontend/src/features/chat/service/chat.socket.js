import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || window.location.origin;

export const initializeSocketConnection = () => {

    const socket = io(API_URL, {
        withCredentials: true,
    })

    socket.on("connect", () => {
        console.log("Connected to Socket.IO server")
    })

}
