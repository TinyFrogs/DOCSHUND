package com.ssafy.docshund.domain.alerts.entity;

import java.time.LocalDateTime;

import com.ssafy.docshund.domain.docs.entity.TranslatedDocument;
import com.ssafy.docshund.domain.forums.entity.Article;
import com.ssafy.docshund.domain.forums.entity.Comment;
import com.ssafy.docshund.domain.supports.entity.Inquiry;
import com.ssafy.docshund.domain.users.entity.User;
import com.ssafy.docshund.global.audit.BaseTimeEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "alert")
@Getter
@NoArgsConstructor
public class Alert extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "alert_id")
	private Integer alertId;

	@Column(name = "title", nullable = false, length = 100)
	private String title;

	@ManyToOne
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@ManyToOne
	@JoinColumn(name = "trans_id")
	private TranslatedDocument translatedDocument;

	@ManyToOne
	@JoinColumn(name = "article_id")
	private Article article;

	@ManyToOne
	@JoinColumn(name = "comment_id")
	private Comment comment;

	@ManyToOne
	@JoinColumn(name = "inquiry_id")
	private Inquiry inquiry;

	@Setter
	@Column(name = "checked_at")
	private LocalDateTime checkedAt;

	public Alert(String title, User user, TranslatedDocument translatedDocument, Article article, Comment comment,
		Inquiry inquiry, LocalDateTime checkedAt) {
		this.title = title;
		this.user = user;
		this.translatedDocument = translatedDocument;
		this.article = article;
		this.comment = comment;
		this.inquiry = inquiry;
		this.checkedAt = checkedAt;
	}
}


