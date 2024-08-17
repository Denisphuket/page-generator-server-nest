FROM node:18.14.2

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Убедитесь, что вы компилируете ваше приложение, если это TypeScript
RUN #npm run start
RUN npm run build:prod

CMD ["node", "dist/main"]
