package com.smartparking.entity;

import com.smartparking.enums.SlotStatus;
import com.smartparking.enums.SlotType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.Objects;

@Entity
@Table(name = "parking_slot")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ParkingSlot extends BaseEntity {

    @Column(name = "slot_number", nullable = false, length = 20)
    private String slotNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "slot_type", nullable = false, length = 20)
    private SlotType slotType;

    @Column(name = "floor_number", nullable = false)
    private Integer floorNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private SlotStatus status = SlotStatus.AVAILABLE;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "company_id")
    private Company company;

    @Version
    @Column(nullable = false)
    @Builder.Default
    private Long version = 0L;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ParkingSlot that = (ParkingSlot) o;
        return getId() != null && Objects.equals(getId(), that.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
