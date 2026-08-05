# BidCraft Local Development Setup

Welcome to BidCraft! This guide explains how to get the project running locally on your machine.

## Prerequisites
- **Docker & Docker Compose**: The easiest way to run the full stack.
- **Node.js**: (Optional) Only if you want to run services outside of Docker.

## Environment Variables

Before starting, set up your environment variables:

1. **Frontend**:
   ```bash
   cp frontend/.env.example frontend/.env
   ```
   Fill in the missing values (like your Cloudinary and Upstash credentials).

2. **Backend**:
   ```bash
   cp backend/.env.example backend/.env
   ```
   Uncomment the variables under **Mode 1: Local Docker Development**.

## Running the Application

BidCraft uses Docker Compose profiles to let you choose between running local databases or connecting to cloud databases.

### Option 1: Full Local Stack (Recommended)
This starts the Frontend, Backend, a local PostgreSQL database, and a local Redis instance.

```bash
# Using Makefile shortcut
make up

# Or using Docker directly
docker compose --profile local up -d
```

### Option 2: Cloud Database Mode
If you prefer to connect to Neon PostgreSQL and Upstash Redis instead of running them locally, ensure you comment out the local DB/Redis lines in `backend/.env` and uncomment the cloud URLs. Then run:

```bash
# Using Makefile shortcut
make up-cloud

# Or using Docker directly
docker compose --profile cloud up -d
```

## Accessing the Services
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000

*Note: The source code is mounted as a volume into the Docker containers, meaning you can edit files locally and the servers will hot-reload automatically.*

## Useful Commands (Makefile)
- `make logs`: View logs for all running services
- `make down`: Stop everything
- `make shell-frontend`: Open a shell in the frontend container
- `make shell-backend`: Open a shell in the backend container
- `make build`: Force rebuild the Docker images
