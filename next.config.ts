import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    remotePatterns: [
      {
        hostname: "my-techguru-lms.t3.storageapi.dev",
        port: "",
        protocol: "https",
      }
    ]
  }
};

export default nextConfig;
