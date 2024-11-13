FROM node:23.1
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
CMD ["node", "dist/app.js"]
EXPOSE 8080