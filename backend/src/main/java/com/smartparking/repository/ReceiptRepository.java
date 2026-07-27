package com.smartparking.repository;

import com.smartparking.entity.Receipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReceiptRepository extends JpaRepository<Receipt, Long> {

    Optional<Receipt> findByReceiptNumber(String receiptNumber);

    Optional<Receipt> findByParkingSessionId(Long parkingSessionId);

    Boolean existsByReceiptNumber(String receiptNumber);
}
