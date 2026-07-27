# Sequence Diagrams

# Smart Parking Lot Management System

---

## Document Information

| Field | Value |
|-------|-------|
| Document Name | Sequence Diagrams |
| Version | 1.0 |
| Project | Smart Parking Lot Management System |
| Diagram Type | UML Sequence Diagram |
| Prepared By | Gaurav Kumar Singh |
| Last Updated | July 2026 |

---

# Table of Contents

1. Introduction
2. Purpose
3. Participants
4. Vehicle Registration
5. Vehicle Check-In
6. Vehicle Check-Out
7. Search Vehicle
8. Dashboard Loading
9. Slot Management
10. Report Generation
11. Design Considerations
12. Conclusion

---

# 1. Introduction

Sequence diagrams describe the runtime behavior of the Smart Parking Lot Management System.

Unlike the Class Diagram, which illustrates the static structure of the application, Sequence Diagrams illustrate how objects collaborate over time to complete a business operation.

Each diagram represents a specific use case and the interactions between system components.

---

# 2. Purpose

The objectives of the Sequence Diagrams are to:

- Visualize request processing.
- Describe communication between layers.
- Define execution order.
- Validate business workflows.
- Assist backend implementation.
- Simplify debugging and maintenance.

---

# 3. Participants

The following participants appear throughout the sequence diagrams.

| Participant | Responsibility |
|-------------|----------------|
| User | Initiates operations |
| React Frontend | Sends HTTP requests |
| Controller | Handles REST endpoints |
| Service | Executes business logic |
| Repository | Performs database operations |
| MySQL Database | Stores persistent data |

---

# 4. Vehicle Registration

## Description

Registers a new vehicle in the system.

### Sequence Diagram

```mermaid
sequenceDiagram

actor User

participant UI as React Frontend
participant VC as VehicleController
participant VS as VehicleService
participant VR as VehicleRepository
participant DB as MySQL

User->>UI: Enter Vehicle Details

UI->>VC: POST /vehicles

VC->>VS: registerVehicle()

VS->>VR: existsByVehicleNumber()

VR->>DB: SELECT Vehicle

DB-->>VR: Result

alt Vehicle Exists

VR-->>VS: Exists

VS-->>VC: Duplicate Vehicle

VC-->>UI: HTTP 409 Conflict

else Vehicle Not Found

VR-->>VS: Not Found

VS->>VR: save(vehicle)

VR->>DB: INSERT Vehicle

DB-->>VR: Success

VR-->>VS: Vehicle Saved

VS-->>VC: Success

VC-->>UI: HTTP 201 Created

end
```

---

# 5. Vehicle Check-In

## Description

Creates an active parking session for a vehicle.

### Sequence Diagram

```mermaid
sequenceDiagram

actor User

participant UI
participant ParkingController
participant ParkingService
participant SlotService
participant ParkingRepository
participant SlotRepository
participant DB

User->>UI: Check-In Vehicle

UI->>ParkingController: POST /parking/checkin

ParkingController->>ParkingService: checkIn()

ParkingService->>SlotService: allocateSlot()

SlotService->>SlotRepository: findAvailableSlot()

SlotRepository->>DB: SELECT Slot

DB-->>SlotRepository: Available Slot

SlotRepository-->>SlotService: Slot

SlotService-->>ParkingService: Allocated Slot

ParkingService->>ParkingRepository: saveParkingSession()

ParkingRepository->>DB: INSERT ParkingSession

ParkingRepository->>DB: UPDATE Slot Status

DB-->>ParkingRepository: Success

ParkingRepository-->>ParkingService: Session Created

ParkingService-->>ParkingController: Success

ParkingController-->>UI: HTTP 201 Created
```

---

# 6. Vehicle Check-Out

## Description

Completes a parking session and releases the occupied slot.

### Sequence Diagram

