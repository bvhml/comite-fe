FROM node:13.12.0-alpine
# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install

# Bundle app source
COPY . .
EXPOSE 3001:3000
CMD [ "yarn", "start" ]


