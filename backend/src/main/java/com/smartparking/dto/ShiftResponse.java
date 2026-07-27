package com.smartparking.dto;

import com.smartparking.enums.ShiftStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShiftResponse {
    private Long id;
    private Long userId;
    private String staffUsername;
    private String staffFullName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private ShiftStatus status;
    private Integer checkinsCount;
    private Integer checkoutsCount;
    private BigDecimal revenueCollected;
    private String notes;
}
