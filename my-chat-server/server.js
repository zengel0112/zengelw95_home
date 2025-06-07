const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let messages = [];

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const msg = JSON.parse(message);
    messages.push(msg);
    // Broadcast to all clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(msg));
      }
    });
  });
  // Send chat history on connect
  ws.send(JSON.stringify({ type: 'history', messages }));
});

// Serve static React files
app.use(express.static(path.join(__dirname, '../dist')));

// API routes
app.get('/chat/getchat/', (req, res) => {
  res.json({ chat: messages });
});

app.get('/', (req, res) => {
  res.send('Chat server is running!');
});

// SPA fallback (must be last)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

server.listen(3001, () => {
  console.log('Chat server running on http://localhost:3001');
});