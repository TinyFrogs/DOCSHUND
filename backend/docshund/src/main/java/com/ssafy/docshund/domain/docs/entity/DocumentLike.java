package com.ssafy.docshund.domain.docs.entity;

import com.ssafy.docshund.domain.users.entity.User;
import com.ssafy.docshund.global.audit.BaseTimeEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "document_like")
@Getter
@NoArgsConstructor
public class DocumentLike extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "dlike_id")
	private Integer dlikeId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "docs_id", nullable = false)
	private Document document;  // 문서 정보 (document 테이블과 연결)

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;  // 사용자 정보 (user 테이블과 연결)

	public DocumentLike(Document document, User user) {
		this.document = document;
		this.user = user;
	}
}
