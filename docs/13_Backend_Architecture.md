# Backend Architecture

# Smart Parking Lot Management System

---

## Document Information

| Field | Value |
|-------|-------|
| Document Name | Backend Architecture |
| Version | 1.0 |
| Project | Smart Parking Lot Management System |
| Technology | Spring Boot |
| Prepared By | Gaurav Kumar Singh |
| Last Updated | July 2026 |

---

# Table of Contents

1. Introduction
2. Backend Objectives
3. Technology Stack
4. Architecture Overview
5. Package Structure
6. Request Lifecycle
7. Core Layers
8. Data Flow
9. Validation Architecture
10. Exception Handling
11. Transaction Management
12. Persistence Layer
13. Configuration Management
14. Logging Strategy
15. Performance Considerations
16. Scalability
17. Conclusion

---

# 1. Introduction

The backend of the Smart Parking Lot Management System is developed using **Spring Boot** and follows a **Layered Architecture**.

Each layer has a single responsibility, making the application modular, maintainable, testable, and scalable.

The backend exposes RESTful APIs that handle all business operations, including vehicle registration, parking management, slot allocation, dashboard analytics, report generation, and receipt creation.

---

# 2. Backend Objectives

The backend is designed to:

- Provide RESTful APIs
- Execute business logic
- Validate incoming requests
- Manage parking sessions
- Handle database operations
- Ensure data integrity
- Generate parking reports
- Support future scalability

---

# 3. Technology Stack

| Layer | Technology |
|--------|------------|
| Language | Java 21 |
| Framework | Spring Boot |
| REST API | Spring MVC |
| ORM | Hibernate |
| Persistence | Spring Data JPA |
| Database | MySQL 8.x |
| Validation | Jakarta Bean Validation |
| Build Tool | Maven |
| Logging | SLF4J + Logback |
| Testing | JUnit 5 + Mockito |
| API Testing | Postman |

---

# 4. Architecture Overview

The backend follows a layered architecture.

```text
               Client (React)

                      │
                      ▼

            REST Controllers

                      │
                      ▼

             Service Layer

                      │
                      ▼

          Repository Layer

                      │
                      ▼

          Hibernate / JPA

                      │
                      ▼

               MySQL Database
```

Each layer communicates only with the layer immediately below it.

---

# 5. Package Structure

```text
com.smartparking

│

├── config

├── controller

├── dto
│   ├── request
│   └── response

├── entity

├── enums

├── exception

├── mapper

├── repository

├── service
│   ├── impl

├── strategy

├── util

└── SmartParkingApplication.java
```

### Responsibilities

**config**

Application configuration classes.

**controller**

REST API endpoints.

**dto**

Objects used for API communication.

**entity**

JPA entity classes.

**repository**

Database interaction.

**service**

Business logic.

**exception**

Custom exceptions and global handlers.

**mapper**

Conversion between DTOs and entities.

**strategy**

Parking allocation strategies.

**util**

Common helper classes.

---

# 6. Request Lifecycle

Every request follows the same processing pipeline.

```text
Client

↓

Controller

↓

Validation

↓

Service

↓

Repository

↓

Hibernate

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
```

Example: Vehicle Registration

1. Client submits vehicle details.
2. Controller receives the request.
3. Request is validated.
4. Service checks business rules.
5. Repository queries the database.
6. Entity is persisted.
7. Response DTO is created.
8. Controller returns HTTP 201 Created.

---

# 7. Core Layers

## 7.1 Controller Layer

Responsibilities

- Handle HTTP requests
- Validate request bodies
- Invoke service methods
- Return HTTP responses

Example Controllers

- VehicleController
- ParkingController
- SlotController
- DashboardController
- ReportController

Controllers do **not** contain business logic.

---

## 7.2 Service Layer

Responsibilities

- Execute business rules
- Coordinate multiple repositories
- Manage transactions
- Calculate parking fees
- Allocate parking slots

Example Services

- VehicleService
- ParkingService
- SlotService
- DashboardService
- ReportService

This is the heart of the backend.

---

## 7.3 Repository Layer

Responsibilities

- CRUD operations
- Custom database queries
- Entity persistence

Repositories

- VehicleRepository
- ParkingRepository
- ParkingSlotRepository
- ReceiptRepository

Repositories interact with the database only through Spring Data JPA.

---

