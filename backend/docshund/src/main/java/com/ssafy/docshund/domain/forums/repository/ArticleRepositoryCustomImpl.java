package com.ssafy.docshund.domain.forums.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.docshund.domain.docs.entity.Position;
import com.ssafy.docshund.domain.docs.entity.QDocument;
import com.ssafy.docshund.domain.forums.dto.ArticleInfoDto;
import com.ssafy.docshund.domain.forums.dto.QArticleInfoDto;
import com.ssafy.docshund.domain.forums.entity.QArticle;
import com.ssafy.docshund.domain.forums.entity.QArticleLike;
import com.ssafy.docshund.domain.forums.entity.QComment;
import com.ssafy.docshund.domain.forums.entity.Status;
import com.ssafy.docshund.domain.users.entity.QUser;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ArticleRepositoryCustomImpl implements ArticleRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	@Override
	public Page<ArticleInfoDto> findAllArticles(String sort, Position filterPosition, String filterDocName,
		String keyword, String searchType, Pageable pageable, Long userId) {

		QArticle article = QArticle.article;
		QArticleLike articleLike = QArticleLike.articleLike;
		QComment comment = QComment.comment;
		QDocument document = QDocument.document;
		QUser user = QUser.user;

		BooleanBuilder builder = new BooleanBuilder();

		if (filterPosition != null) {
			builder.and(document.position.eq(filterPosition));
		}

		if (filterDocName != null && !filterDocName.isEmpty()) {
			builder.and(document.documentName.eq(filterDocName));
		}

		if ((searchType != null && !searchType.isEmpty()) && (keyword != null && !keyword.isEmpty())) {
			if ("title".equals(searchType)) {
				builder.and(article.title.containsIgnoreCase(keyword));
			} else if ("nickname".equals(searchType)) {
				builder.and(article.user.nickname.containsIgnoreCase(keyword));
			}
		}

		OrderSpecifier<?> orderSpecifier = getSortOrder(article, articleLike, sort);

		List<ArticleInfoDto> result = queryFactory
			.select(new QArticleInfoDto(
				article.articleId,
				document.docsId,
				document.position,
				document.documentName,
				article.title,
				article.content,
				article.createdAt,
				article.updatedAt,
				article.viewCount,
				articleLike.alikeId.countDistinct().intValue(),
				comment.commentId.countDistinct().intValue(),
				article.user.userId,
				article.user.nickname,
				article.user.profileImage,
				JPAExpressions
					.selectOne()
					.from(articleLike)
					.where(
						articleLike.article.articleId.eq(article.articleId)
							.and(articleLike.user.userId.eq(userId))
					)
					.exists()
			))
			.from(article)
			.join(document).on(article.document.docsId.eq(document.docsId))
			.join(article.user, user)
			.leftJoin(articleLike).on(article.articleId.eq(articleLike.article.articleId))
			.leftJoin(comment).on(article.articleId.eq(comment.article.articleId))
			.where(builder, article.status.eq(Status.VISIBLE))
			.groupBy(article.articleId, document.docsId, document.position, document.documentName,
				article.title, article.content, article.createdAt, article.updatedAt, article.viewCount,
				article.user.userId, article.user.nickname, article.user.profileImage)
			.orderBy(orderSpecifier)
			.offset(pageable.getOffset())
			.limit(pageable.getPageSize())
			.fetch();

		Long total = Optional.ofNullable(
				queryFactory
					.select(article.count())
					.from(article)
					.join(document).on(article.document.docsId.eq(document.docsId))
					.where(builder, article.status.eq(Status.VISIBLE))
					.fetchOne())
			.orElse(0L);

		return new PageImpl<>(result, pageable, total);
	}

	@Override
	public Page<ArticleInfoDto> findArticlesByAuthorId(Long authorId, Pageable pageable, Long userId) {

		QArticle article = QArticle.article;
		QArticleLike articleLike = QArticleLike.articleLike;
		QComment comment = QComment.comment;
		QDocument document = QDocument.document;
		QUser user = QUser.user;

		List<ArticleInfoDto> result = queryFactory
			.select(new QArticleInfoDto(
				article.articleId,
				document.docsId,
				document.position,
				document.documentName,
				article.title,
				article.content,
				article.createdAt,
				article.updatedAt,
				article.viewCount,
				articleLike.alikeId.countDistinct().intValue(),
				comment.commentId.countDistinct().intValue(),
				article.user.userId,
				article.user.nickname,
				article.user.profileImage,
				JPAExpressions
					.selectOne()
					.from(articleLike)
					.where(
						articleLike.article.articleId.eq(article.articleId)
							.and(articleLike.user.userId.eq(userId))
					)
					.exists()
			))
			.from(article)
			.join(document).on(article.document.docsId.eq(document.docsId))
			.join(article.user, user)
			.leftJoin(articleLike).on(article.articleId.eq(articleLike.article.articleId))
			.leftJoin(comment).on(article.articleId.eq(comment.article.articleId))
			.where(article.user.userId.eq(authorId),
				article.status.eq(Status.VISIBLE))
			.groupBy(article.articleId, document.docsId, document.position, document.documentName,
				article.title, article.content, article.createdAt, article.updatedAt, article.viewCount,
				article.user.userId, article.user.nickname, article.user.profileImage)
			.orderBy(article.createdAt.desc())
			.offset(pageable.getOffset())
			.limit(pageable.getPageSize())
			.fetch();

		Long total = Optional.ofNullable(
				queryFactory
					.select(article.count())
					.from(article)
					.where(article.user.userId.eq(authorId),
						article.status.eq(Status.VISIBLE))
					.fetchOne())
			.orElse(0L);

		return new PageImpl<>(result, pageable, total);
	}

	@Override
	public Page<ArticleInfoDto> findArticlesLikedByUserId(Long userId, Pageable pageable) {

		QArticle article = QArticle.article;
		QArticleLike articleLike = QArticleLike.articleLike;
		QComment comment = QComment.comment;
		QDocument document = QDocument.document;
		QUser user = QUser.user;

		List<ArticleInfoDto> result = queryFactory
			.select(new QArticleInfoDto(
				article.articleId,
				document.docsId,
				document.position,
				document.documentName,
				article.title,
				article.content,
				article.createdAt,
				article.updatedAt,
				article.viewCount,
				articleLike.alikeId.countDistinct().intValue(),
				comment.commentId.countDistinct().intValue(),
				article.user.userId,
				article.user.nickname,
				article.user.profileImage,
				JPAExpressions
					.selectOne()
					.from(articleLike)
					.where(
						articleLike.article.articleId.eq(article.articleId)
							.and(articleLike.user.userId.eq(userId))
					)
					.exists()
			))
			.from(article)
			.join(document).on(article.document.docsId.eq(document.docsId))
			.join(article.user, user)
			.join(articleLike).on(article.articleId.eq(articleLike.article.articleId))
			.leftJoin(comment).on(article.articleId.eq(comment.article.articleId))
			.where(articleLike.user.userId.eq(userId),
				article.status.eq(Status.VISIBLE))
			.groupBy(article.articleId, document.docsId, document.position, document.documentName,
				article.title, article.content, article.createdAt, article.updatedAt, article.viewCount,
				article.user.userId, article.user.nickname, article.user.profileImage)
			.orderBy(article.createdAt.desc())
			.offset(pageable.getOffset())
			.limit(pageable.getPageSize())
			.fetch();

		Long total = Optional.ofNullable(
				queryFactory
					.select(article.count())
					.from(article)
					.join(articleLike).on(article.articleId.eq(articleLike.article.articleId))
					.where(articleLike.user.userId.eq(userId),
						article.status.eq(Status.VISIBLE))
					.fetchOne())
			.orElse(0L);

		return new PageImpl<>(result, pageable, total);
	}

	@Override
	public ArticleInfoDto findArticleById(Integer articleId, Long userId) {

		QArticle article = QArticle.article;
		QArticleLike articleLike = QArticleLike.articleLike;
		QComment comment = QComment.comment;
		QDocument document = QDocument.document;
		QUser user = QUser.user;

		return queryFactory
			.select(new QArticleInfoDto(
				article.articleId,
				document.docsId,
				document.position,
				document.documentName,
				article.title,
				article.content,
				article.createdAt,
				article.updatedAt,
				article.viewCount,
				articleLike.alikeId.countDistinct().intValue(),
				comment.commentId.countDistinct().intValue(),
				article.user.userId,
				article.user.nickname,
				article.user.profileImage,
				articleLike.alikeId.isNotNull()
			))
			.from(article)
			.join(document).on(article.document.docsId.eq(document.docsId))
			.join(article.user, user)
			.leftJoin(articleLike).on(article.articleId.eq(articleLike.article.articleId)
				.and(articleLike.user.userId.eq(userId)))
			.leftJoin(comment).on(article.articleId.eq(comment.article.articleId))
			.where(
				article.articleId.eq(articleId),
				article.status.eq(Status.VISIBLE)
			)
			.groupBy(article.articleId, document.docsId, document.position, document.documentName, article.title,
				article.content,
				article.createdAt, article.updatedAt, article.viewCount,
				article.user.userId, article.user.nickname, article.user.profileImage)
			.fetchOne();
	}

	private OrderSpecifier<?> getSortOrder(QArticle article, QArticleLike articleLike, String sort) {
		if ("likes".equals(sort)) {
			return articleLike.alikeId.countDistinct().desc();
		} else if ("highView".equals(sort)) {
			return article.viewCount.desc();
		} else {
			return article.createdAt.desc();
		}
	}
}
