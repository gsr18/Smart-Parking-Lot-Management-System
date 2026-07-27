# Software Requirements Specification (SRS)

# Smart Parking Lot Management System

---

## Document Information

| Field | Value |
|-------|-------|
| Project Name | Smart Parking Lot Management System |
| Version | 1.0 |
| Document Type | Software Requirements Specification |
| Prepared By | Gaurav Kumar Singh |
| Technology Stack | Java 21, Spring Boot, React, MySQL |
| Architecture | Layered Monolithic Architecture |
| Status | Draft |
| Last Updated | July 2026 |

---

# Table of Contents

1. Introduction
2. Purpose
3. Scope
4. Definitions
5. Acronyms
6. References
7. Product Perspective
8. Product Functions
9. User Classes
10. Operating Environment
11. Design Constraints
12. Assumptions
13. Dependencies

---

# 1. Introduction

## 1.1 Purpose

This Software Requirements Specification (SRS) defines the complete functional and non-functional requirements for the **Smart Parking Lot Management System (SPLMS)**.

The purpose of this document is to provide a single source of truth for all stakeholders involved in the project, including developers, testers, reviewers, and future maintainers.

The document describes:

- Business objectives
- Functional requirements
- Non-functional requirements
- Business rules
- User interactions
- Constraints
- Assumptions
- Acceptance criteria

This specification will act as the primary blueprint for designing, implementing, testing, and deploying the application.

---

## 1.2 Intended Audience

This document is intended for:

- Backend Developers
- Frontend Developers
- Software Architects
- Test Engineers
- Database Designers
- Technical Reviewers
- Academic Evaluators
- Future Contributors

Readers are expected to have basic knowledge of:

- Object-Oriented Programming
- REST APIs
- Spring Boot
- SQL Databases
- Web Applications

---

## 1.3 Scope

The Smart Parking Lot Management System is a web-based application designed to automate parking lot operations.

The system enables administrators to:

- Manage parking slots
- Register vehicles
- Park vehicles
- Remove vehicles
- Calculate parking fees
- Maintain parking history
- Generate reports
- Monitor occupancy through dashboards

Unlike traditional CRUD applications, the system models real-world parking operations using **Parking Sessions**, ensuring complete historical records while preserving data integrity.

The project is intended as a portfolio-quality application demonstrating professional backend engineering practices.

---

# 2. Product Perspective

The Smart Parking Lot Management System is an independent software application.

The system consists of two major components:

- Frontend (React)
- Backend (Spring Boot)

Both communicate using REST APIs over HTTP.

The backend follows a layered architecture consisting of:

- Controller Layer
- Service Layer
- Repository Layer
- Database Layer

The frontend communicates exclusively with backend REST APIs and contains no business logic.

---

## System Context

```

```
+-----------------------------------------------------+
|                Smart Parking System                 |
+-----------------------------------------------------+

        Admin / Parking Staff
                  │
                  ▼

        React Web Application
                  │
            REST APIs (HTTP)
                  │
                  ▼

         Spring Boot Backend
                  │
        Spring Data JPA / Hibernate
                  │
                  ▼

               MySQL Database
```

```

---

# 3. Product Objectives

The primary objectives of the system are:

- Digitize parking lot operations.
- Reduce manual work.
- Eliminate duplicate records.
- Automatically allocate parking slots.
- Calculate parking fees accurately.
- Maintain complete parking history.
- Improve operational efficiency.
- Demonstrate enterprise-level backend architecture.
- Demonstrate Object-Oriented Programming principles.
- Build a portfolio-quality software project.

---

# 4. Product Functions

The system shall provide the following major functions.

## 4.1 Vehicle Management

The system shall allow:

- Vehicle Registration
- Vehicle Search
- Vehicle Lookup
- Vehicle History

---

## 4.2 Parking Management

The system shall support:

- Vehicle Check-In
- Vehicle Check-Out
- Automatic Slot Allocation
- Parking Fee Calculation
- Receipt Generation

---

## 4.3 Slot Management

The system shall allow administrators to:

- Create Parking Slots
- Update Slots
- Enable Slots
- Disable Slots
- View Slot Status

---

## 4.4 Dashboard

The dashboard shall display:

- Total Slots
- Available Slots
- Occupied Slots
- Occupancy Percentage
- Vehicles Parked Today
- Vehicles Exited Today
- Revenue Today
- Revenue This Month

---

## 4.5 Reports

The reporting module shall generate:

- Daily Reports
- Weekly Reports
- Monthly Reports

Reports shall include:

