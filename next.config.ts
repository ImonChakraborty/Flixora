import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Disable optimization for TMDB images to save Vercel transformations
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        port: "",
        pathname: "/t/p/**",
      },
      {
        protocol: "https",
        hostname: "player.videasy.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Configure headers for iframe embedding and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: http:",
              "font-src 'self' data:",
              "connect-src 'self' https://api.themoviedb.org",
              "frame-src 'self' https://player.videasy.net https://*.videasy.net https://vidsrc.net https://*.vidsrc.net https://embed.su https://*.embed.su https://vidlink.pro https://*.vidlink.pro https://player.smashystream.com https://*.smashystream.com https://moviekex.online",
              "media-src 'self' https://player.videasy.net https://*.videasy.net https://vidsrc.net https://*.vidsrc.net https://embed.su https://*.embed.su https://vidlink.pro https://*.vidlink.pro https://player.smashystream.com https://*.smashystream.com https://moviekex.online",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'"
            ].join('; ')
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
  // Optimize for production
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
