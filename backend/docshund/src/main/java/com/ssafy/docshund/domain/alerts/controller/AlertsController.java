package com.ssafy.docshund.domain.alerts.controller;

import com.ssafy.docshund.domain.alerts.dto.AlertDto;
import com.ssafy.docshund.domain.alerts.service.AlertsService;
import com.ssafy.docshund.global.util.user.UserUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/docshund/alerts")
@RequiredArgsConstructor
public class AlertsController {

    private final AlertsService alertsService;
    private final UserUtil userUtil;

    // 알림 목록 조회
    @GetMapping("")
    public ResponseEntity<List<AlertDto>> getAlerts(
        @RequestParam(value = "userId") Long userId
    ) {
        List<AlertDto> alerts = alertsService.getAllAlerts(userId);
        return ResponseEntity.ok(alerts);
    }

    // 알림 상세 조회

    // 알림 삭제
    @DeleteMapping("{alertId}")
    public void deleteAlert() {
    }

    // 알림 조회 처리

    // 알림 받기 (는 어디서 해야하지...)
}
