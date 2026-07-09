const isDevelopment = process.env.NODE_ENV === 'development';

// Under e2e (Playwright) bruker vi en egen dist-mappe slik at test-dev-serveren ikke kolliderer
// med en vanlig `pnpm dev`. Next tillater ikke to dev-servere med samme dist-mappe i samme
// prosjekt («Another next dev server is already running»), selv på ulike porter.
const isE2E = process.env.E2E === 'true';

/** @type {import('next').NextConfig} */
export default {
    ...(isE2E ? { distDir: '.next-e2e' } : {}),
    experimental: {
        optimizePackageImports: ['@navikt/ds-react', '@navikt/aksel-icons'],
        testProxy: true,
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
