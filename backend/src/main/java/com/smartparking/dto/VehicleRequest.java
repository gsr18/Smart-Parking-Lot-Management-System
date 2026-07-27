package com.smartparking.dto;

import com.smartparking.enums.VehicleType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleRequest {

    @NotBlank(message = "Vehicle number is required")
    @Size(max = 20, message = "Vehicle number must not exceed 20 characters")
    @Pattern(regexp = "^[A-Z0-9-]+$", message = "Vehicle number must contain only uppercase alphanumeric characters and hyphens")
    private String vehicleNumber;

    @NotNull(message = "Vehicle type is required")
    private VehicleType vehicleType;

    @NotBlank(message = "Owner name is required")
    @Size(min = 2, max = 100, message = "Owner name must be between 2 and 100 characters")
    private String ownerName;

    @NotBlank(message = "Owner contact number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Owner contact number must be exactly 10 digits")
    private String ownerContact;
}
