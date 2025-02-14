package com.ssafy.docshund.domain.supports.dto.inquiry;

import com.ssafy.docshund.domain.supports.entity.InquiryCategory;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class InquiryRequestDto {

	@Email(message = "올바른 이메일 형식이 아닙니다.")
	@NotBlank(message = "이메일은 필수 입력 값입니다.")
	@Size(max = 80, message = "이메일은 80자를 넘을 수 없습니다.")
	@Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", message = "이메일에 한글을 포함할 수 없습니다.")
	private String email;

	@NotNull(message = "제목은 필수 입력 값입니다.")
	@Size(max = 50, message = "제목은 50자를 넘을 수 없습니다.")
	private String title;

	@NotBlank
	private String category;

	@NotNull(message = "내용은 필수 입력 값입니다.")
	@Size(max = 2000, message = "내용은 2000자를 넘을 수 없습니다.")
	private String content;

	public void emailTextGenerator() {
		this.title = title + " 문의 내용 전송 드립니다.";
		this.content = "<h1>문의 종류 : " + InquiryCategory.valueOf(category).getDescription() + "</h1>\n"
			+ content
			+ "\n\n<b>빠른 시일 내에 답변해드리겠습니다.</b>\n";
	}

}
