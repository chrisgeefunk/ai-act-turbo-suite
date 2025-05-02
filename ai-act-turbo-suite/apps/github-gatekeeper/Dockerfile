FROM node:18-slim
WORKDIR /app
COPY package.json tsconfig.json ./ 
RUN npm ci
COPY src ./src
RUN npm run build
CMD ["npx","probot","run","dist/index.js"]