- Revenue
- Parking Count
- Vehicle Distribution
- Average Parking Duration

---

## 4.6 Search

Users shall be able to search by:

- Vehicle Number
- Owner Name
- Parking Slot
- Vehicle Type

---

# 5. User Classes

The system supports two categories of users.

---

## 5.1 Administrator

The Administrator has complete access to the application.

Responsibilities include:

- Manage Parking Slots
- Park Vehicles
- Remove Vehicles
- Search Vehicles
- View Dashboard
- Generate Reports
- View Parking History

---

## 5.2 Parking Staff

Parking Staff members have limited permissions.

Allowed Operations:

- Park Vehicle
- Remove Vehicle
- Search Vehicle

Restricted Operations:

- Create Slots
- Delete Records
- Modify System Configuration

---

# 6. Operating Environment

## Backend

- Java 21
- Spring Boot 3.x
- Spring MVC
- Spring Data JPA
- Hibernate
- Maven

---

## Database

- MySQL 8.x

---

## Frontend

- React
- Vite
- Tailwind CSS
- Axios

---

## Development Tools

- IntelliJ IDEA
- VS Code
- MySQL Workbench
- Postman
- Git
- GitHub

---

# 7. Design Constraints

The following constraints apply.

- Single parking facility.
- Single backend application.
- Single frontend application.
- Monolithic architecture.
- Local MySQL database.
- RESTful APIs only.
- No GraphQL.
- No Microservices.
- No Message Queues.

These constraints are intentional to keep the project focused, maintainable, and suitable for academic and portfolio purposes.

---

# 8. Assumptions

The system assumes:

- Every vehicle has a unique registration number.
- Every parking slot has a unique identifier.
- One vehicle cannot have multiple active parking sessions.
- One parking slot can contain only one vehicle.
- Parking fees are calculated based on vehicle type.
- Server time is trusted.
- Internet connectivity is available.

---

# 9. Dependencies

The application depends on:

Backend:

- Java 21
- Spring Boot
- Spring Data JPA
- Hibernate
- Lombok
- Bean Validation

Frontend:

- React
- Axios
- Tailwind CSS

Database:

- MySQL

Development:

- Git
- Maven
- Postman

---

# End of Part 1

The remaining sections of this Software Requirements Specification include:

- Functional Requirements
- Business Rules
- Validation Rules
- Use Cases
- User Stories
- Error Handling
- Non-Functional Requirements
- Acceptance Criteria
- Requirement Traceability Matrix

---

# 10. Functional Requirements

The following functional requirements define the expected behavior of the Smart Parking Lot Management System.

Each requirement is assigned a unique identifier for traceability throughout the software development lifecycle.

Priority Levels

| Level | Description |
|--------|-------------|
| High | Essential for the system to function |
| Medium | Important but not critical |
| Low | Nice-to-have feature |

---

# 10.1 Vehicle Management Module

The Vehicle Management Module is responsible for maintaining vehicle information and supporting parking operations.

---

## FR-001 Register Vehicle

### Priority

High

### Description

The system shall allow the registration of a new vehicle if it does not already exist.

### Input

- Vehicle Number
- Vehicle Type
- Owner Name
- Owner Contact Number

### Preconditions

- Vehicle number must be unique.
- Vehicle type must be valid.

### Main Flow

1. User submits vehicle information.
2. System validates all fields.
3. System checks whether the vehicle already exists.
4. If the vehicle does not exist, create a new vehicle.
5. Store the vehicle information.
6. Return success response.

### Alternative Flow

If the vehicle already exists:

- Return HTTP 409 Conflict.
- Display an appropriate error message.

### Postconditions

- Vehicle record is successfully stored.

### Business Rules

- Vehicle Number must be unique.
- Vehicle Type cannot be null.

### Acceptance Criteria

✓ Vehicle is stored successfully.

✓ Duplicate registration is prevented.

---

## FR-002 Search Vehicle

### Priority

High

### Description

The system shall allow users to search for vehicles.

### Search Parameters

- Vehicle Number
- Owner Name
- Vehicle Type

### Main Flow

1. User enters search criteria.
2. System performs search.
3. Matching vehicles are returned.

### Acceptance Criteria

✓ Partial searches supported.

✓ Case insensitive search.

---

## FR-003 View Vehicle Details

### Priority

High

The system shall display:

- Vehicle Number
- Vehicle Type
- Current Parking Status
- Active Parking Session
- Previous Parking Sessions

---

## FR-004 View Vehicle History

### Priority

Medium

The system shall display all historical parking sessions associated with a vehicle.

Information displayed:

