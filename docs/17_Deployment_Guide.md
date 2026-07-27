# Deployment Guide

# Smart Parking Lot Management System

---

## Document Information

| Field | Value |
|-------|-------|
| Document Name | Deployment Guide |
| Version | 1.0 |
| Project | Smart Parking Lot Management System |
| Prepared By | Gaurav Kumar Singh |
| Last Updated | July 2026 |

---

# Table of Contents

1. Introduction
2. Deployment Overview
3. System Requirements
4. Software Prerequisites
5. Project Structure
6. Database Setup
7. Backend Setup
8. Frontend Setup
9. Running the Application
10. Production Deployment
11. Environment Variables
12. Build Process
13. Verification Checklist
14. Troubleshooting
15. Maintenance
16. Conclusion

---

# 1. Introduction

This document provides step-by-step instructions for deploying the Smart Parking Lot Management System.

It covers:

- Development environment setup
- Database configuration
- Backend deployment
- Frontend deployment
- Production deployment recommendations
- Common troubleshooting steps

The goal is to ensure that any developer can clone the repository and run the application with minimal effort.

---

# 2. Deployment Overview

The system consists of three major components:

```text
React Frontend
        │
        ▼
Spring Boot Backend
        │
        ▼
    MySQL Database
```

Deployment order:

1. Configure MySQL.
2. Start the backend.
3. Start the frontend.
4. Verify API connectivity.

---

# 3. System Requirements

### Minimum Requirements

| Component | Requirement |
|-----------|-------------|
| CPU | Dual Core |
| RAM | 4 GB |
| Storage | 20 GB |
| Internet | Required for dependency downloads |

### Recommended Requirements

| Component | Requirement |
|-----------|-------------|
| CPU | Quad Core or higher |
| RAM | 8 GB |
| Storage | SSD |
| Java | 21 |
| MySQL | 8.x |

---

# 4. Software Prerequisites

Install the following software before deployment.

| Software | Version |
|----------|---------|
| Java JDK | 21 |
| Maven | 3.9+ |
| MySQL | 8.x |
| Node.js | 22+ |
| npm | Latest |
| Git | Latest |
| IntelliJ IDEA | Recommended |
| VS Code | Recommended |
| Postman | API Testing |

Verify installation:

```bash
java -version

mvn -version

node -v

npm -v

mysql --version

git --version
```

---

# 5. Project Structure

```text
Smart-Parking-Lot-Management-System/

├── backend/
│
├── frontend/
│
├── docs/
│
├── diagrams/
│
├── assets/
│
├── scripts/
│
├── README.md
│
└── LICENSE
```

---

# 6. Database Setup

## Step 1

Start MySQL Server.

---

## Step 2

Create a new database.

```sql
CREATE DATABASE smart_parking;
```

---

## Step 3

Create a dedicated user (recommended).

```sql
CREATE USER 'parking_user'@'localhost'
IDENTIFIED BY 'strong_password';

GRANT ALL PRIVILEGES
ON smart_parking.*
TO 'parking_user'@'localhost';

FLUSH PRIVILEGES;
```

---

## Step 4

Configure the backend datasource.

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/smart_parking

spring.datasource.username=parking_user

spring.datasource.password=strong_password
```

---

# 7. Backend Setup

Navigate to the backend directory.

```bash
cd backend
```

Install dependencies and build:

```bash
mvn clean install
```

Run the application:

```bash
mvn spring-boot:run
```

or

```bash
java -jar target/smart-parking-system.jar
```

Default backend URL:

```text
http://localhost:8080
```

---

# 8. Frontend Setup

Navigate to the frontend directory.

```bash
cd frontend
```

Install dependencies.

```bash
npm install
```

Start the development server.

```bash
npm run dev
```

Default frontend URL:

```text
http://localhost:5173
```

---

# 9. Running the Application

Ensure the following order:

1. MySQL Server is running.
2. Backend starts successfully.
3. Frontend starts successfully.
4. Browser opens:

```text
http://localhost:5173
```

Verify:

- Dashboard loads.
- Vehicle APIs respond.
- Database connection succeeds.
- Forms submit successfully.

---

# 10. Production Deployment

### Backend

Package the application.

```bash
mvn clean package
```

Run:

```bash
java -jar smart-parking-system.jar
```

---

### Frontend

Create an optimized production build.

```bash
npm run build
```

Output:

```text
dist/
```

Serve the generated files using:

- Nginx
- Apache HTTP Server
- Vercel
- Netlify

---

# 11. Environment Variables

Sensitive configuration should not be hard-coded.

Example:

```properties
DB_HOST=localhost

DB_PORT=3306

DB_NAME=smart_parking

DB_USERNAME=parking_user

DB_PASSWORD=strong_password
```

Production environments should use environment variables or a secret management solution.

---

# 12. Build Process

### Backend

```bash
mvn clean package
```

Artifacts:

```text
target/

└── smart-parking-system.jar
```

---

### Frontend

```bash
npm run build
```

Artifacts:

```text
dist/
```

---

# 13. Verification Checklist

After deployment verify:

- Java installed
- MySQL running
- Database created
- Backend started
- Frontend started
- API reachable
- CORS configured
- CRUD operations working
- Dashboard loads
- Reports generated
- No startup errors

---

# 14. Troubleshooting

## Backend does not start

Possible causes:

- Incorrect JDK version
- Maven dependency errors
- Invalid datasource configuration

---

## Database connection fails

Check:

- MySQL service status
- Username/password
- JDBC URL
- Database existence

---

## Frontend cannot reach backend

Verify:

- Backend is running
- API base URL
- CORS configuration
- Network connectivity

---

## Maven build fails

Try:

```bash
mvn clean
mvn install
```

---

## Node modules issue

Delete:

```text
node_modules/
```

Then reinstall:

```bash
npm install
```

---

# 15. Maintenance

Recommended maintenance tasks:

- Update project dependencies regularly.
- Apply database backups.
- Monitor application logs.
- Review security updates.
- Remove unused dependencies.
- Perform regression testing before releases.
- Document configuration changes.

---

# 16. Deployment Summary

| Component | Technology | Default Port |
|-----------|------------|-------------:|
| Frontend | React + Vite | 5173 |
| Backend | Spring Boot | 8080 |
| Database | MySQL | 3306 |

Deployment sequence:

```text
MySQL

↓

Spring Boot

↓

React

↓

Browser
```

---

# 17. Conclusion

The Smart Parking Lot Management System follows a straightforward deployment process based on a three-tier architecture.

By configuring the database, backend, and frontend in the recommended sequence, developers can quickly set up a local development environment or prepare the application for production deployment. The use of externalized configuration, build automation with Maven and npm, and clear verification steps ensures that the deployment process remains reliable, repeatable, and easy to maintain.

---
**End of Deployment Guide Document**