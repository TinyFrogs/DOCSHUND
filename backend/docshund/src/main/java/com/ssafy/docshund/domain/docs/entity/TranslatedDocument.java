package com.ssafy.docshund.domain.docs.entity;

import com.ssafy.docshund.domain.users.entity.User;
import com.ssafy.docshund.global.audit.BaseTimeEntityWithUpdatedAt;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "translated_document")
@Getter
@NoArgsConstructor
public class TranslatedDocument extends BaseTimeEntityWithUpdatedAt {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "trans_id")
	private Long transId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "origin_id", nullable = false)
	private OriginDocument originDocument;  // 원본 문서와 연결 (origin_document 테이블과 연결)

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;  // 유저 정보 (user 테이블과 연결)

	@Column(name = "content", nullable = false, columnDefinition = "LONGTEXT")
	private String content;  // 유저가 작성한 코드의 마크업 형태로 저장

	@Column(name = "report_count", nullable = false)
	private Integer reportCount;

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false, columnDefinition =
		"ENUM('VISIBLE', 'INVISIBLE', 'DELETED') DEFAULT 'VISIBLE'")
	private Status status;

	// 생성자
	public TranslatedDocument(OriginDocument originDocument, User user, String content, Integer reportCount,
		Status status) {
		this.originDocument = originDocument;
		this.user = user;
		this.content = content;
		this.reportCount = reportCount != null ? reportCount : 0;
		this.status = status != null ? status : Status.VISIBLE;
	}

	public void updateContent(String newContent) {
		this.content = newContent;
	}

}
