const express = require("express");
const fs = require("fs");
const ws = require("ws");
const cors = require("cors");

const { port } = JSON.parse(fs.readFileSync("./config.json"));
const app = express();

app.use(cors());
app.use(express.json());
app.use("/", (req, res) => {
  console.log("HTTP ping received");
  res.send("Express server is running");
});

// Create a WebSocket server
const wsServer = new ws.Server({ noServer: true });

// Handle WebSocket connections
wsServer.on("connection", (socket) => {
  console.log("WebSocket connection established");

  // Handle incoming messages
  socket.on("message", (message) => {
    console.log(`Received: ${message}`);
    socket.send(`Echo: ${message}`); // Echo the message back to the client
  });

  // Handle socket close
  socket.on("close", () => console.log("WebSocket connection closed"));
});

// Start the server
const server = app.listen(port, () => console.log(`Server started on port ${port}`));

// Upgrade HTTP requests to WebSocket
server.on("upgrade", (request, socket, head) => {
  console.log("Handling WebSocket upgrade");
  wsServer.handleUpgrade(request, socket, head, (socket) => {
    wsServer.emit("connection", socket, request);
  });
});

