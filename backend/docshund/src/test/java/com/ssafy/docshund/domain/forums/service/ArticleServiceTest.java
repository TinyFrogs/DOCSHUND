package com.ssafy.docshund.domain.forums.service;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import com.ssafy.docshund.domain.docs.entity.Document;
import com.ssafy.docshund.domain.docs.entity.Position;
import com.ssafy.docshund.domain.docs.repository.DocumentRepository;
import com.ssafy.docshund.domain.forums.dto.ArticleDto;
import com.ssafy.docshund.domain.forums.dto.ArticleInfoDto;
import com.ssafy.docshund.domain.forums.entity.Article;
import com.ssafy.docshund.domain.forums.entity.Status;
import com.ssafy.docshund.domain.forums.repository.ArticleLikeRepository;
import com.ssafy.docshund.domain.forums.repository.ArticleRepository;
import com.ssafy.docshund.domain.users.entity.Provider;
import com.ssafy.docshund.domain.users.entity.User;
import com.ssafy.docshund.fixture.UserTestHelper;
import com.ssafy.docshund.fixture.WithMockCustomOAuth2User;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Transactional
@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("[ Article Service Test ]")
public class ArticleServiceTest {

    @Autowired
    UserTestHelper userTestHelper;

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private ArticleLikeRepository articleLikeRepository;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private ArticleService articleService;

    private User user1;

    private Article article1;
    private Article article2;
    private Article article3;

    @BeforeEach
    public void setUp() {

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
        article2 = articleRepository.save(new Article(user2, doc1, "Spring Boot란", "내용내용내용"));
        article3 = articleRepository.save(new Article(user1, doc2, "MySQL 공부 어케 함", "제곧내ㅜ"));

        // articleLike repository setup
        articleLikeRepository.insertLike(user1.getUserId(),article1.getArticleId());
        articleLikeRepository.insertLike(user1.getUserId(), article2.getArticleId());
        articleLikeRepository.insertLike(user2.getUserId(), article1.getArticleId());
        articleLikeRepository.insertLike(user3.getUserId(), article1.getArticleId());
    }

    @Test
    @DisplayName("아티클 작성 테스트")
    @WithMockCustomOAuth2User
    void createArticleTest() {
        // given
        ArticleDto articleDto = new ArticleDto("test title", "test content", "Spring Boot");

        // when
        ArticleInfoDto result = articleService.createArticle(articleDto);

        // then
        Assertions.assertThat(result).isNotNull();
        Assertions.assertThat(result.getTitle()).isEqualTo("test title");
    }

    @Test
    @DisplayName("아티클 수정 성공 테스트")
    @WithMockCustomOAuth2User
    void successUpdateArticleTest() {
        // given
        ArticleDto articleDto = new ArticleDto(null, "수정된 내용", null);
        Integer articleId = article1.getArticleId();

        // when
        articleService.updateArticle(articleId, articleDto);

        // then
        Article updatedArticle = articleRepository.findById(articleId).orElseThrow();
        Assertions.assertThat(updatedArticle.getContent()).isEqualTo("수정된 내용");
    }

    @Test
    @DisplayName("아티클 수정 실패 테스트 - 권한 없음")
    @WithMockCustomOAuth2User
    void failUpdateArticleTest() {
        // given
        ArticleDto articleDto = new ArticleDto(null, "수정된 내용", null);
        Integer articleId = article2.getArticleId();

        // when & then
        Assertions.assertThatThrownBy(() -> articleService.updateArticle(articleId, articleDto))
                .hasMessage("NO PERMISSION FOR THIS ARTICLE");
    }

