# Personal Profile Website

基于纯静态技术栈构建的个人名片网站，包含打字机特效、技能展示、时间轴经历和项目卡片。

## 技术栈

- **核心**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **图标**: FontAwesome 6
- **字体**: Inter, Noto Sans SC (Google Fonts)
- **容器化**: Docker (Alpine Nginx)

## 快速开始

### 本地运行
直接双击打开 `index.html` 即可在浏览器中预览。

### Docker 运行
```bash
# 构建镜像
docker build -t my-profile .

# 运行容器
docker run -d -p 8080:80 --name my-profile-container my-profile
```

访问 `http://localhost:8080` 查看效果。

## License

MIT

---

