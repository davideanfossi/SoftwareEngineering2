# pull official base image
FROM node:14-alpine

# set working directory
WORKDIR /server

# add `/server/node_modules/.bin` to $PATH
ENV PATH /server/node_modules/.bin:$PATH

# install server dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent

# add server
COPY . ./

# start server
CMD ["npm", "start"]

#docker build -t hike-tracker-server:dev .
#docker run -itd  --rm -v ${PWD}:/app -v /app/node_modules -p 3001:3001 -e CHOKIDAR_USEPOLLING=true hike-tracker-server:dev