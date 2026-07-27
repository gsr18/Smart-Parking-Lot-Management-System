# Low-Level Design (LLD)

# Smart Parking Lot Management System

---

## Document Information

| Field | Value |
|-------|-------|
| Document Name | Low-Level Design (LLD) |
| Version | 1.0 |
| Project | Smart Parking Lot Management System |
| Prepared By | Gaurav Kumar Singh |
| Last Updated | July 2026 |

---

# Table of Contents

1. Introduction
2. Package Structure
3. Domain Model
4. Entity Design
5. DTO Design
6. Repository Layer
7. Service Layer
8. Controller Layer
9. Exception Handling
10. Validation
11. Design Patterns
12. Request Lifecycle
13. Conclusion

---

# 1. Introduction

The Low-Level Design (LLD) describes the internal implementation details of the Smart Parking Lot Management System.

It defines the software packages, classes, entities, DTOs, services, repositories, controllers, and their interactions.

This document acts as the implementation guide for backend development.

---

# 2. Package Structure

```

com.smartparking

├── config
├── controller
├── dto
│ ├── request
│ └── response
├── entity
├── enums
├── exception
├── mapper
├── repository
├── service
│ └── impl
├── strategy
├── util
└── validation

```

Each package has a single responsibility.

---

# 3. Domain Model

The application is built around four primary domain entities.

```

Vehicle
│
├── Car
├── Bike
└── Truck

ParkingSlot

ParkingSession

Receipt

```

ParkingSession is the central business entity.

---

# 4. Entity Design

## 4.1 Vehicle

### Purpose

Represents a registered vehicle.

### Attributes

- id
- vehicleNumber
- vehicleType

### Relationships

- One Vehicle → Many Parking Sessions

---

## 4.2 ParkingSlot

### Purpose

Represents a physical parking slot.

### Attributes

- id
- slotNumber
- slotType
- floorNumber
- status

### Relationships

- One Slot → Many Parking Sessions

---

## 4.3 ParkingSession

### Purpose

Represents one complete parking lifecycle.

### Attributes

- id
- vehicle
- parkingSlot
- ownerName
- ownerContact
- entryTime
- exitTime
- duration
- parkingFee
- status

### Relationships

- Many Sessions → One Vehicle
- Many Sessions → One Slot

---

## 4.4 Receipt

### Purpose

Represents payment information for a completed parking session.

### Attributes

- id
- receiptNumber
- parkingSession
- generatedTime

---

# 5. DTO Design

The API shall never expose Entity classes directly.

---

## VehicleRequest

Fields

- vehicleNumber
- vehicleType
- ownerName
- ownerContact

---

## VehicleResponse

Fields

- id
- vehicleNumber
- vehicleType

---

## CheckInRequest

Fields

- vehicleNumber
- ownerName
- ownerContact

---

## CheckOutResponse

Fields

- vehicleNumber
- slotNumber
- entryTime
- exitTime
- duration
- parkingFee

---

## DashboardResponse

Fields

- totalSlots
- availableSlots
- occupiedSlots
- revenueToday
- revenueMonth

---

# 6. Repository Layer

Repositories provide data access.

---

## VehicleRepository

Responsibilities

- Find by vehicle number
- Save vehicle
- Delete vehicle
- Search vehicles

---

## ParkingSlotRepository

Responsibilities

- Find available slots
- Update slot status
- Search slot

---

## ParkingSessionRepository

Responsibilities

- Save session
- Find active session
- Find history
- Generate reports

---

## ReceiptRepository

Responsibilities

- Save receipt
- Retrieve receipt

---

# 7. Service Layer

Business logic resides here.

---

## VehicleService

Responsibilities

- Register Vehicle
- Search Vehicle
- Retrieve Vehicle Details

---

## ParkingService

Responsibilities

- Check-In
- Check-Out
- Calculate Duration
- Generate Receipt

---

## SlotService

Responsibilities

- Allocate Slot
- Release Slot
- Manage Slots

---

## DashboardService

Responsibilities

- Occupancy Statistics
- Revenue Statistics
- Recent Activity

---

## ReportService

Responsibilities

- Daily Report
- Weekly Report
- Monthly Report

---

# 8. Controller Layer

REST API entry point.

---

## VehicleController

Endpoints

- POST /vehicles
- GET /vehicles
- GET /vehicles/{number}

---

## ParkingController

Endpoints

- POST /parking/checkin
- POST /parking/checkout

---

## SlotController

Endpoints

- GET /slots
- POST /slots
- PUT /slots/{id}

---

## DashboardController

Endpoints

- GET /dashboard

---

## ReportController

Endpoints

- GET /reports/daily
- GET /reports/weekly
- GET /reports/monthly

---

# 9. Exception Handling

Global exception handling shall be implemented.

Exception hierarchy

```

ApplicationException

├── VehicleNotFoundException
├── DuplicateVehicleException
├── SlotNotAvailableException
├── SlotNotFoundException
├── ParkingSessionNotFoundException
└── ValidationException

```

The GlobalExceptionHandler shall convert exceptions into standardized HTTP responses.

---

# 10. Validation

Validation shall use Jakarta Bean Validation.

Examples

VehicleRequest

- @NotBlank
- @Size
- @Pattern

Owner Name

- @NotBlank
- @Size

Contact Number

- @Pattern

Slot Number

- @NotBlank

---

# 11. Design Patterns

The following design patterns are used.

| Pattern | Purpose |
|----------|---------|
| MVC | Separate presentation and business logic |
| Repository | Data access abstraction |
| DTO | API contract separation |
| Strategy | Slot allocation algorithms |
| Factory | Vehicle object creation |
| Dependency Injection | Loose coupling |

---

# 12. Request Lifecycle

Example: Vehicle Check-In

```

Client

↓

ParkingController

↓

ParkingService

↓

SlotService

↓

VehicleRepository

↓

ParkingSlotRepository

↓

ParkingSessionRepository

↓

Database

↓

Repositories

↓

Service

↓

Controller

↓

JSON Response

```

---

# 13. Method Responsibilities

## ParkingService

### checkIn()

- Validate request
- Verify vehicle
- Find available slot
- Create parking session
- Mark slot occupied
- Return response

---

### checkOut()

- Find active session
- Calculate duration
- Calculate fee
- Create receipt
- Mark slot available
- Close session
- Return response

---

## SlotService

### allocateSlot()

- Find compatible slot
- Apply allocation strategy
- Reserve slot

---

### releaseSlot()

- Mark slot available

---

# 14. Enums

## VehicleType

- CAR
- BIKE
- TRUCK

---

## SlotType

- CAR
- BIKE
- TRUCK

---

## SlotStatus

- AVAILABLE
- OCCUPIED
- DISABLED

---

## ParkingStatus

- ACTIVE
- COMPLETED

---

# 15. Transaction Management

The following operations shall execute within a single database transaction.

- Vehicle Check-In
- Vehicle Check-Out
- Slot Allocation
- Slot Release

If any operation fails, the transaction shall roll back.

---

# 16. Logging

The application shall log:

- Vehicle registration
- Vehicle check-in
- Vehicle check-out
- Slot allocation
- Slot release
- Exceptions
- Application startup

Logging framework:

SLF4J + Logback

---

# 17. Conclusion

The Low-Level Design defines the internal structure of the Smart Parking Lot Management System, including packages, entities, services, repositories, controllers, DTOs, validations, exceptions, and request processing.

This document serves as the primary implementation reference for backend development and ensures consistent coding practices across the project.

---
**End of Low-Level Design Document**