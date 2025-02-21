package com.ssafy.docshund.domain.forums.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ssafy.docshund.domain.forums.entity.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {

	@Query("SELECT c FROM Comment c LEFT JOIN FETCH c.replies JOIN c.article a WHERE c.article.articleId = :articleId AND a.status = 'VISIBLE' AND c.parentComment IS NULL ORDER BY c.createdAt ASC")
	List<Comment> findAllByArticleId(@Param("articleId") Integer articleId);

	@Query("SELECT c FROM Comment c JOIN c.article a WHERE c.user.userId = :userId AND c.status = 'VISIBLE' AND a.status = 'VISIBLE' ORDER BY c.createdAt DESC")
	List<Comment> findAllByUserId(@Param("userId") Long userId);
}
