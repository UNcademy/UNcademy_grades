FROM node:16
WORKDIR /uncademy_grades_ms
COPY package.json .
RUN npm install
COPY . .
EXPOSE 8080
CMD [ "npm", "run", "first" ]