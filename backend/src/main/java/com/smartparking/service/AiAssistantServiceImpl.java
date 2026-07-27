package com.smartparking.service;

import com.smartparking.dto.*;
import com.smartparking.enums.SlotStatus;
import com.smartparking.enums.SlotType;
import com.smartparking.enums.VehicleType;
import com.smartparking.repository.ParkingSessionRepository;
import com.smartparking.repository.ParkingSlotRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiAssistantServiceImpl implements AiAssistantService {

    private final DashboardService dashboardService;
    private final ParkingSlotRepository slotRepository;
    private final ParkingSessionRepository sessionRepository;

    @Override
    @Transactional(readOnly = true)
    public AiChatResponse processChatQuery(AiChatRequest request) {
        String msg = request.getMessage().toLowerCase();
        log.info("Processing AI Chat Query: {}", request.getMessage());

        DashboardSummaryResponse summary = dashboardService.getDashboardSummary();
        StringBuilder responseBuilder = new StringBuilder();
        List<String> suggestedActions = new ArrayList<>();

        if (msg.contains("what is") || msg.contains("about") || msg.contains("system") || msg.contains("web app") || msg.contains("overview")) {
            responseBuilder.append("### 🅿️ SmartParking Enterprise Overview\n\n")
                    .append("**SmartParking** is a scalable, multi-tenant Smart Parking Management Platform designed for modern facilities. System highlights:\n\n")
                    .append("- **Multi-Role Portals**: Distinct operational views for **Administrators** (full executive analytics & layout configuration) and **Gate Staff** (fast check-in/checkout operations).\n")
                    .append("- **Interactive Visual Grid**: Real-time floor bay layout supporting 1-click Check-Ins and instant Check-Outs.\n")
                    .append("- **Automated Billing Engine**: Dynamic hourly tariff calculator with ceiling rounding (Car @ ₹50/hr, Bike @ ₹20/hr, Truck @ ₹100/hr).\n")
                    .append("- **Live Shift & Revenue Sync**: Real-time gate shift counter, auto-updating dashboard feeds, and 1-click CSV data exports.");

            suggestedActions.add("How to Check-In & Check-Out");
            suggestedActions.add("Explain Reports & Financials");
            suggestedActions.add("Check occupancy stats");
        } else if (msg.contains("how to use") || msg.contains("checkin") || msg.contains("checkout") || msg.contains("guide") || msg.contains("operation")) {
            responseBuilder.append("### 🚗 Step-by-Step Gate Operations Guide\n\n")
                    .append("1. **Vehicle Check-In**:\n")
                    .append("   - Click **+ Check In** button (or press shortcut `N`).\n")
                    .append("   - Enter Vehicle Registration Plate, Owner Name, Contact Number, and Vehicle Type (Car / Bike / Truck).\n")
                    .append("   - Click any **Available (Green) Bay** directly on the floor layout to pre-fill the slot number.\n")
                    .append("   - System automatically locks the bay and issues an active parking session.\n\n")
                    .append("2. **Vehicle Check-Out**:\n")
                    .append("   - Click any **Occupied (Red/Purple) Bay** directly on the floor layout, or click **Check Out** (shortcut `C`).\n")
                    .append("   - Vehicle plate and slot number pre-fill automatically.\n")
                    .append("   - System calculates duration minutes, billed hours, and exact parking fee, then displays an official receipt!");

            suggestedActions.add("Recommend slot for Car");
            suggestedActions.add("Check occupancy stats");
            suggestedActions.add("Explain Reports & Financials");
        } else if (msg.contains("report") || msg.contains("financial") || msg.contains("export") || msg.contains("csv") || msg.contains("analytics")) {
            responseBuilder.append(String.format("### 📊 Financial Metrics & Performance Analytics\n\n" +
                    "- **Today's Revenue**: **₹%s**\n" +
                    "- **This Week's Revenue**: **₹%s**\n" +
                    "- **This Month's Revenue**: **₹%s**\n" +
                    "- **Lifetime Revenue**: **₹%s**\n\n" +
                    "**Key Analytics Capabilities**:\n" +
                    "- **Reports Page**: Daily, Weekly, and Monthly breakdown of total parked vs exited vehicles.\n" +
                    "- **Exact Category Share**: Car (₹50.00/hr), Bike (₹20.00/hr), Truck (₹100.00/hr).\n" +
                    "- **1-Click Export CSV**: Instantly export raw session history or vehicle records to CSV files.",
                    summary.getRevenueToday(), summary.getRevenueThisWeek(), summary.getRevenueThisMonth(), summary.getLifetimeRevenue()));

            suggestedActions.add("Export CSV history");
            suggestedActions.add("View vehicle type mix");
        } else if (msg.contains("slot") || msg.contains("layout") || msg.contains("floor") || msg.contains("configure")) {
            responseBuilder.append("### ⚙️ Parking Bay & Floor Layout Management\n\n")
                    .append("- **Dynamic Layout Configuration**: Admins can click **Configure Layout** to set total floors, bays per floor, and grid column layouts dynamically per company.\n")
                    .append("- **Visual Bay Statuses**:\n")
                    .append("  - **AVAILABLE (Green)**: Ready for instant vehicle check-in.\n")
                    .append("  - **OCCUPIED (Red/Purple)**: Currently parked; click to initiate check-out.\n")
                    .append("  - **DISABLED (Grey)**: Bay under maintenance.\n")
                    .append("- **Floor Selector Tabs**: Seamlessly switch between Floor 1, Floor 2, Floor 3, etc.");

            suggestedActions.add("Check occupancy stats");
            suggestedActions.add("Recommend slot for Car");
        } else if (msg.contains("shift") || msg.contains("console") || msg.contains("handover") || msg.contains("staff")) {
            responseBuilder.append("### ⏱️ Shift Console & Gate Attendance\n\n")
                    .append("- **Staff Shift Tracking**: Gate staff click **Start Shift** to initiate attendance tracking.\n")
                    .append("- **Live Real-Time Banner**: Ticking duration timer (`0h 26m 45s`), live Check-Ins, Check-Outs, and Shift Revenue.\n")
                    .append("- **Admin Facility View**: For Administrators, the console banner displays real-time facility-wide gate totals.\n")
                    .append("- **Shift Handover Modal**: Ending a shift generates a summary modal for cash reconciliation & handover notes.");

            suggestedActions.add("How to Check-In & Check-Out");
            suggestedActions.add("Check occupancy stats");
        } else if (msg.contains("watchlist") || msg.contains("security") || msg.contains("flag") || msg.contains("alert")) {
            responseBuilder.append("### 🛡️ Watchlist & Security Monitoring\n\n")
                    .append("- **Security Flagging**: Add blacklisted or VIP vehicle plates to the Watchlist with custom security reasons.\n")
                    .append("- **Instant Gate Alerts**: System triggers prominent security notifications whenever a watchlisted vehicle attempts check-in.");

            suggestedActions.add("What is SmartParking?");
            suggestedActions.add("How to Check-In & Check-Out");
        } else if (msg.contains("shortcut") || msg.contains("key") || msg.contains("command")) {
            responseBuilder.append("### ⌨️ Keyboard Shortcuts & Power Navigation\n\n")
                    .append("- `⌘K` or `Ctrl+K`: Open Command Palette search.\n")
                    .append("- `N`: Open Check-In Modal.\n")
                    .append("- `C`: Open Check-Out Modal.");

            suggestedActions.add("What is SmartParking?");
            suggestedActions.add("How to Check-In & Check-Out");
        } else if (msg.contains("occupancy") || msg.contains("busy") || msg.contains("space") || msg.contains("available")) {
            responseBuilder.append(String.format("### 🅿️ Live Lot Occupancy Report\n\n" +
                    "- **Occupancy Rate**: **%.1f%%**\n" +
                    "- **Available Bays**: **%d bays** ready for check-in\n" +
                    "- **Active Parked Vehicles**: **%d vehicles**\n" +
                    "- **Disabled Bays**: **%d bays**\n" +
                    "- **Total Facility Capacity**: **%d bays**",
                    summary.getOccupancyPercentage(), summary.getAvailableSlots(), summary.getOccupiedSlots(), summary.getDisabledSlots(), summary.getTotalSlots()));

            suggestedActions.add("How to Check-In & Check-Out");
            suggestedActions.add("Recommend slot for Car");
        } else if (msg.contains("revenue") || msg.contains("earning") || msg.contains("money") || msg.contains("collected") || msg.contains("pricing")) {
            responseBuilder.append(String.format("### 💵 Live Revenue Summary & Pricing Tariff\n\n" +
                    "- **Today's Revenue**: **₹%s**\n" +
                    "- **Weekly Revenue**: **₹%s**\n" +
                    "- **Monthly Revenue**: **₹%s**\n\n" +
                    "**Pricing Tariff**:\n" +
                    "- **CAR**: ₹50.00 / hour\n" +
                    "- **BIKE**: ₹20.00 / hour\n" +
                    "- **TRUCK**: ₹100.00 / hour",
                    summary.getRevenueToday(), summary.getRevenueThisWeek(), summary.getRevenueThisMonth()));

            suggestedActions.add("Explain Reports & Financials");
            suggestedActions.add("Export CSV history");
        } else if (msg.contains("recommend") || msg.contains("where to park") || msg.contains("best slot")) {
            responseBuilder.append("### 💡 AI Slot Recommendation\n\n" +
                    "- **High-Turnover (Short Stay)**: Floor 1 slots near main entry/exit gates are recommended for fast checkout.\n" +
                    "- **Long-Term Stay**: Upper floor bays (Floor 2 & Floor 3) are optimal for extended parking.");

            suggestedActions.add("Recommend slot for Car");
            suggestedActions.add("Recommend slot for Bike");
        } else {
            responseBuilder.append(String.format("Hello! I am your **SmartParking AI Knowledge Assistant**. The facility currently has **%d active parking sessions**. Ask me anything about how to use the app, gate operations, reports, slot configuration, or shift management!",
                    summary.getActiveSessions()));

            suggestedActions.add("What is SmartParking?");
            suggestedActions.add("How to Check-In & Check-Out");
            suggestedActions.add("Explain Reports & Financials");
            suggestedActions.add("How Shift Console works?");
        }

        return AiChatResponse.builder()
                .response(responseBuilder.toString())
                .suggestedActions(suggestedActions)
                .provider("SmartParking AI Engine (Rule-based & Dynamic Analytics)")
                .confidenceScore(0.95)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public SlotRecommendationResponse recommendSlot(VehicleType vehicleType) {
        SlotType requiredType = SlotType.valueOf(vehicleType.name());
        var availableSlots = slotRepository.findBySlotTypeAndStatus(requiredType, SlotStatus.AVAILABLE);

        if (availableSlots.isEmpty()) {
            return SlotRecommendationResponse.builder()
                    .slotNumber(null)
                    .slotType(requiredType)
                    .floorNumber(null)
                    .reason("No available slots found for vehicle type " + vehicleType)
                    .AIRecommendationSummary("Facility is currently full for " + vehicleType + "s. Please direct driver to overflow area.")
                    .build();
        }

        // Recommend slot on lowest floor closest to entrance
        var recommended = availableSlots.get(0);

        return SlotRecommendationResponse.builder()
                .slotNumber(recommended.getSlotNumber())
                .slotType(recommended.getSlotType())
                .floorNumber(recommended.getFloorNumber())
                .reason("Optimal slot selected based on proximity to Floor " + recommended.getFloorNumber() + " entrance and vehicle compatibility.")
                .AIRecommendationSummary(String.format("Recommended Slot **%s** on Floor %d for %s.", recommended.getSlotNumber(), recommended.getFloorNumber(), vehicleType))
                .build();
    }

    @Override
    public String explainReport(ReportResponse report) {
        return String.format(
                "### AI Report Insights (%s)\n" +
                "- **Volume**: A total of **%d vehicles** checked in and **%d vehicles** completed checkout during this period.\n" +
                "- **Financial Performance**: Total revenue generated reached **₹%s**.\n" +
                "- **Distribution**: Cars represent %.1f%% of overall traffic, Bikes %.1f%%, and Trucks %.1f%%.\n" +
                "- **Recommendation**: Maintenance should be scheduled during off-peak morning hours to maximize slot availability.",
                report.getReportPeriod(),
                report.getTotalParkedVehicles(),
                report.getTotalExitedVehicles(),
                report.getTotalRevenue(),
                report.getVehicleDistribution().getCarPercentage(),
                report.getVehicleDistribution().getBikePercentage(),
                report.getVehicleDistribution().getTruckPercentage()
        );
    }
}