- Entry Time
- Exit Time
- Parking Duration
- Parking Fee
- Parking Slot

---

# 10.2 Parking Management Module

The Parking Module is the core business module of the application.

The system revolves around Parking Sessions.

---

## FR-005 Vehicle Check-In

### Priority

Critical

### Description

The system shall allow a vehicle to enter the parking lot.

### Preconditions

- Vehicle must not already have an ACTIVE parking session.
- Compatible parking slot must exist.

### Main Flow

1. User enters vehicle information.
2. Validate request.
3. Check active parking session.
4. Find compatible slot.
5. Reserve slot.
6. Create Parking Session.
7. Generate receipt.
8. Return success response.

### Alternative Flow

If no slot exists:

Return

"No Parking Slot Available"

HTTP Status

409 Conflict

### Postconditions

- Slot becomes OCCUPIED.
- Parking Session becomes ACTIVE.

### Business Rules

- One vehicle can have only one ACTIVE session.
- One slot can contain only one vehicle.

### Acceptance Criteria

✓ Slot assigned successfully.

✓ Parking session created.

✓ Receipt generated.

---

## FR-006 Vehicle Check-Out

### Priority

Critical

### Description

The system shall remove a parked vehicle from the parking lot.

### Preconditions

- Active parking session must exist.

### Main Flow

1. Search active session.
2. Calculate duration.
3. Calculate parking fee.
4. Generate receipt.
5. Release parking slot.
6. Close parking session.

### Postconditions

- Slot becomes AVAILABLE.
- Parking Session becomes COMPLETED.

### Acceptance Criteria

✓ Fee calculated correctly.

✓ Slot released.

✓ Parking history updated.

---

## FR-007 Parking Fee Calculation

### Priority

High

### Description

The parking fee shall depend upon:

- Vehicle Type
- Parking Duration

### Rules

Bike

₹20/hour

Car

₹50/hour

Truck

₹100/hour

Partial hour shall be rounded UP.

Example

65 minutes

↓

2 Hours

↓

Charge = 2 × Hourly Rate

### Acceptance Criteria

✓ Correct fee for every vehicle type.

---

## FR-008 Generate Receipt

### Priority

Medium

Receipt shall contain:

- Receipt Number
- Vehicle Number
- Vehicle Type
- Entry Time
- Exit Time
- Duration
- Parking Fee
- Slot Number

---

# 10.3 Parking Slot Management

---

## FR-009 Create Parking Slot

### Priority

High

Admin shall create parking slots.

Input

- Slot Number
- Slot Type
- Floor

Business Rules

- Slot Number must be unique.

---

## FR-010 Update Parking Slot

Admin shall update

- Slot Type
- Floor
- Status

---

## FR-011 Enable Parking Slot

Enabled slots may be allocated.

Disabled slots shall never be allocated.

---

## FR-012 Disable Parking Slot

Disabled slots:

- Cannot receive vehicles.
- Existing active session (if any) must finish before disabling.

---

## FR-013 View All Parking Slots

The system shall display:

- Slot Number
- Floor
- Status
- Slot Type

---

## FR-014 View Slot Details

Display

- Slot Information
- Current Vehicle
- Current Parking Session
- Occupancy Status

---

## FR-015 Slot Allocation

The system shall automatically allocate slots.

Allocation Strategy

Current Version

First Available Compatible Slot

Future Strategies

- Nearest Entrance
- Least Occupied Floor
- Reserved Parking
- VIP Parking

### Acceptance Criteria

✓ Compatible slot selected.

✓ Disabled slots ignored.

✓ Occupied slots ignored.

---

# Business Rules Summary

BR-001

Vehicle Number must be unique.

---

BR-002

One vehicle can have only one ACTIVE parking session.

---

BR-003

One parking slot can contain only one ACTIVE vehicle.

---

BR-004

Parking fee depends upon vehicle type.

---

BR-005

Partial hours are rounded upward.

---

BR-006

Disabled parking slots cannot be allocated.

---

BR-007

Completed parking sessions shall never be deleted.

---

BR-008

Parking history shall remain immutable.

---

# End of Part 2

Next Part

Functional Requirements

- Dashboard
- Reports
- Search
- Analytics
- Parking History
- Notifications
- Receipt Management


---

# 10.4 Dashboard Module

The Dashboard provides a real-time overview of the parking lot.

The dashboard shall be the default landing page after successful login.

---

## FR-016 View Dashboard Summary

### Priority

High

### Description

The system shall display key parking statistics.

### Dashboard Metrics

