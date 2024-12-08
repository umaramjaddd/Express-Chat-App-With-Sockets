const http = require('http');
const { Server } = require('socket.io');
const express = require('express');
const cors = require('cors'); // Import CORS middleware

const app = express();
const server = http.createServer(app);

// Enable CORS for specific origin or all origins (you can adjust this as needed)
app.use(cors(
    {
    origin: '*', // Your frontend URL (Next.js)
    // methods: ['GET', 'POST'],
    // allowedHeaders: ['Content-Type'],
}
));

// Add CORS for WebSocket connections too
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // Frontend URL
        methods: ['GET', 'POST'],
    }
});

io.on('connection', (socket) => {
    console.log('A user connected', socket.id);
   
    socket.on('send_message', (msg) => {
        console.log(msg);
        
    socket.broadcast.emit("receive_message", msg);
      });

      socket.on("new_user", (data)=> {
        console.log(data);
        
        socket.broadcast.emit("user_joined", data)
        
      })

      socket.on("user_typing", (data)=> {
        socket.broadcast.emit("user_typing", data);
        
      })
    
    socket.emit('message', 'Hello from server!');
});
app.get('/', (req, res) => {
  res.send('Socket.IO Server is up and running!');
});

app.route("/users").get((req, res, next)=>{
  res.status(200).json({
    users: ["umar amjad"],
    success:  true,
  });
})


const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});