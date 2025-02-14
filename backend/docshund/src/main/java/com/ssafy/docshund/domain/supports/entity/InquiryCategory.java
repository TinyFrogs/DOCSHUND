package com.ssafy.docshund.domain.supports.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum InquiryCategory {
	DOCUMENT_REQUEST("문서 등록 요청"), MEMBER("회원 관련"), REPORT("신고 관련");

	private final String description;

}
