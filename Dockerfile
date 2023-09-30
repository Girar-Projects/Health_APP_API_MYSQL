# Use an official MongoDB image as a parent image
FROM mongo

# Install dependencies for Node.js 18
RUN apt-get update && apt-get install -y \
    curl \
    software-properties-common \
    gnupg

# Install Node.js 18.x
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs

# Copy package files for the API
COPY package*.json /app/

RUN npm install -g nodemon

# Set up the API working directory
WORKDIR /app

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose the API and MongoDB ports
EXPOSE 10000


# Start the API and MongoDB
CMD nodemon index.js
