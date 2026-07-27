package com.smartparking.mapper;

import com.smartparking.dto.SlotRequest;
import com.smartparking.dto.SlotResponse;
import com.smartparking.entity.ParkingSlot;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface SlotMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    ParkingSlot toEntity(SlotRequest request);

    @Mapping(target = "occupiedByVehicleNumber", ignore = true)
    @Mapping(target = "currentOwnerName", ignore = true)
    SlotResponse toResponse(ParkingSlot entity);
}
