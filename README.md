# 🚗 Smart Parking Lot Management System

An Enterprise-grade, Multi-tenant Smart Parking Management Platform built with **Spring Boot 3 (Java 21)**, **React 19 (TypeScript + Vite)**, **Tailwind CSS**, and an integrated **AI Parking Assistant**.

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Java](https://img.shields.io/badge/Java-21-orange)
![React](https://img.shields.io/badge/React-19-blue)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4.1-green)

---

## 🌐 Live Application & Repositories

- **Live Web App (GitHub Pages)**: [https://gsr18.github.io/Smart-Parking-Lot-Management-System/](https://gsr18.github.io/Smart-Parking-Lot-Management-System/)
- **GitHub Repository**: [https://github.com/gsr18/Smart-Parking-Lot-Management-System](https://github.com/gsr18/Smart-Parking-Lot-Management-System)

---

## 💻 Running via Command Line Interface (CLI)

The application includes an **interactive Command Line Interface (CLI)** mode for headless terminal environments, server administration, and quick command-line operations.

### Option 1: Interactive CLI Menu

To launch the interactive terminal menu:

#### Windows:
```cmd
run-cli.bat
```

#### Linux / macOS:
```bash
chmod +x run-cli.sh
./run-cli.sh
```

#### Maven Direct Command:
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.arguments="--cli"
```

#### Interactive CLI Features:
```text
===============================================================
   ____                           _    ____             _
  / ___| _ __ ___   __ _ _ __ | |_ / ___|  __ _ _ __| | __
  \___ \| '_ ` _ \ / _` | '__|| __|  _|   / _` | '__| |/ /
   ___) | | | | | | (_| | |   | |_| |___ | (_| | |  |   < 
  |____/|_| |_| |_|\__,_|_|    \__|_____| \__,_|_|  |_|\_\
           SMART PARKING LOT MANAGEMENT SYSTEM CLI
===============================================================

---------------- MAIN CLI MENU ----------------
1. View All Parking Slots & Occupancy
2. Check-In Vehicle (Park)
3. Check-Out Vehicle (Unpark & Bill)
4. List Active Parking Sessions
5. Real-Time Dashboard Summary
6. Ask AI Parking Assistant
7. Exit CLI
----------------------------------------------
```

---

### Option 2: Single CLI Commands

You can also run single commands directly without entering the interactive loop:

```bash
# View all parking slots and occupancy statuses
cd backend
mvn spring-boot:run -Dspring-boot.run.arguments="--cli --cmd=slots"

# View real-time dashboard metrics summary
mvn spring-boot:run -Dspring-boot.run.arguments="--cli --cmd=stats"

# List active parking sessions
mvn spring-boot:run -Dspring-boot.run.arguments="--cli --cmd=active"

# Quick Vehicle Check-In via CLI
mvn spring-boot:run -Dspring-boot.run.arguments="--cli --cmd=checkin --vehicle=KA01AB1234 --type=CAR"
```

---

## 🚀 Running the Web Application Locally

### Prerequisites
- **Java 21 JDK** installed
- **Node.js v20+** installed
- **Maven 3.8+** installed

### Step 1: Start Backend (Spring Boot)
```bash
cd backend
mvn spring-boot:run
```
The REST API server will start on `http://localhost:8080`.

### Step 2: Start Frontend (Vite + React)
In a new terminal tab:
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Demo Credentials

| Role | Username | Password | Access Level |
|---|---|---|---|
| **Admin** | `admin` | `admin123` | Full Access (Company, Users, Pricing, Analytics, System Rules) |
| **Attendant / Staff** | `staff` | `staff123` | Operational (Check-In, Check-Out, Slots, Shift Management) |

---

## ✨ System Features

1. **Multi-Tenant Architecture**: Supports multiple parking company tenants with domain isolation & role scoping.
2. **Real-time Occupancy & Grid View**: Interactive visual slot grid with live status badges (Available, Occupied, Reserved, Maintenance).
3. **Smart Vehicle Check-In / Check-Out**: Automated slot allocation strategy based on vehicle type (Car, Motorcycle, Truck, EV) with instant receipt generation.
4. **Dynamic Tariff & Pricing Rules**: Tiered hourly pricing, vehicle-type modifiers, and peak/off-peak surcharges.
5. **AI Parking Assistant**: In-app AI agent answering operational queries, troubleshooting, and occupancy forecasting.
6. **Analytics & PDF/CSV Export**: Full revenue reports, occupancy trends, and export functionality.
7. **Dark / Light Mode Support**: Seamless theme switching with persistent user preferences.
8. **Fully Mobile Responsive**: Tailored layout for handheld devices, tablets, and desktop workstations.
9. **Zero-Data-Loss Scalable DB**: Database schema migrations managed via Flyway versioning.

---

## 🛡️ License

This project is open-source under the MIT License.
