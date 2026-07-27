package com.smartparking.strategy;

import com.smartparking.entity.ParkingSlot;
import com.smartparking.enums.SlotStatus;
import com.smartparking.enums.SlotType;
import com.smartparking.repository.ParkingSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Primary
@Component("firstAvailableStrategy")
@RequiredArgsConstructor
public class FirstAvailableStrategy implements ParkingAllocationStrategy {

    private final ParkingSlotRepository parkingSlotRepository;

    @Override
    public Optional<ParkingSlot> allocateSlot(SlotType slotType, Long companyId) {
        List<ParkingSlot> availableSlots = parkingSlotRepository.findAvailableSlotsWithLock(slotType, SlotStatus.AVAILABLE, companyId);
        return availableSlots.stream().findFirst();
    }
}
