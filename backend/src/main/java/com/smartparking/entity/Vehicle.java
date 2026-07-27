package com.smartparking.entity;

import com.smartparking.enums.VehicleType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.Objects;

@Entity
@Table(name = "vehicle")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Vehicle extends BaseEntity {

    @Column(name = "vehicle_number", nullable = false, length = 20)
    private String vehicleNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "vehicle_type", nullable = false, length = 20)
    private VehicleType vehicleType;

    @Column(name = "owner_name", nullable = false, length = 100)
    private String ownerName;

    @Column(name = "owner_contact", nullable = false, length = 15)
    private String ownerContact;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "company_id")
    private Company company;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Vehicle vehicle = (Vehicle) o;
        return getId() != null && Objects.equals(getId(), vehicle.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
