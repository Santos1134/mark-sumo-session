# Mark Sumo Session Service - Backend

Backend server for generating WhatsApp session IDs using Baileys.

## Features

- Real-time QR code generation via Socket.io
- Automatic session cleanup
- Secure session handling
- CORS support for frontend
- Rate limiting (configurable)

## Installation

```bash
cd backend
npm install
```

## Configuration

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
PORT=5000
FRONTEND_URL=http://localhost:3000
SESSION_TIMEOUT=300000
MAX_SESSIONS_PER_IP=3
```

## Running

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## Project Structure

```
backend/
├── server.js              # Main Express + Socket.io server
├── services/
│   ├── whatsapp.js       # Baileys session handling
│   ├── session.js        # Session management
│   └── qrcode.js         # QR code generation
├── routes/
│   └── session.js        # API routes (optional)
├── utils/
│   ├── cleanup.js        # Auto cleanup utilities
│   └── validator.js      # Validation helpers
└── package.json
```

## Socket.io Events

### Client to Server
- `create-session` - Request new session

### Server to Client
- `session-created` - Session initialized
- `qr-update` - New QR code available
- `session-generated` - Session ID ready
- `error` - Error occurred

## API Endpoints

### GET /
Health check

### GET /api/health
Service health status

## Deployment

### Railway
1. Create new project on Railway
2. Connect repository
3. Add environment variables
4. Deploy

### Render
1. Create new Web Service
2. Connect repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables
6. Deploy

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:3000 |
| SESSION_TIMEOUT | Session timeout in ms | 300000 (5 min) |
| MAX_SESSIONS_PER_IP | Max sessions per IP | 3 |

## Security

- Auto-cleanup of sessions after timeout
- CORS restricted to frontend URL
- No session data logging
- Temporary session files deleted after use

## License

MIT - See LICENSE file
