###################
# BUILD FOR PRODUCTION
###################
FROM node:22-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --legacy-peer-deps

COPY . .

RUN npm run build

ENV NODE_ENV=production

RUN npm ci --omit=dev

###################
# PRODUCTION
###################
FROM gcr.io/distroless/nodejs22-debian12 AS production

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3000
ENV NODE_ENV=production

CMD [ "dist/main.js" ]