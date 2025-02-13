package com.ssafy.docshund.domain.users.repository;

import static com.ssafy.docshund.domain.users.entity.QUser.user;
import static com.ssafy.docshund.domain.users.entity.QUserInfo.userInfo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.docshund.domain.users.dto.page.QUserAndInfoDto;
import com.ssafy.docshund.domain.users.dto.page.QUserProfileDto;
import com.ssafy.docshund.domain.users.dto.page.UserAndInfoDto;
import com.ssafy.docshund.domain.users.dto.page.UserProfileDto;
import com.ssafy.docshund.domain.users.dto.page.UserSearchCondition;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class UserRepositoryCustomImpl implements UserRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	@Override
	public Page<UserAndInfoDto> searchUsers(UserSearchCondition condition, Pageable pageable) {
		BooleanBuilder builder = new BooleanBuilder();

		if (condition.getNickname() != null) {
			builder.and(user.nickname.containsIgnoreCase(condition.getNickname()));
		}
		if (condition.getEmail() != null) {
			builder.and(user.email.containsIgnoreCase(condition.getEmail()));
		}
		if (condition.getCategory() != null) {
			builder.and(userInfo.hobby.eq(condition.getCategory()));
		}

		List<UserAndInfoDto> results = queryFactory
			.select(
				new QUserAndInfoDto(
					user.userId, user.email, user.profileImage, user.nickname,
					user.role, user.provider, user.personalId, user.status,
					user.lastLogin, user.createdAt, user.updatedAt,
					userInfo.userInfoId, userInfo.isDarkmode, userInfo.hobby,
					userInfo.introduce, userInfo.reportCount
				)
			)
			.from(user)
			.join(userInfo).on(user.userId.eq(userInfo.user.userId))
			.where(builder)
			.orderBy(userInfo.reportCount.desc())
			.offset(pageable.getOffset())
			.limit(pageable.getPageSize())
			.fetch();

		long total = Optional.ofNullable(queryFactory
				.select(user.count())
				.from(user)
				.join(userInfo).on(user.userId.eq(userInfo.user.userId))
				.where(builder)
				.fetchOne())
			.orElse(0L);

		return new PageImpl<>(results, pageable, total);
	}

	@Override
	public UserProfileDto getProfileUser(Long userId) {
		return queryFactory
			.select(
				new QUserProfileDto(
					user.userId, user.email, user.profileImage, user.nickname,
					user.lastLogin, user.createdAt, user.updatedAt,
					userInfo.hobby, userInfo.introduce, userInfo.isDarkmode
				)
			)
			.from(user)
			.join(userInfo).on(user.userId.eq(userInfo.user.userId))
			.where(user.userId.eq(userId))
			.fetchOne();
	}
}
