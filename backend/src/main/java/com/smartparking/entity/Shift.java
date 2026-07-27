package com.smartparking.entity;

import com.smartparking.enums.ShiftStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "staff_shifts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Shift {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ShiftStatus status;

    @Builder.Default
    @Column(name = "checkins_count", nullable = false)
    private Integer checkinsCount = 0;

    @Builder.Default
    @Column(name = "checkouts_count", nullable = false)
    private Integer checkoutsCount = 0;

    @Builder.Default
    @Column(name = "revenue_collected", nullable = false)
    private BigDecimal revenueCollected = BigDecimal.ZERO;

    private String notes;
}
