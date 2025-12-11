#!/bin/bash

# Cleanup script to kill all running services and free up ports

echo "🧹 Cleaning up running services..."

# Kill all NestJS processes
pkill -f "nest start" 2>/dev/null || true
pkill -f "auth-service" 2>/dev/null || true
pkill -f "tenant-service" 2>/dev/null || true
pkill -f "user-service" 2>/dev/null || true
pkill -f "course-service" 2>/dev/null || true
pkill -f "content-service" 2>/dev/null || true
pkill -f "analytics-service" 2>/dev/null || true
pkill -f "reporting-service" 2>/dev/null || true
pkill -f "notification-service" 2>/dev/null || true
pkill -f "integration-service" 2>/dev/null || true

# Wait for processes to terminate
sleep 2

# Check and kill processes on specific ports if still running
PORTS=(3001 3002 3003 3004 3005 3006 3007 3008 3009)
for port in "${PORTS[@]}"; do
  if lsof -ti:$port > /dev/null 2>&1; then
    echo "  Killing process on port $port..."
    lsof -ti:$port | xargs kill -9 2>/dev/null || true
  fi
done

# Verify ports are free
echo ""
echo "📊 Port Status:"
for port in "${PORTS[@]}"; do
  if lsof -ti:$port > /dev/null 2>&1; then
    echo "  ❌ Port $port is still in use"
  else
    echo "  ✅ Port $port is free"
  fi
done

echo ""
echo "✨ Cleanup complete!"
