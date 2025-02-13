package com.ssafy.docshund.domain.forums.entity;

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

@Entity
@Table(name = "article_like")
public class ArticleLike extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "alike_id")
	private Integer alikeId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "article_id", nullable = false)
	private Article article;  // 게시글 정보 (article 테이블과 연결)

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;  // 유저 정보 (user 테이블과 연결)

}
