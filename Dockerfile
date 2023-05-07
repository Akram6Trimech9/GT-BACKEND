FROM node:18.12.1-alpine AS development

WORKDIR /gt_health/api/src/app

COPY package*.json  ./

RUN npm install 

COPY . . 

RUN npm run build 

EXPOSE ${PORT}

##############
##PRODUCTION##


FROM node:18.12.1-alpine AS production

ARG NODE_ENV=production

ENV NODE_ENV=${NODE_ENV}

WORKDIR /gt_health/api/src/app

COPY --from=development  /gt_health/api/src/app  . 

EXPOSE ${PORT}

CMD [ "node","dist/main" ]