# pull official base image
FROM node:14-alpine
ARG JWT_ACC_ACTIVATE 
ARG CLIENT_URL 
ARG API_KEY 

LABEL name="server"
# set working directory
WORKDIR /server

# add `/server/node_modules/.bin` to $PATH
ENV PATH /server/node_modules/.bin:$PATH
ENV JWT_ACC_ACTIVATE ${JWT_ACC_ACTIVATE}
ENV CLIENT_URL ${CLIENT_URL}
ENV API_KEY ${API_KEY}

# install server dependencies
COPY package.json ./
RUN npm install --silent

EXPOSE 3001

# add server
COPY . ./

# start server
CMD ["npm", "start"]

#docker build -t riccardogiambra/hike-tracker-server:sprint-2 .
#docker run riccardogiambra/hike-tracker-server:sprint-2