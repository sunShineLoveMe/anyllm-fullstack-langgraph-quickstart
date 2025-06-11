# 阿里云部署指南

本文档提供了如何将AnyLLM Fullstack LangGraph应用部署到阿里云的详细步骤。

## 目录

1. [前期准备](#前期准备)
2. [构建Docker镜像](#构建Docker镜像)
3. [阿里云ECS部署](#阿里云ECS部署)
4. [阿里云容器服务ACK部署](#阿里云容器服务ACK部署)
5. [配置域名和HTTPS](#配置域名和HTTPS)
6. [监控和维护](#监控和维护)

## 前期准备

### 1. 确保本地环境正确配置

首先，确保您已经完成了本地开发环境的配置，并且应用在本地运行正常。

### 2. 配置环境变量

编辑 `.env.docker` 文件，根据您的实际情况设置以下变量：

```
# OpenAI API配置（使用DeepSeek模型）
OPENAI_API_BASE_URL=http://your-deepseek-api-url:port
OPENAI_API_KEY=your-api-key

# Google搜索API配置（可选）
GOOGLE_API_KEY=your-google-api-key
GOOGLE_CSE_ID=your-google-cse-id

# 其他配置...
```

### 3. 注册阿里云账号

如果您还没有阿里云账号，请前往[阿里云官网](https://www.aliyun.com/)注册账号并完成实名认证。

## 构建Docker镜像

### 1. 本地构建和测试

在项目根目录下执行以下命令构建并测试Docker镜像：

```bash
# 构建镜像
docker-compose build

# 启动容器
docker-compose up -d

# 检查容器运行状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

确认应用正常运行后，在浏览器中访问 `http://localhost:5173/app/` 测试应用。

### 2. 推送镜像到阿里云容器镜像服务

首先，登录阿里云容器镜像服务并创建镜像仓库：

1. 在阿里云控制台找到"容器镜像服务"
2. 创建命名空间和镜像仓库
3. 按照页面提示配置仓库信息

然后，将本地镜像推送到阿里云：

```bash
# 登录阿里云容器镜像服务
docker login --username=<your-username> registry.cn-hangzhou.aliyuncs.com

# 为镜像打标签
docker tag anyllm-fullstack-langgraph-quickstart:latest registry.cn-hangzhou.aliyuncs.com/<namespace>/<repository>:latest

# 推送镜像
docker push registry.cn-hangzhou.aliyuncs.com/<namespace>/<repository>:latest
```

## 阿里云ECS部署

### 1. 创建ECS实例

1. 登录阿里云控制台，找到"云服务器ECS"
2. 点击"创建实例"，选择规格配置（建议至少2核4GB内存）
3. 选择操作系统（推荐Ubuntu 20.04或CentOS 7）
4. 配置安全组，开放以下端口：
   - 22 (SSH)
   - 80 (HTTP)
   - 443 (HTTPS)
   - 8123 (应用后端，可选)
   - 5173 (应用前端，可选)
5. 创建并启动实例

### 2. 连接到ECS实例

```bash
ssh root@<your-ecs-public-ip>
```

### 3. 安装Docker和Docker Compose

```bash
# 安装Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 启动Docker服务
systemctl start docker
systemctl enable docker

# 安装Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.16.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

### 4. 部署应用

创建应用目录并部署：

```bash
# 创建应用目录
mkdir -p /app/anyllm
cd /app/anyllm

# 上传或创建必要文件
# 可以使用scp命令上传本地文件，或者直接在服务器上创建文件

# 编辑.env.docker文件
nano .env.docker

# 创建docker-compose.yml文件
nano docker-compose.yml

# 拉取镜像并启动容器
docker login --username=<your-username> registry.cn-hangzhou.aliyuncs.com
docker-compose pull
docker-compose up -d
```

### 5. 配置Nginx反向代理

安装并配置Nginx：

```bash
# 安装Nginx
apt-get update
apt-get install -y nginx

# 备份默认配置
mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak

# 创建新的配置文件
nano /etc/nginx/nginx.conf
```

将本项目中的`nginx.conf`文件内容复制到这个文件中，根据需要修改配置。

```bash
# 测试配置文件
nginx -t

# 重启Nginx
systemctl restart nginx
```

## 阿里云容器服务ACK部署

如果您需要更强大的容器编排能力，可以考虑使用阿里云容器服务Kubernetes版(ACK)：

### 1. 创建Kubernetes集群

1. 登录阿里云控制台，找到"容器服务Kubernetes版"
2. 创建Kubernetes集群，选择合适的配置
3. 等待集群创建完成

### 2. 配置kubectl

按照控制台提示配置kubectl工具，以便连接到您的Kubernetes集群。

### 3. 创建Kubernetes部署文件

创建`deployment.yaml`文件：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: anyllm-app
  labels:
    app: anyllm
spec:
  replicas: 1
  selector:
    matchLabels:
      app: anyllm
  template:
    metadata:
      labels:
        app: anyllm
    spec:
      containers:
      - name: anyllm
        image: registry.cn-hangzhou.aliyuncs.com/<namespace>/<repository>:latest
        ports:
        - containerPort: 8123
        - containerPort: 5173
        env:
        - name: TZ
          value: Asia/Shanghai
        volumeMounts:
        - name: config
          mountPath: /app/.env
          subPath: .env
      volumes:
      - name: config
        configMap:
          name: anyllm-config
---
apiVersion: v1
kind: Service
metadata:
  name: anyllm-service
spec:
  selector:
    app: anyllm
  ports:
  - name: backend
    port: 8123
    targetPort: 8123
  - name: frontend
    port: 5173
    targetPort: 5173
  type: ClusterIP
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: anyllm-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /$2
spec:
  rules:
  - host: your-domain.com
    http:
      paths:
      - path: /app(/|$)(.*)
        pathType: Prefix
        backend:
          service:
            name: anyllm-service
            port:
              number: 5173
      - path: /api(/|$)(.*)
        pathType: Prefix
        backend:
          service:
            name: anyllm-service
            port:
              number: 8123
```

### 4. 创建ConfigMap

创建包含环境变量的ConfigMap：

```bash
kubectl create configmap anyllm-config --from-file=.env=.env.docker
```

### 5. 部署到Kubernetes集群

```bash
kubectl apply -f deployment.yaml
```

### 6. 检查部署状态

```bash
kubectl get pods
kubectl get services
kubectl get ingress
```

## 配置域名和HTTPS

### 1. 域名配置

1. 登录阿里云控制台，找到"域名"服务
2. 如果您还没有域名，可以购买一个新域名
3. 添加DNS解析记录，将您的域名指向ECS实例的公网IP地址

### 2. 配置HTTPS

使用Let's Encrypt获取免费SSL证书：

```bash
# 安装certbot
apt-get update
apt-get install -y certbot python3-certbot-nginx

# 获取证书并自动配置Nginx
certbot --nginx -d your-domain.com
```

按照提示完成证书获取和配置过程。

## 监控和维护

### 1. 设置日志监控

```bash
# 查看容器日志
docker-compose logs -f

# 查看Nginx日志
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### 2. 设置自动更新

创建定时任务自动更新应用：

```bash
crontab -e
```

添加以下内容：

```
# 每天凌晨2点拉取最新镜像并重启服务
0 2 * * * cd /app/anyllm && docker-compose pull && docker-compose up -d
```

### 3. 监控系统资源

安装和配置监控工具，如阿里云云监控：

1. 登录阿里云控制台，找到"云监控"服务
2. 按照指南安装和配置云监控代理
3. 设置适当的告警规则

---

完成上述步骤后，您的AnyLLM Fullstack LangGraph应用应该已经成功部署在阿里云上，并可以通过您配置的域名访问。如果遇到问题，请检查日志信息或联系栉云科技的技术支持。 