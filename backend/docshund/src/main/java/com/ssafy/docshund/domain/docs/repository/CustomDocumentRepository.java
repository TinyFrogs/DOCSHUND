package com.ssafy.docshund.domain.docs.repository;

import java.util.List;

import com.ssafy.docshund.domain.docs.dto.TranslatedDocumentDto;
import com.ssafy.docshund.domain.docs.entity.Document;

public interface CustomDocumentRepository {

	// 특정 유저의 관심문서 조회
	List<Document> findLikedDocumentByUserId(Long userId);

	// 베스트 번역본 조회
	List<TranslatedDocumentDto> findBestTrans(Integer docsId);

	// 특정 문단에 대한 번역본 전체 조회
	List<TranslatedDocumentDto> findTranslatedDocs(Integer docsId, Integer originId, String sort, String order);

}
