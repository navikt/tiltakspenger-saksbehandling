# Distroless har ingen semver-tagger — versjonen ligger i repo-navnet (nodejs24-debian13) — så taggen er `latest`.
# Digesten er det som faktisk kjører; taggen er det Dependabot følger, og gir PR når `latest` flyttes.
FROM gcr.io/distroless/nodejs24-debian13:latest@sha256:206cfbab1a64af20b63645150e3aa61b7babc17869e0254914947732963d6f07

WORKDIR /usr/app

COPY package.json .
COPY next.config.js .
COPY .next/standalone ./
# .next/static kopieres ikke inn - assets serveres fra cdn.nav.no (se CDN_ASSET_PREFIX/assetPrefix)
COPY public ./public

ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

# Entrypointet i distroless er node, så CMD er bare skriptet.
CMD ["server.js"]
