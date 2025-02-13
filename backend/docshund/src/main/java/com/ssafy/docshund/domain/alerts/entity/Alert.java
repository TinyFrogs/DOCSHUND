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

@Entity
@Table(name = "alert")
public class Alert extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "alert_id")
	private Integer alertId;

	@Column(name = "title", nullable = false, length = 30)
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

	@Column(name = "checked_at")
	private LocalDateTime checkedAt;

}
