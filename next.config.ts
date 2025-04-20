import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.habbo.com.br",
        pathname: "/**", // Permite todas as rotas do domínio
      },
      {
        protocol: "https",
        hostname: "images.habbo.com", // Adiciona suporte para o domínio de emblemas
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
