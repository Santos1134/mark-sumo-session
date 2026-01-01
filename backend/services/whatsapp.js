/**
 * WhatsApp Service
 * Handles Baileys connections for session generation
 */

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');
const path = require('path');
const qrcodeService = require('./qrcode');

class WhatsAppService {
    constructor() {
        this.connections = new Map();
        this.sessionsDir = path.join(__dirname, '../sessions');

        // Create sessions directory if it doesn't exist
        if (!fs.existsSync(this.sessionsDir)) {
            fs.mkdirSync(this.sessionsDir, { recursive: true });
        }
    }

    /**
     * Create a WhatsApp connection for session generation
     * @param {string} sessionId - Unique session identifier
     * @param {object} callbacks - { onQR, onPairingCode, onConnected, onError }
     * @param {object} options - { usePairingCode: boolean, phoneNumber: string }
     */
    async createConnection(sessionId, callbacks, options = {}) {
        try {
            const { onQR, onPairingCode, onConnected, onError } = callbacks;
            const { usePairingCode = false, phoneNumber = null } = options;
            const sessionPath = path.join(this.sessionsDir, sessionId);

            // Create session directory
            if (!fs.existsSync(sessionPath)) {
                fs.mkdirSync(sessionPath, { recursive: true });
            }

            // Load auth state
            const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

            // Get latest Baileys version
            const { version } = await fetchLatestBaileysVersion();

            // Create socket
            const sock = makeWASocket({
                version,
                logger: pino({ level: 'silent' }),
                printQRInTerminal: false,
                auth: state,
                browser: ['Mark Sumo Session Generator', 'Chrome', '1.0.0'],
                connectTimeoutMs: 60000,
                defaultQueryTimeoutMs: 60000,
                keepAliveIntervalMs: 10000
            });

            // Store connection
            this.connections.set(sessionId, {
                sock,
                sessionPath,
                callbacks,
                usePairingCode
            });

            // Handle credentials update
            sock.ev.on('creds.update', saveCreds);

            // Request pairing code if using phone number
            if (usePairingCode && phoneNumber && !state.creds?.registered) {
                try {
                    // Remove any non-digit characters from phone number
                    const cleanNumber = phoneNumber.replace(/\D/g, '');
                    console.log(`Requesting pairing code for: ${cleanNumber}`);

                    const code = await sock.requestPairingCode(cleanNumber);
                    console.log(`Pairing code generated: ${code}`);

                    if (onPairingCode) {
                        onPairingCode(code);
                    }
                } catch (error) {
                    console.error('Error requesting pairing code:', error);
                    onError(new Error('Failed to generate pairing code. Please check the phone number.'));
                    this.disconnectSession(sessionId);
                    return;
                }
            }

            // Handle connection updates
            sock.ev.on('connection.update', async (update) => {
                const { connection, lastDisconnect, qr } = update;

                // QR code generated (only for QR mode)
                if (qr && !usePairingCode) {
                    try {
                        const qrDataUrl = await qrcodeService.generateQRDataURL(qr);
                        if (onQR) {
                            onQR(qrDataUrl);
                        }
                    } catch (error) {
                        console.error('Error generating QR code:', error);
                        onError(error);
                    }
                }

                // Connection established
                if (connection === 'open') {
                    console.log(`WhatsApp connected for session: ${sessionId}`);

                    // Get auth state
                    const authState = await this.getAuthState(sessionPath);
                    onConnected(authState);
                }

                // Connection closed
                if (connection === 'close') {
                    const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
                    const statusCode = lastDisconnect?.error?.output?.statusCode;

                    console.log(`Connection closed for session ${sessionId}. Status code: ${statusCode}`);

                    if (statusCode === DisconnectReason.loggedOut) {
                        onError(new Error('Logged out. Please try again.'));
                    } else if (!shouldReconnect) {
                        onError(new Error('Connection failed. Please try again.'));
                    }

                    // Clean up
                    this.disconnectSession(sessionId);
                }
            });

        } catch (error) {
            console.error(`Error creating connection for session ${sessionId}:`, error);
            callbacks.onError(error);
            this.disconnectSession(sessionId);
        }
    }

    /**
     * Get authentication state from session directory
     * @param {string} sessionPath
     * @returns {object} Auth state
     */
    async getAuthState(sessionPath) {
        try {
            const credsPath = path.join(sessionPath, 'creds.json');
            if (fs.existsSync(credsPath)) {
                const creds = JSON.parse(fs.readFileSync(credsPath, 'utf-8'));
                return creds;
            }
            return null;
        } catch (error) {
            console.error('Error reading auth state:', error);
            return null;
        }
    }

    /**
     * Convert auth state to session string
     * @param {object} authState
     * @returns {string} Base64 encoded session
     */
    async convertToSessionString(authState) {
        try {
            const sessionString = Buffer.from(JSON.stringify(authState)).toString('base64');
            return sessionString;
        } catch (error) {
            console.error('Error converting to session string:', error);
            throw error;
        }
    }

    /**
     * Disconnect a specific session
     * @param {string} sessionId
     */
    disconnectSession(sessionId) {
        const connection = this.connections.get(sessionId);
        if (connection) {
            try {
                connection.sock?.end();
                connection.sock?.ws?.close();

                // Clean up session files
                if (fs.existsSync(connection.sessionPath)) {
                    fs.rmSync(connection.sessionPath, { recursive: true, force: true });
                }

                this.connections.delete(sessionId);
                console.log(`Session ${sessionId} disconnected and cleaned up`);
            } catch (error) {
                console.error(`Error disconnecting session ${sessionId}:`, error);
            }
        }
    }

    /**
     * Disconnect all sessions
     */
    disconnectAll() {
        console.log(`Disconnecting ${this.connections.size} sessions...`);
        for (const sessionId of this.connections.keys()) {
            this.disconnectSession(sessionId);
        }
    }

    /**
     * Get active connections count
     * @returns {number}
     */
    getActiveConnectionsCount() {
        return this.connections.size;
    }
}

// Export singleton instance
module.exports = new WhatsAppService();
