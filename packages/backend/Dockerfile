FROM node:22-alpine

# Copy the built application to the container
COPY ./dist /app

# Set the working directory
WORKDIR /app

# Expose the port your backend server listens on
EXPOSE 3000

# Start the backend server
CMD ["node", "main.js"]