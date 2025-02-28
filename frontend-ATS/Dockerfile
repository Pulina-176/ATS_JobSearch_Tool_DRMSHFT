# Using base image from Docker Hub
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json file
COPY package.json ./

# installing dependencies
RUN npm install
 
# copy all files
COPY . .

# expose the port to run application
EXPOSE 5173

CMD ["npm" , "run" , "dev"]