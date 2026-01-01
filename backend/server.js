/**
 * Mark Sumo Session Service - Backend Server
 * Generates WhatsApp session IDs using Baileys
 */

require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const sessionManager = require('./services/session');
const whatsappService = require('./services/whatsapp');

const app = express();
const server = http.createServer(app);

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Socket.io setup
const io = new Server(server, {
    cors: corsOptions
});

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        service: 'Mark Sumo Session Service',
        status: 'running',
        version: '1.0.0'
    });
});

// API Routes
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        activeSessions: sessionManager.getActiveSessionCount()
    });
});

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Handle session creation request
    socket.on('create-session', async () => {
        try {
            const sessionId = sessionManager.createSession(socket.id);
            console.log(`Creating session: ${sessionId}`);

            // Send session ID to client
            socket.emit('session-created', { sessionId });

            // Initialize WhatsApp connection
            await whatsappService.createConnection(sessionId, {
                onQR: (qr) => {
                    console.log(`QR code generated for session: ${sessionId}`);
                    socket.emit('qr-update', { qr });
                },
                onConnected: async (authState) => {
                    console.log(`WhatsApp connected for session: ${sessionId}`);

                    // Convert auth state to session string
                    const sessionString = await whatsappService.convertToSessionString(authState);

                    // Send session string to client
                    socket.emit('session-generated', {
                        sessionId: sessionString
                    });

                    // Clean up
                    setTimeout(() => {
                        whatsappService.disconnectSession(sessionId);
                        sessionManager.deleteSession(sessionId);
                    }, 5000);
                },
                onError: (error) => {
                    console.error(`Error in session ${sessionId}:`, error);
                    socket.emit('error', {
                        message: 'Failed to generate session. Please try again.'
                    });
                    sessionManager.deleteSession(sessionId);
                }
            });

        } catch (error) {
            console.error('Error creating session:', error);
            socket.emit('error', {
                message: 'Failed to create session. Please try again.'
            });
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        const sessionId = sessionManager.getSessionBySocketId(socket.id);
        if (sessionId) {
            whatsappService.disconnectSession(sessionId);
            sessionManager.deleteSession(sessionId);
        }
    });
});

// Cleanup old sessions every minute
setInterval(() => {
    const timeout = parseInt(process.env.SESSION_TIMEOUT) || 300000; // 5 minutes
    sessionManager.cleanupOldSessions(timeout);
}, 60000);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║  Mark Sumo Session Service Started     ║
╠════════════════════════════════════════╣
║  Port: ${PORT}                            ║
║  Frontend: ${process.env.FRONTEND_URL || 'http://localhost:3000'} ║
╚════════════════════════════════════════╝
    `);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down gracefully...');
    whatsappService.disconnectAll();
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
