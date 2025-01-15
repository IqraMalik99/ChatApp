import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { v4 as uuidv4 } from "uuid";
import { Server } from 'socket.io';
import http from 'http';
import { socketAuthentication } from './middlerware/socketmiddleware.js';
import { Message } from './schema/message.schema.js';
import { CHAT_JOINED, CHAT_LEAVED, NEW_MESSAGE_ALERT, ONLINE_USERS, START_TYPING, STOP_TYPING, NEW_MESSAGE, FRIEND_REQUEST_ALERT, Friend_Request } from './constansts/EventName.js'
import { getSockets } from './utilities/Event.js';
import { Chat } from './schema/chat.schema.js';

dotenv.config();
const permittedOrigins = [
    "http://localhost:5173",
    'http://chat-app-frontened-self.vercel.app',
  ];
const corsOptions = {
    origin: function (origin, callback) {
      // List of allowed origins
      const allowedOrigins = [
        'http://localhost:5173',
        'http://chat-app-frontened-self.vercel.app',
      ];
      
      // Check if the request's origin is in the allowed origins list
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true); // Allow the request
      } else {
        callback(new Error('Not allowed by CORS')); // Reject the request
      }
    },
    credentials: true, // Allow credentials (cookies, headers, etc.)
  };

export const app = express();
export const server = http.createServer(app);
export const io = new Server(server, {
    cors: {
        origin: permittedOrigins,
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true,
    }
});

export let userSocketsIds = new Map();
export let onlineUsers = new Set();
let START_TYPING_SHOW="START_TYPING_SHOW";

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message, error: err });
});

app.set("io", io);

// Middleware for socket authentication
io.use((socket, next) => {
    cookieParser()(
        socket.request,
        socket.request.res,
        async (err) => await socketAuthentication(err, socket, next)
    );
    console.log("Socket authenticated successfully");
});

