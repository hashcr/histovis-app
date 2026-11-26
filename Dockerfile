# syntax=docker/dockerfile:1
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json .npmrc ./
RUN npm install

COPY . .
ARG BUILD_CONFIG=production
RUN npx ng build --configuration ${BUILD_CONFIG}

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/www /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=15s --timeout=5s --retries=5 \
  CMD wget -q -O - http://127.0.0.1/health >/dev/null 2>&1 || exit 1
