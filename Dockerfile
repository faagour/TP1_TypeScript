FROM node:19
# Create app directory in container
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
CMD [“node”,”dist/index.js”]
EXPOSE 8080