```mermaid
sequenceDiagram

actor User

participant UI
participant ParkingController
participant ParkingService
participant ParkingRepository
participant ReceiptRepository
participant DB

User->>UI: Check-Out Vehicle

UI->>ParkingController: POST /parking/checkout

ParkingController->>ParkingService: checkOut()

ParkingService->>ParkingRepository: findActiveSession()

ParkingRepository->>DB: SELECT Session

DB-->>ParkingRepository: Active Session

ParkingRepository-->>ParkingService: Session

ParkingService->>ParkingService: Calculate Duration

ParkingService->>ParkingService: Calculate Fee

ParkingService->>ReceiptRepository: saveReceipt()

ReceiptRepository->>DB: INSERT Receipt

ParkingRepository->>DB: UPDATE ParkingSession

ParkingRepository->>DB: UPDATE ParkingSlot

DB-->>ParkingRepository: Success

ParkingService-->>ParkingController: Receipt

ParkingController-->>UI: HTTP 200 OK
```

---

# 7. Search Vehicle

## Description

Searches a registered vehicle.

### Sequence Diagram

```mermaid
sequenceDiagram

actor User

participant UI
participant VehicleController
participant VehicleService
participant VehicleRepository
participant DB

User->>UI: Search Vehicle

UI->>VehicleController: GET /vehicles/{number}

VehicleController->>VehicleService: findVehicle()

VehicleService->>VehicleRepository: search()

VehicleRepository->>DB: SELECT Vehicle

DB-->>VehicleRepository: Vehicle

VehicleRepository-->>VehicleService: Vehicle

VehicleService-->>VehicleController: Response

VehicleController-->>UI: HTTP 200 OK
```

---

# 8. Dashboard Loading

## Description

Loads dashboard statistics.

### Sequence Diagram

```mermaid
sequenceDiagram

actor User

participant UI
participant DashboardController
participant DashboardService
participant ParkingRepository
participant DB

User->>UI: Open Dashboard

UI->>DashboardController: GET /dashboard

DashboardController->>DashboardService: loadDashboard()

DashboardService->>ParkingRepository: fetchStatistics()

ParkingRepository->>DB: Aggregate Queries

DB-->>ParkingRepository: Statistics

ParkingRepository-->>DashboardService: Dashboard Data

DashboardService-->>DashboardController: Response

DashboardController-->>UI: HTTP 200 OK
```

---

# 9. Parking Slot Management

## Description

Creates a new parking slot.

### Sequence Diagram

```mermaid
sequenceDiagram

actor Admin

participant UI
participant SlotController
participant SlotService
participant SlotRepository
participant DB

Admin->>UI: Create Slot

UI->>SlotController: POST /slots

SlotController->>SlotService: createSlot()

SlotService->>SlotRepository: save()

SlotRepository->>DB: INSERT Slot

DB-->>SlotRepository: Success

SlotRepository-->>SlotService: Slot Saved

SlotService-->>SlotController: Success

SlotController-->>UI: HTTP 201 Created
```

---

# 10. Report Generation

## Description

Generates a monthly parking report.

### Sequence Diagram

```mermaid
sequenceDiagram

actor Admin

participant UI
participant ReportController
participant ReportService
participant ParkingRepository
participant DB

Admin->>UI: Generate Report

UI->>ReportController: GET /reports/monthly

ReportController->>ReportService: generateMonthlyReport()

ReportService->>ParkingRepository: fetchMonthlyStatistics()

ParkingRepository->>DB: Aggregate Query

DB-->>ParkingRepository: Report Data

ParkingRepository-->>ReportService: Statistics

ReportService-->>ReportController: Report

ReportController-->>UI: HTTP 200 OK
```

---

# 11. Design Considerations

The sequence diagrams follow these design principles:

- Controllers only coordinate requests.
- Services contain all business logic.
- Repositories handle data access only.
- The database is accessed exclusively through repositories.
- Each business operation follows a layered execution flow.
- Transactions are managed within the Service Layer.

---

# 12. Conclusion

The Sequence Diagrams define the dynamic behavior of the Smart Parking Lot Management System by illustrating how components interact during major business operations.

These diagrams validate the runtime execution flow and provide implementation guidance for backend development while ensuring clear separation of responsibilities across application layers.

---
**End of Sequence Diagrams Document**