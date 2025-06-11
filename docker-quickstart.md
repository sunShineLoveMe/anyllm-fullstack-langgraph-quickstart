# Docker快速部署指南

本指南提供了在Docker环境和阿里云上快速部署AnyLLM Fullstack LangGraph应用的简明步骤。

## 本地Docker部署

### 1. 配置环境变量

复制示例环境变量文件并进行配置：

```bash
cp .env.docker .env
```

根据您的需求编辑`.env`文件，特别是DeepSeek模型的API配置：

```
OPENAI_API_BASE_URL=http://your-deepseek-api-url:port
OPENAI_API_KEY=your-api-key
```

### 2. 构建和启动Docker容器

使用Docker Compose构建和启动应用：

```bash
# 构建容器
docker-compose build

# 启动容器
docker-compose up -d
```

### 3. 访问应用

在浏览器中访问：`http://localhost:5173/app/`

## 阿里云ECS部署步骤

### 1. 准备阿里云ECS实例

1. 在阿里云控制台创建ECS实例（建议2核4GB以上）
2. 开放端口：22(SSH)、80(HTTP)、443(HTTPS)
3. 连接到ECS实例：`ssh root@<your-ecs-ip>`

### 2. 安装Docker环境

```bash
# 安装Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
systemctl start docker
systemctl enable docker

# 安装Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.16.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

### 3. 部署应用

```bash
# 创建应用目录
mkdir -p /app/anyllm
cd /app/anyllm

# 将本地项目文件上传到服务器
# 可以使用scp或git clone

# 配置环境变量
cp .env.docker .env
# 编辑.env文件，设置正确的API配置

# 构建和启动应用
docker-compose up -d --build
```

### 4. 配置Nginx反向代理（可选，用于域名访问）

安装Nginx：

```bash
apt-get update
apt-get install -y nginx
```

创建Nginx配置：

```bash
# 备份默认配置
mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak

# 创建新配置
nano /etc/nginx/nginx.conf
```

将以下内容复制到配置文件中：

```nginx
user  nginx;
worker_processes  auto;

events {
    worker_connections  1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    sendfile        on;
    keepalive_timeout  65;

    server {
        listen       80;
        server_name  your-domain.com;  # 替换为您的域名

        location / {
            proxy_pass http://localhost:5173;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        location /api/ {
            proxy_pass http://localhost:8123;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

重启Nginx：

```bash
nginx -t  # 检查配置
systemctl restart nginx
```

### 5. 配置HTTPS（可选）

使用Let's Encrypt配置HTTPS：

```bash
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```

## 常见问题

### 1. 应用无法启动

检查日志：

```bash
docker-compose logs
```

确保环境变量正确配置，特别是DeepSeek API相关配置。

### 2. 无法访问应用

检查防火墙设置：

```bash
# 查看防火墙状态
systemctl status firewalld

# 如果防火墙开启，添加端口
firewall-cmd --permanent --add-port=80/tcp
firewall-cmd --permanent --add-port=443/tcp
firewall-cmd --permanent --add-port=5173/tcp
firewall-cmd --permanent --add-port=8123/tcp
firewall-cmd --reload
```

### 3. 性能优化

如果应用运行缓慢，可以调整Docker容器的资源限制：

```yaml
# 在docker-compose.yml中添加
services:
  anyllm-app:
    # ... 其他配置 ...
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G
```

## 更多资源

- 完整部署指南：请查看项目中的`deploy-guide.md`
- 阿里云容器服务ACK部署：请查看完整部署指南的相关章节
- 技术支持：如有问题，请联系[栉云科技](http://zhiyunllm.tech/)提供的技术支持 