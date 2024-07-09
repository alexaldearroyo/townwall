#!/bin/bash

# Ensure the environment variables are set
source /app/.env

# Run the migrations
pnpm migrate up
