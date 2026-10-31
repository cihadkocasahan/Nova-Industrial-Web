#!/bin/sh
set -e

echo "⏳ Waiting for MySQL database..."
until nc -z -v -w30 "$DB_HOST" "$DB_PORT"; do
  echo "Waiting for database connection at $DB_HOST:$DB_PORT..."
  sleep 2
done

echo "✅ Database is reachable!"

echo "🔄 Running database migrations..."
npm run db:migrate || true

echo "🌱 Running database seed (initial data)..."
npm run db:seed || true

echo "🚀 Starting Nova Industrial API Server..."
exec node dist/server.js
