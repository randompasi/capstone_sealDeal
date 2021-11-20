#Creates React app on docker
FROM node:16.13.0-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# add app
COPY . ./

RUN chown -R node /app/node_modules/.cache

# start app
CMD ["npm", "start"]