- Total Parking Slots
- Available Slots
- Occupied Slots
- Disabled Slots
- Occupancy Percentage
- Active Parking Sessions
- Vehicles Parked Today
- Vehicles Exited Today
- Revenue Today
- Revenue This Week
- Revenue This Month

### Acceptance Criteria

✓ Dashboard loads within 2 seconds.

✓ Statistics reflect current database state.

---

## FR-017 View Recent Parking Activity

### Priority

Medium

Display the most recent parking activities.

Each record shall include:

- Vehicle Number
- Vehicle Type
- Slot Number
- Entry Time
- Status

Maximum records displayed:

10

---

## FR-018 Vehicle Type Distribution

### Priority

Medium

Display a chart representing

- Cars
- Bikes
- Trucks

The chart shall update automatically when parking sessions change.

---

## FR-019 Occupancy Analytics

### Priority

Medium

Display

- Occupancy Percentage
- Occupied Slots
- Available Slots

The occupancy percentage shall be calculated as

Occupied Slots / Total Enabled Slots × 100

---

# 10.5 Parking History Module

---

## FR-020 View Parking History

### Priority

High

The system shall maintain complete parking history.

History shall never be deleted.

Information displayed

- Vehicle Number
- Vehicle Type
- Owner Name
- Slot Number
- Entry Time
- Exit Time
- Duration
- Parking Fee
- Status

---

## FR-021 Filter Parking History

### Priority

High

History shall support filtering by

- Date
- Vehicle Number
- Vehicle Type
- Parking Status
- Slot Number

---

## FR-022 Sort Parking History

### Priority

Medium

History shall support sorting by

- Entry Time
- Exit Time
- Parking Fee
- Duration

Ascending

Descending

---

## FR-023 Pagination

### Priority

Medium

Parking history shall support pagination.

Default page size

10

Configurable page size

10

20

50

100

---

# 10.6 Search Module

---

## FR-024 Global Search

### Priority

High

Users shall search using

- Vehicle Number
- Owner Name
- Slot Number

Search results shall return

- Vehicle Information
- Parking Session
- Slot Information

---

## FR-025 Advanced Search

### Priority

Medium

Advanced filters

- Vehicle Type
- Date Range
- Parking Status
- Parking Fee Range

---

# 10.7 Reporting Module

---

## FR-026 Daily Report

### Priority

Medium

Generate

Daily Parking Report

Include

- Total Vehicles
- Revenue
- Occupancy
- Average Parking Duration
- Vehicle Distribution

---

## FR-027 Weekly Report

Generate

Weekly Report

Include

- Total Revenue
- Parking Count
- Peak Parking Day
- Vehicle Distribution

---

## FR-028 Monthly Report

Generate

Monthly Report

Include

- Monthly Revenue
- Parking Statistics
- Occupancy Trend
- Vehicle Type Statistics

---

## FR-029 Revenue Summary

Display

- Today
- Week
- Month
- Lifetime

---

# 10.8 Receipt Module

---

## FR-030 Generate Parking Receipt

The receipt shall contain

- Receipt Number
- Vehicle Number
- Vehicle Type
- Owner Name
- Slot Number
- Entry Time
- Exit Time
- Parking Duration
- Parking Fee
- Generated Time

Receipt Number shall be unique.

---

## FR-031 View Previous Receipts

Users shall view historical receipts.

---

# 10.9 Administration Module

---

## FR-032 Manage Parking Slots

Administrator shall

- Create Slot
- Update Slot
- Disable Slot
- Enable Slot

---

## FR-033 System Configuration

Future Version

Allow configuration of

- Hourly Rates
- Slot Allocation Strategy
- Parking Rules

Current Version

Static configuration.

---

# 10.10 Notifications

---

## FR-034 Success Notifications

Display messages for

- Vehicle Parked
- Vehicle Removed
- Slot Created
- Slot Updated

---

## FR-035 Error Notifications

Display meaningful errors

Examples

Vehicle Already Parked

Vehicle Not Found

No Slot Available

Invalid Input

Slot Disabled

---

# Functional Requirement Summary

| Module | Requirements |
|----------|-------------|
| Vehicle | FR-001 to FR-004 |
| Parking | FR-005 to FR-008 |
| Slot | FR-009 to FR-015 |
| Dashboard | FR-016 to FR-019 |
| Parking History | FR-020 to FR-023 |
| Search | FR-024 to FR-025 |
| Reports | FR-026 to FR-029 |
| Receipt | FR-030 to FR-031 |
| Administration | FR-032 to FR-033 |
| Notifications | FR-034 to FR-035 |

---

# Functional Requirement Statistics

