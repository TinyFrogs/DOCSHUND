package com.ssafy.docshund.domain.alerts.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.docshund.domain.alerts.dto.AlertOutputDto;
import com.ssafy.docshund.domain.alerts.entity.Alert;
import com.ssafy.docshund.domain.alerts.repository.AlertRepository;
import com.ssafy.docshund.domain.docs.entity.Document;
import com.ssafy.docshund.domain.docs.entity.OriginDocument;
import com.ssafy.docshund.domain.docs.entity.Position;
import com.ssafy.docshund.domain.docs.entity.Status;
import com.ssafy.docshund.domain.docs.entity.TranslatedDocument;
import com.ssafy.docshund.domain.docs.repository.DocumentRepository;
import com.ssafy.docshund.domain.docs.repository.OriginDocumentRepository;
import com.ssafy.docshund.domain.docs.repository.TranslatedDocumentRepository;
import com.ssafy.docshund.domain.forums.entity.Article;
import com.ssafy.docshund.domain.forums.entity.Comment;
import com.ssafy.docshund.domain.forums.repository.ArticleRepository;
import com.ssafy.docshund.domain.forums.repository.CommentRepository;
import com.ssafy.docshund.domain.supports.dto.inquiry.InquiryRequestDto;
import com.ssafy.docshund.domain.supports.entity.Inquiry;
import com.ssafy.docshund.domain.supports.entity.InquiryCategory;
import com.ssafy.docshund.domain.supports.repository.InquiryRepository;
import com.ssafy.docshund.domain.users.entity.Provider;
import com.ssafy.docshund.domain.users.entity.User;
import com.ssafy.docshund.fixture.UserTestHelper;
import com.ssafy.docshund.fixture.WithMockCustomOAuth2User;
import com.ssafy.docshund.global.util.user.UserUtil;

@SpringBootTest
@Transactional
@DisplayName("[ Alerts Service Integration Test ]")
class AlertsServiceImplTest {

	@Autowired
	private AlertsService alertsService;

	@Autowired
	private AlertRepository alertRepository;

	@Autowired
	private ArticleRepository articleRepository;

	@Autowired
	private CommentRepository commentRepository;

	@Autowired
	private DocumentRepository documentRepository;

	@Autowired
	private OriginDocumentRepository originDocumentRepository;

	@Autowired
	private TranslatedDocumentRepository translatedDocumentRepository;

	@Autowired
	private InquiryRepository inquiryRepository;

	@MockitoBean
	private UserUtil userUtil;

	@Autowired
	private UserTestHelper userTestHelper;

	private User user1; // 관리자
	private User user2;
	private User user3;

	private TranslatedDocument translatedDoc1;
	private Article article1;
	private Comment comment1;
	private Inquiry inquiry1;
	private Alert alert1;

	@BeforeEach
	void setUp() {
		user1 = userTestHelper.saveUser("admin@gmail.com", "10000", "adminUser", Provider.GOOGLE, true, "안녕하세요",
			"Backend", true);
		user2 = userTestHelper.saveUser("test1@gmail.com", "10001", "testUser1", Provider.GOOGLE, false, "안녕하세요",
			"Frontend", true);
		user3 = userTestHelper.saveUser("test2@github.com", "10002", "testUser2", Provider.GITHUB, false, "안녕하세요",
			"Backend", true);

		Document doc1 = documentRepository.save(new Document("Spring", "Spring Boot", "logoImage", "v1",
			0, Position.BACKEND, "apache", "docLink"));
		OriginDocument originDoc1 = originDocumentRepository.save(
			new OriginDocument(doc1, 2, "<p>", "<p>And Spring boot is very easy and simple.</p>"));
		translatedDoc1 = translatedDocumentRepository.save(
			new TranslatedDocument(originDoc1, user3, "그리고 스프링 부트는 아주 쉽고 간단합니다.", 0, Status.VISIBLE));

		article1 = articleRepository.save(
			new Article(user1, doc1, "Spring Boot 개요 공부", "Spring Boot는 경량 애플리케이션 개발을 위한 프레임워크입니다."));
		comment1 = commentRepository.save(new Comment(null, user1, article1, "부모댓글1"));

		InquiryRequestDto inquiryRequest = new InquiryRequestDto("test@test.com", "로그인이 안돼요 ㅠㅠ",
			String.valueOf(InquiryCategory.MEMBER), "사실 뻥이에요...ㅋㅋ");
		inquiry1 = inquiryRepository.save(Inquiry.createInquiry(user2, inquiryRequest, null));

		alert1 = alertRepository.save(new Alert("💬 내 게시글에 새로운 댓글이 달렸어요!", user1, null, article1, null, null, null));
	}

	@Test
	@DisplayName("사용자의 알림 조회 테스트")
	@WithMockCustomOAuth2User
	void testGetAlertById() {
		when(userUtil.getUser()).thenReturn(user1);
		AlertOutputDto result = alertsService.getAlert(Long.valueOf(alert1.getAlertId()));

		assertNotNull(result);
		assertEquals(alert1.getTitle(), result.getTitle());
	}

	@Test
	@DisplayName("사용자가 자신의 알림을 삭제하는 경우")
	@WithMockCustomOAuth2User
	void testDeleteOwnAlert() {
		when(userUtil.getUser()).thenReturn(user1);
		assertDoesNotThrow(() -> alertsService.deleteAlert(Long.valueOf(alert1.getAlertId())));
		assertFalse(alertRepository.findById(Long.valueOf(alert1.getAlertId())).isPresent());
	}

	@Test
	@DisplayName("번역 좋아요 알림 전송 테스트")
	void testSendTranslationVoteAlert() {
		alertsService.sendTranslationVoteAlert(translatedDoc1, user2);
		// DB에 데이터가 없다는 가정 하에, 알림은 하나만 생성되므로 해당 유저에 대한 알림이 존재하는지 조회
		// 추후 문제시 알림이 유저랑 일치하는지 + 이게 그 알림이 맞는지 확인하는 로직 추가 예정
		assertTrue(alertRepository.existsByUser(user3));
	}

	@Test
	@DisplayName("게시글 댓글 알림 전송 테스트")
	void testSendCommentAlert() {
		alertsService.sendCommentAlert(article1, user2);
		// DB에 데이터가 없다는 가정 하에, 알림은 하나만 생성되므로 해당 유저에 대한 알림이 존재하는지 조회
		// 추후 문제시 알림이 유저랑 일치하는지 + 이게 그 알림이 맞는지 확인하는 로직 추가 예정
		assertTrue(alertRepository.existsByUser(user1));
	}

	@Test
	@DisplayName("댓글 대댓글 알림 전송 테스트")
	void testSendCommentReplyAlert() {
		alertsService.sendCommentReplyAlert(comment1, user2);
		// DB에 데이터가 없다는 가정 하에, 알림은 하나만 생성되므로 해당 유저에 대한 알림이 존재하는지 조회
		// 추후 문제시 알림이 유저랑 일치하는지 + 이게 그 알림이 맞는지 확인하는 로직 추가 예정
		assertTrue(alertRepository.existsByUser(user1));
	}

	@Test
	@DisplayName("문의 답변 알림 전송 테스트")
	void testSendInquiryAnswerAlert() {
		alertsService.sendInquiryAnswerAlert(inquiry1);
		// DB에 데이터가 없다는 가정 하에, 알림은 하나만 생성되므로 해당 유저에 대한 알림이 존재하는지 조회
		// 추후 문제시 알림이 유저랑 일치하는지 + 이게 그 알림이 맞는지 확인하는 로직 추가 예정
		assertTrue(alertRepository.existsByUser(user2));
	}
}
