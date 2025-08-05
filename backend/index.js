const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// App setup
const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure upload directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer storage config
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
  res.json({ fileUrl });
});

// Start server and Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Socket.IO chat logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('login', (username) => {
    socket.username = username;
    console.log(`Logged in: ${username}`);
  });

  socket.on('join_group', (group) => {
    if (socket.currentGroup) {
      socket.leave(socket.currentGroup);
      console.log(`${socket.username} left ${socket.currentGroup}`);
    }
    socket.join(group);
    socket.currentGroup = group;
    console.log(`${socket.username} joined ${group}`);
  });

  socket.on('group_message', ({ sender, message }) => {
    const group = socket.currentGroup;
    if (!group) return;
    const timestamp = new Date();
    io.to(group).emit('group_message', { sender, message, timestamp });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Run server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
