package com.ssafy.docshund.domain.docs.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.ssafy.docshund.domain.docs.entity.Status;
import com.ssafy.docshund.domain.docs.entity.TranslatedDocument;

public record UserTransDocumentDto(
	Long transId,
	Integer originId,
	Integer docsId,
	String documentName,
	Integer pOrder,
	Long userId,
	String content,
	Integer reportCount,
	Status status,
	LocalDateTime createdAt,
	LocalDateTime updatedAt,
	Integer likeCount,
	List<Long> likeUserIds
) {
	public static UserTransDocumentDto fromEntity(TranslatedDocument translatedDocument,
		Integer likeCount, List<Long> likeUserIds) {
		return new UserTransDocumentDto(
			translatedDocument.getTransId(),
			translatedDocument.getOriginDocument().getOriginId(),
			translatedDocument.getOriginDocument().getDocument().getDocsId(),
			translatedDocument.getOriginDocument().getDocument().getDocumentName(),
			translatedDocument.getOriginDocument().getPOrder(),
			translatedDocument.getUser().getUserId(),
			translatedDocument.getContent(),
			translatedDocument.getReportCount(),
			translatedDocument.getStatus(),
			translatedDocument.getCreatedAt(),
			translatedDocument.getUpdatedAt(),
			likeCount,
			likeUserIds
		);
	}

	// 좋아요한 사용자 ID 추가
	public UserTransDocumentDto withLikeUserIds(List<Long> likeUserIds) {
		return new UserTransDocumentDto(
			this.transId, this.originId, this.docsId, this.documentName, this.pOrder, this.userId, this.content,
			this.reportCount, this.status, this.createdAt, this.updatedAt, likeUserIds.size(), likeUserIds
		);
	}
}
