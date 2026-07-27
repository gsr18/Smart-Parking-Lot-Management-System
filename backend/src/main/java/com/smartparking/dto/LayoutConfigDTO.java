package com.smartparking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LayoutConfigDTO {
    private int totalFloors; // 1 to 4
    // Maps floor number to grid template, e.g., "5x5", "10x10", "15x15"
    private Map<Integer, String> floorTemplates;
}
