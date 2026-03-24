/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin');
 
const withNextIntl = createNextIntlPlugin();
 
const nextConfig = {
  images: {
    // Dominios permitidos para imágenes externas
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.in',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // Formatos modernos
    formats: ['image/avif', 'image/webp'],
    // Tamaños de dispositivo para srcset
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    // Tamaños de imagen para srcset
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Minimizar tiempo de caché en desarrollo
    minimumCacheTTL: 60,
  },
  // Optimizaciones de rendimiento
  experimental: {
    optimizeCss: true,
  },
  // Compresión
  compress: true,
  // Canonical: redirigir health4spain.com → www.health4spain.com
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'health4spain.com' }],
        destination: 'https://www.health4spain.com/:path*',
        permanent: true,
      },
    ];
  },
  // Headers de seguridad y caché
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:all*(js|css)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
 
module.exports = withNextIntl(nextConfig);
