package com.ssafy.docshund.domain.forums.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.docshund.domain.forums.entity.ArticleLike;

public interface ArticleLikeRepository extends JpaRepository<ArticleLike, Integer> {

	@Modifying
	@Query(value = "DELETE FROM article_like WHERE user_id = :userId AND article_id = :articleId", nativeQuery = true)
	void deleteLike(@Param("userId") Long userId, @Param("articleId") Integer articleId);

	@Modifying
	@Query(value = "INSERT INTO article_like (user_id, article_id, created_at) VALUES (:userId, :articleId, NOW())", nativeQuery = true)
	void insertLike(@Param("userId") Long userId, @Param("articleId") Integer articleId);

	@Query(value = "SELECT EXISTS(SELECT 1 FROM article_like WHERE user_id = :userId AND article_id = :articleId)", nativeQuery = true)
	Integer existsLike(@Param("userId") Long userId, @Param("articleId") Integer articleId);
}
