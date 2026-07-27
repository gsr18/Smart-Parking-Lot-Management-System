package com.smartparking.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pricing_policies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PricingPolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false, unique = true)
    private Company company;

    @Builder.Default
    @Column(name = "car_hourly_rate", nullable = false)
    private BigDecimal carHourlyRate = new BigDecimal("50.00");

    @Builder.Default
    @Column(name = "bike_hourly_rate", nullable = false)
    private BigDecimal bikeHourlyRate = new BigDecimal("20.00");

    @Builder.Default
    @Column(name = "truck_hourly_rate", nullable = false)
    private BigDecimal truckHourlyRate = new BigDecimal("120.00");

    @Builder.Default
    @Column(name = "peak_multiplier", nullable = false)
    private BigDecimal peakMultiplier = new BigDecimal("1.20");

    @Builder.Default
    @Column(name = "weekend_multiplier", nullable = false)
    private BigDecimal weekendMultiplier = new BigDecimal("1.15");

    @Builder.Default
    @Column(name = "lost_ticket_fee", nullable = false)
    private BigDecimal lostTicketFee = new BigDecimal("500.00");

    @Builder.Default
    @Column(name = "peak_start_hour", nullable = false)
    private Integer peakStartHour = 18;

    @Builder.Default
    @Column(name = "peak_end_hour", nullable = false)
    private Integer peakEndHour = 22;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onSave() {
        this.updatedAt = LocalDateTime.now();
    }
}
