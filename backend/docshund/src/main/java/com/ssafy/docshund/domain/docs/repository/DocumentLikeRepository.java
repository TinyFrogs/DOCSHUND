package com.ssafy.docshund.domain.docs.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ssafy.docshund.domain.docs.entity.DocumentLike;

@Repository
public interface DocumentLikeRepository extends JpaRepository<DocumentLike, Integer> {

	// 특정 유저와 문서의 좋아요 여부 확인
	boolean existsByDocument_DocsIdAndUser_UserId(Integer docsId, Long userId);

	// 특정 문서의 좋아요 개수 조회
	int countByDocument_DocsId(Integer docsId);

	// 특정 유저와 문서의 좋아요 제거
	void deleteByDocument_DocsIdAndUser_UserId(Integer docsId, Long userId);

	// 특정 문서를 좋아요한 사용자 ID 단일 조회
	@Query("SELECT dl.user.userId FROM DocumentLike dl WHERE dl.document.docsId = :docsId")
	List<Long> findLikedUserIdsByDocumentId(@Param("docsId") Integer docsId);

	// 특정 문서를 좋아요한 사용자 ID 리스트 조회
	@Query("SELECT dl.document.docsId, dl.user.userId FROM DocumentLike dl WHERE dl.document.docsId IN :docsIds")
	List<Object[]> findLikedUserIdsByDocumentIds(@Param("docsIds") List<Integer> docsIds);

}
