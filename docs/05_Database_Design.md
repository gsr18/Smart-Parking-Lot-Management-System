# Database Design

# Smart Parking Lot Management System

---

## Document Information

| Field | Value |
|-------|-------|
| Document Name | Database Design |
| Version | 1.0 |
| Project | Smart Parking Lot Management System |
| Database | MySQL 8.x |
| Prepared By | Gaurav Kumar Singh |
| Last Updated | July 2026 |

---

# Table of Contents

1. Introduction
2. Database Objectives
3. Database Overview
4. Entity Overview
5. Table Design
6. Relationships
7. Primary Keys
8. Foreign Keys
9. Constraints
10. Indexing Strategy
11. Normalization
12. Data Integrity
13. Naming Conventions
14. Future Database Expansion
15. Conclusion

---

# 1. Introduction

The Smart Parking Lot Management System stores all operational data in a relational MySQL database.

The database is designed to provide:

- Data consistency
- High integrity
- Efficient querying
- Historical record preservation
- Scalable relationships
- ACID-compliant transactions

The schema follows Third Normal Form (3NF) to minimize redundancy while maintaining query performance.

---

# 2. Database Objectives

The database has been designed with the following objectives:

- Store vehicle information
- Store parking slot information
- Preserve parking history
- Support dashboard analytics
- Enable report generation
- Ensure referential integrity
- Prevent duplicate records
- Support future scalability

---

# 3. Database Overview

The database consists of four primary entities.

```
Vehicle

ParkingSlot

ParkingSession

Receipt
```

Among these,

**ParkingSession** is the central entity because it records the complete lifecycle of every parking event.

---

# 4. Entity Overview

| Entity | Purpose |
|---------|----------|
| Vehicle | Stores registered vehicle details |
| ParkingSlot | Stores information about parking slots |
| ParkingSession | Stores every parking transaction |
| Receipt | Stores generated payment receipts |

---

# 5. Table Design

---

## 5.1 Vehicle

### Purpose

Stores information about every registered vehicle.

### Columns

| Column | Type | Constraints |
|---------|------|-------------|
| id | BIGINT | Primary Key |
| vehicle_number | VARCHAR(20) | Unique, Not Null |
| vehicle_type | ENUM | Not Null |

---

## 5.2 ParkingSlot

### Purpose

Represents physical parking slots.

### Columns

| Column | Type | Constraints |
|---------|------|-------------|
| id | BIGINT | Primary Key |
| slot_number | VARCHAR(20) | Unique |
| slot_type | ENUM | Not Null |
| floor_number | INT | Not Null |
| status | ENUM | Not Null |

---

## 5.3 ParkingSession

### Purpose

Stores complete parking lifecycle.

### Columns

| Column | Type | Constraints |
|---------|------|-------------|
| id | BIGINT | Primary Key |
| vehicle_id | BIGINT | Foreign Key |
| slot_id | BIGINT | Foreign Key |
| owner_name | VARCHAR(100) | Not Null |
| owner_contact | VARCHAR(15) | Not Null |
| entry_time | DATETIME | Not Null |
| exit_time | DATETIME | Nullable |
| duration_minutes | INT | Nullable |
| parking_fee | DECIMAL(10,2) | Nullable |
| status | ENUM | Not Null |

---

## 5.4 Receipt

### Purpose

Stores receipt information for completed parking sessions.

### Columns

| Column | Type | Constraints |
|---------|------|-------------|
| id | BIGINT | Primary Key |
| receipt_number | VARCHAR(30) | Unique |
| parking_session_id | BIGINT | Foreign Key |
| generated_time | DATETIME | Not Null |

---

# 6. Entity Relationships

## Vehicle → ParkingSession

Relationship

One-to-Many

One vehicle may have many parking sessions over time.

```
Vehicle

1 -------- * ParkingSession
```

---

## ParkingSlot → ParkingSession

Relationship

One-to-Many

One slot may be used in multiple parking sessions over time.

```
ParkingSlot

1 -------- * ParkingSession
```

---

## ParkingSession → Receipt

Relationship

One-to-One

Every completed parking session generates exactly one receipt.

```
ParkingSession

1 -------- 1 Receipt
```

---

# 7. Primary Keys

Each table uses a surrogate primary key.

| Table | Primary Key |
|---------|-------------|
| Vehicle | id |
| ParkingSlot | id |
| ParkingSession | id |
| Receipt | id |

Reasons

- Better indexing
- Stable references
- Simplified joins
- Independent from business identifiers

---

# 8. Foreign Keys

| Child Table | Parent Table |
|--------------|--------------|
| ParkingSession | Vehicle |
| ParkingSession | ParkingSlot |
| Receipt | ParkingSession |

Referential integrity shall be enforced through foreign key constraints.

---

# 9. Constraints

## Vehicle

- Vehicle Number must be unique.
- Vehicle Type cannot be null.

---

## Parking Slot

- Slot Number must be unique.
- Slot Type cannot be null.
- Floor Number must be positive.

---

## Parking Session

- Entry Time required.
- Exit Time nullable until checkout.
- Parking Fee cannot be negative.

---

## Receipt

Receipt Number must be unique.

---

# 10. Indexing Strategy

Indexes improve query performance.

Recommended indexes:

| Table | Indexed Column |
|---------|----------------|
| Vehicle | vehicle_number |
| ParkingSlot | slot_number |
| ParkingSession | status |
| ParkingSession | entry_time |
| ParkingSession | vehicle_id |
| Receipt | receipt_number |

---

# 11. Normalization

The schema follows Third Normal Form (3NF).

## First Normal Form (1NF)

- Atomic values
- No repeating groups

Satisfied

---

## Second Normal Form (2NF)

- No partial dependency

Satisfied

---

## Third Normal Form (3NF)

- No transitive dependency

Satisfied

---

# 12. Data Integrity

The database maintains integrity using:

- Primary Keys
- Foreign Keys
- Unique Constraints
- Check Constraints
- Transactions

The following rules are enforced:

- No duplicate vehicle numbers.
- No duplicate slot numbers.
- No orphan parking sessions.
- No orphan receipts.

---

# 13. Naming Conventions

Tables

- vehicle
- parking_slot
- parking_session
- receipt

Columns

snake_case

Examples

vehicle_number

entry_time

parking_fee

Foreign Keys

table_name_id

Examples

vehicle_id

slot_id

parking_session_id

---

# 14. Future Database Expansion

The schema supports future additions including:

Additional Tables

- user
- role
- payment
- notification
- parking_lot
- floor
- reservation

Additional Features

- Multiple parking locations
- Online payments
- RFID
- QR Code
- JWT Authentication
- Audit logs

The existing schema can be extended without significant redesign.

---

# 15. Conclusion

The database design provides a normalized, scalable, and maintainable relational model for the Smart Parking Lot Management System.

The schema preserves complete parking history through the ParkingSession entity while maintaining strong referential integrity and efficient query performance.

This database forms the persistence layer for the Spring Boot backend and supports all functional and reporting requirements defined in the Software Requirements Specification.

---
**End of Database Design Document**