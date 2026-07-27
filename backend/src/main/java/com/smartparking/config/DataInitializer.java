package com.smartparking.config;

import com.smartparking.entity.Role;
import com.smartparking.enums.RoleType;
import com.smartparking.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    private final RoleRepository roleRepository;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void initBaseRoles() {
        try {
            roleRepository.findByName(RoleType.ROLE_ADMIN)
                    .orElseGet(() -> roleRepository.save(Role.builder().name(RoleType.ROLE_ADMIN).build()));

            roleRepository.findByName(RoleType.ROLE_STAFF)
                    .orElseGet(() -> roleRepository.save(Role.builder().name(RoleType.ROLE_STAFF).build()));

            log.info("Base Security Roles (ROLE_ADMIN, ROLE_STAFF) initialized successfully");
        } catch (Exception e) {
            log.error("Error during DataInitializer startup: {}", e.getMessage(), e);
        }
    }
}
