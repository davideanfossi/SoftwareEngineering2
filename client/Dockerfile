# pull official base image
FROM node:14-alpine

# set working directory
WORKDIR /client

# add `/client/node_modules/.bin` to $PATH
ENV PATH /client/node_modules/.bin:$PATH

# install client dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent

# add client
COPY . ./

# start client
CMD ["npm", "start"]

#docker build -t riccardogiambra/hike-tracker-client:sprint-2 .
#docker run riccardogiambra/hike-tracker-client:sprint-2