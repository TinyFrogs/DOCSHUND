package com.ssafy.docshund.domain.supports.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.ssafy.docshund.domain.supports.dto.notice.NoticeRequestDto;
import com.ssafy.docshund.domain.supports.dto.notice.NoticeResponseDto;

public interface NoticeService {

	Page<NoticeResponseDto> searchNotice(Pageable pageable);

	void createNotice(NoticeRequestDto noticeRequestDto);

	NoticeResponseDto getNoticeDetail(Integer noticeId);

	void modifyNotice(NoticeRequestDto noticeRequestDto, Integer noticeId);

	void deleteNotice(Integer noticeId);

}
