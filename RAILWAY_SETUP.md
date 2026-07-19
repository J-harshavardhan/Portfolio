# Railway Deployment Instructions

## Quick Deploy to Railway

1. **Sign up at https://railway.app** (free account)

2. **Create New Project** 
   - Click "Create New Project" 
   - Select "Deploy from GitHub"
   - Connect your GitHub account if needed
   - Select the `J-harshavardhan/Portfolio` repository

3. **Configure Backend Directory**
   - Railway will auto-detect the structure
   - Make sure it's set to deploy from `/Backend` directory

4. **Add Environment Variables**
   - In Railway dashboard, go to your project
   - Click "Variables"
   - Add the following:
     ```
     GROQ_API_KEY=<your-groq-api-key>
     VERCEL_URLS=portfolio-xi-three-91.vercel.app
     ```

5. **Deploy**
   - Railway will automatically build and deploy
   - You'll get a URL like: `https://backend-xxxx.railway.app`

6. **Update Vercel Environment Variable**
   - Go to Vercel Dashboard → portfolio project → Settings
   - Environment Variables
   - Add new variable:
     - Key: `VITE_API_URL`
     - Value: `https://backend-xxxx.railway.app` (use your Railway URL)
   - Save

7. **Redeploy on Vercel**
   - Vercel Dashboard → Deployments
   - Click latest deployment → Redeploy
   - Wait ~2 minutes

✅ Done! Chat will work on your deployed site.
