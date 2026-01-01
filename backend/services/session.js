/**
 * Session Management Service
 * Manages active WhatsApp session generation requests
 */

const { v4: uuidv4 } = require('uuid');

class SessionManager {
    constructor() {
        this.sessions = new Map();
        this.socketMap = new Map(); // Map socket IDs to session IDs
    }

    /**
     * Create a new session
     * @param {string} socketId - Socket.io client ID
     * @returns {string} Session ID
     */
    createSession(socketId) {
        const sessionId = uuidv4();
        const session = {
            id: sessionId,
            socketId,
            createdAt: Date.now(),
            status: 'pending' // pending, connected, completed, error
        };

        this.sessions.set(sessionId, session);
        this.socketMap.set(socketId, sessionId);

        return sessionId;
    }

    /**
     * Get session by ID
     * @param {string} sessionId
     * @returns {object|null}
     */
    getSession(sessionId) {
        return this.sessions.get(sessionId) || null;
    }

    /**
     * Get session ID by socket ID
     * @param {string} socketId
     * @returns {string|null}
     */
    getSessionBySocketId(socketId) {
        return this.socketMap.get(socketId) || null;
    }

    /**
     * Update session status
     * @param {string} sessionId
     * @param {string} status
     */
    updateSessionStatus(sessionId, status) {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.status = status;
            session.updatedAt = Date.now();
        }
    }

    /**
     * Delete a session
     * @param {string} sessionId
     */
    deleteSession(sessionId) {
        const session = this.sessions.get(sessionId);
        if (session) {
            this.socketMap.delete(session.socketId);
            this.sessions.delete(sessionId);
            console.log(`Session deleted: ${sessionId}`);
        }
    }

    /**
     * Get count of active sessions
     * @returns {number}
     */
    getActiveSessionCount() {
        return this.sessions.size;
    }

    /**
     * Clean up old sessions
     * @param {number} timeout - Maximum age in milliseconds
     */
    cleanupOldSessions(timeout = 300000) { // Default 5 minutes
        const now = Date.now();
        let cleaned = 0;

        for (const [sessionId, session] of this.sessions.entries()) {
            if (now - session.createdAt > timeout) {
                this.deleteSession(sessionId);
                cleaned++;
            }
        }

        if (cleaned > 0) {
            console.log(`Cleaned up ${cleaned} old sessions`);
        }
    }

    /**
     * Get all sessions (for debugging)
     * @returns {Array}
     */
    getAllSessions() {
        return Array.from(this.sessions.values());
    }
}

// Export singleton instance
module.exports = new SessionManager();
