package com.smartparking.service;

import com.smartparking.dto.AiChatRequest;
import com.smartparking.dto.AiChatResponse;
import com.smartparking.dto.ReportResponse;
import com.smartparking.dto.SlotRecommendationResponse;
import com.smartparking.enums.VehicleType;

public interface AiAssistantService {

    AiChatResponse processChatQuery(AiChatRequest request);

    SlotRecommendationResponse recommendSlot(VehicleType vehicleType);

    String explainReport(ReportResponse report);
}
