FROM node:18

WORKDIR /app/user

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate || echo "Skipping Prisma generate"

RUN npm run build

EXPOSE 8001

CMD ["npm", "start"]