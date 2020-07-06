FROM node:12-alpine

ENV NODE_ENV dev
ENV AWS_REGION eu-west-2

WORKDIR /opt/app_static

# SETUP
COPY package.json /opt/app_static
RUN yarn install

# BUILD
ADD . /opt/app_static
RUN yarn tsc

# RUN
CMD ["yarn", "node", "dist/index.js"]
