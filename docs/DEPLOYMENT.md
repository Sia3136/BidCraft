# Deployment Guide

This document outlines the deployment strategy for BidCraft, comparing various hosting architectures and providing recommendations for production.

## Recommended Hosting Architecture

For a robust, modern, and cost-effective production deployment, the recommended architecture is:
- **Frontend**: Vercel (Managed Next.js hosting)
- **Backend**: Railway or Render (Managed Docker container hosting)
- **Database**: Neon (Managed Serverless PostgreSQL)
- **Cache**: Upstash (Managed Serverless Redis)
- **External APIs**: Cloudinary (Images), Razorpay (Payments), Firebase (Auth/Admin), etc.

*This decoupled approach ensures you are not locked into a single platform and allows each layer to scale independently.*

## Deployment Options

### 1. Vercel + Railway/Render (Best Free-Tier/Low-Cost Combo)
**Frontend (Vercel)**
- Extremely fast global CDN, seamless Next.js integration.
- No Dockerfile needed; Vercel builds the Next.js app natively.
- *Limitations*: Free tier has limits on serverless function execution time.

**Backend (Railway / Render)**
- **Supported**: Yes. You can deploy the backend using the provided `backend/Dockerfile` with the `production` target.
- **Advantages**: Easy GitHub integration, automatic deployments, affordable scaling.
- **Limitations**: Free tiers spin down inactive containers (Render spins down after 15 minutes of inactivity).

### 2. Fly.io
- **Supported**: Yes. Both Frontend and Backend can be deployed via their Dockerfiles.
- **Advantages**: Run Docker containers close to users (edge deployment), generous free tier.
- **Limitations**: Requires creating `fly.toml` files; learning curve is slightly steeper than Railway.

### 3. DigitalOcean / AWS / Azure (IaaS / VPS)
- **Supported**: Yes, using `docker-compose.prod.yml`.
- **Advantages**: Full control over the environment. Can run frontend, backend, database, and redis on a single droplet to save costs.
- **Limitations**: Requires manual server maintenance, security patching, and setup. Not recommended unless you have specific infrastructure requirements.

## Deployment Checklist

1. **Environment Variables**:
   - Ensure all production secrets (`JWT_SECRET`, `RAZORPAY_KEY_SECRET`, etc.) are securely set in your hosting platform's environment settings.
   - Update `NEXT_PUBLIC_API_URL` on the frontend to point to your live backend domain (e.g., `https://api.yourdomain.com`).
   - Update `FRONTEND_ORIGIN` on the backend to point to your live frontend domain (e.g., `https://yourdomain.com`).

2. **Database Migrations**:
   - Ensure you run database migrations against the production database (Neon). This can be done locally by temporarily setting your local `DATABASE_URL` to Neon and running `npm run migrate`.

3. **Prisma Generate**:
   - The Dockerfiles handle `prisma generate` during the build step.

4. **Healthchecks**:
   - Verify that your `/api/health` endpoint on the backend returns a 200 OK status.

## Common Deployment Issues

- **CORS Errors**: If the frontend cannot communicate with the backend, verify that `FRONTEND_ORIGIN` is correctly set in the backend environment.
- **Database Connection Limits**: Serverless databases like Neon can hit connection limits. Prisma is generally good at pooling, but monitor your active connections.
- **Missing Build Arguments**: Ensure that Next.js has access to all `NEXT_PUBLIC_` variables *during the build process* on your CI/CD platform (like Vercel).

## Future Scaling Recommendations

- **CDN Caching**: Leverage Vercel's Edge Caching for API responses where real-time data is not strictly required.
- **Horizontal Scaling**: The Express backend is stateless (sessions are JWTs, state is in PostgreSQL/Redis). You can easily scale it by running multiple instances behind a load balancer on Railway/Render.
