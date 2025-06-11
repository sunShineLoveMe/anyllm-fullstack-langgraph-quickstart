#!/bin/bash
set -e

# 启动后端服务
cd /app/backend
python -m anyagent.server --host 0.0.0.0 --port 8123 &

# 等待后端启动
echo "等待后端服务启动..."
sleep 5

# 启动前端静态文件服务
cd /app
npx serve -s frontend/dist -l 5173 &

# 保持容器运行
echo "服务已启动，监听中..."
tail -f /dev/null 