# Portfolio Deployment Guide

## Current Status
- **Frontend**: Deployed on Vercel at `https://portfolio-7z0abg2uy-j-harshavardhans-projects.vercel.app`
- **Backend**: Running locally on `http://localhost:8000`

## Issue: Ask AI Not Working on Vercel

The Vercel frontend cannot reach your local backend because:
- Vercel servers are in the cloud and can't access your local `localhost:8000`
- Your backend needs to be publicly deployed

## Solution: Deploy Backend to a Public Service

### Option 1: Deploy to Railway (Recommended - Easiest)

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Create a Railway Account**
   - Go to https://railway.app
   - Sign up and create a new project

3. **Deploy Backend**
   ```bash
   cd Backend
   railway login
   railway link
   railway up
   ```

4. **Set Environment Variables in Railway**
   - Add `GROQ_API_KEY` from your `.env` file
   - Note the deployed URL (e.g., `https://yourapp.railway.app`)

5. **Update Vercel Environment Variable**
   - In Vercel project settings, add:
     - Key: `VITE_API_URL`
     - Value: `https://yourapp.railway.app`

6. **Redeploy Frontend**
   - Push changes to trigger redeploy, or manually trigger in Vercel dashboard

### Option 2: Deploy to Render

1. **Sign up at https://render.com**

2. **Create new Web Service**
   - Connect your GitHub repository
   - Set build command: `pip install -r Backend/requirements.txt`
   - Set start command: `cd Backend && uvicorn main:app --host 0.0.0.0 --port 8000`

3. **Add Environment Variables**
   - `GROQ_API_KEY`: Your API key
   - `VERCEL_URLS`: Your Vercel domain

4. **Update Vercel with Backend URL**
   - Add `VITE_API_URL` environment variable pointing to your Render URL

## Quick Test: Local Development

To test everything works locally:

```bash
# Terminal 1: Backend
cd Backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000

# Terminal 2: Frontend
cd Frontend
npm run dev
```

Then visit `http://localhost:5173` - the chat should work!

## Files Updated

- `Frontend/src/App.jsx` - Now uses `VITE_API_URL` environment variable
- `Frontend/.env.local` - Local development API URL
- `Frontend/vercel.json` - Vercel deployment configuration
- `Backend/main.py` - Dynamic CORS configuration
