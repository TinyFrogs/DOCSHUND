package com.ssafy.docshund.domain.supports.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.docshund.domain.supports.dto.inquiry.AnswerRequestDto;
import com.ssafy.docshund.domain.supports.dto.inquiry.InquiryRequestDto;
import com.ssafy.docshund.domain.supports.dto.inquiry.page.InquiryAndAnswerDto;

public interface InquiryService {

	void createInquiry(InquiryRequestDto inquiryRequestDto, MultipartFile file);

	Page<InquiryAndAnswerDto> getInquiries(Long userId, Pageable pageable);

	void respondToInquiry(Long inquiryId, AnswerRequestDto answerRequestDto);
}
