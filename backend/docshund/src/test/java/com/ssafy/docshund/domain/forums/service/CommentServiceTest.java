package com.ssafy.docshund.domain.forums.service;

import java.util.List;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;

import com.ssafy.docshund.domain.docs.entity.Document;
import com.ssafy.docshund.domain.docs.entity.Position;
import com.ssafy.docshund.domain.docs.repository.DocumentRepository;
import com.ssafy.docshund.domain.forums.dto.CommentDto;
import com.ssafy.docshund.domain.forums.dto.CommentInfoDto;
import com.ssafy.docshund.domain.forums.entity.Article;
import com.ssafy.docshund.domain.forums.entity.Comment;
import com.ssafy.docshund.domain.forums.entity.Status;
import com.ssafy.docshund.domain.forums.repository.ArticleRepository;
import com.ssafy.docshund.domain.forums.repository.CommentRepository;
import com.ssafy.docshund.domain.users.entity.Provider;
import com.ssafy.docshund.domain.users.entity.User;
import com.ssafy.docshund.fixture.UserTestHelper;
import com.ssafy.docshund.fixture.WithMockCustomOAuth2User;

import jakarta.transaction.Transactional;

@Transactional
@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("[ Comment Service Test ]")
public class CommentServiceTest {

	@Autowired
	UserTestHelper userTestHelper;

	@Autowired
	private DocumentRepository documentRepository;

	@Autowired
	private ArticleRepository articleRepository;

	@Autowired
	private CommentRepository commentRepository;

	@Autowired
	private CommentService commentService;

	private User user1;

	private Article article1;
	private Comment pc1;
	private Comment cc1;

	@BeforeEach
	void setUp() {

		// user repository setup
		user1 = userTestHelper.saveUser("admin@gmail.com", "100000", "adminUser", Provider.GOOGLE, true, "안녕하세요", "Backend",
			true);
		User user2 = userTestHelper.saveUser("test1@gmail.com", "10001", "testUser1", Provider.GOOGLE, false, "안녕하세요", "Frontend",
			true);
		User user3 = userTestHelper.saveUser("test2@github.com", "10002", "testUser2", Provider.GITHUB, false, "안녕하세요", "Backend",
			true);

		// document repository setup
		Document doc1 = documentRepository.save(new Document("Spring", "Spring Boot", "logoImage", "v1",
			0, Position.BACKEND, "apache", "docLink"));
		Document doc2 = documentRepository.save(new Document("MySQL", "MySQL", "logoImage", "v1",
			0, Position.DBSQL, "apache", "docLink"));

		// article repository setup
		article1 = articleRepository.save(new Article(user1, doc1, "Spring Boot 개요", "Spring Boot는 Spring Framework를 기반으로 한 경량 애플리케이션 개발을 위한 프레임워크입니다."));

		// comment repository setup
		pc1 = commentRepository.save(new Comment(null, user1, article1, "부모댓글1"));
		cc1 = commentRepository.save(new Comment(pc1, user3, article1, "자식댓글1-1"));
		Comment pc2 = commentRepository.save(new Comment(null, user2, article1, "부모댓글2"));
		commentRepository.save(new Comment(pc2, user2, article1, "자식댓글2-1"));
		commentRepository.save(new Comment(pc1, user1, article1, "자식댓글1-2"));
	}

	@Test
	@DisplayName("특정 게시글 댓글 조회 테스트")
	@WithMockCustomOAuth2User
	void getCommentsByArticleIdTest() {
		// given
		Integer articleId = article1.getArticleId();

		// when
		List<CommentInfoDto> result = commentService.getCommentsByArticleId(articleId);

		// then
		Assertions.assertThat(result.size()).isEqualTo(2);
		Assertions.assertThat(result.getFirst().getContent()).isEqualTo(pc1.getContent());
		Assertions.assertThat(result.getFirst().getReplies().size()).isEqualTo(2);
		Assertions.assertThat(result.getFirst().getReplies().getFirst().getContent()).isEqualTo("자식댓글1-1");
	}

	@Test
	@DisplayName("특정 사용자 댓글 조회 테스트")
	@WithMockCustomOAuth2User
	void getCommentsByUserIdTest() {
		// given
		Long userId = user1.getUserId();

		// when
		List<CommentInfoDto> result = commentService.getCommentsByUserId(userId);

		// then
		Assertions.assertThat(result.getFirst().getUserId()).isEqualTo(userId);
		Assertions.assertThat(result.size()).isEqualTo(2);
	}

	@Test
	@DisplayName("댓글 작성 테스트")
	@WithMockCustomOAuth2User
	void createCommentTest() {
		// given
		Integer articleId = article1.getArticleId();
		CommentDto commentDto = new CommentDto("새로운 댓글");

		// when
		CommentInfoDto result = commentService.createComment(articleId, commentDto);

		// then
		Assertions.assertThat(result.getContent()).isEqualTo(commentDto.getContent());
	}

	@Test
	@DisplayName("답글 작성 테스트")
	@WithMockCustomOAuth2User
	void createReplyTest() {
		// given
		Integer articleId = article1.getArticleId();
		Integer commentId = pc1.getCommentId();
		CommentDto commentDto = new CommentDto("새로운 답글");

		// when
		CommentInfoDto result = commentService.createReply(articleId, commentId, commentDto);

		// then
		Assertions.assertThat(result.getContent()).isEqualTo(commentDto.getContent());
	}

	@Test
	@DisplayName("댓글 수정 성공 테스트")
	@WithMockCustomOAuth2User
	void successUpdateCommentTest() {
		// given
		Integer articleId = article1.getArticleId();
		Integer commentId = pc1.getCommentId();
		CommentDto commentDto = new CommentDto("수정한내용");

		// when
		commentService.updateComment(articleId, commentId, commentDto);

		// then
		Assertions.assertThat(commentRepository.findById(commentId).orElseThrow().getContent()).isEqualTo(commentDto.getContent());
	}

	@Test
	@DisplayName("댓글 수정 실패 테스트 - 권한 없음")
	@WithMockCustomOAuth2User
	void failUpdateCommentTest() {
		// given
		Integer articleId = article1.getArticleId();
		Integer commentId = cc1.getCommentId();
		CommentDto commentDto = new CommentDto("수정한내용");

		// when & then
		Assertions.assertThatThrownBy(() -> commentService.updateComment(articleId, commentId, commentDto))
		                .hasMessage("NO PERMISSION FOR THIS COMMENT");
	}

	@Test
	@DisplayName("댓글 삭제 성공 테스트")
	@WithMockCustomOAuth2User
	void successDeleteCommentTest() {
		// given
		Integer articleId = article1.getArticleId();
		Integer commentId = pc1.getCommentId();

		// when
		commentService.deleteComment(articleId, commentId);

		// then
		Assertions.assertThat(commentRepository.findById(commentId).orElseThrow().getStatus()).isEqualTo(Status.DELETED);
	}

	@Test
	@DisplayName("댓글 삭제 실패 테스트 - 권한 없음")
	@WithMockCustomOAuth2User
	void failDeleteCommentTest() {
		// given
		Integer articleId = article1.getArticleId();
		Integer commentId = cc1.getCommentId();

		// when & then
		Assertions.assertThatThrownBy(() -> commentService.deleteComment(articleId, commentId))
			.hasMessage("NO PERMISSION FOR THIS COMMENT");
	}

	@AfterEach
	public void tearDown() {
		commentRepository.deleteAll();
		articleRepository.deleteAll();
		documentRepository.deleteAll();
	}
}
