FROM oven/bun:1.2.8 AS base

ENV NODE_ENV=production

WORKDIR /app

USER root
RUN apt-get update && apt-get install -y openssl

COPY package.json ./
COPY bun.lock* ./
COPY database ./database
COPY tools ./tools
COPY src/config/env/.env.development ./.env

RUN bun install --frozen-lockfile

RUN chown -R 1001:1001 /app/node_modules

COPY . .
RUN bun run build

RUN groupadd -r -g 1001 GainPlay && useradd -r -u 1001 -g GainPlay nestjs
USER nestjs

EXPOSE 3000

CMD ["bun", "start:prod"]
