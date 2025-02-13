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
@Table(name = "translated_document_like")
@Getter
@NoArgsConstructor
public class TranslatedDocumentLike extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "tlike_id")
	private Integer tlikeId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "trans_id", nullable = false)
	private TranslatedDocument translatedDocument;  // 번역된 문서와 연결 (translated_document 테이블과 연결)

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;  // 유저 정보 (user 테이블과 연결)

	public TranslatedDocumentLike(TranslatedDocument translatedDocument, User user) {
		this.translatedDocument = translatedDocument;
		this.user = user;
	}
}
