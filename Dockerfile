FROM node:lts-alpine
USER node
WORKDIR /home/node
COPY . .
RUN yarn
CMD [ "node", "index.js" ]
