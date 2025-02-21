package com.ssafy.docshund.domain.forums.entity;

import java.util.ArrayList;
import java.util.List;

import com.ssafy.docshund.domain.users.entity.User;
import com.ssafy.docshund.global.audit.BaseTimeEntityWithUpdatedAt;

import jakarta.persistence.CascadeType;
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
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "comment")
@Getter
@NoArgsConstructor
public class Comment extends BaseTimeEntityWithUpdatedAt {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "comment_id")
	private Integer commentId;

	@OneToMany(mappedBy = "parentComment", cascade = CascadeType.ALL)
	private List<Comment> replies = new ArrayList<>(); // 자식 댓글

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "parent_id")
	private Comment parentComment;  // 부모 댓글 (자식 댓글을 위한 self-reference)

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;  // 댓글 작성자 (user 테이블과 연결)

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "article_id", nullable = false)
	private Article article;  // 댓글이 달린 게시글 (article 테이블과 연결)

	@Column(name = "content", nullable = false, columnDefinition = "TEXT")
	private String content;  // 댓글 내용

	@Column(name = "report_cnt", nullable = false)
	private Integer reportCount;  // 신고 횟수

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false, columnDefinition = "ENUM('VISIBLE', 'INVISIBLE', 'DELETED') DEFAULT 'VISIBLE'")
	private Status status;

	public Comment(Comment parentComment, User user, Article article, String content) {
		this.parentComment = parentComment;
		this.user = user;
		this.article = article;
		this.content = content;
		this.reportCount = 0;
		this.status = Status.VISIBLE;

		if (parentComment != null) {
			parentComment.getReplies().add(this);
		}
	}

	public void modifyContent(String content) {
		this.content = content;
	}

	public void modifyToDelete() {
		this.status = Status.DELETED;
	}

	public void modifyToInvisible() {
		this.status = Status.INVISIBLE;
	}

	public void increaseReportCount() {
		this.reportCount++;
	}

	public void decreaseReportCount() {
		this.reportCount--;
	}

	public void modifyStatus(Status status) {
		this.status = status;
	}

	public void resetReportCount() {
		this.reportCount = 0;
		this.status = Status.VISIBLE;
	}
}
