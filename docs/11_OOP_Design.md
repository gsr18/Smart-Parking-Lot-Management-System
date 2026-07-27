# Object-Oriented Design

# Smart Parking Lot Management System

---

## Document Information

| Field | Value |
|-------|-------|
| Document Name | Object-Oriented Design |
| Version | 1.0 |
| Project | Smart Parking Lot Management System |
| Design Paradigm | Object-Oriented Programming (OOP) |
| Prepared By | Gaurav Kumar Singh |
| Last Updated | July 2026 |

---

# Table of Contents

1. Introduction
2. Why Object-Oriented Design?
3. OOP Principles
4. SOLID Principles
5. Object Relationships
6. Object Lifecycle
7. Advantages of OOP in the Project
8. Conclusion

---

# 1. Introduction

The Smart Parking Lot Management System is designed using the Object-Oriented Programming (OOP) paradigm.

Instead of organizing the application around functions, the system models real-world entities such as Vehicles, Parking Slots, Parking Sessions, and Receipts as objects.

Each object encapsulates its own state and behavior, making the application modular, reusable, maintainable, and extensible.

---

# 2. Why Object-Oriented Design?

Parking management is naturally object-oriented.

Real-world objects include:

- Vehicle
- Car
- Bike
- Truck
- Parking Slot
- Parking Session
- Receipt

Representing these concepts as Java objects makes the software easier to understand and maintain.

Benefits include:

- Better code organization
- Reusability
- Reduced duplication
- Easier maintenance
- Improved scalability
- Easier testing

---

# 3. OOP Principles

---

## 3.1 Abstraction

### Definition

Abstraction hides unnecessary implementation details while exposing only essential functionality.

### Project Implementation

The application introduces an abstract base class:

```
Vehicle
```

Concrete implementations:

```
Vehicle

↓

Car

Bike

Truck
```

The rest of the application interacts with the abstract Vehicle class instead of concrete subclasses.

Example

```
Vehicle vehicle;

vehicle = new Car();

vehicle = new Bike();

vehicle = new Truck();
```

Advantages

- Loose coupling
- Easier extension
- Cleaner business logic

---

## 3.2 Encapsulation

### Definition

Encapsulation binds data and methods together while protecting object state.

### Project Implementation

All entity attributes are private.

```
private String vehicleNumber;

private VehicleType vehicleType;
```

Data is accessed using getters and setters.

```
getVehicleNumber()

setVehicleNumber()
```

Advantages

- Protects object state
- Prevents accidental modification
- Improves maintainability

---

## 3.3 Inheritance

### Definition

Inheritance enables one class to reuse the properties and behavior of another.

### Project Implementation

```
Vehicle

↓

Car

Bike

Truck
```

Common properties

- vehicleNumber
- vehicleType

Inherited by

- Car
- Bike
- Truck

Advantages

- Eliminates duplicate code
- Supports future vehicle types
- Improves readability

---

## 3.4 Polymorphism

### Definition

Polymorphism allows one interface to represent multiple implementations.

### Project Implementation

ParkingService works with the Vehicle abstraction.

```
Vehicle vehicle = repository.find(...);
```

The actual runtime object may be:

- Car
- Bike
- Truck

Business logic remains unchanged.

Advantages

- Flexible design
- Easier maintenance
- Better extensibility

---

# 4. SOLID Principles

The project follows the SOLID principles to improve maintainability and extensibility.

---

## 4.1 Single Responsibility Principle (SRP)

Each class has one well-defined responsibility.

Examples

VehicleService

- Vehicle-related operations only

ParkingService

- Parking-related operations only

SlotService

- Slot management only

---

## 4.2 Open/Closed Principle (OCP)

Classes are open for extension but closed for modification.

Example

New vehicle types can be introduced without modifying existing business logic.

```
Vehicle

↓

ElectricCar
```

No changes required in ParkingService.

---

## 4.3 Liskov Substitution Principle (LSP)

Any subclass of Vehicle can replace its parent.

Example

```
Vehicle vehicle = new Car();

Vehicle vehicle = new Truck();

Vehicle vehicle = new Bike();
```

All subclasses behave correctly wherever Vehicle is expected.

---

## 4.4 Interface Segregation Principle (ISP)

Interfaces remain focused.

Examples

```
VehicleService

SlotService

ReportService
```

Each service exposes only methods relevant to its responsibility.

---

## 4.5 Dependency Inversion Principle (DIP)

High-level modules do not depend directly on low-level implementations.

Example

```
ParkingService

↓

ParkingRepository Interface

↓

JpaParkingRepository
```

Spring Dependency Injection provides the concrete implementation.

Advantages

- Loose coupling
- Easier testing
- Better flexibility

---

# 5. Object Relationships

## Association

Vehicle

↓

ParkingSession

A vehicle participates in many parking sessions.

---

ParkingSlot

↓

ParkingSession

A slot may be reused across many parking sessions.

---

## Aggregation

Dashboard aggregates information from:

- Vehicles
- Parking Sessions
- Parking Slots

The Dashboard does not own these objects.

---

## Composition

Receipt depends on ParkingSession.

Without a ParkingSession, a Receipt cannot exist.

This represents composition.

---

# 6. Object Lifecycle

## Vehicle

Created

↓

Stored

↓

Used in Parking Sessions

↓

Retained

Vehicle records are never deleted automatically.

---

## Parking Session

Created at Check-In

↓

ACTIVE

↓

Check-Out

↓

COMPLETED

↓

Stored Permanently

---

## Parking Slot

Created

↓

AVAILABLE

↓

OCCUPIED

↓

AVAILABLE

Repeated throughout the application's lifetime.

---

# 7. Advantages of OOP in this Project

Using Object-Oriented Programming provides several benefits.

### Code Reusability

Vehicle functionality is reused by all vehicle types.

---

### Maintainability

Business logic is isolated into dedicated services.

---

### Scalability

Future vehicle types can be added easily.

Examples

- Bus
- ElectricCar
- Ambulance

---

### Testability

Each class can be tested independently.

Examples

- VehicleServiceTest
- ParkingServiceTest
- SlotServiceTest

---

### Flexibility

Business logic depends on abstractions rather than concrete implementations.

---

# 8. OOP Summary

| Principle | Project Implementation |
|-----------|------------------------|
| Abstraction | Abstract Vehicle class |
| Encapsulation | Private fields with getters/setters |
| Inheritance | Car, Bike, Truck extend Vehicle |
| Polymorphism | Services operate on Vehicle abstraction |
| Composition | Receipt contains ParkingSession |
| Aggregation | Dashboard aggregates multiple entities |
| Association | Vehicle ↔ ParkingSession, Slot ↔ ParkingSession |

---

# 9. Conclusion

The Smart Parking Lot Management System applies Object-Oriented Programming principles to model real-world parking operations in a modular and maintainable manner.

The design demonstrates abstraction, encapsulation, inheritance, and polymorphism while following SOLID principles to ensure the application remains extensible, testable, and aligned with enterprise software engineering practices.

This object-oriented foundation supports future enhancements without requiring major architectural changes.

---
**End of Object-Oriented Design Document**