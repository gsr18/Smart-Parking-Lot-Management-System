# System Architecture

# Smart Parking Lot Management System

---

## Document Information

| Field | Value |
|-------|-------|
| Document Name | System Architecture |
| Version | 1.0 |
| Project | Smart Parking Lot Management System |
| Prepared By | Gaurav Kumar Singh |
| Architecture Style | Layered Monolithic Architecture |
| Last Updated | July 2026 |

---

# Table of Contents

1. Introduction
2. Architecture Goals
3. Architectural Style
4. System Context
5. High-Level Architecture
6. Major Components
7. Technology Stack
8. Request Flow
9. Data Flow
10. Cross-Cutting Concerns
11. Security Overview
12. Deployment Overview
13. Scalability Considerations
14. Architecture Principles
15. Conclusion

---

# 1. Introduction

The Smart Parking Lot Management System (SPLMS) is designed as a modern full-stack web application that automates parking operations through a clean and modular software architecture.

The architecture emphasizes:

- Separation of Concerns
- Maintainability
- Scalability
- Extensibility
- Testability
- Clean Code Practices

The application follows a Layered Monolithic Architecture where all modules are deployed as a single application while maintaining clear logical separation between layers.

---

# 2. Architecture Goals

The architecture has been designed to achieve the following goals:

- Maintain a clean separation between presentation, business, and persistence layers.
- Ensure loose coupling between system components.
- Support future feature additions with minimal code changes.
- Centralize business logic within the Service Layer.
- Promote reusable and maintainable code.
- Provide a stable REST API for frontend communication.
- Preserve complete parking history through Parking Sessions.
- Enable efficient database access using Spring Data JPA.

---

# 3. Architectural Style

The system follows a **Layered Monolithic Architecture**.

### Why Layered Architecture?

- Easy to understand
- Well suited for Spring Boot
- Clear separation of responsibilities
- Simple deployment
- Suitable for small and medium-sized applications
- Easier debugging and testing

Each layer communicates only with the layer directly below it.

---

# 4. System Context

The application consists of three primary actors.

- Administrator
- Parking Staff
- Database

Users interact with the React frontend.

The frontend communicates with the backend using REST APIs.

The backend processes business logic and stores data in MySQL.

```
+--------------------------------------------------------------+
|                      Smart Parking System                     |
+--------------------------------------------------------------+

            Administrator / Parking Staff
                        │
                        ▼
                React Frontend (UI)
                        │
                 HTTP / REST APIs
                        │
                        ▼
             Spring Boot Backend Application
                        │
          Spring Data JPA / Hibernate ORM
                        │
                        ▼
                  MySQL Database
```

---

# 5. High-Level Architecture

The backend consists of five logical layers.

```
Presentation Layer
        │
        ▼
Controller Layer
        │
        ▼
Service Layer
        │
        ▼
Repository Layer
        │
        ▼
Database Layer
```

Each layer has a single responsibility.

---

# 6. Major Components

## Frontend

Responsibilities

- User Interface
- Form Validation
- Dashboard
- API Communication
- Data Visualization

Technology

- React
- Vite
- Tailwind CSS
- Axios

---

## Controller Layer

Responsibilities

- Receive HTTP Requests
- Validate Request Body
- Call Services
- Return HTTP Responses

Controllers do not contain business logic.

---

## Service Layer

Responsibilities

- Business Logic
- Parking Rules
- Fee Calculation
- Slot Allocation
- Dashboard Statistics
- Report Generation

The Service Layer is the heart of the application.

---

## Repository Layer

Responsibilities

- Database Operations
- CRUD Operations
- Custom Queries
- Data Persistence

Implemented using Spring Data JPA.

---

## Database Layer

Responsibilities

- Persistent Storage
- Relationships
- Constraints
- Indexes

Database

MySQL 8.x

---

# 7. Technology Stack

## Backend

- Java 21
- Spring Boot
- Spring MVC
- Spring Data JPA
- Hibernate
- Maven
- Bean Validation
- Lombok

---

## Frontend

- React
- Vite
- Tailwind CSS
- Axios

---

## Database

- MySQL

---

## Development Tools

- IntelliJ IDEA
- VS Code
- Postman
- MySQL Workbench
- Git
- GitHub

---

# 8. Request Flow

Every request follows the same processing pipeline.

```
User

↓

React UI

↓

REST API

↓

Controller

↓

Service

↓

Repository

↓

Database

↓

Repository

↓

Service

↓

Controller

↓

JSON Response

↓

React UI
```

This ensures a consistent and maintainable request lifecycle.

---

# 9. Data Flow

Example: Vehicle Check-In

1. User submits vehicle details.
2. Frontend sends POST request.
3. Controller validates request.
4. Service checks business rules.
5. Repository retrieves slot information.
6. Parking Session is created.
7. Slot status is updated.
8. Database transaction commits.
9. Success response is returned.
10. Dashboard statistics refresh.

---

# 10. Cross-Cutting Concerns

The following concerns affect multiple modules.

## Validation

Bean Validation ensures incoming requests are valid.

---

## Exception Handling

Global Exception Handler provides consistent error responses.

---

## Logging

Application logs:

- Startup
- Parking Events
- Errors
- Warnings

---

## Transactions

Critical operations use database transactions to maintain consistency.

---

# 11. Security Overview

Version 1 focuses on secure coding practices.

Security includes:

- Input Validation
- SQL Injection Prevention
- Exception Handling
- HTTP Status Codes
- Server-side Fee Calculation

Future versions may include:

- JWT Authentication
- Role-Based Access Control
- HTTPS
- Password Encryption

---

# 12. Deployment Overview

Deployment Architecture

```
Browser

↓

React Application

↓

Spring Boot Application

↓

MySQL Database
```

The frontend and backend communicate over HTTP.

The backend communicates with MySQL using Hibernate.

---

# 13. Scalability Considerations

The architecture supports future enhancements including:

- Authentication
- Multiple Parking Lots
- Online Payments
- QR Code Entry
- RFID Integration
- Email Notifications
- SMS Notifications
- Cloud Deployment
- Docker
- Kubernetes

No major architectural redesign should be required.

---

# 14. Architecture Principles

The project follows the following software engineering principles.

- Separation of Concerns
- Single Responsibility Principle
- Dependency Injection
- Encapsulation
- Abstraction
- Layered Design
- Low Coupling
- High Cohesion
- Reusability
- Maintainability

---

# 15. Conclusion

The Smart Parking Lot Management System adopts a Layered Monolithic Architecture to provide a clean, maintainable, and scalable foundation for application development.

This architecture separates responsibilities across presentation, business, persistence, and database layers while ensuring that business rules remain centralized within the Service Layer.

The architecture serves as the blueprint for the subsequent High-Level Design (HLD), Low-Level Design (LLD), Database Design, and API Specification documents.

---
**End of System Architecture Document**