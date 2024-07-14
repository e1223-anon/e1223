# build
FROM node:22-alpine AS build

RUN corepack enable

WORKDIR /base
COPY package.json .
COPY .yarnrc.yml .
COPY yarn.lock .
COPY packages/ packages/

RUN yarn install
RUN yarn workspace @p1223/backend build
RUN yarn workspace @p1223/frontend build --configuration production

FROM node:22-alpine AS backend

WORKDIR /app
COPY --from=build /base/node_modules ./node_modules
COPY --from=build /base/packages/backend/dist /app

EXPOSE 3000

CMD ["node", "main.js"]

FROM node:22-alpine AS frontend 

ENV PORT 8080
WORKDIR /app
COPY --from=build /base/packages/frontend/dist/frontend/browser/ /app
RUN ls -R
EXPOSE 8080
CMD ["npx", "http-server", "-p", "8080", "."]


