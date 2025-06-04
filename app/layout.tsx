import type { Metadata } from "next";
import { ClientProviders } from "./client-providers";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "Krea Clone - AI-Powered Creative Tools",
    template: "%s | Krea Clone"
  },
  description: "Create stunning images, videos, and more with AI-powered tools. Transform your ideas into reality with our advanced AI generation platform.",
  keywords: ["AI", "图像生成", "视频生成", "人工智能", "创意工具", "AI art", "image generation", "video generation"],
  authors: [{ name: "Krea Clone Team" }],
  creator: "Krea Clone",
  publisher: "Krea Clone",
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
    title: 'Krea Clone - AI-Powered Creative Tools',
    description: 'Create stunning images, videos, and more with AI-powered tools',
    siteName: 'Krea Clone',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Krea Clone - AI-Powered Creative Tools',
    description: 'Create stunning images, videos, and more with AI-powered tools',
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
