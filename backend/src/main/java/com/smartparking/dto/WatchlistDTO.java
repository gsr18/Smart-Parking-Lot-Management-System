package com.smartparking.dto;

import com.smartparking.enums.WatchlistCategory;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WatchlistDTO {
    private Long id;

    @NotBlank(message = "Vehicle number is required")
    private String vehicleNumber;

    private WatchlistCategory category;

    @NotBlank(message = "Reason is required")
    private String reason;

    private BigDecimal outstandingDues;
}
