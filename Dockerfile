# Stage 1: Build
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:20-slim
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY tsconfig.json ./
COPY drizzle.config.* ./
COPY --from=builder /app/shared ./shared

ENV NODE_ENV=production
EXPOSE 5000

# Using tsx to run the server entry point as defined in your scripts
CMD ["node", "dist/index.cjs"]
