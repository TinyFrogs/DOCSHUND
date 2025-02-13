package com.ssafy.docshund.domain.supports.entity;

import com.ssafy.docshund.domain.supports.dto.inquiry.AnswerRequestDto;
import com.ssafy.docshund.global.audit.BaseTimeEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;

@Getter
@Entity
@Table(name = "answer")
public class Answer extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "answer_id")
	private Integer answerId;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "inquiry_id", referencedColumnName = "inquiry_id")
	private Inquiry inquiry;  // 문의와 1:1 관계 설정 (inquiry 테이블과 연결)

	@Column(name = "content", nullable = false)
	private String content;  // 답변 내용

	public static Answer createAnswer(AnswerRequestDto answerRequestDto, Inquiry inquiry) {
		Answer answer = new Answer();
		answer.inquiry = inquiry;
		answer.content = answerRequestDto.getContent();

		return answer;
	}
}
