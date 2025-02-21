package com.ssafy.docshund.domain.users.dto.memo;

import com.querydsl.core.annotations.QueryProjection;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class MemoRequestDto {
	private Integer memoId;
	private Long userId;
	@NotNull(message = "제목은 비워둘 수 없습니다.") @Size(max = 50, message = "제목은 50자 이내로 작성해야합니다.")
	private String title;
	@NotNull(message = "내용은 비워둘 수 없습니다.") @Size(max = 15000, message = "내용은 15000자 이내로 작성해야합니다.")
	private String content;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

	@QueryProjection
	public MemoRequestDto(Integer memoId, Long userId, String title, String content, LocalDateTime createdAt,
		LocalDateTime updatedAt) {
		this.memoId = memoId;
		this.userId = userId;
		this.title = title;
		this.content = content;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}
}
