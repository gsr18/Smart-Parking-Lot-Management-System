package com.smartparking.util;

import com.smartparking.enums.VehicleType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;

class FeeCalculatorTest {

    private FeeCalculator feeCalculator;

    @BeforeEach
    void setUp() {
        feeCalculator = new FeeCalculator();
    }

    @Test
    @DisplayName("Should round partial hour up to 1 full hour for 15-minute stay")
    void testCalculateFee_ShortStay() {
        LocalDateTime entry = LocalDateTime.of(2026, 7, 24, 10, 0);
        LocalDateTime exit = LocalDateTime.of(2026, 7, 24, 10, 15);

        BigDecimal fee = feeCalculator.calculateFee(VehicleType.CAR, entry, exit);

        // 15 mins = 1 billed hour * ₹50.00 = ₹50.00
        assertEquals(new BigDecimal("50.00"), fee);
    }

    @Test
    @DisplayName("Should charge 2 full hours for 65-minute stay (Ceiling rounding)")
    void testCalculateFee_SixtyFiveMinutes() {
        LocalDateTime entry = LocalDateTime.of(2026, 7, 24, 10, 0);
        LocalDateTime exit = LocalDateTime.of(2026, 7, 24, 11, 5);

        BigDecimal fee = feeCalculator.calculateFee(VehicleType.CAR, entry, exit);

        // 65 mins = 2 billed hours * ₹50.00 = ₹100.00
        assertEquals(new BigDecimal("100.00"), fee);
    }

    @Test
    @DisplayName("Should charge correct hourly rates for different vehicle types")
    void testCalculateFee_VehicleTypeRates() {
        LocalDateTime entry = LocalDateTime.of(2026, 7, 24, 10, 0);
        LocalDateTime exit = LocalDateTime.of(2026, 7, 24, 12, 0); // 2 hours

        BigDecimal bikeFee = feeCalculator.calculateFee(VehicleType.BIKE, entry, exit);
        BigDecimal carFee = feeCalculator.calculateFee(VehicleType.CAR, entry, exit);
        BigDecimal truckFee = feeCalculator.calculateFee(VehicleType.TRUCK, entry, exit);

        assertEquals(new BigDecimal("40.00"), bikeFee);  // 2 hrs * ₹20
        assertEquals(new BigDecimal("100.00"), carFee);  // 2 hrs * ₹50
        assertEquals(new BigDecimal("200.00"), truckFee); // 2 hrs * ₹100
    }
}
