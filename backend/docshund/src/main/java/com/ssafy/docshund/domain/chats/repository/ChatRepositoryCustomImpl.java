package com.ssafy.docshund.domain.chats.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.docshund.domain.chats.dto.ChatInfoDto;
import com.ssafy.docshund.domain.chats.dto.QChatInfoDto;
import com.ssafy.docshund.domain.chats.entity.QChat;
import com.ssafy.docshund.domain.chats.entity.Status;
import com.ssafy.docshund.domain.docs.entity.QDocument;
import com.ssafy.docshund.domain.users.entity.QUser;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ChatRepositoryCustomImpl implements ChatRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	@Override
	public Page<ChatInfoDto> findAllByDocsId(Integer docsId, Pageable pageable) {

		QChat chat = QChat.chat;
		QUser user = QUser.user;
		QDocument document = QDocument.document;

		List<ChatInfoDto> result = queryFactory
			.select(new QChatInfoDto(
				chat.document.docsId,
				chat.chatId,
				chat.content,
				chat.user.userId,
				chat.user.nickname,
				chat.user.profileImage
			))
			.from(chat)
			.join(document).on(chat.document.docsId.eq(document.docsId))
			.join(user).on(chat.user.userId.eq(user.userId))
			.where(chat.document.docsId.eq(docsId),
				chat.status.eq(Status.VISIBLE))
			.orderBy(chat.createdAt.desc())
			.offset(pageable.getOffset())
			.limit(pageable.getPageSize())
			.fetch();

		Long total = Optional.ofNullable(
				queryFactory
					.select(chat.count())
					.from(chat)
					.where(chat.document.docsId.eq(docsId))
					.fetchOne())
			.orElse(0L);

		return new PageImpl<>(result, pageable, total);
	}
}
