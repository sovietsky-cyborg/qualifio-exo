FROM node:22
WORKDIR /usr/app/ 
EXPOSE 3000/tcp
RUN npm i -g concurrently
CMD npm run
