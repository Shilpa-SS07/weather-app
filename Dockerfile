FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# ✅ Build-time argument (IMPORTANT)
ARG VITE_WEATHER_API_KEY
ENV VITE_WEATHER_API_KEY=$VITE_WEATHER_API_KEY

# Build React app properly (IMPORTANT FIX)
RUN npm run build

# Install serve to run production build
RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]