# this was instrumental to make this work, what a mission
# https://www.captaincodeman.com/build-a-docker-container-from-a-pnpm-monorepo
# Stage 1: Install dependencies
FROM node:20 AS builder
RUN corepack enable
WORKDIR /app
#COPY package.json pnpm-lock.yaml .npmrc ./
COPY . .
# Add other workspace package.json copies here if needed
RUN pnpm fetch --frozen-lockfile
RUN pnpm install --frozen-lockfile

# Stage 2: Build the application
# Leverage cached dependencies from previous stage
RUN pnpm -r build
# Create production deployment in /app/out, including only production dependencies
RUN pnpm deploy --filter=web --prod /app/out

# Stage 3: Production image
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
# Copy the production-ready output from the builder stage
COPY --from=builder /app/out .
EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]
