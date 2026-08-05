.PHONY: up up-cloud down logs build shell-frontend shell-backend

# --------------------------------------------------
# Make shortcuts for Docker Compose
# --------------------------------------------------

# Start all services including local PostgreSQL and Redis
up:
	docker compose --profile local up -d

# Start only Frontend and Backend (connects to Cloud DB/Redis)
up-cloud:
	docker compose up -d

# Stop all services and remove containers
down:
	docker compose --profile local down

# View logs for all running services
logs:
	docker compose --profile local logs -f

# Force rebuild of containers
build:
	docker compose --profile local build

# Open a shell in the frontend container
shell-frontend:
	docker compose exec frontend sh

# Open a shell in the backend container
shell-backend:
	docker compose exec backend sh