Total Functional Requirements

35

High Priority

17

Medium Priority

16

Low Priority

2

Critical Requirements

- Vehicle Check-In
- Vehicle Check-Out
- Slot Allocation
- Parking Session Management

---

# End of Part 3

The next section defines the complete quality requirements of the system, including:

- Non-Functional Requirements (NFR)
- Performance Requirements
- Security Requirements
- Reliability
- Scalability
- Availability
- Maintainability
- Validation Rules
- Business Rules
- Data Integrity Rules

These requirements determine how well the system performs, not just what it does.


---

# 11. Non-Functional Requirements

Non-Functional Requirements (NFRs) define the quality attributes of the Smart Parking Lot Management System. These requirements ensure the application is reliable, scalable, maintainable, secure, and performant.

---

# 11.1 Performance Requirements

## NFR-001 API Response Time

### Priority

High

### Requirement

The system shall respond to normal API requests within **300 milliseconds** under normal operating conditions.

### Acceptance Criteria

- GET APIs < 300 ms
- POST APIs < 500 ms
- PUT APIs < 500 ms
- DELETE APIs < 500 ms

---

## NFR-002 Dashboard Loading Time

The dashboard shall load completely within **2 seconds**.

---

## NFR-003 Search Performance

Vehicle searches shall return results within **500 milliseconds** for databases containing up to **100,000 parking records**.

---

## NFR-004 Report Generation

Daily, Weekly, and Monthly reports shall be generated within **5 seconds**.

---

# 11.2 Scalability Requirements

## NFR-005

The system shall support future expansion without major architectural changes.

Examples

- Additional vehicle types
- Additional parking strategies
- Multiple parking lots
- Authentication
- Online payments

---

## NFR-006

The application shall follow modular architecture.

Each module shall be independently maintainable.

Modules include

- Vehicle
- Parking
- Slot
- Dashboard
- Reports

---

# 11.3 Reliability Requirements

## NFR-007

The application shall prevent duplicate parking sessions.

---

## NFR-008

The application shall never lose parking history.

Completed sessions shall remain permanently stored.

---

## NFR-009

Database transactions shall maintain consistency.

Parking Session Creation

Vehicle Entry

Slot Allocation

must either

Complete Successfully

OR

Rollback Completely

---

# 11.4 Availability

## NFR-010

The system shall remain operational during standard working hours.

---

## NFR-011

Unexpected failures shall not corrupt database records.

---

# 11.5 Maintainability

## NFR-012

The project shall follow SOLID Principles.

---

## NFR-013

Business logic shall never be written inside Controllers.

---

## NFR-014

Database operations shall only exist inside Repository Layer.

---

## NFR-015

Business rules shall only exist inside Service Layer.

---

## NFR-016

Entities shall never be exposed directly through REST APIs.

DTOs shall be used.

---

# 11.6 Extensibility

## NFR-017

The architecture shall allow introducing new vehicle types without changing existing business logic.

Example

Future

- Electric Car
- Bus
- Emergency Vehicle

---

## NFR-018

Parking allocation strategies shall be replaceable.

Examples

- First Available
- Nearest Entrance
- VIP Strategy
- Reserved Strategy

---

# 11.7 Security Requirements

## NFR-019

All user inputs shall be validated.

---

## NFR-020

The system shall protect against SQL Injection using JPA parameterized queries.

---

## NFR-021

Meaningful exception messages shall never expose internal implementation details.

Example

Bad

```
NullPointerException
```

Good

```
Vehicle Not Found
```

---

## NFR-022

Sensitive information shall never be logged.

---

## NFR-023

Future versions shall support

- JWT Authentication
- Role-Based Access Control
- Password Encryption

---

# 11.8 Usability

## NFR-024

The UI shall be responsive.

---

## NFR-025

Users shall complete common operations within three clicks.

Examples

- Park Vehicle
- Remove Vehicle
- Search Vehicle

---

## NFR-026

Error messages shall be human-readable.

---

# 11.9 Portability

## NFR-027

Backend shall run on

- Windows
- Linux
- macOS

without code modification.

---

## NFR-028

Frontend shall support

- Chrome
- Edge
- Firefox

Latest versions.

---

# 11.10 Coding Standards

## NFR-029

Java Code shall follow

Oracle Java Coding Conventions.

---

## NFR-030

Meaningful variable names shall be used.

Example

Good

vehicleNumber

Bad

vn

---

## NFR-031

Methods shall have a single responsibility.

---

## NFR-032

Maximum method length

Recommended

Less than 30 lines

---

## NFR-033

