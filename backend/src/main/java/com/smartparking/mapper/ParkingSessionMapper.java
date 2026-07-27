package com.smartparking.mapper;

import com.smartparking.dto.CheckInResponse;
import com.smartparking.dto.CheckOutResponse;
import com.smartparking.dto.RecentActivityResponse;
import com.smartparking.entity.ParkingSession;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface ParkingSessionMapper {

    @Mapping(target = "sessionId", source = "id")
    @Mapping(target = "vehicleNumber", source = "vehicle.vehicleNumber")
    @Mapping(target = "vehicleType", source = "vehicle.vehicleType")
    @Mapping(target = "slotNumber", source = "parkingSlot.slotNumber")
    @Mapping(target = "floorNumber", source = "parkingSlot.floorNumber")
    @Mapping(target = "staffId", source = "staffUser.id")
    @Mapping(target = "staffName", source = "staffUser.fullName")
    @Mapping(target = "status", expression = "java(entity.getStatus().name())")
    CheckInResponse toCheckInResponse(ParkingSession entity);

    @Mapping(target = "sessionId", source = "id")
    @Mapping(target = "receiptNumber", ignore = true)
    @Mapping(target = "vehicleNumber", source = "vehicle.vehicleNumber")
    @Mapping(target = "vehicleType", source = "vehicle.vehicleType")
    @Mapping(target = "slotNumber", source = "parkingSlot.slotNumber")
    @Mapping(target = "floorNumber", source = "parkingSlot.floorNumber")
    @Mapping(target = "staffId", source = "staffUser.id")
    @Mapping(target = "staffName", source = "staffUser.fullName")
    @Mapping(target = "status", expression = "java(entity.getStatus().name())")
    CheckOutResponse toCheckOutResponse(ParkingSession entity);

    @Mapping(target = "sessionId", source = "id")
    @Mapping(target = "vehicleNumber", source = "vehicle.vehicleNumber")
    @Mapping(target = "vehicleType", source = "vehicle.vehicleType")
    @Mapping(target = "slotNumber", source = "parkingSlot.slotNumber")
    RecentActivityResponse toRecentActivityResponse(ParkingSession entity);
}
