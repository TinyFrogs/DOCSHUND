package com.ssafy.docshund.domain.supports.dto.notice;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class NoticeRequestDto {

	private String title;
	private String content;
}