Classes shall follow Single Responsibility Principle.

---

# 11.11 Logging Requirements

## NFR-034

The application shall log

- Vehicle Check-In
- Vehicle Check-Out
- Slot Allocation
- Slot Release
- Exceptions
- Application Startup

---

## NFR-035

Logs shall include

- Timestamp
- Log Level
- Module
- Message

---

# 11.12 Testing Requirements

## NFR-036

Business logic shall be unit testable.

---

## NFR-037

Repository layer shall support integration testing.

---

## NFR-038

REST APIs shall be testable using

- Postman
- MockMvc

---

# 11.13 Documentation Requirements

## NFR-039

All public classes shall contain JavaDoc comments.

---

## NFR-040

The project shall include

- README
- HLD
- LLD
- API Documentation
- Database Documentation

---

# NFR Summary

| Category | Requirement IDs |
|------------|----------------|
| Performance | NFR-001 to NFR-004 |
| Scalability | NFR-005 to NFR-006 |
| Reliability | NFR-007 to NFR-009 |
| Availability | NFR-010 to NFR-011 |
| Maintainability | NFR-012 to NFR-016 |
| Extensibility | NFR-017 to NFR-018 |
| Security | NFR-019 to NFR-023 |
| Usability | NFR-024 to NFR-026 |
| Portability | NFR-027 to NFR-028 |
| Coding Standards | NFR-029 to NFR-033 |
| Logging | NFR-034 to NFR-035 |
| Testing | NFR-036 to NFR-038 |
| Documentation | NFR-039 to NFR-040 |

---

# End of Part 4

The next section defines:

- Business Rules (BR)
- Validation Rules (VR)
- Data Integrity Rules
- Database Constraints

These rules form the core domain logic of the Parking Management System and ensure data consistency across all modules.


---

# 12. Business Rules

Business Rules define the domain-specific logic that governs the Smart Parking Lot Management System.

These rules must always be enforced regardless of the frontend or API client.

---

## BR-001 Unique Vehicle Number

Every vehicle registered in the system shall have a unique registration number.

Duplicate vehicle numbers are not permitted.

---

## BR-002 Single Active Parking Session

A vehicle shall have only one ACTIVE parking session at any given time.

If a vehicle already has an active session, it cannot be checked in again until the current session is completed.

---

## BR-003 One Vehicle Per Slot

A parking slot shall contain only one vehicle at a time.

A slot marked as OCCUPIED cannot be assigned to another vehicle.

---

## BR-004 Compatible Slot Allocation

Vehicles shall only be assigned to compatible parking slots.

Examples:

- Bike → Bike Slot
- Car → Car Slot
- Truck → Truck Slot

If no compatible slot exists, the check-in request shall be rejected.

---

## BR-005 Slot Availability

Only parking slots with status AVAILABLE may be allocated.

Slots marked as OCCUPIED or DISABLED shall not be assigned.

---

## BR-006 Parking Session Lifecycle

Every parking session shall follow the lifecycle:

ACTIVE → COMPLETED

A completed session cannot return to ACTIVE.

---

## BR-007 Parking History Preservation

Completed parking sessions shall never be deleted.

Historical records must remain available for reporting and auditing.

---

## BR-008 Fee Calculation

Parking fees shall be calculated using:

- Vehicle Type
- Parking Duration

Current hourly rates:

| Vehicle Type | Hourly Rate |
|--------------|------------:|
| Bike | ₹20 |
| Car | ₹50 |
| Truck | ₹100 |

---

## BR-009 Partial Hour Billing

Parking duration shall be rounded up to the nearest hour.

Examples:

- 15 Minutes → 1 Hour
- 61 Minutes → 2 Hours
- 125 Minutes → 3 Hours

---

## BR-010 Unique Receipt Number

Each completed parking session shall generate one unique receipt number.

Receipt numbers shall never be duplicated.

---

## BR-011 Slot Release

When a vehicle exits,

- Parking Session becomes COMPLETED
- Slot becomes AVAILABLE

Both operations shall occur within the same database transaction.

---

## BR-012 Dashboard Consistency

Dashboard statistics shall always reflect the latest committed database state.

---

# 13. Validation Rules

Validation Rules ensure that only valid data enters the system.

---

## VR-001 Vehicle Number

Requirements:

- Mandatory
- Maximum Length: 20 Characters
- Must be Unique
- Cannot Contain Only Spaces

Examples:

Valid

- BR01AB1234
- PB10XY5678

Invalid

- ""
- "     "

---

## VR-002 Owner Name

Requirements:

