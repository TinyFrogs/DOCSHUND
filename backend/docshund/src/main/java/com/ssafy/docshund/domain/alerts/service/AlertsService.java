package com.ssafy.docshund.domain.alerts.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.ssafy.docshund.domain.alerts.dto.AlertOutputDto;
import com.ssafy.docshund.domain.docs.entity.TranslatedDocument;
import com.ssafy.docshund.domain.forums.entity.Article;
import com.ssafy.docshund.domain.forums.entity.Comment;
import com.ssafy.docshund.domain.supports.entity.Inquiry;
import com.ssafy.docshund.domain.users.entity.User;

@Service
public interface AlertsService {

	// 알림 목록 조회
	List<AlertOutputDto> getAllAlerts();

	// 단일 알림 조회
	AlertOutputDto getAlert(Long alertId);

	// 알림 받아오기 SSE 연결
	SseEmitter subscribe();

	// 알림 삭제
	void deleteAlert(Long alertId);

	// 알림 일괄 삭제
	void deleteAlerts();

	// 알림 읽음 처리
	void readAlert(Long alertId);

	// 알림 일괄 읽음 처리
	void readAlerts();

	// 번역 알림 전송
	void sendTranslationVoteAlert(TranslatedDocument translatedDocument, User user);

	// 게시글 좋아요 알림 전송 (고도화시 고려)
	//	void sendArticleLikeAlert(Article article, User user);

	// 게시글 댓글 알림 전송
	void sendCommentAlert(Article article, User user);

	// 게시글 대댓글 알림 전송
	void sendCommentReplyAlert(Comment parentComment, User user);

	// 문의에 답변이 달렸을 시 알림 전송
	void sendInquiryAnswerAlert(Inquiry inquiry);
}
