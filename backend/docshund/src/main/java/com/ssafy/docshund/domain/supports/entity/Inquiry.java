package com.ssafy.docshund.domain.supports.entity;

import com.ssafy.docshund.domain.supports.dto.inquiry.InquiryRequestDto;
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

@Entity
@Getter
@Table(name = "inquiry")
public class Inquiry extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "inquiry_id")
	private Integer inquiryId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id")
	private User user;  // 문의를 작성한 사용자 (user 테이블과 연결)

	@Column(name = "email", nullable = false)
	private String email;  // 비회원인 경우 이메일로 처리

	@Column(name = "title", nullable = false)
	private String title;  // 문의 제목

	@Enumerated(EnumType.STRING)
	@Column(name = "category", nullable = false)
	private InquiryCategory category;  // 문의 카테고리 (문서 등록 요청, 회원 관련, 신고 관련)

	@Column(name = "content", nullable = false)
	private String content;  // 문의 내용

	@Column(name = "file")
	private String file;  // 첨부 파일 (없을 수도 있음)

	@Column(name = "is_answered", nullable = false)
	private Boolean isAnswered;  // 답변 여부

	public static Inquiry createInquiry(User user, InquiryRequestDto inquiryRequestDto, String imageUrl) {
		Inquiry inquiry = new Inquiry();
		inquiry.user = user;
		inquiry.email = inquiryRequestDto.getEmail();
		inquiry.title = inquiryRequestDto.getTitle();
		inquiry.category = InquiryCategory.valueOf(inquiryRequestDto.getCategory());
		inquiry.content = inquiryRequestDto.getContent();
		inquiry.file = imageUrl;
		inquiry.isAnswered = false;

		return inquiry;
	}

	public void isAnsweredTrue() {
		this.isAnswered = true;
	}
}
