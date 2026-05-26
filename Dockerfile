# Build stage
FROM node:22-alpine AS build
RUN corepack enable && corepack prepare pnpm@10.30.3 --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN pnpm build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# El template se procesa con envsubst al iniciar (nginx:alpine lo hace solo).
# NGINX_ENVSUBST_FILTER=^PORT$ limita la sustitucion a ${PORT}, dejando
# intactas las variables internas de nginx ($host, $uri, $backend, etc.).
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
ENV NGINX_ENVSUBST_FILTER=^PORT$
CMD ["nginx", "-g", "daemon off;"]
