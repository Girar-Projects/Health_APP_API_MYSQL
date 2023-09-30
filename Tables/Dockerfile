FROM mysql:latest

# Set the environment variables
ENV MYSQL_ROOT_PASSWORD=password
ENV MYSQL_DATABASE=health_app_test
ENV MYSQL_USER=health_testing
ENV MYSQL_PASSWORD=0919483800
ENV MYSQL_AUTHENTICATION_PLUGIN=mysql_native_password

# Configure the MySQL server
EXPOSE 3306
VOLUME /var/lib/mysql

CMD ["mysqld"]