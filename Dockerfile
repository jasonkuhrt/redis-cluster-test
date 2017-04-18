from node:7.9-alpine

workdir /app
copy package.json /app/
run npm install
copy . /app/

entrypoint ["npm", "run"]
cmd ["start"]
