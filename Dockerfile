FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_WEATHER_API_KEY
ENV VITE_WEATHER_API_KEY=$VITE_WEATHER_API_KEY

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]