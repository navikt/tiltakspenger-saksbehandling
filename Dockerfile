FROM node:24-alpine

# Docker Hub-bildet kan ligge etter alpines sikkerhetsoppdateringer (openssl 7.9.2026), så pakkene løftes her.
# npm, corepack og yarn brukes ikke i drift og drar med seg sårbare bundlede pakker (tar, brace-expansion, ip-address).
RUN apk upgrade --no-cache \
    && rm -rf /usr/local/lib/node_modules /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack /opt/yarn-* /usr/local/bin/yarn /usr/local/bin/yarnpkg

WORKDIR /usr/app

COPY package.json .
COPY next.config.js .
COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public

ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "server.js"]
