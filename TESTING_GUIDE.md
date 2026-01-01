# Testing Guide - Mark Sumo Session Service

Complete guide to test your session service locally before deployment.

## Prerequisites

- Node.js 18+ installed
- Two terminals/command prompts
- WhatsApp installed on your phone
- Internet connection

## Step-by-Step Testing

### 1. Setup Backend

Open Terminal 1:

```bash
cd C:\Users\sumom\mark-sumo-session\backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Start the server
npm run dev
```

**Expected Output:**
```
╔════════════════════════════════════════╗
║  Mark Sumo Session Service Started     ║
╠════════════════════════════════════════╣
║  Port: 5000                            ║
║  Frontend: http://localhost:3000       ║
╚════════════════════════════════════════╝
```

### 2. Setup Frontend

Open Terminal 2:

```bash
cd C:\Users\sumom\mark-sumo-session\frontend

# Install dependencies
npm install

# Create .env.local file
copy .env.local.example .env.local

# Start the dev server
npm run dev
```

**Expected Output:**
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- event compiled client and server successfully
```

### 3. Test Landing Page

1. Open browser: http://localhost:3000
2. You should see:
   - "Mark Sumo Bot Session Generator" title
   - Purple gradient background
   - "Generate Session ID" button
   - Features section (Secure, Fast, Easy)
   - How It Works section

**✅ Success**: Landing page loads correctly

### 4. Test Session Generation

1. Click **"Generate Session ID"** button
2. You should be redirected to: http://localhost:3000/generate
3. Click **"Start Generation"** button

**Expected Flow:**
- Status: "Connecting to session service..."
- Status: "Waiting for QR code..."
- QR code appears

**Check Backend Terminal:**
```
Client connected: <socket-id>
Creating session: <session-id>
QR code generated for session: <session-id>
```

**✅ Success**: QR code is displayed

### 5. Test QR Code Scanning

1. Open WhatsApp on your phone
2. Go to Settings → Linked Devices
3. Tap "Link a Device"
4. Scan the QR code on your screen

**Expected Flow:**
- Backend logs: "WhatsApp connected for session: <session-id>"
- Frontend shows: Success checkmark ✓
- Session ID displayed in a box
- "Copy" button available

**✅ Success**: Session ID generated

### 6. Test Copy Functionality

1. Click the **"Copy"** button
2. You should see:
   - Toast notification: "Session ID copied to clipboard!"
   - Button changes to "✓ Copied"

3. Paste somewhere (notepad) to verify

**✅ Success**: Session ID copied correctly

### 7. Test Another Generation

1. Click **"Generate Another"** button
2. Process should start again
3. New QR code should appear

**✅ Success**: Can generate multiple sessions

## Common Issues & Solutions

### Issue 1: Backend Won't Start

**Error**: `Port 5000 is already in use`

**Solution**:
```bash
# Windows: Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in .env
PORT=5001
```

### Issue 2: Frontend Can't Connect

**Error**: `socket.io connection failed`

**Solution**:
- Check backend is running on port 5000
- Verify `.env.local` has correct URL:
  ```
  NEXT_PUBLIC_API_URL=http://localhost:5000
  ```
- Restart frontend after changing .env.local

### Issue 3: QR Code Not Appearing

**Possible Causes**:
1. Baileys dependency missing
2. Node modules not installed correctly

**Solution**:
```bash
cd backend
rm -rf node_modules
npm install
npm run dev
```

### Issue 4: Session ID Not Generated

**Error**: QR scanned but no session ID

**Solution**:
- Check backend logs for errors
- Ensure WhatsApp is updated
- Try scanning again
- Check internet connection

### Issue 5: Module Not Found Errors

**Error**: `Cannot find module 'socket.io-client'`

**Solution**:
```bash
cd frontend
npm install socket.io-client react-hot-toast
```

## Verification Checklist

Before deployment, verify:

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Landing page loads
- [ ] Can navigate to /generate
- [ ] QR code appears
- [ ] QR code can be scanned
- [ ] Session ID is generated
- [ ] Copy button works
- [ ] Toast notifications appear
- [ ] Can generate multiple sessions
- [ ] No console errors
- [ ] Mobile responsive (test on phone)

## Performance Testing

### Test Session Cleanup

1. Generate a session but don't scan QR
2. Wait 5 minutes
3. Check backend logs: "Cleaned up X old sessions"

**✅ Success**: Auto-cleanup working

### Test Multiple Concurrent Sessions

1. Open 3 browser tabs
2. Generate session in each
3. All should get unique QR codes

**✅ Success**: Multiple sessions supported

## Browser Testing

Test in multiple browsers:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari (if on Mac)
- [ ] Edge

## Mobile Testing

1. Get your local IP:
   ```bash
   ipconfig  # Windows
   # Look for IPv4 Address
   ```

2. Update frontend .env.local:
   ```
   NEXT_PUBLIC_API_URL=http://YOUR_IP:5000
   ```

3. Access from phone: `http://YOUR_IP:3000`

**✅ Success**: Works on mobile browser

## Production Readiness

Before deploying to production:

1. **Test with HTTPS URLs**:
   - Update environment variables
   - Test with deployed URLs

2. **Security Check**:
   - Verify CORS settings
   - Test rate limiting
   - Check session cleanup

3. **Performance**:
   - Test with slow internet
   - Test concurrent users
   - Monitor memory usage

## Next Steps After Testing

1. ✅ All tests passing → Ready to deploy
2. ❌ Issues found → Fix and retest
3. Document any custom configurations
4. Create deployment checklist

## Getting Help

If you encounter issues:

1. Check backend logs in Terminal 1
2. Check browser console (F12)
3. Verify all dependencies installed
4. Try fresh `npm install`
5. Clear browser cache

## Success Criteria

Your session service is ready when:

✅ QR code generates in under 5 seconds
✅ Session ID appears after scanning
✅ Copy functionality works
✅ Auto-cleanup removes old sessions
✅ No errors in console or logs
✅ Mobile responsive design works
✅ Can handle multiple concurrent users

---

**Ready to Deploy?** See README.md for deployment instructions.
