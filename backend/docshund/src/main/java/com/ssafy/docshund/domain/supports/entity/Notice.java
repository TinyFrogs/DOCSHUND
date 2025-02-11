package com.ssafy.docshund.domain.supports.entity;

import com.ssafy.docshund.domain.supports.dto.notice.NoticeRequestDto;
import com.ssafy.docshund.global.audit.BaseTimeEntityWithUpdatedAt;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

@Getter
@Entity
@Table(name = "Notice")
public class Notice extends BaseTimeEntityWithUpdatedAt {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "notice_id")
	private Integer noticeId;

	@Column(name = "title", nullable = false, length = 200)
	private String title;

	@Column(name = "content", nullable = false, columnDefinition = "TEXT")
	private String content;

	public static Notice createNotice(NoticeRequestDto noticeRequestDto) {
		Notice notice = new Notice();
		notice.title = noticeRequestDto.getTitle();
		notice.content = noticeRequestDto.getContent();
		return notice;
	}

	public void modifyNotice(NoticeRequestDto noticeRequestDto) {
		this.title = noticeRequestDto.getTitle();
		this.content = noticeRequestDto.getContent();
	}
}

