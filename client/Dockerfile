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

#docker build -t hike-tracker-client:dev .
#docker run -itd  --rm -v ${PWD}:/app -v /app/node_modules -p 3000:3000 -e CHOKIDAR_USEPOLLING=true hike-tracker-client:dev