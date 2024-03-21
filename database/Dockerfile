# Use an official PostgreSQL image as a parent image
FROM postgres:latest

# Set the environment variables
ENV POSTGRES_DB Ratatouille23Cuscione
ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD eoqfuX-a5ytdl-hzebwu

# Copy SQL scripts into the container
COPY ./all_database.sql /docker-entrypoint-initdb.d/

# Expose the PostgreSQL port
EXPOSE 5432
