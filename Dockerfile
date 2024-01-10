# 使用 Node.js 10 作为基础镜像
FROM node:16-alpine

# 设置工作目录
WORKDIR /app


# 复制 package.json 和 yarn.lock 到工作目录
COPY package.json ./

# 安装项目依赖
RUN apk add --update make python3 py3-pip && npm install

# 复制整个项目到工作目录
COPY . .

# 构建 Next.js 应用
RUN npm run build

# 暴露应用运行的端口（默认为 3000）
EXPOSE 3000

# 启动 Next.js 应用
CMD ["yarn", "start"]
