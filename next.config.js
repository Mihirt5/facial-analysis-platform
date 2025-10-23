/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    externalDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "y40hvd26ja.ufs.sh", // uploadthing
      },
      {
        protocol: "https",
        hostname: "utfs.io", // uploadthing CDN
      },
      {
        protocol: "https",
        hostname: "dashscope-result-sgp.oss-ap-southeast-1.aliyuncs.com", // AIMLAPI Qwen Image Edit
      },
      {
        protocol: "https",
        hostname: "replicate.delivery", // Replicate CDN
      },
      {
        protocol: "https",
        hostname: "pbxt.replicate.delivery", // Replicate CDN alternative
      },
      {
        protocol: "https",
        hostname: "*.replicate.delivery", // Replicate CDN wildcard
      },
    ],
  },
  async rewrites() {
    if (process.env.NODE_ENV !== "development") return [];
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
      {
        source: "/ingest/flags",
        destination: "https://us.i.posthog.com/flags",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/review",
        destination: "/review/orders",
        permanent: true,
      },
      {
        source: "/ig",
        destination: "/?utm_source=instagram",
        permanent: true,
      },
      {
        source: "/tt",
        destination: "/?utm_source=tiktok",
        permanent: true,
      },
      {
        source: "/yt",
        destination: "/?utm_source=youtube",
        permanent: true,
      },
    ];
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

export default config;
