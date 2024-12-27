#!/bin/sh
set -e

# Run the migration
bun run migrate.ts

# Then run the application
exec "$@"
