# Ratatouille23 Cuscione N86003575

## Quick Start Guide

This README provides quick instructions on how to launch the application using Docker Compose.

### Prerequisites

- Ensure you have Docker and Docker Compose installed on your machine.

### Installation and Launch

1. Navigate to the project directory.

2. Modify the `compose.yml` file to include your IP address. Find the `WEBSOCKET_ALLOWED_ORIGINS` environment variable and change it as follows:

    ```yaml
    services:
      backend:
        ...
        environment:
          - WEBSOCKET_ALLOWED_ORIGINS=http://yourlocalip:3000
    ```

    Replace `service-name` with the actual name of the Docker service you want to configure.

3. Run Docker Compose:

    ```bash
    docker-compose up -d
    ```

    This command will start the application in the background. You can monitor the logs by running `docker-compose logs -f`.

4. The application should now be accessible at [http://localhost:3000/](http://localhost:3000/) in your browser.

### Stopping the Application

To stop the application, execute the following command in the project directory:

```bash
docker-compose down
```
### Application Credentials
Upon application startup, the following accounts are automatically created:

Admin Pizzeria: username=admin, password=Password01
Staff Accounts: waiter1, waiter2, manager, chef1; password for all: Password01.
Feel free to explore the application using these credentials.
