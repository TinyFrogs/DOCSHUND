package com.ssafy.docshund.domain.docs.entity;

import com.ssafy.docshund.global.audit.BaseTimeEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "document")
@Getter
@NoArgsConstructor
public class Document extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "docs_id")
	private Integer docsId;

	@Column(name = "document_category", nullable = false, length = 120)
	private String documentCategory;

	@Column(name = "document_name", nullable = false, length = 120)
	private String documentName;

	@Column(name = "license", nullable = false, length = 80)
	private String license;

	@Column(name = "document_link", nullable = false)
	private String documentLink;

	@Column(name = "view_count", nullable = false, columnDefinition = "INT DEFAULT 0")
	private Integer viewCount;

	@Column(name = "document_version", nullable = false, length = 80)
	private String documentVersion;

	@Column(name = "document_logo")
	private String documentLogo;

	@Enumerated(EnumType.STRING)
	@Column(name = "position")
	private Position position;

	// 명시적인 생성자 추가
	public Document(String documentCategory, String documentName, String documentLogo,
		String documentVersion, Integer viewCount, Position position,
		String license, String documentLink) {
		this.documentCategory = documentCategory;
		this.documentName = documentName;
		this.documentLogo = documentLogo;
		this.documentVersion = documentVersion;
		this.viewCount = viewCount;
		this.position = position;
		this.license = license;
		this.documentLink = documentLink;
	}

	public void increaseViewCount() {
		this.viewCount++;
	}

}
