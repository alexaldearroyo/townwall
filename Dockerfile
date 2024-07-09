# Dockerfile

FROM node:lts-alpine AS builder

# Install necessary tools
RUN apk add --no-cache libc6-compat yq --repository=https://dl-cdn.alpinelinux.org/alpine/edge/community

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy the project content
COPY . .

# Combine dependencies
RUN yq --inplace --output-format=json '(.dependencies = .dependencies * (.devDependencies | to_entries | map(select(.key | test("^(autoprefixer|daisyui|tailwindcss|typescript|@types/*|eslint-config-upleveled)$"))) | from_entries)) | (.devDependencies = {})' package.json

# Set specific environment variables for the build
ENV BUILD_ENV=true

# Install dependencies and build the application
RUN pnpm install
RUN pnpm build

# Execution stage
FROM node:lts-alpine AS runner

ENV NODE_ENV production

# Install necessary tools
RUN apk add bash postgresql
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy the built application
COPY --from=builder /app/.next ./.next

# Copy only files necessary to run the application
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/migrations ./migrations
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/next.config.js ./

# Copy startup scripts and make them executable
COPY --from=builder /app/scripts ./scripts
RUN chmod +x /app/scripts/fly-io-start.sh

CMD ["./scripts/fly-io-start.sh"]
