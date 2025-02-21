package com.ssafy.docshund.domain.docs.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.docshund.domain.docs.entity.TranslatedDocument;
import com.ssafy.docshund.domain.docs.entity.TranslatedDocumentLike;
import com.ssafy.docshund.domain.users.entity.User;

public interface TranslatedDocumentLikeRepository extends
	JpaRepository<TranslatedDocumentLike, Integer> {

	// 특정 유저가 번역문서에 좋아요 했는지 여부 확인
	boolean existsByTranslatedDocument_TransIdAndUser_UserId(Long transId,
		Long currentUserId);

	// 특정 번역 문서(단일 transId)의 좋아요한 유저 목록 조회
	@Query("SELECT tl.user.userId FROM TranslatedDocumentLike tl WHERE tl.translatedDocument.transId = :transId")
	List<Long> findLikedUserIdsByTransId(@Param("transId") Long transId);

	// 여러 번역 문서(transIds)의 좋아요한 유저 목록 한 번에 조회 (N+1 문제 해결)
	@Query("SELECT tl.translatedDocument.transId, tl.user.userId FROM TranslatedDocumentLike tl "
		+ "WHERE tl.translatedDocument.transId IN :transIds")
	List<Object[]> findLikedUserIdsByDocumentIds(@Param("transIds") List<Long> transIds);

	// 유저의 번역문서 좋아요 취소
	void deleteByTranslatedDocument_TransIdAndUser_UserId(Long transId,
		Long currentUserId);

	// 번역문서 좋아요 추가
	default void addVote(TranslatedDocument translatedDocument, User user) {
		save(new TranslatedDocumentLike(translatedDocument, user));
	}

	// 특정 유저가 좋아요한 번역 문서 전체 조회
	@Query("SELECT tl.translatedDocument FROM TranslatedDocumentLike tl "
		+ "JOIN FETCH tl.translatedDocument.originDocument "
		+ "JOIN FETCH tl.translatedDocument.user "
		+ "WHERE tl.user.userId = :userId AND tl.translatedDocument.status = 'VISIBLE'")
	List<TranslatedDocument> findLikedTranslatedDocsByUserId(@Param("userId") Long userId);
}
