FROM node:18.18.2 AS builder

WORKDIR /marketplace

COPY package.json ./

# Install pnpm
RUN npm install -g pnpm typescript

# Install dependencies
RUN pnpm install

# Copy source
COPY . .

# Build
RUN pnpm run build

# Production image
FROM oven/bun:1.1.4-slim

ENV PORT 8000
ENV NODE_ENV production

WORKDIR /marketplace

COPY --from=builder /marketplace/dist ./dist
COPY --from=builder /marketplace/package.json ./package.json

RUN npm install --only=production

EXPOSE 8000

CMD ["bun", "dist/src/server.js"]