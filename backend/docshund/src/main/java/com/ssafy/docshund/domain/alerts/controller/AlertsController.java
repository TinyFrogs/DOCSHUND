package com.ssafy.docshund.domain.alerts.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.ssafy.docshund.domain.alerts.dto.AlertOutputDto;
import com.ssafy.docshund.domain.alerts.service.AlertsService;
import com.ssafy.docshund.domain.users.entity.User;
import com.ssafy.docshund.global.util.user.UserUtil;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/docshund/alerts")
@RequiredArgsConstructor
public class AlertsController {

	private final AlertsService alertsService;
	private final UserUtil userUtil;

	// DB 스케줄링으로 하루에 한 번씩 30일이 지난 알림을 삭제 (전체 알림 DB 색인 후 삭제)

	// 알림 목록 조회
	@GetMapping("")
	public ResponseEntity<List<AlertOutputDto>> getAlerts(
		@RequestParam(value = "userId") Long userId
	) {
		List<AlertOutputDto> alerts = alertsService.getAllAlerts(userId);
		return ResponseEntity.ok(alerts);
	}

	// 알림 상세 조회
	@GetMapping("/{alertId}")
	public ResponseEntity<AlertOutputDto> getAlert(
		@PathVariable Long alertId
	) {
		AlertOutputDto alert = alertsService.getAlert(alertId);
		return ResponseEntity.ok(alert);
	}

	// 알림 삭제
	@DeleteMapping("/{alertId}/delete")
	public ResponseEntity<?> deleteAlert(
		@PathVariable Long alertId
	) {
		alertsService.deleteAlert(alertId);
		return ResponseEntity.ok().body(Map.of("message", "알림이 성공적으로 삭제되었습니다."));
	}

	// 알림 일괄 삭제
	@DeleteMapping("/delete")
	public ResponseEntity<?> deleteAlerts(
	) {
		alertsService.deleteAlerts();
		return ResponseEntity.ok().body(Map.of("message", "알림이 일괄 삭제되었습니다."));
	}

	// 알림 조회 처리
	@PostMapping("/{alertId}/read")
	public ResponseEntity<?> readAlert(
		@PathVariable Long alertId
	) {
		alertsService.readAlert(alertId);
		return ResponseEntity.ok().body(Map.of("message", "알림이 읽음 처리되었습니다."));
	}

	// 알림 일괄 조회 처리
	@PostMapping("/read")
	public ResponseEntity<?> readAlerts(
	) {
		alertsService.readAlerts();
		return ResponseEntity.ok().body(Map.of("message", "알림이 일괄 읽음 처리되었습니다."));
	}

	// 알림 받기 (SSE 연결)
	@GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
	public SseEmitter subscribe() {
		if(userUtil.getUser() == null) {
			throw new SecurityException("로그인이 필요합니다.");
		}
		Long userId = userUtil.getUser().getUserId();
		return alertsService.subscribe(userId);
	}

}
