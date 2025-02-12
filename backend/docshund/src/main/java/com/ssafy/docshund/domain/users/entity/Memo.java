package com.ssafy.docshund.domain.users.entity;

import com.ssafy.docshund.global.audit.BaseTimeEntityWithUpdatedAt;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "memo")
@Getter
@NoArgsConstructor
public class Memo extends BaseTimeEntityWithUpdatedAt {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "memo_id")
	private Integer memoId;

	@ManyToOne
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@Column(name = "title", nullable = false, length = 200)
	private String title;

	@Column(name = "content", nullable = false, columnDefinition = "TEXT")
	private String content;

	public Memo(User user, String title, String content) {
		this.user = user;
		this.title = title;
		this.content = content;
	}

	public void modifyMemo(String title, String content) {
		this.title = title;
		this.content = content;
	}
}
