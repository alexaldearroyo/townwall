#!/usr/bin/env bash

set -o errexit

# Verificar si la configuración de PostgreSQL existe
if [[ ! -f /postgres-volume/run/postgresql/data/postgresql.conf ]]; then
  echo "⚠️ No PostgreSQL database found, run the setup script"
  /app/scripts/alpine-postgresql-setup-and-start.sh
fi

echo "Setting up PostgreSQL on Fly.io..."

if ! su postgres -c "pg_ctl status -D /postgres-volume/run/postgresql/data"; then
  su postgres -c "pg_ctl start -D /postgres-volume/run/postgresql/data"
else
  echo "PostgreSQL is already running."
fi

sleep 5

pnpm migrate up

echo "HOST: $HOST"
echo "PORT: $PORT"

export PORT=8080
export HOST=0.0.0.0
./node_modules/.bin/next start -p 8080 -H 0.0.0.0
