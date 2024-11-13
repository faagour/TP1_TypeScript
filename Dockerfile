FROM node:23.1
WORKDIR /app
COPY . .

RUN npm install

RUN ls -la /app

CMD ["npm", "run", "dev"]
EXPOSE 3000
