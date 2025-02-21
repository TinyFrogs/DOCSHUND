package com.ssafy.docshund.domain.docs.repository;

import static com.ssafy.docshund.domain.docs.entity.QDocument.document;
import static com.ssafy.docshund.domain.docs.entity.QDocumentLike.documentLike;
import static com.ssafy.docshund.domain.docs.entity.QOriginDocument.originDocument;
import static com.ssafy.docshund.domain.docs.entity.QTranslatedDocument.translatedDocument;
import static com.ssafy.docshund.domain.docs.entity.QTranslatedDocumentLike.translatedDocumentLike;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.docshund.domain.docs.dto.TranslatedDocumentDto;
import com.ssafy.docshund.domain.docs.entity.Document;
import com.ssafy.docshund.domain.docs.entity.Status;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Repository
public class CustomDocumentRepositoryImpl implements CustomDocumentRepository {

	@PersistenceContext
	private EntityManager entityManager;
	private final JPAQueryFactory queryFactory;

	public CustomDocumentRepositoryImpl(EntityManager entityManager) {
		this.entityManager = entityManager;
		this.queryFactory = new JPAQueryFactory(entityManager);
	}

	// 특정 유저의 관심 문서 조회
	@Override
	public List<Document> findLikedDocumentByUserId(Long userId) {
		return queryFactory
			.select(document)
			.from(documentLike)
			.join(documentLike.document, document)
			.where(documentLike.user.userId.eq(userId))
			.fetch();
	}

	// 특정 문서 내에서 각 originId별 좋아요가 가장 많은 번역문 가져오기 (pOrder순 정렬)
	@Override
	public List<TranslatedDocumentDto> findBestTrans(Integer docsId) {
		// 각 originId별 좋아요 개수가 가장 많은 transId 찾기
		Map<Integer, Long> bestTransIdMap = queryFactory
			.select(originDocument.originId, translatedDocument.transId)
			.from(translatedDocument)
			.leftJoin(translatedDocumentLike)
			.on(translatedDocument.transId.eq(translatedDocumentLike.translatedDocument.transId))
			.join(translatedDocument.originDocument, originDocument)
			.where(originDocument.document.docsId.eq(docsId).and(translatedDocument.status.eq(Status.VISIBLE)))
			.groupBy(originDocument.originId, translatedDocument.transId)
			.orderBy(originDocument.originId.asc(), translatedDocumentLike.translatedDocument.transId.count().desc(),
				translatedDocument.createdAt.desc())
			.fetch()
			.stream()
			.filter(tuple -> tuple.get(translatedDocument.transId) != null)
			.collect(Collectors.toMap(
				tuple -> tuple.get(originDocument.originId),
				tuple -> Optional.ofNullable(tuple.get(translatedDocument.transId)).orElse(0L),
				(existing, replacement) -> existing // 같은 originId에 대해 첫 번째 transId만 유지
			));

		// 가장 좋아요가 많은 transId 목록 가져오기
		List<Long> bestTransIds = bestTransIdMap.values().stream()
			.filter(transId -> transId != 0L)
			.toList();

		// transId 기준으로 번역문 가져와서 pOrder 기준 정렬
		return queryFactory
			.selectFrom(translatedDocument)
			.where(translatedDocument.transId.in(bestTransIds)
				.and(translatedDocument.status.eq(Status.VISIBLE)))
			.orderBy(translatedDocument.originDocument.pOrder.asc())
			.fetch()
			.stream()
			.map(transDoc -> new TranslatedDocumentDto(
				transDoc.getTransId(),
				transDoc.getOriginDocument().getOriginId(),
				transDoc.getUser().getUserId(),
				transDoc.getContent(),
				transDoc.getReportCount(),
				transDoc.getStatus(),
				transDoc.getCreatedAt(),
				transDoc.getUpdatedAt(),
				0, // 좋아요 개수 Service에서 처리
				List.of() // 좋아요한 유저 목록 Service에서 처리
			))
			.toList();
	}

	// 특정 문단(originId)의 번역 전체 조회 (정렬 포함)
	@Override
	public List<TranslatedDocumentDto> findTranslatedDocs(Integer docsId, Integer originId, String sort, String order) {
		// 좋아요 개수 계산
		NumberExpression<Long> likeCount = translatedDocumentLike.translatedDocument.transId.count();

		// 정렬 조건 설정 (기본값: 좋아요 순 & 내림차순)
		OrderSpecifier<?> sortOrder;
		if ("newest".equalsIgnoreCase(sort)) {
			sortOrder = "asc".equalsIgnoreCase(order) ? translatedDocument.createdAt.asc() :
				translatedDocument.createdAt.desc();
		} else {
			sortOrder = "asc".equalsIgnoreCase(order) ? likeCount.asc() : likeCount.desc();
		}

		return queryFactory
			.selectFrom(translatedDocument)
			.leftJoin(translatedDocumentLike)
			.on(translatedDocument.transId.eq(translatedDocumentLike.translatedDocument.transId))
			.join(translatedDocument.originDocument, originDocument)
			.where(originDocument.document.docsId.eq(docsId)
				.and(originDocument.originId.eq(originId))
				.and(translatedDocument.status.eq(Status.VISIBLE)))
			.groupBy(translatedDocument.transId)
			.orderBy(sortOrder)
			.fetch()
			.stream()
			.map(transDoc -> new TranslatedDocumentDto(
				transDoc.getTransId(),
				transDoc.getOriginDocument().getOriginId(),
				transDoc.getUser().getUserId(),
				transDoc.getContent(),
				transDoc.getReportCount(),
				transDoc.getStatus(),
				transDoc.getCreatedAt(),
				transDoc.getUpdatedAt(),
				0, // 좋아요 개수는 Service에서 처리
				List.of() // 좋아요한 유저 목록은 Service에서 처리
			))
			.toList();
	}
}
