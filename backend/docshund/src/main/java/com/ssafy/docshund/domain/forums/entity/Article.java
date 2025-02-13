package com.ssafy.docshund.domain.forums.entity;

import com.ssafy.docshund.domain.docs.entity.Document;
import com.ssafy.docshund.domain.users.entity.User;
import com.ssafy.docshund.global.audit.BaseTimeEntityWithUpdatedAt;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "article")
@Getter
@NoArgsConstructor
public class Article extends BaseTimeEntityWithUpdatedAt {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "article_id")
	private Integer articleId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;  // 유저 정보 (user 테이블과 연결)

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "docs_id", nullable = false)
	private Document document;  // 문서 정보 (document 테이블과 연결)

	@Column(name = "title", nullable = false, length = 50)
	private String title;  // 게시글 제목

	@Column(name = "content", nullable = false, columnDefinition = "TEXT")
	private String content;  // 게시글 내용

	@Column(name = "view_cnt", nullable = false)
	private Integer viewCount;  // 조회수

	@Column(name = "report_cnt", nullable = false)
	private Integer reportCount;  // 신고 횟수

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false, columnDefinition = "ENUM('VISIBLE', 'INVISIBLE', 'DELETED') DEFAULT 'VISIBLE'")
	private Status status;  // 게시글 상태

	public Article(User user, Document document, String title, String content) {
		this.user = user;
		this.document = document;
		this.title = title;
		this.content = content;
		this.viewCount = 0;
		this.reportCount = 0;
		this.status = Status.VISIBLE;
	}

	public void modifyTitle(String title) {
		this.title = title;
	}

	public void modifyContent(String content) {
		this.content = content;
	}

	public void modifyDocument(Document document) {
		this.document = document;
	}

	public void modifyToDelete() {
		this.status = Status.DELETED;
	}

	public void modifyToInvisible() {
		this.status = Status.INVISIBLE;
	}
}
