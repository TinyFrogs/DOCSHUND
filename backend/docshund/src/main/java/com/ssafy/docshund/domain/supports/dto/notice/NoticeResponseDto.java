package com.ssafy.docshund.domain.supports.dto.notice;

import java.time.LocalDateTime;

import com.ssafy.docshund.domain.supports.entity.Notice;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class NoticeResponseDto {

	private Integer noticeId;
	private String title;
	private String content;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

	public NoticeResponseDto(Notice notice) {
		this.noticeId = notice.getNoticeId();
		this.title = notice.getTitle();
		this.content = notice.getContent();
		this.createdAt = notice.getCreatedAt();
		this.updatedAt = notice.getUpdatedAt();
	}
}
