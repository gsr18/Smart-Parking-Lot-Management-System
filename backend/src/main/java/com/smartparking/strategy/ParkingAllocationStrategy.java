package com.smartparking.strategy;

import com.smartparking.entity.ParkingSlot;
import com.smartparking.enums.SlotType;

import java.util.Optional;

public interface ParkingAllocationStrategy {

    /**
     * Allocates a compatible parking slot for the requested vehicle slot type and company.
     */
    Optional<ParkingSlot> allocateSlot(SlotType slotType, Long companyId);

    default Optional<ParkingSlot> allocateSlot(SlotType slotType) {
        return allocateSlot(slotType, null);
    }
}
