 /** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      // domains 대신 remotePatterns 만 써도 되고, domains 도 병용 가능합니다.
      // domains: ['res.cloudinary.com'],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
          port: '',       // 빈 문자열로 두거나 생략
          pathname: '/**',// 모든 경로를 허용
        },
      ],
    },
    async rewrites() {
      return [{
        source: '/api/:path*',
        destination: 'https://api.taest-mag.kr/api/:path*',
      }];
    },
};

export default nextConfig;
