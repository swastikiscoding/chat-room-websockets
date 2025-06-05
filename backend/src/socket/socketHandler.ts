import { Server, Socket } from "socket.io";

// Keep track of rooms and their users
const rooms: { [roomCode: string]: string[] } = {};
// Track connected sockets by ID to prevent duplicate messages
const connectedSockets: { [socketId: string]: { username: string, roomCode: string } } = {};

export function handleSocketConnection(socket: Socket, io: Server) {
  console.log(`[Server] New connection: ${socket.id}`);
  
  // Check if a room exists
  socket.on("check-room", (roomCode: string, callback) => {
    console.log(`[Server] Checking room: ${roomCode}`);
    // When creating a room, consider it valid even if it doesn't exist yet
    callback(true);
  });

  // Handle joining a room
  socket.on("join-room", ({ username, roomCode }: {username: string, roomCode: string}) => {
    console.log(`[Server] ${username} joining room: ${roomCode}`);
    
    // Check if this socket is already in a room to prevent duplicate joins
    if (connectedSockets[socket.id]) {
      console.log(`[Server] Socket ${socket.id} is already in a room, preventing duplicate join`);
      return;
    }
    
    socket.join(roomCode);
    
    // Initialize room if it doesn't exist
    if (!rooms[roomCode]) {
      console.log(`[Server] Creating new room: ${roomCode}`);
      rooms[roomCode] = [];
    }
    
    // Add user to room only if they're not already in it
    if (!rooms[roomCode].includes(username)) {
      rooms[roomCode].push(username);
      console.log(`[Server] Room ${roomCode} users:`, rooms[roomCode]);
      
      // Emit user joined message to room (except sender)
      socket.to(roomCode).emit("user-joined", `${username} has joined the room`);
      console.log(`[Server] Emitted 'user-joined' event to room: ${roomCode}`);
    }
    
    // Emit updated user list to everyone in the room
    io.to(roomCode).emit("room-users", rooms[roomCode]);
    console.log(`[Server] Emitted 'room-users' event with users:`, rooms[roomCode]);
    
    // Store user data on socket object and in our tracking object
    socket.data.username = username;
    socket.data.roomCode = roomCode;
    connectedSockets[socket.id] = { username, roomCode };
  });

  // Handle leaving a room
  socket.on("leave-room", ({ username, roomCode }: {username: string, roomCode: string}) => {
    console.log(`[Server] ${username} leaving room: ${roomCode}`);
    leaveRoom(socket, io, username, roomCode);
    // Remove from connected sockets tracking
    delete connectedSockets[socket.id];
  });

  // Handle sending a message
  socket.on("send-message", ({ roomCode, username, message }: {roomCode: string, username: string, message: string}) => {
    console.log(`[Server] Message from ${username} in room ${roomCode}: ${message}`);
    io.to(roomCode).emit("receive-message", { username, message });
    console.log(`[Server] Emitted 'receive-message' to room: ${roomCode}`);
  });

  // Handle disconnects
  socket.on("disconnect", () => {
    console.log(`[Server] Disconnection: ${socket.id}`);
    const userData = connectedSockets[socket.id];
    if (userData) {
      leaveRoom(socket, io, userData.username, userData.roomCode);
      delete connectedSockets[socket.id];
    }
  });
}

// Helper function to handle room leaving logic
function leaveRoom(socket: Socket, io: Server, username: string, roomCode: string) {
  console.log(`[Server] Executing leaveRoom for ${username} from ${roomCode}`);
  
  // Remove the user from the room
  if (rooms[roomCode]) {
    const userIndex = rooms[roomCode].indexOf(username);
    
    // Only emit leave message if user was actually in the room
    if (userIndex !== -1) {
      rooms[roomCode].splice(userIndex, 1);
      console.log(`[Server] Updated users for room ${roomCode}:`, rooms[roomCode]);
      
      // Delete room if empty
      if (rooms[roomCode].length === 0) {
        delete rooms[roomCode];
        console.log(`[Server] Room ${roomCode} deleted - no users left`);
      } else {
        // Otherwise notify others that the user has left
        socket.to(roomCode).emit("user-left", `${username} has left the room`);
        io.to(roomCode).emit("room-users", rooms[roomCode]);
        console.log(`[Server] Emitted user-left and room-users events`);
      }
    }
  }
  
  socket.leave(roomCode);
}
