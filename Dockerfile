# Chainguard-image fra Navs speil: https://sikkerhet.nav.no/docs/verktoy/chainguard-dockerimages/
# Bevisst uten digest: Chainguard backporter ikke fikser til eldre patch-versjoner, og Dependabot når ikke speilet.
# Major-taggen gir nyeste bygg av Node 24 ved hvert image-bygg.
FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim

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

# Entrypointet i imaget er node, så CMD er bare skriptet.
CMD ["server.js"]
