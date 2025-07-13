# Use official Node.js image
FROM node:20

# Create app directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all files
COPY . .

# Expose port (use the one your app uses, like 3000 or 8080)
EXPOSE 3000

# Run your app
CMD ["node", "app.js"]
