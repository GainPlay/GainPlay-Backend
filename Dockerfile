FROM oven/bun:latest AS base

ENV NODE_ENV=production

WORKDIR /app

COPY package.json ./
COPY bun.lock* ./
COPY database ./database
COPY tools ./tools

RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

RUN groupadd -r -g 1001 GainPlay
RUN useradd -r -u 1001 nestjs

USER nestjs

EXPOSE 3000

CMD [ "bun" ,"start:prod" ]