- Mandatory
- Minimum Length: 2
- Maximum Length: 100

---

## VR-003 Contact Number

Requirements:

- Mandatory
- Exactly 10 digits
- Numeric only

Example

9876543210

---

## VR-004 Vehicle Type

Allowed Values

- BIKE
- CAR
- TRUCK

Any other value shall be rejected.

---

## VR-005 Slot Number

Requirements

- Mandatory
- Unique
- Maximum Length: 20

Example

A-101

---

## VR-006 Slot Type

Allowed Values

- BIKE
- CAR
- TRUCK

---

## VR-007 Floor Number

Requirements

- Positive Integer
- Minimum Value: 1

---

## VR-008 Entry Time

Entry Time shall always be generated by the server.

Clients shall not supply entry timestamps.

---

## VR-009 Exit Time

Exit Time shall only be generated during vehicle check-out.

---

## VR-010 Parking Fee

Parking Fee

- Cannot be negative
- Shall be calculated by the backend
- Clients cannot modify the value

---

# 14. Data Integrity Rules

The system shall maintain complete consistency of stored data.

---

## DIR-001

Vehicle Number shall be unique.

---

## DIR-002

Slot Number shall be unique.

---

## DIR-003

Each ACTIVE parking session must reference exactly one vehicle.

---

## DIR-004

Each ACTIVE parking session must reference exactly one parking slot.

---

## DIR-005

A parking slot cannot have multiple ACTIVE parking sessions.

---

## DIR-006

Historical parking sessions shall never be modified after completion except for administrative corrections.

---

## DIR-007

Foreign key relationships shall always remain valid.

---

## DIR-008

Database transactions shall guarantee ACID properties.

---

# 15. Error Handling Requirements

The backend shall return meaningful error responses.

Standard response format:

{
    "timestamp": "...",
    "status": 404,
    "error": "Not Found",
    "message": "Vehicle not found.",
    "path": "/api/parking/checkout"
}

---

## Common Error Scenarios

| Error Code | Description |
|------------|-------------|
| VEHICLE_NOT_FOUND | Vehicle does not exist |
| VEHICLE_ALREADY_PARKED | Vehicle already has an active session |
| SLOT_NOT_AVAILABLE | No compatible slot available |
| SLOT_NOT_FOUND | Slot does not exist |
| INVALID_INPUT | Request validation failed |
| PARKING_SESSION_NOT_FOUND | Active parking session not found |
| DUPLICATE_SLOT | Slot number already exists |
| DUPLICATE_VEHICLE | Vehicle number already exists |

---

# End of Part 5



---

# 16. Use Cases

This section describes the primary interactions between users and the Smart Parking Lot Management System.

---

## UC-001 Register Vehicle

### Primary Actor

Parking Staff / Administrator

### Goal

Register a new vehicle in the system.

### Preconditions

- Vehicle number does not already exist.

### Main Flow

1. User selects **Register Vehicle**.
2. User enters vehicle details.
3. System validates the information.
4. System stores the vehicle.
5. Success message is displayed.

### Alternate Flow

- Vehicle number already exists.
- Validation fails.

### Postconditions

- Vehicle is available for future parking sessions.

---

## UC-002 Check-In Vehicle

### Primary Actor

Parking Staff

### Goal

Park a vehicle in the parking lot.

### Preconditions

- Vehicle exists.
- Vehicle is not already parked.
- Compatible parking slot is available.

### Main Flow

1. Search vehicle.
2. Select Check-In.
3. System finds a compatible slot.
4. Parking session is created.
5. Slot becomes OCCUPIED.
6. Receipt is generated.

### Postconditions

- Parking session status = ACTIVE.

---

## UC-003 Check-Out Vehicle

### Primary Actor

Parking Staff

### Goal

Remove a parked vehicle.

### Preconditions

- Vehicle has an ACTIVE parking session.

### Main Flow

1. Search vehicle.
2. Select Check-Out.
3. Calculate parking duration.
4. Calculate parking fee.
5. Generate receipt.
6. Release parking slot.
7. Close parking session.

### Postconditions

- Parking session status = COMPLETED.
- Slot status = AVAILABLE.

---

## UC-004 Search Vehicle

### Primary Actor

Administrator / Parking Staff

### Goal

Locate vehicle information.

### Main Flow

1. Enter search criteria.
2. View matching results.
3. Open vehicle details.

---

## UC-005 Manage Parking Slots

### Primary Actor

Administrator

### Goal

Create and maintain parking slots.

### Main Flow

- Create slot
- Update slot
- Enable slot
- Disable slot

---

