import type { Metadata } from "next";
import "./globals.css";
import ClientProviders from "./client-providers";
import { auth } from "@/auth";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "声渡 - 声之所至，渡见世界",
    template: "%s | Wave Shift"
  },
  description: "专业的AI音视频处理平台，提供音频转录、文本配音、视频翻译等服务。声之所至，渡见世界。",
  keywords: ["AI", "音频转录", "文本配音", "视频翻译", "人工智能", "语音处理", "声渡", "audio transcription", "text to speech", "video translation"],
  authors: [{ name: "声渡团队" }],
  creator: "声渡",
  publisher: "声渡",
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
    title: 'Wave Shift - 声之所至，渡见世界',
    description: '专业的AI音视频处理平台，提供音频转录、文本配音、视频翻译等服务',
    siteName: 'Wave Shift',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wave Shift - 声之所至，渡见世界',
    description: '专业的AI音视频处理平台，提供音频转录、文本配音、视频翻译等服务',
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased">
        <ClientProviders session={session}>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
