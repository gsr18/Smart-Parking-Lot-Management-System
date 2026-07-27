package com.smartparking.dto;

import com.smartparking.enums.SlotStatus;
import com.smartparking.enums.SlotType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SlotRequest {

    @NotBlank(message = "Slot number is required")
    @Size(max = 20, message = "Slot number must not exceed 20 characters")
    private String slotNumber;

    @NotNull(message = "Slot type is required")
    private SlotType slotType;

    @NotNull(message = "Floor number is required")
    @Min(value = 1, message = "Floor number must be at least 1")
    private Integer floorNumber;

    @Builder.Default
    private SlotStatus status = SlotStatus.AVAILABLE;
}
