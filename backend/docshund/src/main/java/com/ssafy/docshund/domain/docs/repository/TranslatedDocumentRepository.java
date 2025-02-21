package com.ssafy.docshund.domain.docs.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.docshund.domain.docs.entity.Status;
import com.ssafy.docshund.domain.docs.entity.TranslatedDocument;

public interface TranslatedDocumentRepository extends JpaRepository<TranslatedDocument, Long> {

	// 특정 원본 문서(docsId)에 속한 번역 문서 조회
	List<TranslatedDocument> findByOriginDocument_Document_DocsIdAndStatus(Integer docsId, Status status);

	// 특정 유저의 번역문서 조회
	List<TranslatedDocument> findByUser_UserIdAndStatus(Long userId, Status status);
}
