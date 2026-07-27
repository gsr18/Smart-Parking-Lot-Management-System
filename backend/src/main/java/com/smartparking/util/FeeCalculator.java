package com.smartparking.util;

import com.smartparking.enums.VehicleType;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDateTime;

@Component
public class FeeCalculator {

    public static final BigDecimal BIKE_HOURLY_RATE = new BigDecimal("20.00");
    public static final BigDecimal CAR_HOURLY_RATE = new BigDecimal("50.00");
    public static final BigDecimal TRUCK_HOURLY_RATE = new BigDecimal("100.00");

    /**
     * Calculates parking fee based on vehicle type and duration between entry and exit time.
     * Partial hours are rounded UP to the nearest full hour (ceiling rounding).
     */
    public BigDecimal calculateFee(VehicleType vehicleType, LocalDateTime entryTime, LocalDateTime exitTime) {
        if (entryTime == null || exitTime == null || exitTime.isBefore(entryTime)) {
            return BigDecimal.ZERO;
        }

        long minutes = Duration.between(entryTime, exitTime).toMinutes();
        int hours = calculateBilledHours(minutes);
        BigDecimal hourlyRate = getHourlyRate(vehicleType);

        return hourlyRate.multiply(BigDecimal.valueOf(hours)).setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Calculates billed hours from total duration minutes.
     * 1 to 60 minutes = 1 hour.
     * 61 to 120 minutes = 2 hours, etc.
     */
    public int calculateBilledHours(long durationMinutes) {
        if (durationMinutes <= 0) {
            return 1; // Minimum charge is 1 hour
        }
        return (int) Math.ceil((double) durationMinutes / 60.0);
    }

    public BigDecimal getHourlyRate(VehicleType vehicleType) {
        if (vehicleType == null) {
            return CAR_HOURLY_RATE;
        }
        return switch (vehicleType) {
            case BIKE -> BIKE_HOURLY_RATE;
            case CAR -> CAR_HOURLY_RATE;
            case TRUCK -> TRUCK_HOURLY_RATE;
        };
    }
}
