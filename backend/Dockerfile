# --------------------------------------------------
# 1. Base Image & Dependencies
# --------------------------------------------------
FROM node:20-alpine AS base
WORKDIR /app

# --------------------------------------------------
# 2. Development Stage
# --------------------------------------------------
FROM base AS development
# Install nodemon globally or rely on devDependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Source code is mounted via volume, so we just run the dev command
CMD ["npm", "run", "dev"]

# --------------------------------------------------
# 3. Builder Stage (Production)
# --------------------------------------------------
FROM base AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
# We only need production dependencies for the final image
RUN npm ci --omit=dev

COPY . .

# --------------------------------------------------
# 4. Production Runner Stage
# --------------------------------------------------
FROM base AS production
WORKDIR /app
ENV NODE_ENV=production

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 backendjs

# Copy dependencies and source code
COPY --from=builder --chown=backendjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=backendjs:nodejs /app/src ./src
COPY --from=builder --chown=backendjs:nodejs /app/package.json ./package.json

USER backendjs

EXPOSE 8000
ENV PORT=8000

CMD ["npm", "start"]
