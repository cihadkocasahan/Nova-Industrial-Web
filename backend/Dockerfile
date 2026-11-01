FROM node:20-alpine

WORKDIR /app

# Install netcat for healthcheck waiting
RUN apk add --no-cache netcat-openbsd

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Ensure uploads folder exists
RUN mkdir -p uploads && chmod -R 777 uploads

# Setup entrypoint script
RUN chmod +x docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
