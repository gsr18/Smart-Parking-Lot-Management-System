package com.smartparking.controller;

import com.smartparking.dto.ApiResponse;
import com.smartparking.dto.WatchlistDTO;
import com.smartparking.service.WatchlistService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/watchlist")
@RequiredArgsConstructor
public class WatchlistController {

    private final WatchlistService watchlistService;

    @PostMapping
    public ResponseEntity<ApiResponse<WatchlistDTO>> addToWatchlist(@Valid @RequestBody WatchlistDTO dto) {
        WatchlistDTO saved = watchlistService.addToWatchlist(dto);
        return ResponseEntity.ok(ApiResponse.success(saved, "Vehicle added to watchlist"));
    }

    @GetMapping("/check")
    public ResponseEntity<ApiResponse<WatchlistDTO>> checkWatchlist(@RequestParam String vehicleNumber) {
        Optional<WatchlistDTO> entry = watchlistService.checkWatchlist(vehicleNumber);
        return ResponseEntity.ok(ApiResponse.success(entry.orElse(null), "Watchlist checked"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<WatchlistDTO>>> getCompanyWatchlist() {
        List<WatchlistDTO> list = watchlistService.getCompanyWatchlist();
        return ResponseEntity.ok(ApiResponse.success(list, "Watchlist fetched"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> removeFromWatchlist(@PathVariable Long id) {
        watchlistService.removeFromWatchlist(id);
        return ResponseEntity.ok(ApiResponse.success("Success", "Vehicle removed from watchlist"));
    }
}
