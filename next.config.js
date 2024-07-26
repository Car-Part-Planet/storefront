/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/s/files/**'
      }
    ]
  },
  async redirects() {
    return [
      {
        source: '/password',
        destination: '/',
        permanent: true
      },
      // Redirect all product pages to the equivalent collection year
      {
        source: '/:partType/:make/:model/:year/:product',
        destination: '/:partType/:make/:model/:year',
        permanent: true
      }
    ];
  }
};
