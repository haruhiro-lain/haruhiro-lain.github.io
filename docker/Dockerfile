# ============================================================
# Stage 1: 构建阶段
# ============================================================
FROM node:22-alpine AS builder

WORKDIR /app

# 安装依赖（利用 Docker 缓存层）
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts && npm install --ignore-scripts

# 复制源码
COPY . .

# 构建（跳过同步脚本，直接构建静态站点）
ENV SITE_URL=https://your-domain.com
RUN npx astro build

# ============================================================
# Stage 2: 运行阶段 — Nginx 提供静态文件
# ============================================================
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 可选：自定义 Nginx 配置（支持 SPA 路由、缓存等）
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
