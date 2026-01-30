import type { NextConfig } from "next";

// const supabaseHost = process.env.SUPABASE_URL?.replace(/^https?:\/\//, '');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xzsyaboxuwomztxntiep.supabase.co",
        pathname: "/storage/v1/object/public/**", 
      },
    ],
  },
};

export default nextConfig;
