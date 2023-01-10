FROM node:16-alpine as builder

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /usr/app

COPY package.json .
COPY package-lock.json .
COPY next.config.js .
COPY src/ ./src
COPY public/ ./public

RUN npm ci --no-audit
RUN npm run build:labs

FROM node:16-alpine as runtime
WORKDIR /usr/app

ENV PORT 3000
ENV NODE_ENV development

COPY --from=builder /usr/app/.next/standalone ./
COPY --from=builder /usr/app/.next/static ./.next/static
COPY --from=builder /usr/app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
