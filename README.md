# Fish Audio Clone 🎙️

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fbillowssun%2Ffish-audio-clone)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

一个基于 [Fish Audio](https://fish.audio/) 的高保真语音克隆与文本转语音（TTS）Web 界面。旨在提供媲美官方体验的私有化部署方案，支持自定义声音模型管理与阿里云 SenseVoice ASR 语音识别。

---

## ✨ 核心特性

- **🚀 高性能 TTS**: 调用 Fish Audio 最新 API (v1)，支持流式输出与多种音频格式。
- **🎙️ 语音克隆**: 支持上传参考音频，快速生成独有的声音克隆模型。
- **🧠 智能识别**: 集成阿里云 DashScope SenseVoice ASR，提供精准的语音转文字服务，辅助生成参考文本。
- **📂 本地模型库**: 利用 IndexedDB (localforage) 在浏览器本地存储您常用的声音模型，安全且便捷。
- **🎨 现代 UI**: 使用 React 19 + Tailwind CSS 4 构建，响应式设计，适配桌面与移动端。
- **🔒 安全隐私**: 通过 Vercel Edge Functions 实现 API 中转，前端代码不泄露您的 API Key。

---

## 🛠️ 技术栈

- **Frontend**: [React 19](https://react.dev/), [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State/Storage**: [LocalForage](https://localforage.github.io/localForage/) (IndexedDB)
- **Deployment**: [Vercel](https://vercel.com/) (Edge Functions)
- **APIs**: Fish Audio API, Alibaba Cloud DashScope (SenseVoice)

---

## 🚀 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/billowssun/fish-audio-clone.git
cd fish-audio-clone
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境变量
在项目根目录创建 `.env.local` 文件，并填入以下内容：
```env
# Fish Audio API Key (前往 https://fish.audio/ 申请)
FISH_AUDIO_API_KEY=your_fish_audio_api_key

# 阿里云 API Key (前往阿里云 DashScope 申请)
ALIYUN_API_KEY=your_aliyun_api_key
```

### 4. 启动开发服务器
```bash
npm run dev
```

---

## 📦 部署说明

项目完美适配 **Vercel**。由于本项目包含 API 中转函数（位于 `/api` 目录），部署时请确保：

1. 将代码推送到 GitHub/GitLab。
2. 在 Vercel 后台导入项目。
3. **关键步骤**: 在 Vercel 项目设置的 **Environment Variables** 中添加以下变量：
   - `FISH_AUDIO_API_KEY`
   - `ALIYUN_API_KEY`
4. 点击部署。

---

## 📁 项目结构

```text
fish-audio-clone/
├── api/                # Vercel Edge Functions (API 代理)
│   ├── aliyun/asr.js   # 阿里云 ASR 代理
│   └── fish/v1/tts.js  # Fish Audio TTS 代理
├── src/                # 前端源代码
│   ├── App.jsx         # 主界面逻辑
│   └── main.jsx        # 入口文件
├── public/             # 静态资源
├── package.json        # 依赖与脚本
└── vercel.json         # Vercel 路由配置
```

---

## 📄 开源协议

本项目基于 [MIT License](LICENSE) 协议开源。

---

## 🙏 鸣谢

- [Fish Audio](https://fish.audio/) 提供的顶级 AI 语音技术。
- [Alibaba Cloud](https://www.aliyun.com/) 提供的 ASR 语音识别能力。
