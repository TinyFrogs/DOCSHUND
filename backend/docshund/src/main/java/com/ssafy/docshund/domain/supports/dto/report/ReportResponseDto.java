package com.ssafy.docshund.domain.supports.dto.report;

import com.querydsl.core.annotations.QueryProjection;
import com.ssafy.docshund.domain.supports.entity.ReportCategory;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
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

	@QueryProjection
	public ReportResponseDto(Integer reportId, Long userId, ReportCategory category, String content,
		String originContent, Long reportedUser, String reportFile, Integer commentId,
		Integer articleId, Long transId, Long chatId) {
		this.reportId = reportId;
		this.userId = userId;
		this.category = category;
		this.content = content;
	}
}
