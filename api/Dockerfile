FROM node:18-alpine
WORKDIR /usr/src/api
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 4000
CMD ["node", "dist/index.js"]
