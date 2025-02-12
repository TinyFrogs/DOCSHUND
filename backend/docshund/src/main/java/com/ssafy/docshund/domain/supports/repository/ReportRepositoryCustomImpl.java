package com.ssafy.docshund.domain.supports.repository;

import static com.ssafy.docshund.domain.supports.entity.QReport.report;
import static com.ssafy.docshund.domain.users.entity.QUser.user;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.docshund.domain.supports.dto.report.QReportResponseDto;
import com.ssafy.docshund.domain.supports.dto.report.ReportResponseDto;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ReportRepositoryCustomImpl implements ReportRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	public Page<ReportResponseDto> searchReportUsers(Long userId, Pageable pageable) {
		BooleanBuilder builder = new BooleanBuilder();

		if (userId != null) {
			builder.and(report.reportedUser.eq(userId));
		}

		List<ReportResponseDto> results = queryFactory
			.select(
				new QReportResponseDto(
					report.reportId, user.userId, report.category,
					report.content, report.originContent, report.reportedUser,
					report.reportFile, report.commentId, report.articleId,
					report.transId, report.chatId, report.createdAt
				)
			)
			.from(report)
			.join(user).on(user.userId.eq(report.user.userId))
			.where(builder)
			.orderBy(report.createdAt.desc())
			.offset(pageable.getOffset())
			.limit(pageable.getPageSize())
			.fetch();

		long total = Optional.ofNullable(queryFactory
				.select(report.count())
				.from(report)
				.where(builder)
				.fetchOne())
			.orElse(0L);

		return new PageImpl<>(results, pageable, total);
	}

}
