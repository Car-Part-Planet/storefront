const baseUrl = process.env.SHOPIFY_ORIGIN_URL
  ? process.env.SHOPIFY_ORIGIN_URL
  : 'http://localhost:3000';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*'
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  };
}
