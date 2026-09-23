# Digesten er det som faktisk kjører; taggen er det Dependabot følger, og gir PR når `24-alpine` flyttes.
# `apk upgrade` under henter fortsatt sikkerhetsoppdateringer i perioden mellom digest-bumpene.
FROM node:24-alpine@sha256:ebfe2f90462722a7a4de65e91990e97fe0d401c70e0e762c5b53302f905ec1c1

# Docker Hub-bildet kan ligge etter alpines sikkerhetsoppdateringer (openssl 7.9.2026), så pakkene løftes her.
# npm, corepack og yarn brukes ikke i drift og drar med seg sårbare bundlede pakker (tar, brace-expansion, ip-address).
RUN apk upgrade --no-cache \
    && rm -rf /usr/local/lib/node_modules /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack /opt/yarn-* /usr/local/bin/yarn /usr/local/bin/yarnpkg

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

CMD ["node", "server.js"]
