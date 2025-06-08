import type { Metadata } from "next";
import { ClientProviders } from "./client-providers";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "VoiceForge AI - 智能音视频处理平台",
    template: "%s | VoiceForge AI"
  },
  description: "专业的AI音视频处理平台，提供音频转录、文本配音、视频翻译等服务。让每一个声音都被完美传达。",
  keywords: ["AI", "音频转录", "文本配音", "视频翻译", "人工智能", "语音处理", "audio transcription", "text to speech", "video translation"],
  authors: [{ name: "VoiceForge AI Team" }],
  creator: "VoiceForge AI",
  publisher: "VoiceForge AI",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: defaultUrl,
    title: 'VoiceForge AI - 智能音视频处理平台',
    description: '专业的AI音视频处理平台，提供音频转录、文本配音、视频翻译等服务',
    siteName: 'VoiceForge AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VoiceForge AI - 智能音视频处理平台',
    description: '专业的AI音视频处理平台，提供音频转录、文本配音、视频翻译等服务',
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="font-sans antialiased">
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
