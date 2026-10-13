# 标题字体

- 文件：`noto-serif-sc-400-subset.woff2`
- 字体：Noto Serif SC，Normal / Regular 400。
- 来源：[Google Fonts 官方字体目录](https://fonts.google.com/noto/specimen/Noto+Serif+SC)及 [CSS2 API](https://developers.google.com/fonts/docs/css2#optimizing_your_font_requests)。
- 获取日期：2026-10-13。
- 授权：[SIL Open Font License 1.1](https://github.com/google/fonts/blob/main/ofl/notoserifsc/OFL.txt)，完整许可证保存在同目录 `OFL.txt`。
- 字体上游：[notofonts/noto-cjk](https://github.com/notofonts/noto-cjk)；[Google Fonts 元数据](https://github.com/google/fonts/blob/main/ofl/notoserifsc/METADATA.pb)。
- 大小：25,176 bytes；文件头为 `wOF2`（WOFF2）。
- SHA-256：`ca1917e43c75d025c85f4c639a9bab29937f699f61e0fd93d088770387e902a4`。

该文件是 Google Fonts 官方 API 生成的标题字符子集，用于在不同操作系统上保持标题字形一致，避免加载完整中文字体。它不是全量中文字库；正文继续使用原有字体。新增标题文字时应重新生成子集，不能直接假定新字符已包含。

## 字符范围

包含 ASCII U+0020–U+007E（空格、数字、大小写字母及标点）、中点 `·`（U+00B7），以及以下文案的所有字符，共 166 个唯一字符：

```text
以代码筑境，让想象生长。向下扎根，向上生长。走过的路，皆为养分。让想法，有迹可循。
下一段奇妙旅程，从一次对话开始。欧国烽专业技能实习经历项目作品保持联系
山海有境 · 代码无界月色入山海 · 灵感入代码
```

Google Fonts 响应中的完整 `unicode-range` 和 CDN 来源 URL 保存在 `source.css.txt`，用于溯源；页面应引用本地 WOFF2，不需要在运行时请求该 CDN。

## 重新生成

向 `https://fonts.googleapis.com/css2` 请求 `family=Noto+Serif+SC:wght@400`、`display=swap` 以及包含上述所有字符、经 URL 编码的 `text` 参数，并使用支持 WOFF2 的浏览器 User-Agent。下载响应 `src` URL 指向的字体文件，并同步更新字符范围、大小及哈希值。此流程无需安装代码依赖。

## 引用

```css
@font-face {
  font-family: 'Noto Serif SC';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('assets/fonts/noto-serif-sc-400-subset.woff2') format('woff2');
}
```

本字体只有 400 字重。使用该子集的标题应指定 `font-weight: 400`，避免浏览器自动合成粗体。字体资产及其许可应随网站一起发布，无需添加 `.gitignore` 规则。
