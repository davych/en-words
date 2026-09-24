# Speak Notes · 英语开口笔记

面向日常生活、商务、项目和 IT 沟通的个人英语笔记。打开页面后挑一个场景，先看中文试说英文，再点击朗读，最后把句子换成自己的生活或工作内容说一遍。无需账号、打卡或学习记录。

## 内容

- `site/content/lessons.json`：场景口语、语法速查、原笔记表达修订建议和外部练习链接。可直接编辑 JSON 扩充内容。
- `site/content/original-notes.txt`：用户提供的原始资料，逐字保留；页面「我的原始笔记」可阅读和搜索。
- `site/index.html`、`site/styles.css`、`site/app.js`：纯静态页面，不需要安装依赖或构建。

## 本地预览

```sh
python3 -m http.server 8000 --directory site
```

打开 `http://localhost:8000/`。由于浏览器限制，直接双击 HTML 文件可能无法加载 JSON 和笔记，请通过本地服务器预览。

## 发布

`.github/workflows/pages.yml` 在推送到 `main` 时通过 GitHub Actions 发布 `site/`。在仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**，之后可在 Actions 页查看部署结果。项目地址预期为 `https://davych.github.io/en-words/`。

## 资料来源

页面里的练习短句和对话为本项目编写；外部教材仅提供链接。主要参考 [British Council LearnEnglish Speaking](https://learnenglish.britishcouncil.org/free-resources/speaking)、[B1 Speaking](https://learnenglish.britishcouncil.org/free-resources/speaking/b1)、[B2 Speaking](https://learnenglish.britishcouncil.org/free-resources/speaking/b2) 以及其[语法参考](https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/present-perfect)。
