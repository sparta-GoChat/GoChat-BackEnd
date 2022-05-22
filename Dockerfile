FROM node:16

WORKDIR /app

COPY package*.json ./
COPY ./ ./

RUN npm install \ 
&& npm run build

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]