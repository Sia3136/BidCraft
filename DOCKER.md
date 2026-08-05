# Docker Architecture & Overview

This document details the Docker configuration used in BidCraft. 

## Design Philosophy
The Docker setup in BidCraft is designed to:
1. Provide a zero-friction local development environment.
2. Mirror production environments as closely as possible without introducing unnecessary tooling (e.g., no Nginx reverse proxies, no PM2).
3. Strictly use managed cloud services (Neon, Upstash, Firebase, Cloudinary, Razorpay, etc.) via configuration, rather than attempting to containerize or emulate them locally.

## Containers (Services)
- **frontend**: Next.js React application. Multi-stage build targeting `development` locally (with hot-reload) and `production` for optimized standalone deployments.
- **backend**: Express.js REST API. Multi-stage build targeting `development` locally and `production` for deployments.
- **db** (Optional): A local PostgreSQL 15 container for offline development.
- **redis** (Optional): A local Redis 7 container for caching and queues during offline development.

## Networks
- **bidcraft_network**: A custom bridge network that isolates the application services. Inside this network, the backend can reach the local database via `db:5432` and the local Redis instance via `redis:6379`.

## Volumes
- **postgres_data**: Named volume to persist local PostgreSQL data across container restarts.
- **redis_data**: Named volume to persist local Redis data.
- **Source Code Mounts**: In the development environment (`docker-compose.yml`), `./frontend` and `./backend` are bind-mounted to enable hot module replacement (HMR).

## Ports
- **3000**: Next.js Frontend (Exposed to host).
- **8000**: Express.js Backend API (Exposed to host).
- **5432**: PostgreSQL Database (Exposed to host for local database inspection via tools like DBeaver/DataGrip).
- **6379**: Redis (Exposed to host).

## Environment Variables
Environment variables define the behavior of the containers. 
For production, sensitive variables should be managed through your hosting provider (e.g., Vercel / Railway secrets).
For local development, create `.env` files based on the provided `.env.example` templates in the `frontend/` and `backend/` directories.

## Multi-stage Builds
The `Dockerfile` in both `frontend` and `backend` utilizes Docker multi-stage builds.
- **Development Target**: Installs dependencies and runs the development server. Relies on `docker-compose.yml` to mount the source code.
- **Production Target**: Installs only production dependencies (`npm ci --omit=dev`), builds the application, and sets up a secure, non-root user for execution. The Next.js frontend uses `output: 'standalone'` to minimize image size.

## Troubleshooting

### Container fails to start
Check the logs using `make logs` or `docker compose logs`. The backend waits for the `db` and `redis` containers to pass their health checks before starting.

### Hot reloading not working
Ensure you are using the development `docker-compose.yml` and not the production one. File watching might occasionally fail on Windows/WSL2; try restarting the containers (`make down` then `make up`).
