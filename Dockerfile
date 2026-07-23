FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY site/ ./site/
ENV PORT=8080
EXPOSE 8080
CMD sh -c "serve -s site -l ${PORT:-8080}"
