FROM node:18

WORKDIR /app/subscription

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate || echo "Skipping Prisma generate"

RUN npm run build

EXPOSE 8002

CMD ["npm", "start"]