# 使用轻量级的 Nginx 镜像作为基础
FROM nginx:alpine

# 将当前目录的所有文件复制到 Nginx 的默认静态资源目录
COPY . /usr/share/nginx/html

# 暴露 80 端口
EXPOSE 80

# 启动 Nginx (默认行为，其实也可以省略 CMD)
CMD ["nginx", "-g", "daemon off;"]
