# YouTube Summarizer

![image](https://github.com/user-attachments/assets/33c3d2be-41e0-4f25-93de-06d71f9df441)

## 🚀 Overview

YouTube Summarizer is a powerful tool that extracts and summarizes YouTube video transcripts using AI. This project leverages **Next.js, Google Cloud AI, and Generative AI models** to generate concise and easy-to-read summaries of video content.

## ✨ Features

- 🎯 **AI-powered Summarization** - Automatically extracts key points from YouTube videos.
- 🔄 **Proxy Support** - Uses a proxy to bypass YouTube restrictions.
- 🎨 **Clean UI** - Minimalist and responsive design using **TailwindCSS**.

## 📸 Demo

🔗 [Live Demo](https://youtube-summarizer-sable.vercel.app/)

## 🛠️ Installation

To set up the project locally, follow these steps:

```sh
# Clone the repository
git clone https://github.com/jorgepedraza88/youtube-summarizer.git
cd youtube-summarizer

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 🔧 Configuration

1. **Environment Variables**

   - Create a `.env.local` file and add your API credentials:

   ```sh
   GEMINI_API_KEY=[YOUR.GEMINI.API.KEY]
   PROXY_HOST=[YOUR.PROXY.HOST]
   PROXY_PORT=[YOUR.PROXY.PORT]
   PROXY_USER=[YOUR.PROXY.USERNAME]
   PROXY_PASSWORD=[YOUR.PROXY.PASSWORD]
   ```

2. **Proxy Setup**

   - The app uses a **proxy** to fetch transcripts without being blocked by YouTube.
   - Ensure your **proxy credentials** are correct to avoid connection issues.

## 📜 Usage

1. Enter a **YouTube video URL**.
2. Click **Summarize** to generate an AI-driven summary.
3. The app caches results to improve performance and reduce API calls.

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Next.js API Routes, Axios
- **AI Services**: Google Generative AI (gemini-2.5-flash-lite)
- **Proxy Support**: A secure proxy for bypassing YouTube restrictions

## 📄 License

This project is licensed under the **MIT License**.

## 📬 Contact

For questions or suggestions, reach out to **Jorge Pedraza** at `jorgepedraza1988@gmail.com`.

---

_Made with ❤️ by Jorge Pedraza._
