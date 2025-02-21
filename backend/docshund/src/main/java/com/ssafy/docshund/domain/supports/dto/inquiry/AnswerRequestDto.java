package com.ssafy.docshund.domain.supports.dto.inquiry;

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
public class AnswerRequestDto {

	@NotNull(message = "내용은 필수 입력 값입니다.")
	@Size(max = 2000, message = "내용은 2000자를 넘을 수 없습니다.")
	String content;
}
