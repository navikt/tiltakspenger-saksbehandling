const isDevelopment = process.env.NODE_ENV === 'development';

const isE2E = process.env.E2E === 'true';

// Settes kun i byggesteget for deploy (.build-for-deploy.yml), slik at statiske assets
// (.next/static) serveres fra cdn.nav.no. Dette gjør at nais sin telemetri-collector kan
// hente sourcemaps og dekode stack-traces fra klientfeil. Utsatt for lokal kjøring og tester.
const cdnAssetPrefix = process.env.CDN_ASSET_PREFIX;

/** @type {import('next').NextConfig} */
export default {
    assetPrefix: cdnAssetPrefix,
    // Sourcemaps må ligge ved siden av JS-bundlene på CDN-en for at stack-traces skal dekodes
    productionBrowserSourceMaps: true,
    experimental: {
        optimizePackageImports: ['@navikt/ds-react', '@navikt/aksel-icons'],
        testProxy: isE2E,
    },
    // Dropper optimalizeringen med standalone for tester, slik at test-serveren alltid har alle ressurser tilgjengelig
    output: isE2E ? undefined : 'standalone',
    async headers() {
        const ContentSecurityPolicy = `
          default-src 'self';
          script-src 'self' cdn.nav.no ${isDevelopment ? "'unsafe-eval'" : ''};
          style-src 'self' 'unsafe-inline' cdn.nav.no;
          font-src 'self' cdn.nav.no;
          connect-src 'self' cdn.nav.no https://telemetry.nav.no https://telemetry.ekstern.dev.nav.no;
          prefetch-src 'self' cdn.nav.no;
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
