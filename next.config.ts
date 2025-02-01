import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'example.com',  // Replace with the allowed image domains
      'anotherdomain.com',
      'cdn.example.com',
      '*.com',
       '**'
    ],
  },
  /* config options here */
};

export default nextConfig;
