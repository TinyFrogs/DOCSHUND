package com.ssafy.docshund.domain.forums.service;

import static com.ssafy.docshund.global.exception.GlobalErrorCode.RESOURCE_NOT_FOUND;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.docshund.domain.alerts.service.AlertsService;
import com.ssafy.docshund.domain.docs.entity.Document;
import com.ssafy.docshund.domain.docs.entity.Position;
import com.ssafy.docshund.domain.docs.repository.DocumentRepository;
import com.ssafy.docshund.domain.forums.dto.ArticleDto;
import com.ssafy.docshund.domain.forums.dto.ArticleInfoDto;
import com.ssafy.docshund.domain.forums.entity.Article;
import com.ssafy.docshund.domain.forums.entity.Status;
import com.ssafy.docshund.domain.forums.exception.ForumException;
import com.ssafy.docshund.domain.forums.exception.ForumExceptionCode;
import com.ssafy.docshund.domain.forums.repository.ArticleLikeRepository;
import com.ssafy.docshund.domain.forums.repository.ArticleRepository;
import com.ssafy.docshund.domain.users.entity.User;

import com.ssafy.docshund.domain.users.exception.user.UserException;
import com.ssafy.docshund.global.exception.GlobalErrorCode;
import com.ssafy.docshund.global.exception.ResourceNotFoundException;
import com.ssafy.docshund.global.util.user.UserUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ArticleServiceImpl implements ArticleService {

	private final UserUtil userUtil;
	private final ArticleRepository articleRepository;
	private final ArticleLikeRepository articleLikeRepository;
	private final DocumentRepository documentRepository;
	private final AlertsService alertsService;

	@Override
	@Transactional
	public ArticleInfoDto createArticle(ArticleDto articleDto) {

		User user = userUtil.getUser();
		if (user == null) {
			throw new AccessDeniedException("NO PERMISSION TO UNLOGINED USER");
		}

		Document document = documentRepository.findByDocumentName(articleDto.getCategory())
				.orElseThrow(() -> new ForumException(ForumExceptionCode.INVALID_CATEGORY));

		Article savedArticle = articleRepository.save(
				new Article(user, document, articleDto.getTitle(), articleDto.getContent()));

		return new ArticleInfoDto(
				savedArticle.getArticleId(), savedArticle.getDocument().getDocsId(),
				savedArticle.getDocument().getPosition(),
				savedArticle.getDocument().getDocumentName(), savedArticle.getTitle(), savedArticle.getContent(),
				savedArticle.getCreatedAt(), savedArticle.getUpdatedAt(), 0, 0, 0,
				savedArticle.getUser().getUserId(), savedArticle.getUser().getNickname(),
				savedArticle.getUser().getProfileImage(), false
		);
	}

	@Override
	@Transactional
	public void updateArticle(Integer articleId, ArticleDto articleDto) {

		Article article = articleRepository.findById(articleId)
				.orElseThrow(() -> new ResourceNotFoundException(RESOURCE_NOT_FOUND));

		User user = userUtil.getUser();
		if (user == null || !article.getUser().getUserId().equals(user.getUserId())) {
			throw new UserException(GlobalErrorCode.INVALID_RESOURCE_OWNER);
		}

		if (articleDto.getTitle() != null) {
			article.modifyTitle(articleDto.getTitle());
		}

		if (articleDto.getContent() != null) {
			article.modifyContent(articleDto.getContent());
		}

		if (articleDto.getCategory() != null) {
			Document document = documentRepository.findByDocumentName(articleDto.getCategory())
					.orElseThrow(() -> new ResourceNotFoundException(RESOURCE_NOT_FOUND));

			article.modifyDocument(document);
		}
	}

	@Override
	public Page<ArticleInfoDto> getArticles(String sort, Position filterPosition, String filterDocName,
											String keyword, String searchType, Pageable pageable) {

		User user = userUtil.getUser();
		Long userId = (user != null) ? user.getUserId() : 0L;

		return articleRepository.findAllArticles(sort, filterPosition, filterDocName, keyword, searchType, pageable,
				userId);
	}

	@Override
	public Page<ArticleInfoDto> getArticlesByUserId(Long authorId, Pageable pageable) {

		User user = userUtil.getUser();
		Long userId = (user != null) ? user.getUserId() : 0L;

		return articleRepository.findArticlesByAuthorId(authorId, pageable, userId);
	}

	@Override
	public Page<ArticleInfoDto> getArticlesLikedByUserId(Pageable pageable) {

		User user = userUtil.getUser();
		if (user == null) {
			throw new UserException(GlobalErrorCode.INVALID_RESOURCE_OWNER);
		}

		return articleRepository.findArticlesLikedByUserId(user.getUserId(), pageable);
	}

	@Override
	@Transactional
	public ArticleInfoDto getArticleDetail(Integer articleId) {

		User user = userUtil.getUser();
		Long userId = (user != null) ? user.getUserId() : 0L;

		Article article = articleRepository.findById(articleId).orElseThrow(
				() -> new ResourceNotFoundException(RESOURCE_NOT_FOUND));
		article.increaseViewCount();

		ArticleInfoDto articleInfo = articleRepository.findArticleById(articleId, userId);

		return articleInfo;
	}

	@Override
	@Transactional
	public void deleteArticle(Integer articleId) {

		Article article = articleRepository.findById(articleId)
				.orElseThrow(() -> new ResourceNotFoundException(RESOURCE_NOT_FOUND));

		User user = userUtil.getUser();
		if (user == null || !article.getUser().getUserId().equals(user.getUserId())) {
			throw new UserException(GlobalErrorCode.INVALID_RESOURCE_OWNER);
		}

		article.modifyToDelete();
	}

	@Override
	@Transactional
	public void likeArticle(Integer articleId) {

		User user = userUtil.getUser();
		if (user == null) {
			throw new AccessDeniedException("NO PERMISSION TO UNLOGINED USER");
		}

		if (articleLikeRepository.existsLike(user.getUserId(), articleId) == 1) {
			articleLikeRepository.deleteLike(user.getUserId(), articleId);
		} else {
			articleLikeRepository.insertLike(user.getUserId(), articleId);
		}
	}

	@Override
	@Transactional
	public void modifyArticleStatus(Integer articleId, Status status) {
		User user = userUtil.getUser();
		if (!userUtil.isAdmin(user)) {
			throw new RuntimeException("어드민이 아닙니다.");
		}

		Article article = articleRepository.findById(articleId)
				.orElseThrow(() -> new ResourceNotFoundException(RESOURCE_NOT_FOUND));

		article.modifyStatus(status);
	}
}
