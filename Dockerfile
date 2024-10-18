FROM --platform=linux/amd64 node:18.11.0
ARG ENV_ANY
ENV QA_ENV=$ENV_ANY

RUN apt-get update
WORKDIR /usr/src
COPY package*.json ./
RUN npm install pm2 -g
RUN apt-get -y update
RUN apt-get install -y ffmpeg
RUN echo "copying env file"
RUN touch .env
RUN echo $QA_ENV > .env

# RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
 RUN npm install

COPY . .
CMD [ "node", "src/index.js"]

EXPOSE 3000
