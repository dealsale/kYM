FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY server.js ./
COPY seed/ ./seed/
COPY site/ ./site/
COPY admin/ ./admin/

ENV PORT=8080
ENV DATA_DIR=/app/data
EXPOSE 8080
CMD ["node", "server.js"]
