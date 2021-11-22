FROM node:16.13.0-alpine3.12

# setting production enviroment
ENV NODE_ENV production

RUN mkdir -p /app
RUN chown -R node:node /app && chmod -R 770 /app

# create the directory inside the container
WORKDIR /app


# copy the package.json files from local machine to the workdir in container
COPY --chown=node:node package*.json ./

# copy the generated modules and all other files to the container
COPY --chown=node:node . ./

# run npm install in our local machine
RUN npm ci --only=production

# our app is running on port 5000 within the container, so need to expose it
EXPOSE 8080

COPY --chown=node:node ./package.json ./package.json
COPY --chown=node:node ./package-lock.json ./package-lock.json
COPY --chown=node:node ./src ./src


USER node
# the command that starts our app
CMD ["node", "src/server.js"]