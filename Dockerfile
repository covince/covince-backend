FROM node:lts-alpine
USER node
WORKDIR /home/node
COPY . .
RUN yarn --production
CMD [ "node", "index.js" ]
