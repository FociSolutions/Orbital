# Label the stage as build
FROM node:latest as build

# Set Working directory
WORKDIR /app

# adding '/app/node_modules/.bin' to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# Build runtime image
COPY ./src/orbital-designer/package.json /app/package.json
COPY ./src/orbital-designer/package-lock.json /app/package-lock.json
RUN npm ci
RUN npm install -g @angular/cli@latest

# add app
COPY ./src/orbital-designer /app

# start app
RUN ng build --output-path=dist

############
### prod ###
############

# base image
FROM nginx:1.16.0-alpine

# copy artifact build from the 'build environment'
COPY --from=build /app/dist /usr/share/nginx/html

# expose port 80
EXPOSE 80

# run nginx
CMD ["nginx", "-g", "daemon off;"]