package com.ssafy.docshund.domain.supports.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.docshund.domain.supports.dto.notice.NoticeRequestDto;
import com.ssafy.docshund.domain.supports.dto.notice.NoticeResponseDto;
import com.ssafy.docshund.domain.supports.service.NoticeService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/docshund/supports/notice")
public class NoticeController {

	private final NoticeService noticeService;

	@GetMapping
	public ResponseEntity<Page<NoticeResponseDto>> searchNotice(Pageable pageable) {
		return ResponseEntity.ok(noticeService.searchNotice(pageable));
	}

	@PostMapping
	public ResponseEntity<String> createNotice(@RequestBody NoticeRequestDto noticeRequestDto) {
		noticeService.createNotice(noticeRequestDto);
		return ResponseEntity.ok("공지사항이 생성되었습니다.");
	}

	@GetMapping("/{noticeId}")
	public ResponseEntity<NoticeResponseDto> getNoticeDetail(@PathVariable Integer noticeId) {
		return ResponseEntity.ok(noticeService.getNoticeDetail(noticeId));
	}

	@PatchMapping("/{noticeId}")
	public ResponseEntity<String> modifyNotice(@RequestBody NoticeRequestDto noticeRequestDto,
		@PathVariable Integer noticeId) {
		noticeService.modifyNotice(noticeRequestDto, noticeId);
		return ResponseEntity.ok("공지사항이 수정되었습니다.");
	}

	@DeleteMapping("/{noticeId}")
	public ResponseEntity<String> deleteNotice(@PathVariable Integer noticeId) {
		noticeService.deleteNotice(noticeId);
		return ResponseEntity.ok("공지사항이 삭제되었습니다.");
	}

}
