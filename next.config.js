const isDevelopment = process.env.NODE_ENV === 'development';

const isE2E = process.env.E2E === 'true';

/** @type {import('next').NextConfig} */
export default {
    experimental: {
        optimizePackageImports: ['@navikt/ds-react', '@navikt/aksel-icons'],
        testProxy: isE2E,
    },
    // Dropper optimalizeringen med standalone for tester, slik at test-serveren alltid har alle ressurser tilgjengelig
    output: isE2E ? undefined : 'standalone',
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
