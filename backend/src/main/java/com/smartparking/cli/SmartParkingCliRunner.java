package com.smartparking.cli;

import com.smartparking.dto.CheckInRequest;
import com.smartparking.dto.CheckInResponse;
import com.smartparking.dto.CheckOutRequest;
import com.smartparking.dto.CheckOutResponse;
import com.smartparking.entity.ParkingSlot;
import com.smartparking.enums.SlotStatus;
import com.smartparking.enums.VehicleType;
import com.smartparking.repository.ParkingSlotRepository;
import com.smartparking.service.AiAssistantService;
import com.smartparking.service.DashboardService;
import com.smartparking.service.ParkingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.Scanner;

/**
 * Interactive & Command Line Interface (CLI) Runner for Smart Parking System.
 * Activated by passing '--cli' argument when starting backend Java application.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class SmartParkingCliRunner implements CommandLineRunner {

    private final ParkingService parkingService;
    private final ParkingSlotRepository slotRepository;
    private final DashboardService dashboardService;
    private final AiAssistantService aiAssistantService;

    @Override
    public void run(String... args) throws Exception {
        boolean cliMode = Arrays.asList(args).contains("--cli") || 
                           Boolean.parseBoolean(System.getProperty("cli", "false")) ||
                           Boolean.parseBoolean(System.getenv("CLI_MODE"));

        if (!cliMode) {
            return;
        }

        System.out.println("\n" +
                "===============================================================\n" +
                "   ____                           _    ____             _\n" +
                "  / ___| _ __ ___   __ _ _ __ | |_ / ___|  __ _ _ __| | __\n" +
                "  \\___ \\| '_ ` _ \\ / _` | '__|| __|  _|   / _` | '__| |/ /\n" +
                "   ___) | | | | | | (_| | |   | |_| |___ | (_| | |  |   < \n" +
                "  |____/|_| |_| |_|\\__,_|_|    \\__|_____| \\__,_|_|  |_|\\_\\\n" +
                "           SMART PARKING LOT MANAGEMENT SYSTEM CLI\n" +
                "===============================================================");

        // Check if single command flag was passed
        String command = getArgValue(args, "--cmd=");
        if (command != null) {
            handleSingleCommand(command, args);
            return;
        }

        // Interactive Loop
        Scanner scanner = new Scanner(System.in);
        boolean running = true;

        while (running) {
            printMenu();
            System.out.print("Select an option [1-7]: ");
            String choice = scanner.nextLine().trim();

            switch (choice) {
                case "1":
                    displayParkingSlots();
                    break;
                case "2":
                    checkInVehicle(scanner);
                    break;
                case "3":
                    checkOutVehicle(scanner);
                    break;
                case "4":
                    listActiveSessions();
                    break;
                case "5":
                    displayDashboardStats();
                    break;
                case "6":
                    askAiAssistant(scanner);
                    break;
                case "7":
                case "exit":
                case "q":
                    running = false;
                    System.out.println("\nExiting Smart Parking CLI. Goodbye!");
                    break;
                default:
                    System.out.println("Invalid option! Please enter a number between 1 and 7.");
            }
        }
    }

    private void printMenu() {
        System.out.println("\n---------------- MAIN CLI MENU ----------------");
        System.out.println("1. View All Parking Slots & Occupancy");
        System.out.println("2. Check-In Vehicle (Park)");
        System.out.println("3. Check-Out Vehicle (Unpark & Bill)");
        System.out.println("4. List Active Parking Sessions");
        System.out.println("5. Real-Time Dashboard Summary");
        System.out.println("6. Ask AI Parking Assistant");
        System.out.println("7. Exit CLI");
        System.out.println("----------------------------------------------");
    }

    private void displayParkingSlots() {
        List<ParkingSlot> slots = slotRepository.findAll();
        System.out.println("\n+------------+------------+---------------+----------+");
        System.out.println("| SLOT CODE  | TYPE       | STATUS        | FLOOR    |");
        System.out.println("+------------+------------+---------------+----------+");
        if (slots.isEmpty()) {
            System.out.println("| No parking slots found in system.                   |");
        } else {
            for (ParkingSlot s : slots) {
                String statusStr = s.getStatus() == SlotStatus.AVAILABLE ? "[AVAILABLE]" :
                                  s.getStatus() == SlotStatus.OCCUPIED ? "[OCCUPIED ]" : "[" + s.getStatus() + "]";
                System.out.printf("| %-10s | %-10s | %-13s | Floor %-2d |\n",
                        s.getSlotNumber(), s.getSlotType(), statusStr, s.getFloorNumber());
            }
        }
        System.out.println("+------------+------------+---------------+----------+");
    }

    private void checkInVehicle(Scanner scanner) {
        System.out.println("\n--- VEHICLE CHECK-IN ---");
        System.out.print("Enter Vehicle Registration Number (e.g. KA01AB1234): ");
        String vehicleNum = scanner.nextLine().trim();

        System.out.print("Select Vehicle Type (CAR / MOTORCYCLE / TRUCK / EV): ");
        String vTypeStr = scanner.nextLine().trim().toUpperCase();
        VehicleType vType;
        try {
            vType = VehicleType.valueOf(vTypeStr);
        } catch (Exception e) {
            System.out.println("Invalid type! Defaulting to CAR.");
            vType = VehicleType.CAR;
        }

        System.out.print("Enter Owner Name: ");
        String owner = scanner.nextLine().trim();

        System.out.print("Enter Owner Contact Phone: ");
        String contact = scanner.nextLine().trim();

        System.out.print("Enter Preferred Slot Number (press ENTER for auto-allocation): ");
        String slot = scanner.nextLine().trim();

        try {
            CheckInRequest req = CheckInRequest.builder()
                    .vehicleNumber(vehicleNum)
                    .vehicleType(vType)
                    .ownerName(owner.isEmpty() ? "Guest Driver" : owner)
                    .ownerContact(contact.isEmpty() ? "N/A" : contact)
                    .preferredSlotNumber(slot.isEmpty() ? null : slot)
                    .build();

            CheckInResponse resp = parkingService.checkIn(req);
            System.out.println("\nSUCCESS: Vehicle Checked In Successfully!");
            System.out.println("----------------------------------------");
            System.out.println("Session ID    : " + resp.getSessionId());
            System.out.println("Vehicle No    : " + resp.getVehicleNumber());
            System.out.println("Allocated Slot: " + resp.getSlotNumber());
            System.out.println("Status        : " + resp.getStatus());
            System.out.println("----------------------------------------");
        } catch (Exception e) {
            System.out.println("\nERROR Checking In: " + e.getMessage());
        }
    }

    private void checkOutVehicle(Scanner scanner) {
        System.out.println("\n--- VEHICLE CHECK-OUT ---");
        System.out.print("Enter Vehicle Number OR Slot Number: ");
        String val = scanner.nextLine().trim();

        CheckOutRequest req = new CheckOutRequest();
        if (val.contains("-") || val.length() <= 5) {
            req.setSlotNumber(val);
        } else {
            req.setVehicleNumber(val);
        }

        try {
            CheckOutResponse resp = parkingService.checkOut(req);
            System.out.println("\nSUCCESS: Vehicle Checked Out Successfully!");
            System.out.println("========================================");
            System.out.println("Receipt Number : " + resp.getReceiptNumber());
            System.out.println("Vehicle Number : " + resp.getVehicleNumber());
            System.out.println("Parking Slot   : " + resp.getSlotNumber());
            System.out.println("Entry Time     : " + resp.getEntryTime());
            System.out.println("Exit Time      : " + resp.getExitTime());
            System.out.println("Total Fee      : ₹" + resp.getParkingFee());
            System.out.println("========================================");
        } catch (Exception e) {
            System.out.println("\nERROR Checking Out: " + e.getMessage());
        }
    }

    private void listActiveSessions() {
        System.out.println("\n--- ACTIVE PARKING SESSIONS ---");
        try {
            var page = parkingService.getActiveSessions(org.springframework.data.domain.PageRequest.of(0, 50));
            if (page.isEmpty()) {
                System.out.println("No active parking sessions right now.");
            } else {
                System.out.println("+------------+------------+---------------+---------------------+");
                System.out.println("| VEHICLE    | SLOT CODE  | OWNER         | ENTRY TIME          |");
                System.out.println("+------------+------------+---------------+---------------------+");
                for (CheckInResponse s : page.getContent()) {
                    System.out.printf("| %-10s | %-10s | %-13s | %-19s |\n",
                            s.getVehicleNumber(), s.getSlotNumber(), s.getOwnerName(),
                            "Floor " + s.getFloorNumber() + " (" + s.getStatus() + ")");
                }
                System.out.println("+------------+------------+---------------+---------------------+");
            }
        } catch (Exception e) {
            System.out.println("Error fetching sessions: " + e.getMessage());
        }
    }

    private void displayDashboardStats() {
        System.out.println("\n--- REAL-TIME DASHBOARD SUMMARY ---");
        try {
            var summary = dashboardService.getDashboardSummary();
            System.out.println("Total Slots          : " + summary.getTotalSlots());
            System.out.println("Occupied Slots       : " + summary.getOccupiedSlots());
            System.out.println("Available Slots      : " + summary.getAvailableSlots());
            System.out.println("Occupancy Rate       : " + String.format("%.1f%%", summary.getOccupancyPercentage()));
            System.out.println("Today's Revenue      : ₹" + summary.getRevenueToday());
            System.out.println("Active Vehicles      : " + summary.getActiveSessions());
        } catch (Exception e) {
            System.out.println("Error retrieving stats: " + e.getMessage());
        }
    }

    private void askAiAssistant(Scanner scanner) {
        System.out.println("\n--- AI PARKING ASSISTANT CLI ---");
        System.out.print("Ask anything about system rules, slots, fees, or features: ");
        String query = scanner.nextLine().trim();

        if (query.isEmpty()) {
            return;
        }

        System.out.println("Thinking...");
        try {
            com.smartparking.dto.AiChatRequest req = com.smartparking.dto.AiChatRequest.builder()
                    .message(query)
                    .build();
            com.smartparking.dto.AiChatResponse resp = aiAssistantService.processChatQuery(req);
            System.out.println("\n🤖 AI Assistant:\n" + resp.getResponse());
        } catch (Exception e) {
            System.out.println("AI Assistant unavailable: " + e.getMessage());
        }
    }

    private void handleSingleCommand(String cmd, String[] args) {
        switch (cmd.toLowerCase()) {
            case "slots":
                displayParkingSlots();
                break;
            case "stats":
                displayDashboardStats();
                break;
            case "active":
                listActiveSessions();
                break;
            case "checkin":
                String vNum = getArgValue(args, "--vehicle=");
                String vType = getArgValue(args, "--type=");
                if (vNum == null) {
                    System.out.println("Error: --vehicle=<number> required for single command checkin");
                    return;
                }
                CheckInRequest req = CheckInRequest.builder()
                        .vehicleNumber(vNum)
                        .vehicleType(vType != null ? VehicleType.valueOf(vType.toUpperCase()) : VehicleType.CAR)
                        .ownerName("CLI User")
                        .ownerContact("N/A")
                        .build();
                CheckInResponse resp = parkingService.checkIn(req);
                System.out.println("Checked in: " + resp.getVehicleNumber() + " -> Slot " + resp.getSlotNumber());
                break;
            default:
                System.out.println("Unknown command: " + cmd);
        }
    }

    private String getArgValue(String[] args, String prefix) {
        for (String arg : args) {
            if (arg.startsWith(prefix)) {
                return arg.substring(prefix.length());
            }
        }
        return null;
    }
}
