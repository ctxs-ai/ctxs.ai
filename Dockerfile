# FROM node:20-slim AS base

# ENV PNPM_HOME="/pnpm"
# ENV PATH="$PNPM_HOME:$PATH"
# RUN corepack enable

# FROM base AS prod

# WORKDIR /app
# COPY pnpm-lock.yaml /app
# RUN pnpm fetch --prod

# COPY . /app
# RUN pnpm run -r build

# FROM base
# COPY --from=prod /app/apps/web/node_modules /app/node_modules
# COPY --from=prod /app/apps/web/dist /app/dist
# EXPOSE 4321
# CMD [ "node", "/app/apps/web/dist/server/entry.mjs" ]

FROM node:20 AS base
FROM base AS deps
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml .npmrc ./
COPY apps/web/package.json ./apps/web/package.json
COPY packages/db/package.json ./packages/db/package.json
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm fetch --frozen-lockfile
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile
FROM deps AS build
RUN corepack enable
WORKDIR /app
# COPY package.json pnpm-lock.yaml ./
# RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm fetch --frozen-lockfile
# RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile
COPY . .
RUN pnpm -r build
RUN pnpm deploy --filter=web --prod out
# FROM base
WORKDIR /app/out
# COPY --from=build /app/apps/web/node_modules /app/node_modules
# COPY --from=build /app/apps/web/dist /app/dist
ENV NODE_ENV=production
ENV HOST=0.0.0.0
EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]
