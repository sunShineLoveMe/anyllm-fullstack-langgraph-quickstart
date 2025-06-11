FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM python:3.11-slim

WORKDIR /app

# 安装基本依赖
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 安装后端依赖
COPY backend/pyproject.toml backend/setup.py ./backend/
WORKDIR /app/backend
RUN pip install -e .
COPY backend/ ./

# 复制前端构建文件
WORKDIR /app
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# 创建环境变量文件
COPY .env.docker .env

# 添加启动脚本
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 8123 5173

ENTRYPOINT ["/docker-entrypoint.sh"] 