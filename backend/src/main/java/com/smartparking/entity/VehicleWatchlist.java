package com.smartparking.entity;

import com.smartparking.enums.WatchlistCategory;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicle_watchlist", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"company_id", "vehicle_number"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleWatchlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(name = "vehicle_number", nullable = false)
    private String vehicleNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WatchlistCategory category;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String reason;

    @Builder.Default
    @Column(name = "outstanding_dues", nullable = false)
    private BigDecimal outstandingDues = BigDecimal.ZERO;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