    @Test
    @DisplayName("아티클 조회 테스트 - 좋아요순 정렬, BACKEND 포지션 필터링")
    @WithMockCustomOAuth2User
    void getArticlesTest() {
        // given
        Pageable pageable = PageRequest.of(0, 10);
        String testSort = "likes";
        Position testPosition = Position.BACKEND;

        // when
        Page<ArticleInfoDto> result = articleService.getArticles(testSort, testPosition, "","","", pageable);

        // then
        Assertions.assertThat(result.getContent()).isNotNull();
        Assertions.assertThat(result.getContent().size()).isEqualTo(2);
        Assertions.assertThat(result.getContent().getFirst().getTitle()).isEqualTo("Spring Boot 개요");
    }

    @Test
    @DisplayName("아티클 조회 테스트 - 특정 유저가 작성한 아티클")
    @WithMockCustomOAuth2User
    void getArticlesByUserIdTest() {
        // given
        Pageable pageable = PageRequest.of(0, 10);
        Long authorId = user1.getUserId();

        // when
        Page<ArticleInfoDto> result = articleService.getArticlesByUserId(authorId, pageable);

        // then
        Assertions.assertThat(result.getContent()).isNotNull();
        Assertions.assertThat(result.getContent().size()).isEqualTo(2);
    }

    @Test
    @DisplayName("아티클 조회 테스트 - 로그인한 유저가 좋아요한 아티클")
    @WithMockCustomOAuth2User
    void getArticlesLikedByUserIdTest() {
        // given
        Pageable pageable = PageRequest.of(0, 10);

        // when
        Page<ArticleInfoDto> result = articleService.getArticlesLikedByUserId(pageable);

        // then
        Assertions.assertThat(result.getContent()).isNotNull();
        Assertions.assertThat(result.getContent().size()).isEqualTo(2);
    }

    @Test
    @DisplayName("아티클 상세 조회")
    @WithMockCustomOAuth2User
    void getArticleDetailTest() {
        // given
        Integer articleId = article3.getArticleId();

        // when
        ArticleInfoDto result = articleService.getArticleDetail(articleId);

        // then
        Assertions.assertThat(result).isNotNull();
        Assertions.assertThat(result.getTitle()).isEqualTo("MySQL 공부 어케 함");
        Assertions.assertThat(result.getUserId()).isEqualTo(user1.getUserId());
    }

    @Test
    @DisplayName("아티클 삭제 성공 테스트")
    @WithMockCustomOAuth2User
    void successDeleteArticleTest() {
        // given
        Integer articleId = article3.getArticleId();

        // when
        articleService.deleteArticle(articleId);

        // then
        Assertions.assertThat(articleRepository.findById(articleId).orElseThrow().getStatus()).isEqualTo(Status.DELETED);
    }

    @Test
    @DisplayName("아티클 삭제 실패 테스트 - 권한 없음")
    @WithMockCustomOAuth2User
    void failDeleteArticleTest() {
        // given
        Integer articleId = article2.getArticleId();

        // when & then
        Assertions.assertThatThrownBy(() -> articleService.deleteArticle(articleId))
                .hasMessage("NO PERMISSION FOR THIS ARTICLE");
    }

    @Test
    @DisplayName("아티클 좋아요 누르기 테스트")
    @WithMockCustomOAuth2User
    void insertLikeArticleTest() {
        // given
        Integer articleId = article3.getArticleId();

        // when
        articleService.likeArticle(articleId);

        // then
        Assertions.assertThat(articleLikeRepository.existsLike(user1.getUserId(), articleId)).isEqualTo(1);
    }

    @Test
    @DisplayName("아티클 좋아요 취소 테스트")
    @WithMockCustomOAuth2User
    void deleteLikeArticleTest() {
        // given
        Integer articleId = article1.getArticleId();

        // when
        articleService.likeArticle(articleId);

        // then
        Assertions.assertThat(articleLikeRepository.existsLike(user1.getUserId(), articleId)).isEqualTo(0);
    }

    @AfterEach
    public void tearDown() {
        articleLikeRepository.deleteAll();
        articleRepository.deleteAll();
        documentRepository.deleteAll();
    }
}
