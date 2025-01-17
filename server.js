const express = require('express');
const WebSocket = require('ws');
const http = require('http');

// Create an Express app
const app = express();
const port = 3000;

// Keep track of WebSocket clients
let websocketClients = [];

// Create an endpoint to send a message to all connected WebSocket clients
app.get('/send-message', (req, res) => {
    const message = req.query.message;
    
    // Send a message to all connected WebSocket clients
    websocketClients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });

    res.json({
		message: `Message "${message}" sent`,
		clients: websocketClients.length
	});

});

// Create a test endpoint to check server status
app.get('/', (req, res) => {
    res.send(`WebSocket Server is running. Connected clients: ${websocketClients.length}`);
});

// Create an HTTP server
const server = http.createServer(app);

// Create a WebSocket server
const wss = new WebSocket.Server({ server });

// Handle WebSocket connections
wss.on('connection', (ws, req) => {
    console.log('New WebSocket client connected from:', req.socket.remoteAddress);
    websocketClients.push(ws);

    ws.send('INNOVATORS SOFT;Start Your New Session With Our School Management Software, Plese Whatsapp @  92 322 4559543;https://i.ibb.co/whb6xCj/School-Add.jpghttps')
    // Handle incoming messages from client
    ws.on('message', (message) => {
        console.log('Received message from client:', message.toString());
        
        // Echo the message back to the client
        ws.send(`Server received: ${message}`);
    });

    // Handle client disconnection
    ws.on('close', () => {
        console.log('Client disconnected');
        websocketClients = websocketClients.filter(client => client !== ws);
        console.log(`Remaining connected clients: ${websocketClients.length}`);
    });

    // Handle errors
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

// Start the server
server.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`WebSocket server running at ws://localhost:${port}`);
    console.log('Ready to accept connections from Android client');
});
