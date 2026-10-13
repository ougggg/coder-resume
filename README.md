# Personal Profile Website

基于纯静态技术栈构建的个人名片网站，以月下山水为背景，呈现一个安静而灵动的个人数字花园。

## 页面与动效

- 原创月夜山水、分层流雾、呼吸光晕、Canvas 流萤与轻微鼠标 / 滚动视差。
- 保留完整技能、经历、项目、简历下载和联系方式，重新组织排版与视觉层次。
- 姓名和核心岗位固定展示，正文 14–15px、技术标签 11px；560px 以下的技能区采用单列。
- 手机折叠菜单、当前章节高亮、键盘焦点与滚动入场。
- 项目优先展示简历中的成果，通过原生折叠控件查看完整技术细节，无需 JavaScript。
- 导航栏可暂停动效，包括场景、悬停位移和页面平滑滚动；选择会在本机保存，且遵循系统“减少动态效果”设置。
- 流萤按远、中、近景分层，正文及导航区域自动避让；字体加载和视窗变化时重新计算阅读区域。
- 场景离开视口或页面进入后台时停止绘制；手机减少粒子，限制画布像素比和绘制频率。
- 无 JavaScript 时正文和导航仍可访问；外部字体加载失败时回退到系统字体。

背景使用本地 `assets/fairyland.webp`（约 223 KB）；原始 PNG 和完整生成提示词见 `assets/`。页面未新增运行依赖。

## 技术栈

- **核心**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **图标**: FontAwesome 6
- **字体**: Inter, Noto Sans SC (Google Fonts)；标题使用本地 Noto Serif SC 400 子集（约 25 KB）
- **容器化**: Docker (Alpine Nginx)

## 快速开始

### 本地运行
直接双击打开 `index.html` 即可在浏览器中预览。

也可使用已有的 Python 启动静态服务器：

```bash
python -m http.server 8080 --bind 127.0.0.1
```

访问 `http://127.0.0.1:8080`。默认没有构建步骤。

简历 PDF 沿用原来的远程地址；跨域链接是否直接下载取决于远程响应头和浏览器，可能在浏览器内打开。

标题字体覆盖当前标题、装饰文案及 ASCII 字符。修改标题后请按 `assets/fonts/SOURCE.md` 更新子集；字体来源和 OFL 许可证同目录保留。项目指标沿用原简历内容，仓库未提供项目演示地址和真实截图。

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

