package com.ssafy.docshund.domain.forums.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.ssafy.docshund.domain.docs.entity.Position;
import com.ssafy.docshund.domain.forums.dto.ArticleDto;
import com.ssafy.docshund.domain.forums.dto.ArticleInfoDto;
import com.ssafy.docshund.domain.forums.entity.Status;

public interface ArticleService {

	ArticleInfoDto createArticle(ArticleDto articleDto);

	void updateArticle(Integer articleId, ArticleDto articleDto);

	Page<ArticleInfoDto> getArticles(String sort, Position filterPosition, String filterDocName,
		String keyword, String searchType, Pageable pageable);

	Page<ArticleInfoDto> getArticlesByUserId(Long authorId, Pageable pageable);

	Page<ArticleInfoDto> getArticlesLikedByUserId(Pageable pageable);

	ArticleInfoDto getArticleDetail(Integer articleId);

	void deleteArticle(Integer articleId);

	void likeArticle(Integer articleId);

	void modifyArticleStatus(Integer articleId, Status status);

}
