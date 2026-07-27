package com.smartparking.entity;

import com.smartparking.enums.ParkingStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "parking_session")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ParkingSession extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "slot_id", nullable = false)
    private ParkingSlot parkingSlot;

    @Column(name = "owner_name", nullable = false, length = 100)
    private String ownerName;

    @Column(name = "owner_contact", nullable = false, length = 15)
    private String ownerContact;

    @Column(name = "entry_time", nullable = false)
    private LocalDateTime entryTime;

    @Column(name = "exit_time")
    private LocalDateTime exitTime;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @Column(name = "parking_fee", precision = 10, scale = 2)
    private BigDecimal parkingFee;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private ParkingStatus status = ParkingStatus.ACTIVE;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "company_id")
    private Company company;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "staff_id")
    private User staffUser;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ParkingSession session = (ParkingSession) o;
        return getId() != null && Objects.equals(getId(), session.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