## 7.4 Database Layer

Responsibilities

- Store entities
- Maintain relationships
- Execute SQL queries
- Enforce constraints

---

# 8. Data Flow

## Vehicle Check-In

```text
User

↓

ParkingController

↓

ParkingService

↓

SlotService

↓

ParkingRepository

↓

MySQL

↓

Response DTO

↓

Client
```

## Vehicle Check-Out

```text
User

↓

ParkingController

↓

ParkingService

↓

Calculate Duration

↓

Calculate Fee

↓

Update Parking Session

↓

Release Slot

↓

Generate Receipt

↓

Client
```

---

# 9. Validation Architecture

Input validation is performed before business logic execution.

### Bean Validation

Examples

```java
@NotBlank

@NotNull

@Size

@Email

@Positive
```

### Business Validation

Examples

- Vehicle number must be unique.
- Vehicle cannot have multiple active sessions.
- Slot must be available.
- Exit time must be after entry time.

This two-layer validation ensures both data correctness and business rule enforcement.

---

# 10. Exception Handling

A centralized exception handling mechanism is implemented using `@RestControllerAdvice`.

### Custom Exceptions

- VehicleNotFoundException
- SlotNotAvailableException
- DuplicateVehicleException
- ActiveParkingSessionException
- ParkingSessionNotFoundException

### Standard Error Response

```json
{
  "timestamp": "...",
  "status": 404,
  "error": "Not Found",
  "message": "Vehicle not found",
  "path": "/api/v1/vehicles/ABC1234"
}
```

Centralized exception handling ensures consistent API responses.

---

# 11. Transaction Management

Business operations that involve multiple database updates are executed within transactions.

Example

Vehicle Check-Out

1. Retrieve active session
2. Calculate parking fee
3. Save receipt
4. Update parking session
5. Release parking slot

If any step fails, the transaction is rolled back to preserve data consistency.

Spring's `@Transactional` annotation manages this behavior.

---

# 12. Persistence Layer

Persistence is implemented using Spring Data JPA.

### Advantages

- No manual SQL for basic CRUD
- Automatic query generation
- Entity relationship management
- Database portability
- Transaction support

Repositories extend interfaces such as:

```java
JpaRepository<Entity, Long>
```

---

# 13. Configuration Management

Application configuration is externalized.

Examples

```properties
spring.datasource.url
spring.datasource.username
spring.datasource.password
spring.jpa.hibernate.ddl-auto
server.port
```

Benefits

- Environment-specific configuration
- Easier deployment
- Improved security
- No hard-coded values

---

# 14. Logging Strategy

The backend records important events using SLF4J with Logback.

Examples

- Application startup
- Vehicle registration
- Vehicle check-in
- Vehicle check-out
- Report generation
- Validation failures
- Exceptions

Log levels

- INFO
- WARN
- ERROR
- DEBUG (development only)

---

# 15. Performance Considerations

The backend is designed for efficient request processing.

Measures include:

- Indexed database columns
- Pagination for large datasets
- Lazy loading where appropriate
- Efficient repository queries
- DTO-based responses
- Avoiding unnecessary database access

---

# 16. Scalability

The architecture supports future enhancements without major redesign.

Potential additions:

- JWT Authentication
- Role-Based Access Control (RBAC)
- Redis Caching
- RabbitMQ/Kafka for asynchronous processing
- Docker containerization
- Kubernetes deployment
- Microservices migration
- Payment gateway integration
- Multi-parking-lot support

---

# 17. Backend Architecture Summary

| Layer | Responsibility |
|--------|----------------|
| Controller | Handle HTTP requests |
| Service | Execute business logic |
| Repository | Database interaction |
| Entity | Data model |
| DTO | API communication |
| Mapper | Entity ↔ DTO conversion |
| Strategy | Slot allocation logic |
| Configuration | Application setup |
| Exception | Error handling |
| Utility | Shared helper methods |

---

# 18. Conclusion

The backend architecture of the Smart Parking Lot Management System follows Spring Boot best practices and enterprise software design principles.

By combining Layered Architecture, RESTful APIs, Spring Data JPA, Bean Validation, centralized exception handling, transaction management, and modular package organization, the backend remains clean, maintainable, testable, and ready for future enhancements such as authentication, caching, cloud deployment, and distributed services.

---
**End of Backend Architecture Document**