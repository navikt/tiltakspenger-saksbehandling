/** @type {import('next').NextConfig} */
module.exports = {
    output: 'standalone',
    async rewrites() {
        return [
            {
                source: '/saker/person',
                destination: `https://tiltakspenger-vedtak.dev.intern.nav.no/saker/person`,
            },
        ];
    },
};
