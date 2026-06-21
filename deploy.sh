#!/bin/bash
# 阿里云 ECS 一键部署脚本
# 1. 买 ECS（CentOS 7.9, 2核4G, 按量付费 ~0.3元/时）
# 2. 安全组开放 8000 端口
# 3. SSH 登录后运行此脚本

# 安装 Docker
curl -fsSL https://get.docker.com | bash
systemctl start docker
systemctl enable docker

# 构建并运行
cd /opt/zhiyuan
docker build -t zhiyuan .
docker run -d --name zhiyuan -p 8000:8000 --restart always \
  -e APP_ENV=production \
  -e JWT_SECRET=$(openssl rand -hex 32) \
  zhiyuan

echo "Done! Visit http://YOUR_EIP:8000/api/health"
