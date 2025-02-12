package com.ssafy.docshund.domain.supports.dto.notice;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class NoticeRequestDto {

	@NotNull(message = "제목은 필수 입력값입니다.")
	@Size(max = 50, message = "제목은 최대 50글자까지 가능합니다.")
	private String title;

	@NotNull(message = "내용은 필수 입력값입니다.")
	@Size(max = 16000, message = "내용은 최대 16000글자까지 가능합니다.")
	private String content;
}
