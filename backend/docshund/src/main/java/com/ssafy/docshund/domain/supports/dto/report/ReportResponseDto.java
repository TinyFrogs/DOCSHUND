package com.ssafy.docshund.domain.supports.dto.report;

import java.time.LocalDateTime;

import com.querydsl.core.annotations.QueryProjection;
import com.ssafy.docshund.domain.supports.entity.ReportCategory;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class ReportResponseDto {

	private Integer reportId;

	private Long userId;

	private ReportCategory category;

	private String content;

	private String originContent;

	private Long reportedUser;

	private String reportFile;

	private Integer commentId;

	private Integer articleId;

	private Long transId;

	private Long chatId;

	private LocalDateTime createdAt;

	@QueryProjection
	public ReportResponseDto(Integer reportId, Long userId, ReportCategory category, String content,
		String originContent, Long reportedUser, String reportFile, Integer commentId,
		Integer articleId, Long transId, Long chatId, LocalDateTime createdAt) {
		this.reportId = reportId;
		this.userId = userId;
		this.category = category;
		this.originContent = originContent;
		this.reportedUser = reportedUser;
		this.reportFile = reportFile;
		this.commentId = commentId;
		this.articleId = articleId;
		this.transId = transId;
		this.chatId = chatId;
		this.content = content;
		this.createdAt = createdAt;
	}
}
