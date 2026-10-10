import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 90 keeps catalog photos sharp after resizing. 75 stays available for other images.
    qualities: [75, 90],
  },
};

export default nextConfig;
