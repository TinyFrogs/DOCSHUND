package com.ssafy.docshund.domain.supports.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.docshund.domain.supports.dto.report.ReportRequestDto;
import com.ssafy.docshund.domain.supports.dto.report.ReportResponseDto;
import com.ssafy.docshund.domain.supports.service.ReportService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/docshund/supports/reports")
public class ReportController {

	private final ReportService reportService;

	@GetMapping
	public ResponseEntity<Page<ReportResponseDto>> searchReportUsers(@RequestParam(required = false) Long userId,
		Pageable pageable) {
		return ResponseEntity.ok(reportService.searchReportUsers(userId, pageable));
	}

	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> createReport(
		@Valid @RequestPart(value = "report", required = false) ReportRequestDto reportRequestDto,
		@RequestPart(value = "file", required = false) MultipartFile file) {
		reportService.reportUser(reportRequestDto, file);

		return ResponseEntity.ok("신고가 완료되었습니다.");
	}

	@PostMapping("/{reportId}/withdraw")
	public ResponseEntity<String> withdrawReport(@PathVariable Integer reportId) {
		reportService.withdrawReport(reportId);

		return ResponseEntity.ok("신고 철회가 완료되었습니다.");
	}
}
