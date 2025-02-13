package com.ssafy.docshund.domain.supports.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.ssafy.docshund.domain.supports.dto.inquiry.page.InquiryAndAnswerDto;

public interface InquiryRepositoryCustom {

	//문의와 답변들고오기(만약 답변이 없으면 문의만 들고오기, userId가 있으면 그 userId만, userId가 없으면 전부)
	Page<InquiryAndAnswerDto> searchInquiryAndAnswer(Long userId, Pageable pageable);
}
