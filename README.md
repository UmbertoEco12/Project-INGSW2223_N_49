# Restaurant Order & Menu Management App

## Overview
Developed a full-stack web application for restaurants to manage menus and orders efficiently. Built with React and TypeScript for the frontend, Java Spring for the backend, PostgreSQL for data storage, and Docker for containerized deployment. Features role-based access:
- **Admins & Managers** can modify menu items and prices.
- **Waiters** can place orders.
- **Chefs** can mark orders as complete.
- **Managers** can track and close orders upon payment.

Designed to streamline restaurant operations with a structured and scalable architecture.

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

    Replace `yourlocalip` with the actual IP address of your machine.

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

- **Admin Pizzeria**:
  - Username: `admin`
  - Password: `Password01`
- **Staff Accounts**:
  - Usernames: `waiter1`, `waiter2`, `manager`, `chef1`
  - Password for all: `Password01`

Feel free to explore the application using these credentials.

