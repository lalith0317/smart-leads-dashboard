# Deployment Guide

This project can be deployed without Docker using:

- MongoDB Atlas for the database
- Render for the Express API
- Vercel for the React frontend

## 1. Push to GitHub

Create a new empty GitHub repository, then run:

```bash
git remote add origin https://github.com/YOUR_USERNAME/smart-leads-dashboard.git
git branch -M main
git push -u origin main
```

Do not commit `.env` files. Use `.env.example` only.

## 2. Create MongoDB Atlas Database

1. Create a free Atlas cluster.
2. Create a database user.
3. Add network access for your deployment provider. For simple student deployments, `0.0.0.0/0` is the easiest setting.
4. Copy the connection string.

It should look like:

```text
mongodb+srv://USERNAME:PASSWORD@cluster-name.mongodb.net/smart-leads
```

## 3. Deploy Backend on Render

Create a new Render Web Service from the GitHub repo.

Use these settings:

```text
Root Directory: leave empty
Build Command: npm install && npm run build --workspace server
Start Command: npm run start --workspace server
```

Environment variables:

```env
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster-name.mongodb.net/smart-leads
JWT_SECRET=use-a-long-random-production-secret
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=https://your-vercel-app.vercel.app
NODE_ENV=production
```

After deploy, check:

```text
https://your-render-service.onrender.com/api/health
```

## 4. Deploy Frontend on Vercel

Import the same GitHub repo into Vercel.

Use these settings:

```text
Framework Preset: Vite
Root Directory: client
Build Command: npm run build
Output Directory: dist
```

Environment variable:

```env
VITE_API_URL=https://your-render-service.onrender.com/api
```

Redeploy after adding the environment variable.

## 5. Update Backend CORS

After Vercel gives you the final frontend URL, go back to Render and set:

```env
CLIENT_URL=https://your-vercel-app.vercel.app
```

Redeploy the backend.

## 6. Seed Production Data

For a live submission, create an account from the Register page. If you want demo leads in production, temporarily run the seed command with the production `MONGO_URI`, then remove that access.
