package com.smartparking.dto;

import com.smartparking.enums.SlotType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SlotRecommendationResponse {

    private String slotNumber;
    private SlotType slotType;
    private Integer floorNumber;
    private String reason;
    private String AIRecommendationSummary;
}
