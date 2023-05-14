FROM node:18.16.0-slim
# Create app directory
WORKDIR /usr/src/Company_Employee_Project
# Bundle app source and Install dependencies
COPY . .
RUN npm install
# Open a port to outside of container
EXPOSE 3000
# Another form of entrypoint
CMD ["npm", "run", "start"]
