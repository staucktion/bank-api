FROM node:23

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma ./

RUN npx prisma generate

COPY . .

EXPOSE 80

CMD ["npm", "run", "serve"]
