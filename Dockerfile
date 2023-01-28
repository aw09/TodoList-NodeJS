FROM node:16

# Install Nginx
RUN apt-get update && apt-get install -y nginx

# Copy the nginx conf
COPY nginx.conf /etc/nginx/nginx.conf

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

# RUN npm install
# If you are building your code for production
RUN npm ci --only=production

# Environment Variables
ENV MYSQL_HOST=localhost
ENV MYSQL_PORT=3306
ENV MYSQL_USER=
ENV MYSQL_PASSWORD=
ENV MYSQL_DBNAME=
ENV PORT=3000


EXPOSE 3030 3000

# Start the app and nginx
CMD ["sh", "start.sh"]