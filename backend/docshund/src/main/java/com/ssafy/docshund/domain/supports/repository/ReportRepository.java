package com.ssafy.docshund.domain.supports.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.docshund.domain.supports.entity.Report;
import com.ssafy.docshund.domain.users.entity.User;

@Repository
public interface ReportRepository extends JpaRepository<Report, Integer>, ReportRepositoryCustom {

	boolean existsByUserAndArticleId(User user, Integer articleId);

	boolean existsByUserAndCommentId(User user, Integer commentId);

	boolean existsByUserAndTransId(User user, Long transId);

	boolean existsByUserAndChatId(User user, Long chatId);

	int deleteAllByCommentId(Integer commentId);

	int deleteAllByTransId(Long transId);

	int deleteAllByArticleId(Integer articleId);

	int deleteAllByChatId(Long chatId);
}
