# Quick Start - Mark Sumo Session Service

Get your session service running in 5 minutes!

## Installation Commands

### Backend

```bash
cd C:\Users\sumom\mark-sumo-session\backend
npm install
copy .env.example .env
npm run dev
```

Leave this terminal open.

### Frontend (New Terminal)

```bash
cd C:\Users\sumom\mark-sumo-session\frontend
npm install
copy .env.local.example .env.local
npm run dev
```

## Access

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## Test It

1. Open http://localhost:3000
2. Click "Generate Session ID"
3. Click "Start Generation"
4. Scan QR code with WhatsApp
5. Copy your session ID!

## Deploy It

### Backend → Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
cd backend
railway login
railway init
railway up

# Add environment variable in Railway dashboard:
# FRONTEND_URL = your-frontend-url
```

### Frontend → Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel

# Add environment variable in Vercel dashboard:
# NEXT_PUBLIC_API_URL = your-backend-url
```

## Custom Domain

After deployment:
- Backend: `api.marksumobot.com`
- Frontend: `sessions.marksumobot.com`

Update environment variables with new URLs.

## Need Help?

- See TESTING_GUIDE.md for detailed testing
- See README.md for full documentation
- Check backend/README.md for backend details
- Check frontend/README.md for frontend details

---

**Next**: Test locally, then deploy to production!
