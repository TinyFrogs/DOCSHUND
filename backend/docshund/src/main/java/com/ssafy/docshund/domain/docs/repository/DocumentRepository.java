package com.ssafy.docshund.domain.docs.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.docshund.domain.docs.entity.Document;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Integer> {

	Document findByDocsId(Integer docsId);

	Optional<Document> findByDocumentName(String documentName);


}
