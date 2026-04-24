# Vercel + Cloudinary Deployment

This project is intended to be deployed as two separate Vercel projects:

- `backend/` as a Node.js project
- `frontend/` as a Vite static project

## 1. Prepare Cloudinary

Create a Cloudinary account and collect:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## 2. Deploy the backend

Import the GitHub repository into Vercel and set:

- Root Directory: `backend`

Environment variables:

```bash
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=replace-with-a-long-random-string
JWT_EXPIRE=7d
CORS_ORIGIN=https://your-frontend-project.vercel.app
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 3. Deploy the frontend

Create another Vercel project from the same repo and set:

- Root Directory: `frontend`

Environment variables:

```bash
VITE_API_BASE_URL=https://your-backend-project.vercel.app/api
```

## 4. Finalize CORS

After the frontend gets its final Vercel URL, update the backend `CORS_ORIGIN` to that exact URL and redeploy the backend.
