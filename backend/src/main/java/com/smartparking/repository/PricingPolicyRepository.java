package com.smartparking.repository;

import com.smartparking.entity.PricingPolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PricingPolicyRepository extends JpaRepository<PricingPolicy, Long> {

    Optional<PricingPolicy> findByCompanyId(Long companyId);
}
