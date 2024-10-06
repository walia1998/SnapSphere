import {Server} from "socket.io";
import express from "express";
import http from "http";
import { Socket } from "dgram";
const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors : {
        origin : 'http://localhost:5173',
        methods : ['GET', 'POST']
    }
})

const userSocketMap = {}; // this map stores socket id corresponding the userId -> socketId

export const getRecevierSocketID = (receiverId) => userSocketMap[receiverId]

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if(userId) {
        userSocketMap[userId] = socket.id;
        console.log(`User Connected: UserId = ${userId}, SocketId = ${socket.id}`);
    }

    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('diconnect', () => {
        if(userId) {
            console.log(`User Connected: UserId = ${userId}, SocketId = ${socket.id}`);
            delete userSocketMap[userId];
        }
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    })
})

export {app,server,io}; 