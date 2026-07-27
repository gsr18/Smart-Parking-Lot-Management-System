package com.smartparking.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "receipt")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Receipt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "receipt_number", nullable = false, unique = true, length = 30)
    private String receiptNumber;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "parking_session_id", nullable = false, unique = true)
    private ParkingSession parkingSession;

    @Column(name = "generated_time", nullable = false)
    private LocalDateTime generatedTime;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Receipt receipt = (Receipt) o;
        return id != null && Objects.equals(id, receipt.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
