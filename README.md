# Mark Sumo Session Service

Complete WhatsApp session ID generation service for Mark Sumo Bot.

## Overview

This service allows users to generate WhatsApp session IDs by scanning a QR code. The session ID can then be used to deploy and connect Mark Sumo Bot to their WhatsApp account.

## Architecture

- **Backend**: Node.js + Express + Socket.io + Baileys
- **Frontend**: Next.js 14 (React)
- **Real-time**: Socket.io for QR code streaming

## Project Structure

```
mark-sumo-session/
├── backend/           # Node.js server
│   ├── server.js
│   ├── services/
│   ├── package.json
│   └── README.md
│
└── frontend/          # Next.js app
    ├── app/
    ├── components/
    ├── package.json
    └── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your settings
npm run dev
```

Backend will run on http://localhost:5000

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local with backend URL
npm run dev
```

Frontend will run on http://localhost:3000

## Usage Flow

1. User visits the frontend website
2. Clicks "Generate Session ID"
3. Backend creates WhatsApp connection
4. QR code is displayed in real-time
5. User scans QR with WhatsApp
6. Session ID is generated and displayed
7. User copies session ID for bot deployment

## Features

### Backend
- ✅ Real-time QR code generation
- ✅ Automatic session cleanup
- ✅ Socket.io for live updates
- ✅ CORS security
- ✅ Rate limiting support

### Frontend
- ✅ Modern, responsive UI
- ✅ Real-time QR display
- ✅ One-click copy
- ✅ Status indicators
- ✅ Error handling

## Deployment

### Backend Deployment (Railway)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
cd backend
railway init
railway up
```

### Frontend Deployment (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel
```

Or use the Vercel dashboard:
1. Connect GitHub repository
2. Select frontend directory
3. Add environment variable
4. Deploy

## Environment Variables

### Backend (.env)
```env
PORT=5000
FRONTEND_URL=https://your-frontend.vercel.app
SESSION_TIMEOUT=300000
MAX_SESSIONS_PER_IP=3
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

## Domain Setup

After deployment, configure custom domain:

1. **Backend**: `api.marksumobot.com`
2. **Frontend**: `sessions.marksumobot.com`

Update environment variables accordingly.

## Security Considerations

- ✅ Sessions auto-delete after 5 minutes
- ✅ CORS restricted to frontend domain
- ✅ No session data logging
- ✅ Temporary files cleaned up
- ✅ Rate limiting prevents abuse
- ✅ HTTPS enforced in production

## Monitoring

Check service health:

```bash
# Backend health check
curl http://localhost:5000/api/health

# Response
{
  "status": "healthy",
  "activeSessions": 0
}
```

## Troubleshooting

### QR Code Not Appearing
- Check backend is running
- Verify Socket.io connection
- Check browser console for errors

### Session ID Not Generated
- Ensure WhatsApp scanned correctly
- Check backend logs
- Verify Baileys dependencies installed

### Connection Issues
- Check CORS settings
- Verify frontend URL in backend .env
- Ensure both services are running

## Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm run dev  # Hot reload enabled
```

## Tech Stack

### Backend
- Express.js (web server)
- Socket.io (real-time communication)
- @whiskeysockets/baileys (WhatsApp Web API)
- QRCode (QR generation)
- Pino (logging)

### Frontend
- Next.js 14 (React framework)
- Socket.io-client (Socket connection)
- React Hot Toast (notifications)
- CSS Modules (styling)

## API Reference

### Socket Events

**Client → Server**
```javascript
socket.emit('create-session')
```

**Server → Client**
```javascript
socket.on('session-created', (data) => {})
socket.on('qr-update', (data) => {})
socket.on('session-generated', (data) => {})
socket.on('error', (data) => {})
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## License

MIT License - See LICENSE file

## Support

- GitHub Issues: [Report an issue](https://github.com/Santos1134/mark-sumo-session/issues)
- Email: your-email@example.com

## Credits

Created by Mark Sumo
Built with Baileys WhatsApp Web API

---

**Version**: 1.0.0
**Last Updated**: 2025-01-01
