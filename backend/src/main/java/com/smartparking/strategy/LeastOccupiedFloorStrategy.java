package com.smartparking.strategy;

import com.smartparking.entity.ParkingSlot;
import com.smartparking.enums.SlotStatus;
import com.smartparking.enums.SlotType;
import com.smartparking.repository.ParkingSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Component("leastOccupiedFloorStrategy")
@RequiredArgsConstructor
public class LeastOccupiedFloorStrategy implements ParkingAllocationStrategy {

    private final ParkingSlotRepository parkingSlotRepository;

    @Override
    public Optional<ParkingSlot> allocateSlot(SlotType slotType, Long companyId) {
        List<ParkingSlot> availableSlots = parkingSlotRepository.findAvailableSlotsWithLock(slotType, SlotStatus.AVAILABLE, companyId);

        if (availableSlots.isEmpty()) {
            return Optional.empty();
        }

        // Group by floor number and find the floor with the highest available slot count
        return availableSlots.stream()
                .min(Comparator.comparingInt(s -> getOccupiedCountForFloor(s, companyId)));
    }

    private int getOccupiedCountForFloor(ParkingSlot slot, Long companyId) {
        List<ParkingSlot> floorSlots = (companyId != null) ?
                parkingSlotRepository.findByFloorNumberAndCompanyIdOrderBySlotNumberAsc(slot.getFloorNumber(), companyId) :
                parkingSlotRepository.findByFloorNumberOrderBySlotNumberAsc(slot.getFloorNumber());

        return (int) floorSlots.stream().filter(s -> s.getStatus() == SlotStatus.OCCUPIED).count();
    }
}
