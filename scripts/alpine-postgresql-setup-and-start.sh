#!/usr/bin/env bash

# Exit if any command exits with a non-zero exit code
set -o errexit

echo "Setting up PostgreSQL on Alpine Linux..."

export PGHOST=/postgres-volume/run/postgresql
export PGDATA="$PGHOST/data"

# Verificar y crear los directorios necesarios con los permisos correctos
mkdir -p "$PGDATA"
chown -R postgres:postgres /postgres-volume/run/postgresql
chmod 0700 "$PGDATA"

# Inicializar la base de datos y configurar PostgreSQL como el usuario postgres
su postgres -c "
  initdb -D '$PGDATA';
  sed -i \"s/#unix_socket_directories = '\/run\/postgresql'/unix_socket_directories = '\/postgres-volume\/run\/postgresql'/g\" '$PGDATA/postgresql.conf';
  echo \"listen_addresses='*'\" >> '$PGDATA/postgresql.conf';
  pg_ctl start -D '$PGDATA';
  psql -U postgres postgres <<SQL
    CREATE DATABASE $PGDATABASE;
    CREATE USER $PGUSERNAME WITH ENCRYPTED PASSWORD '$PGPASSWORD';
    GRANT ALL PRIVILEGES ON DATABASE $PGDATABASE TO $PGUSERNAME;
    \\connect $PGDATABASE
    CREATE SCHEMA $PGUSERNAME AUTHORIZATION $PGUSERNAME;
  SQL
"
