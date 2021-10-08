#Creates React app on docker
FROM node:alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install
RUN npm install react-scripts@3.4.1 -g

# add app
COPY . ./

RUN chown -R node /app/node_modules/.cache

# open port to listen
EXPOSE 3000


# start app
CMD ["npm", "start"]
