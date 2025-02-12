package com.ssafy.docshund.domain.docs.dto;

import com.ssafy.docshund.domain.docs.entity.Document;
import com.ssafy.docshund.domain.docs.entity.Position;
import com.ssafy.docshund.global.validation.ValidEnum;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;

public record DocumentDto(
	Integer docsId,
	@NotBlank(message = "문서 대분류는 비워두거나 공백일 수 없습니다.") @Size(max = 30, message = "문서 대분류는 30자 이내로 작성해야합니다.")
	String documentCategory,
	@NotBlank(message = "문서명은 비워두거나 공백일 수 없습니다.") @Size(max = 30, message = "문서명은 30자 이내로 작성해야합니다.")
	String documentName,
	String documentLogo,
	@NotNull @Size(max = 20, message = "문서 버전은 20자 이내로 작성해야합니다.")
	String documentVersion,
	@Min(0)
	Integer viewCount,
	Integer likeCount,  // Join을 통해 받아올 예정
	@NotNull(message = "position은 비워둘 수 없습니다.") @ValidEnum(enumClass = Position.class, message = "position은 'FRONTEND', 'BACKEND', 'DBSQL' 중 하나여야합니다.")
	Position position,
	@NotBlank(message = "라이센스는 비워두거나 공백일 수 없습니다.") @Size(max = 20, message = "라이센스는 20자 이내로 작성해야합니다.")
	String license,
	@NotNull
	String documentLink,
	LocalDateTime createdAt,
	List<Long> likeUserIds) {

	// 문서 조회용
	public static DocumentDto fromEntity(Document document, int likeCount, List<Long> likeUserIds) {
		return new DocumentDto(
			document.getDocsId(),
			document.getDocumentCategory(),
			document.getDocumentName(),
			document.getDocumentLogo(),
			document.getDocumentVersion(),
			document.getViewCount(),
			likeCount, // likeCount 기본값 0
			document.getPosition(),
			document.getLicense(),
			document.getDocumentLink(),
			document.getCreatedAt(),
			likeUserIds
		);
	}
}
