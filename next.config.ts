import type {NextConfig} from 'next';

console.log("AI SYSTEM CHECK:");
console.log("- NEXT_PUBLIC_GROQ_API_KEY:", process.env.NEXT_PUBLIC_GROQ_API_KEY ? "EXISTS (Primary)" : "MISSING");
console.log("- NEXT_PUBLIC_GEMINI_API_KEY:", process.env.NEXT_PUBLIC_GEMINI_API_KEY ? "EXISTS (Secondary)" : "MISSING (Optional)");

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 't4.ftcdn.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.prod.website-files.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.letsnurture.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cloudrestaurantmanager.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.researchgate.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dam.mediacorp.sg',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'thumbs.dreamstime.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.hb.se',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.businessworld.in',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.bizbuysell.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'logmeal.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lens.usercontent.google.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.vecteezy.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'chatgpt.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
