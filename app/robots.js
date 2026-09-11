export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://apna-store01.vercel.app/sitemap.xml',
  };
}