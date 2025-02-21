package com.ssafy.docshund.domain.chats.entity;

import com.ssafy.docshund.domain.docs.entity.Document;
import com.ssafy.docshund.domain.users.entity.User;
import com.ssafy.docshund.global.audit.BaseTimeEntity;

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
@Table(name = "chat")
@Getter
@NoArgsConstructor
public class Chat extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "chat_id")
	private Long chatId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "document_id", nullable = false)
	private Document document;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@Column(name = "content", nullable = false, columnDefinition = "TEXT")
	private String content;

	@Column(name = "report_cnt", nullable = false)
	private Integer reportCount;

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false, columnDefinition = "ENUM('VISIBLE', 'INVISIBLE') DEFAULT 'VISIBLE'")
	private Status status;

	public Chat(Document document, User user, String content) {
		this.document = document;
		this.user = user;
		this.content = content;
		this.reportCount = 0;
		this.status = Status.VISIBLE;
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
