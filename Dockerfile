FROM node:16-alpine

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /usr/app

COPY package.json .
COPY package-lock.json .
COPY next.config.js .

COPY .next/standalone ./
COPY .next/static ./.next/static

ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000

EXPOSE 3000

CMD ["node", "server.js"]
