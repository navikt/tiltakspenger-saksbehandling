const isDevelopment = process.env.NODE_ENV === 'development';

/** @type {import('next').NextConfig} */
export default {
    experimental: {
        optimizePackageImports: ['@navikt/ds-react', '@navikt/aksel-icons'],
    },
    output: 'standalone',
    async headers() {
        const ContentSecurityPolicy = `
          default-src 'self';
          script-src 'self' ${isDevelopment ? "'unsafe-eval'" : ''};
          style-src 'self' 'unsafe-inline';
          font-src 'self' cdn.nav.no;
        `;

        const securityHeaders = [
            {
                key: 'Content-Security-Policy',
                value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
            },
            {
                key: 'X-Frame-Options',
                value: 'DENY',
            },
            {
                key: 'X-XSS-Protection',
                value: '1; mode=block',
            },
            {
                key: 'X-Content-Type-Options',
                value: 'nosniff',
            },
            {
                key: 'Referrer-Policy',
                value: 'no-referrer',
            },
        ];

        return [
            {
                source: '/:path*',
                headers: securityHeaders,
            },
        ];
    },
};
