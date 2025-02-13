package com.ssafy.docshund.domain.users.entity;

import com.ssafy.docshund.global.audit.BaseTimeEntityWithUpdatedAt;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "memo")
public class Memo extends BaseTimeEntityWithUpdatedAt {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "memo_id")
	private Integer memoId;

	@ManyToOne
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@Column(name = "title", nullable = false)
	private String title;

	@Column(name = "content", nullable = false)
	private String content;

}
