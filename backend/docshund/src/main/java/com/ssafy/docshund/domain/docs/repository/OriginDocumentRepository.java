package com.ssafy.docshund.domain.docs.repository;

import com.ssafy.docshund.domain.docs.entity.OriginDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OriginDocumentRepository extends JpaRepository<OriginDocument, Integer> {

	// 특정 문서의 원본 조회 (전체)
	List<OriginDocument> findByDocument_DocsId(Integer docsId);

	// 특정 문서의 특정 단락 원본 조회
	Optional<OriginDocument> findByOriginId(Integer originId);
	
	// 특정 문서에 원본이 존재하는지 여부
	boolean existsByDocument_DocsId(Integer docsId);
}
