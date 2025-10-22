#!/bin/bash

# Script to stop all Foodie Frenzy services

echo "Stopping Foodie Frenzy services..."

# Find and kill processes running on our service ports
echo "Stopping backend service (port 4000)..."
lsof -ti:4000 | xargs kill -9 2>/dev/null || echo "No backend process found on port 4000"

echo "Stopping frontend service (port 5173)..."
lsof -ti:5173 | xargs kill -9 2>/dev/null || echo "No frontend process found on port 5173"

echo "Stopping admin service (port 5174)..."
lsof -ti:5174 | xargs kill -9 2>/dev/null || echo "No admin process found on port 5174"

echo "All services stopped!"