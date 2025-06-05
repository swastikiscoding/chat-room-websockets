# Real-Time Chat Room Application

A full-stack real-time chat application built with React, TypeScript, Socket.IO, and Express.

![image](https://github.com/user-attachments/assets/ec6da5ff-9a4e-4b68-bccd-33c4ced68f8b)

## Features

- **Real-time messaging** using WebSockets via Socket.IO
- **Room-based chat system** with unique room codes
- **User presence indicators** showing who is in the room
- **System messages** for user join/leave events
- **Visual user identification** with color-coded avatars
- **Responsive design** for desktop and mobile devices

## Tech Stack

### Frontend
- React 19
- TypeScript
- React Router v7
- Socket.IO Client
- TailwindCSS v4
- Vite

### Backend
- Node.js
- Express
- Socket.IO
- TypeScript

## Project Structure

```
chat-room-websockets/
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   └── App.tsx         # Main application component
│   └── ...
└── backend/                # Node.js backend application
    ├── src/
    │   ├── socket/         # WebSocket handling
    │   └── index.ts        # Main server entry point
    └── ...
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/chat-room-websockets.git
   cd chat-room-websockets
   ```

2. Install dependencies
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies
   cd ../backend
   npm install
   ```

### Development

1. Start the backend server
   ```bash
   cd backend
   npm run dev
   ```

2. In a new terminal, start the frontend development server
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

### Production Build

1. Build the entire application
   ```bash
   npm run build
   ```

2. Start the production server
   ```bash
   npm start
   ```

## How It Works

### Creating/Joining a Room

1. Enter your name on the homepage
2. Choose to create a new room or join an existing one
3. For joining, enter the room code provided by the room creator
4. Start chatting in real-time with other users in the room

### WebSocket Communication

The application uses Socket.IO to establish WebSocket connections between the client and server. Events are emitted and listened to on both ends to facilitate real-time communication.

Main socket events:
- `join-room`: When a user enters a room
- `leave-room`: When a user leaves a room
- `send-message`: When a user sends a message
- `receive-message`: When a message is received
- `room-users`: Updates the list of users in a room
- `user-joined`/`user-left`: System notifications
