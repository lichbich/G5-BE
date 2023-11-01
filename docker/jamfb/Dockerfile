FROM node:lts-alpine

RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      nodejs \
      yarn

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN mkdir /backend
# Change workdir
WORKDIR /backend
# Add current src and install file
COPY package*.json ./

RUN npm install

COPY . .

# Run update and install package for application
# Start application
EXPOSE 8888
CMD ["npm", "run", "start:jamfb"]

# FROM python:3