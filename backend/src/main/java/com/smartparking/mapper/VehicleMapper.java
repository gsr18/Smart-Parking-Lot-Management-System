package com.smartparking.mapper;

import com.smartparking.dto.VehicleRequest;
import com.smartparking.dto.VehicleResponse;
import com.smartparking.entity.Vehicle;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface VehicleMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Vehicle toEntity(VehicleRequest request);

    @Mapping(target = "currentlyParked", ignore = true)
    @Mapping(target = "activeSlotNumber", ignore = true)
    VehicleResponse toResponse(Vehicle entity);
}
