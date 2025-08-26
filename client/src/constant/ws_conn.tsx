import { io } from "socket.io-client";
import { server } from ".";

// Create and export a single socket instance
const socket = io(server, {
    withCredentials: true,
    transports: ["websocket"], // Forces WebSocket transport
});

export default socket;
