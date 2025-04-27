FROM oven/bun:1.1.4-slim

WORKDIR /app

# Copy your project files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the source code
COPY . .

EXPOSE 10000

# Run directly (no build step)
CMD ["bun", "src/index.ts"]
