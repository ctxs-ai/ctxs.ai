FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS prod

WORKDIR /app
COPY pnpm-lock.yaml /app
RUN pnpm fetch --prod

COPY . /app
RUN pnpm run -r build

FROM base
COPY --from=prod /app/apps/web/node_modules /app/node_modules
COPY --from=prod /app/apps/web/dist /app/dist
EXPOSE 4321
CMD [ "node", "/app/apps/web/dist/server/entry.mjs" ]
