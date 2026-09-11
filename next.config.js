/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Store-Host', value: 'apna-store01' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
