package com.ssafy.docshund.domain.forums.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.ssafy.docshund.domain.docs.entity.Position;
import com.ssafy.docshund.domain.forums.dto.ArticleInfoDto;

public interface ArticleRepositoryCustom {
	Page<ArticleInfoDto> findAllArticles(String sort, Position filterPosition, String filterDocName,
                                         String keyword, String searchType, Pageable pageable, Long userId);

	Page<ArticleInfoDto> findArticlesByAuthorId(Long authorId, Pageable pageable, Long userId);

	Page<ArticleInfoDto> findArticlesLikedByUserId(Long userId, Pageable pageable);

	ArticleInfoDto findArticleById(Integer articleId, Long userId);
}
