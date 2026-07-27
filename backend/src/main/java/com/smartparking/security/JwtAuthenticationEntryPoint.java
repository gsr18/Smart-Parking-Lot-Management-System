package com.smartparking.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartparking.dto.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException {
        log.error("Responding with unauthorized error. Message - {}", authException.getMessage());

        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        ApiResponse<Object> errorResponse = ApiResponse.error(
                "Unauthorized: " + authException.getMessage(),
                "UNAUTHORIZED",
                request.getRequestURI()
        );

        objectMapper.findAndRegisterModules();
        objectMapper.writeValue(response.getOutputStream(), errorResponse);
    }
}
