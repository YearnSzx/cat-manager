# Cat Manager Frontend

## Local development

```bash
npm install
npm run dev
```

You can override the backend address with a local `.env` file based on `frontend/.env.example`.

## Vercel deployment

Deploy `frontend` as a separate Vercel project.

Required environment variable:

```bash
VITE_API_BASE_URL=https://your-backend-project.vercel.app/api
```
