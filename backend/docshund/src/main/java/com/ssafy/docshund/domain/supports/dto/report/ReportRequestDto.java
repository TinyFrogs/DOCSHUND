package com.ssafy.docshund.domain.supports.dto.report;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReportRequestDto {

	private Integer commentId;
	private Integer articleId;
	private Long transId;
	private Long chatId;
	private String category;

	@NotNull
	@Size(max = 500, message = "500자를 넘을 수 없습니다.")
	private String content;

	private String originContent;

	@NotBlank(message = "신고할 유저는 필수입니다.")
	private Long reportedUser;
}