## UC-006 View Dashboard

### Primary Actor

Administrator

### Goal

Monitor parking lot statistics.

Dashboard includes

- Occupancy
- Revenue
- Active Sessions
- Available Slots
- Vehicle Distribution

---

## UC-007 View Parking History

### Primary Actor

Administrator

### Goal

Review historical parking sessions.

Features

- Search
- Filter
- Sort
- Pagination

---

## UC-008 Generate Reports

### Primary Actor

Administrator

### Goal

Generate analytical reports.

Reports

- Daily
- Weekly
- Monthly

---

# 17. Acceptance Criteria

The project shall be considered complete when all of the following conditions are satisfied.

---

## Functional Acceptance

✓ Vehicle Registration works.

✓ Vehicle Search works.

✓ Vehicle Check-In works.

✓ Vehicle Check-Out works.

✓ Parking Fee Calculation is correct.

✓ Slot Allocation works correctly.

✓ Dashboard displays live statistics.

✓ Reports are generated.

✓ Parking History is maintained.

---

## Technical Acceptance

✓ REST APIs follow HTTP standards.

✓ Spring Boot layered architecture is implemented.

✓ MySQL database is normalized.

✓ DTO pattern is used.

✓ Validation is implemented.

✓ Exception handling is centralized.

✓ Repository pattern is followed.

✓ Code follows SOLID principles.

---

## Quality Acceptance

✓ No duplicate parking sessions.

✓ No duplicate slot numbers.

✓ Parking history remains consistent.

✓ Dashboard statistics are accurate.

✓ Business rules are enforced.

---

# 18. Requirement Traceability Matrix

| Requirement ID | Module | Related Use Case |
|---------------|--------|------------------|
| FR-001 | Vehicle | UC-001 |
| FR-002 | Vehicle | UC-004 |
| FR-003 | Vehicle | UC-004 |
| FR-004 | Vehicle | UC-007 |
| FR-005 | Parking | UC-002 |
| FR-006 | Parking | UC-003 |
| FR-007 | Parking | UC-003 |
| FR-008 | Parking | UC-003 |
| FR-009 | Slot | UC-005 |
| FR-010 | Slot | UC-005 |
| FR-011 | Slot | UC-005 |
| FR-012 | Slot | UC-005 |
| FR-013 | Slot | UC-005 |
| FR-014 | Slot | UC-005 |
| FR-015 | Slot | UC-002 |
| FR-016 | Dashboard | UC-006 |
| FR-017 | Dashboard | UC-006 |
| FR-018 | Dashboard | UC-006 |
| FR-019 | Dashboard | UC-006 |
| FR-020 | History | UC-007 |
| FR-021 | History | UC-007 |
| FR-022 | History | UC-007 |
| FR-023 | History | UC-007 |
| FR-024 | Search | UC-004 |
| FR-025 | Search | UC-004 |
| FR-026 | Reports | UC-008 |
| FR-027 | Reports | UC-008 |
| FR-028 | Reports | UC-008 |
| FR-029 | Reports | UC-008 |
| FR-030 | Receipt | UC-003 |
| FR-031 | Receipt | UC-003 |
| FR-032 | Administration | UC-005 |
| FR-033 | Administration | UC-005 |
| FR-034 | Notifications | UC-002 |
| FR-035 | Notifications | UC-003 |

---

# 19. Glossary

| Term | Description |
|------|-------------|
| Parking Session | Record representing one complete parking event |
| Parking Slot | Physical location where a vehicle is parked |
| Vehicle | Car, Bike, or Truck registered in the system |
| Dashboard | Real-time monitoring interface |
| Receipt | Proof of completed parking transaction |
| Check-In | Process of parking a vehicle |
| Check-Out | Process of removing a parked vehicle |
| DTO | Data Transfer Object |
| REST API | Interface between frontend and backend |
| Repository | Layer responsible for database access |

---

# 20. Revision History

| Version | Date | Description | Author |
|----------|------|-------------|--------|
| 1.0 | July 2026 | Initial Software Requirements Specification | Gaurav Kumar Singh |

---

# 21. Conclusion

This Software Requirements Specification defines the complete functional and non-functional requirements for the Smart Parking Lot Management System.

It establishes the project's business objectives, quality attributes, validation rules, use cases, and acceptance criteria. The document serves as the primary reference for system design, implementation, testing, and maintenance.

All subsequent architectural and design documents—including the System Architecture, High-Level Design, Low-Level Design, Database Design, API Specification, and Deployment Guide—shall conform to the requirements defined in this specification.

---
**End of Software Requirements Specification**