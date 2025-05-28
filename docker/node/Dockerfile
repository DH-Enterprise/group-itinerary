FROM node:20

WORKDIR /var/www

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port 5173 for Vite dev server
EXPOSE 5173

# Start the development server
CMD ["npm", "run", "dev"]