io.on("connection", (socket) => {
    const user = socket.user;
    console.log("socket is :", socket.user);

    const userId = user?._id?.toString(); // Safely access userId

    if (!userId) {
        console.error("User ID not found during connection");
        socket.disconnect();
        return;
    }

    userSocketsIds.set(userId, socket.id);
    console.log("User connected:", { id: userId, socketId: socket.id });
    console.log("Current userSocketsIds map:", userSocketsIds.entries());


    // Utility Function to Map Valid Socket IDs
    const getValidSockets = (members) => {
        if (!Array.isArray(members)) {
            console.error("Invalid members data. Expected an array, got:", members);
            return [];
        }
        return members
            .map((memberId) => userSocketsIds.get(memberId?.toString())) // Safely access memberId
            .filter(Boolean); // Remove undefined or null socket IDs
    };

    // **NEW_MESSAGE Event**
    socket.on(NEW_MESSAGE, async ({ sender, content, chatId, members }) => {
        console.log("Received NEW_MESSAGE event:", { content, chatId, members });

        if (!Array.isArray(members)) {
            console.error("Invalid member data for NEW_MESSAGE:", members);
            return;
        }
        let newMessageForRealTime = {};
        if (sender.toString() === user._id.toString()) {
            newMessageForRealTime = {
                attachment: [],
                chatId,
                content,
                sender: {
                    _id: user._id.toString(),
                    username: user.username,
                },
                createdAt: new Date().toString(),
                _id: uuidv4(),
            };
        }
        const newMessageForDB = {
            content,
            sender: user._id,
            chatId,
        };
        console.log("New message for real time is ,", newMessageForRealTime);

        const recipients = getValidSockets(members);
        console.log("Valid socket IDs for members:", recipients);
        console.log("recipients", recipients);

        try {
            const chat = await Chat.findOne({
                _id: chatId,
                members: { $in: [user._id] },
            });

            if (chat) {
                console.log(`User ${userId} is a member of chat ${chatId}`);
                recipients.forEach((rec) => {
                    console.log("rec :", rec);
                    try {
                        console.log("new new new:", newMessageForRealTime);
                        io.to(rec).emit(NEW_MESSAGE, { newMessageForRealTime });
                    } catch (error) {
                        console.error(`Failed to send message to socket ${rec}:`, error);
                    }
                }
                );
                try {
                    const msg = await Message.create(newMessageForDB);
                    console.log("Message created successfully:", msg);
                } catch (error) {
                    console.error("Error saving message:", error);
                }
            } else {
                console.log(`User ${userId} is NOT a member of chat ${chatId}`);
            }
        } catch (error) {
            console.error("Error finding chat:", error);
            throw error;
        }
    });

    // **Friend Request Event**
    socket.on(Friend_Request, ({ sender, friends }) => {
        console.log("Friends data received:", friends);

        if (!Array.isArray(friends)) {
            console.error("Invalid friends data. Expected an array, got:", friends);
            return;
        }

        const recipientIds = friends.map((friend) => friend?._id).filter(Boolean); // Safely access _id
        console.log("Recipient IDs:", recipientIds);
        const recipients = getValidSockets(recipientIds);
recipients.map((rec)=>   io.to(rec).emit(FRIEND_REQUEST_ALERT, { sender })
)
    });

    socket.on('ACCEPT_FRIEND_REQUEST', ({ requestId }) => {
        console.log("rec id");
        console.log(requestId);
        let arr = requestId.split(" ");
        let recipientId = getValidSockets(arr);
        let message = `${user.username} has accept your friend request`
        console.log("reciept id is ", recipientId);

       recipientId.map((rec)=> io.to(rec).emit('Accept_FRIEND_Request_ALERT', { message }) ) ;
    })

    // socket.on("Attachment", async({chatId,attachment,}))

    socket.on('REJECT_FRIEND_REQUEST', ({ requestId }) => {
        console.log("reject id");
        console.log(requestId);
        let arr = requestId.split(" ");
        let recipientId = getValidSockets(arr);
        let message = `${user.username} has reject your friend request`
        console.log("reciept id is ", recipientId);

        recipientId.map((rec)=>  io.to(rec).emit('Reject_FRIEND_Request_ALERT', { message }) );
    })

    // **Typing Events**
    socket.on(START_TYPING, async({ chatId, userId }) => {
        let chatData = await Chat.findById(chatId);
        let member = chatData.members.filter((mem)=> mem.toString() != userId.toString());
        const recipients = getValidSockets(member);
        let username = user.username;
        socket.to(recipients).emit(START_TYPING_SHOW, { chatId, username });
    });

    // socket.on(STOP_TYPING, ({ chatId, member }) => {
    //     const recipients = getValidSockets(member);
    //     socket.to(recipients).emit(STOP_TYPING, { chatId, username: user.username });
    // });

    // **Chat Events**
    socket.on(CHAT_JOINED, ({ member }) => {
        const recipients = getValidSockets(member);
        onlineUsers.add(userId);
        io.to(recipients).emit(ONLINE_USERS, Array.from(onlineUsers));
    });

    socket.on(CHAT_LEAVED, ({ member }) => {
        const recipients = getValidSockets(member);
        onlineUsers.delete(userId);
        io.to(recipients).emit(ONLINE_USERS, Array.from(onlineUsers));
    });

    // **Handle Disconnection**
    socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
        console.log("Updated userSocketsIds map:", userSocketsIds);
        console.log("Updated onlineUsers set:", onlineUsers);

        userSocketsIds.delete(userId);
        onlineUsers.delete(userId);

        console.log("Updated userSocketsIds map:", userSocketsIds);
        console.log("Updated onlineUsers set:", onlineUsers);

        // socket.broadcast.emit(ONLINE_USERS, Array.from(onlineUsers));  use after done with messages
    });
});

import { userRouter } from './routes/user.routes.js';
import { chatRouter } from './routes/chat.route.js';



app.use("/user", userRouter);
app.use("/chat", chatRouter);
