/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: process.env.NEXT_PUBLIC_APP_BACKEND_URL + '/api/:path*',
            },
        ];
    },
};

export default nextConfig;
