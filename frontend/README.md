# Mark Sumo Session Service - Frontend

Next.js frontend for generating WhatsApp session IDs.

## Features

- Clean, modern UI
- Real-time QR code display
- One-click session ID copy
- Responsive design
- Socket.io integration
- Toast notifications

## Installation

```bash
cd frontend
npm install
```

## Configuration

Create a `.env.local` file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Running

### Development
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/
│   ├── page.js              # Landing page
│   ├── layout.js            # Root layout
│   ├── globals.css          # Global styles
│   └── generate/
│       └── page.js          # Session generator page
├── components/
│   ├── QRDisplay.js         # QR code display component
│   └── SessionOutput.js     # Session ID output component
├── lib/
│   └── socket.js            # Socket.io client
└── package.json
```

## Pages

### / (Home)
- Landing page with features
- "Generate Session ID" CTA
- How it works guide

### /generate
- QR code generator
- Real-time updates
- Session ID display
- Copy to clipboard

## Components

### QRDisplay
Displays WhatsApp QR code with loading state

### SessionOutput
Shows generated session ID with copy functionality

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project on Vercel
3. Add environment variable: `NEXT_PUBLIC_API_URL`
4. Deploy

### Netlify
1. Connect repository
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variables
5. Deploy

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| NEXT_PUBLIC_API_URL | Backend API URL | Yes |

## Customization

### Colors
Edit `globals.css` to change the gradient:

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Branding
Update text in:
- `app/page.js` - Landing page content
- `app/layout.js` - Page metadata

## License

MIT - See LICENSE file
