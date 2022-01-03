const express = require('express');
const bodyParser = require("body-parser");
const chatRouter = require("./routes");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const Chat = require("./chatSchema");
const connect = require("./dbConnection");

// cors 
app.use(cors());

//bodyparser middleware
app.use(bodyParser.json());

//routes
app.use("/chats", chatRouter);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log(`UseR Connected ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with Id: ${socket.id}, joind room: ${data}`);
    })
    socket.on("send_message", (data) => {
        console.log("data.room", data);
        socket.to(data.room).emit("receive_message", { message: data.message });


        // save chat to the database
        connect.then(db => {
            console.log("connected correctly to the server");

            let chatMessage = new Chat({ message: data.message, sender: data.author, type: data.type });
            chatMessage.save();
        });
    })
    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    })
});



server.listen(8080, () => {
    console.log("Server running");
})
