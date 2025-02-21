package com.ssafy.docshund.domain.supports.entity;

import java.util.Arrays;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ReportCategory {
	욕설_및_폭력성("ABUSIVE_LANGUAGE_OR_VIOLENCE"),
	음란물_및_불법_콘텐츠_게시("EXPLICIT_OR_ILLEGAL_CONTENT"),
	사행성_조장("PROMOTING_GAMBLING"),
	스팸_및_광고("SPAM_OR_ADVERTISING"),
	도배("FLOODING"),
	개인정보_노출("PERSONAL_INFORMATION_EXPOSURE"),
	저작권_침해("COPYRIGHT_INFRINGEMENT"),
	기타("OTHER");

	private final String description;

	// description을 기반으로 ReportCategory 찾기
	public static ReportCategory fromDescription(String description) {
		return Arrays.stream(ReportCategory.values())
			.filter(category -> category.getDescription().equals(description))
			.findFirst()
			.orElseThrow(() -> new IllegalArgumentException("해당하는 신고 카테고리가 없습니다: " + description));
	}
}
