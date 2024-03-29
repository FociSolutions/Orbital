# Label the stage as build
FROM node:lts-alpine as build

# Set Working directory
WORKDIR /app

COPY ./src/orbital-designer/package.json ./src/orbital-designer/package-lock.json ./

RUN npm ci

# add app
COPY ./src/orbital-designer .

# start app
RUN npm run build:ci -- --output-path=dist

############
### prod ###
############

# base image
# Pinning major and minor version because only concerned with bug fixes/patches, not new features
FROM nginx:1.22-alpine

## Copy our default nginx config
COPY ./src/orbital-designer/nginx/default.conf /etc/nginx/conf.d/
## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*
# copy artifact build from the 'build environment'
COPY --from=build /app/dist /usr/share/nginx/html

# expose port 80
EXPOSE 80

# run nginx
CMD ["nginx", "-g", "daemon off;"]
