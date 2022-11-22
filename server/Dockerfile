# pull official base image
FROM node:14-alpine

# set working directory
WORKDIR /server

# add `/server/node_modules/.bin` to $PATH
ENV PATH /server/node_modules/.bin:$PATH

# install server dependencies
COPY server/package.json ./
RUN npm install --silent

# add server
COPY . ./

# start server
CMD ["npm", "start"]

#docker build -t riccardogiambra/hike-tracker-server:sprint-2 .
#docker run riccardogiambra/hike-tracker-server:sprint-2