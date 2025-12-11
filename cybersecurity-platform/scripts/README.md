# Development Scripts

This directory contains utility scripts for managing the development environment.

## cleanup-ports.sh

Kills all running NestJS services and frees up ports 3001-3009.

### Usage:

```bash
# Run directly
./scripts/cleanup-ports.sh

# Or use npm script
npm run cleanup
```

### What it does:

1. Kills all running NestJS service processes
2. Frees up ports 3001-3009 (used by microservices)
3. Verifies all ports are available
4. Shows status report

### When to use:

- Before starting all services with `npm run start:all:dev`
- When you get "EADDRINUSE" port errors
- After stopping development to clean up zombie processes
- When switching between different service configurations

### Automatic cleanup:

The cleanup script automatically runs before `npm run start:all:dev` via the `prestart:all:dev` hook.
