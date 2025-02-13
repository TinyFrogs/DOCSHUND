package com.ssafy.docshund.domain.docs.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.docshund.domain.docs.dto.DocumentDto;
import com.ssafy.docshund.domain.docs.dto.OriginDocumentDto;
import com.ssafy.docshund.domain.docs.dto.TranslatedDocumentDto;
import com.ssafy.docshund.domain.users.entity.User;

@Service
public interface DocsService {
	// 문서 전체 목록 불러오기
	List<DocumentDto> getAllDocuments(String sort, String order);

	// 특정 문서 정보 불러오기
	DocumentDto getDocumentDetail(Integer docsId);

	// 문서 생성하기
	DocumentDto createDocument(DocumentDto documentdto, User user);

	// 원본 조회하기
	List<OriginDocumentDto> getAllOriginDocuments(Integer docsId);

	// 특정 단락 원본 조회하기
	OriginDocumentDto getOriginDocumentDetail(Integer originId);

	// 원본 생성하기
	List<OriginDocumentDto> createOriginDocuments(Integer docsId, String content, User user);

	// 관심문서 등록/취소
	DocumentDto toggleLikes(Integer docsId, User user);

	// 특정 유저 관심 문서 조회
	List<DocumentDto> getLikesDocument(Long userId);

	// 특정 문서 번역문 전체 조회
	List<TranslatedDocumentDto> getAllTranslatedDocuments(Integer docsId);

	// 특정 문서 베스트 번역 조회
	List<TranslatedDocumentDto> getBestTranslatedDocuments(Integer docsId);

	// 특정 문단에 대한 번역본 전체 조회
	List<TranslatedDocumentDto> getTranslatedDocuments(Integer docsId, Integer originId, String sort, String order);

	// 번역 작성하기
	TranslatedDocumentDto createTranslatedDocument(Integer docsId, Integer originId, User user, String content);

	// 특정 유저의 번역본 조회
	List<TranslatedDocumentDto> getUserTransDocument(Long userId);

	// 번역 상세보기
	TranslatedDocumentDto getTranslatedDocumentDetail(Integer docsId, Integer transId);

	// 번역 수정하기
	TranslatedDocumentDto updateTranslatedDocument(Integer docsId, Integer transId, User user, String content);

	// 번역 삭제하기
	void deleteTranslatedDocument(Integer docsId, Integer transId, User user);

	// 번역 투표 / 투표해제
	boolean toggleVotes(Integer docsId, Integer transId, User user);

	// 유저가 좋아한 번역본 목록 조회
	List<TranslatedDocumentDto> getUserLikedTrans(Long userId);
}
