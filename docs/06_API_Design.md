# API Specification

# Smart Parking Lot Management System

---

## Document Information

| Field | Value |
|-------|-------|
| Document Name | API Specification |
| Version | 1.0 |
| Project | Smart Parking Lot Management System |
| API Style | RESTful |
| Data Format | JSON |
| Authentication | None (Version 1) |
| Prepared By | Gaurav Kumar Singh |

---

# Table of Contents

1. Introduction
2. API Design Principles
3. Base URL
4. Standard Request Format
5. Standard Response Format
6. HTTP Status Codes
7. Vehicle APIs
8. Parking APIs
9. Parking Slot APIs
10. Dashboard APIs
11. Report APIs
12. Error Response Format
13. API Versioning
14. Future APIs

---

# 1. Introduction

This document defines all REST APIs exposed by the Smart Parking Lot Management System.

The APIs follow REST architectural principles and exchange data in JSON format.

All endpoints are designed to be stateless.

---

# 2. API Design Principles

The API follows these principles:

- RESTful URLs
- Resource-based endpoints
- JSON request/response
- Stateless communication
- Proper HTTP status codes
- Consistent error handling
- Version-ready design

---

# 3. Base URL

Development

```
http://localhost:8080/api/v1
```

Example

```
http://localhost:8080/api/v1/vehicles
```

---

# 4. Standard Request Headers

```
Content-Type: application/json
Accept: application/json
```

---

# 5. Standard Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {},
  "timestamp": "2026-07-20T14:25:36"
}
```

---

# 6. Standard Error Response

```json
{
  "success": false,
  "message": "Vehicle not found.",
  "errorCode": "VEHICLE_NOT_FOUND",
  "timestamp": "2026-07-20T14:30:12"
}
```

---

# 7. HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |

---

# 8. Vehicle APIs

---

## Register Vehicle

POST

```
/vehicles
```

### Request

```json
{
  "vehicleNumber": "PB10AB1234",
  "vehicleType": "CAR",
  "ownerName": "Rahul Sharma",
  "ownerContact": "9876543210"
}
```

### Response

HTTP 201

```json
{
  "success": true,
  "message": "Vehicle registered successfully."
}
```

---

## Get All Vehicles

GET

```
/vehicles
```

---

## Get Vehicle By Number

GET

```
/vehicles/{vehicleNumber}
```

Example

```
GET /vehicles/PB10AB1234
```

---

## Search Vehicle

GET

```
/vehicles/search?keyword=PB10
```

---

# 9. Parking APIs

---

## Check-In Vehicle

POST

```
/parking/checkin
```

### Request

```json
{
  "vehicleNumber": "PB10AB1234"
}
```

### Response

```json
{
  "success": true,
  "message": "Vehicle checked in successfully.",
  "data": {
    "slotNumber": "A-101",
    "entryTime": "2026-07-20T09:45:00"
  }
}
```

---

## Check-Out Vehicle

POST

```
/parking/checkout
```

### Request

```json
{
  "vehicleNumber": "PB10AB1234"
}
```

### Response

```json
{
  "success": true,
  "message": "Vehicle checked out successfully.",
  "data": {
    "parkingFee": 100,
    "durationMinutes": 110,
    "receiptNumber": "RCPT-10025"
  }
}
```

---

## Get Active Parking Sessions

GET

```
/parking/active
```

---

## Get Parking History

GET

```
/parking/history
```

Supports:

- Pagination
- Sorting
- Filtering

Example

```
/parking/history?page=0&size=10
```

---

# 10. Parking Slot APIs

---

## Get All Slots

GET

```
/slots
```

---

## Create Slot

POST

```
/slots
```

### Request

```json
{
  "slotNumber": "A-101",
  "slotType": "CAR",
  "floorNumber": 1
}
```

---

## Update Slot

PUT

```
/slots/{id}
```

---

## Enable Slot

PATCH

```
/slots/{id}/enable
```

---

## Disable Slot

PATCH

```
/slots/{id}/disable
```

---

## Get Available Slots

GET

```
/slots/available
```

---

# 11. Dashboard APIs

---

## Dashboard Summary

GET

```
/dashboard
```

### Response

```json
{
  "totalSlots": 120,
  "availableSlots": 65,
  "occupiedSlots": 55,
  "occupancyPercentage": 45.8,
  "revenueToday": 8500
}
```

---

## Recent Activity

GET

```
/dashboard/recent-activity
```

---

## Vehicle Distribution

GET

```
/dashboard/vehicle-distribution
```

---

# 12. Report APIs

---

## Daily Report

GET

```
/reports/daily
```

---

## Weekly Report

GET

```
/reports/weekly
```

---

## Monthly Report

GET

```
/reports/monthly
```

---

## Revenue Summary

GET

```
/reports/revenue
```

---

# 13. Error Codes

| Error Code | Description |
|------------|-------------|
| VEHICLE_NOT_FOUND | Vehicle does not exist |
| DUPLICATE_VEHICLE | Vehicle already exists |
| SLOT_NOT_FOUND | Slot does not exist |
| SLOT_NOT_AVAILABLE | Compatible slot unavailable |
| PARKING_SESSION_NOT_FOUND | Active parking session missing |
| VALIDATION_FAILED | Input validation failed |
| INTERNAL_SERVER_ERROR | Unexpected server error |

---

# 14. API Versioning

Current Version

```
v1
```

Example

```
/api/v1/vehicles
```

Future versions

```
/api/v2
```

will maintain backward compatibility where possible.

---

# 15. Future APIs

Future releases may introduce:

- Authentication APIs
- User Management APIs
- Payment APIs
- Reservation APIs
- Notification APIs
- Multi-Parking Lot APIs
- QR Code APIs
- RFID APIs

---

# API Summary

| Module | Endpoints |
|---------|-----------|
| Vehicle | 4 |
| Parking | 4 |
| Slot | 6 |
| Dashboard | 3 |
| Reports | 4 |

Total REST Endpoints

**21**

---

# Conclusion

This API Specification defines the REST interface for the Smart Parking Lot Management System.

It provides a consistent contract between the frontend and backend, ensuring predictable communication, standardized responses, and future extensibility.

---
**End of API Specification**