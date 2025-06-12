#!/bin/bash

# 启动前端服务
echo "Starting frontend service..."
cd frontend || { echo "Failed to enter frontend directory"; exit 1; }
nohup npm run dev > ../frontend.log 2>&1 &
echo "Frontend started with PID $!"

# 启动后端服务
echo "Starting backend service..."
cd ../backend || { echo "Failed to enter backend directory"; exit 1; }
nohup langgraph dev > ../backend.log 2>&1 &
echo "Backend started with PID $!"

echo "All services started in background."

