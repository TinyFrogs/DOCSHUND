package com.ssafy.docshund.domain.supports.repository;

import static com.ssafy.docshund.domain.supports.entity.QAnswer.answer;
import static com.ssafy.docshund.domain.supports.entity.QInquiry.inquiry;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.docshund.domain.supports.dto.inquiry.page.InquiryAndAnswerDto;
import com.ssafy.docshund.domain.supports.dto.inquiry.page.QInquiryAndAnswerDto;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class InquiryRepositoryCustomImpl implements InquiryRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	@Override
	public Page<InquiryAndAnswerDto> searchInquiryAndAnswer(Long userId, Pageable pageable) {
		BooleanBuilder builder = new BooleanBuilder();

		if (userId != null) {
			builder.and(inquiry.user.userId.eq(userId));
		}

		List<InquiryAndAnswerDto> result = queryFactory
			.select(
				new QInquiryAndAnswerDto(
					inquiry.user.userId, inquiry.inquiryId, inquiry.title, inquiry.content,
					inquiry.email, inquiry.createdAt, inquiry.category,
					inquiry.file, answer.createdAt, inquiry.isAnswered, answer.content
				)
			)
			.from(inquiry)
			.leftJoin(answer).on(inquiry.inquiryId.eq(answer.inquiry.inquiryId))
			.where(builder)
			.offset(pageable.getOffset())
			.limit(pageable.getPageSize())
			.fetch();

		return new PageImpl<>(result, pageable, 0);
	}
}
