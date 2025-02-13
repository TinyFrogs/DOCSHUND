package com.ssafy.docshund.domain.forums.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.docshund.domain.docs.entity.Position;
import com.ssafy.docshund.domain.forums.dto.ArticleDto;
import com.ssafy.docshund.domain.forums.dto.ArticleInfoDto;
import com.ssafy.docshund.domain.forums.dto.CommentDto;
import com.ssafy.docshund.domain.forums.dto.CommentInfoDto;
import com.ssafy.docshund.domain.forums.service.ArticleService;
import com.ssafy.docshund.domain.forums.service.CommentService;
import com.ssafy.docshund.global.aws.s3.S3FileUploadService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/docshund/forums")
public class ForumController {

	private final ArticleService articleService;
	private final CommentService commentService;
	private final S3FileUploadService s3FileUploadService;

	/* Article */

	@PostMapping
	public ResponseEntity<ArticleInfoDto> postArticle(
			@RequestBody ArticleDto articleDto
	) {
		ArticleInfoDto result = articleService.createArticle(articleDto);

		return ResponseEntity.ok(result);
	}

	@PostMapping("/image")
	public ResponseEntity<String> postImage(
			@RequestPart(value = "file") MultipartFile file
	) {
		String image = s3FileUploadService.uploadFile(file, "article");

		return ResponseEntity.ok(image);
	}

	@PatchMapping("/{articleId}")
	public ResponseEntity<Void> patchArticle(
			@PathVariable Integer articleId,
			@RequestBody ArticleDto articleDto
	) {
		articleService.updateArticle(articleId, articleDto);

		return ResponseEntity.noContent().build();
	}

	@GetMapping
	public ResponseEntity<Page<ArticleInfoDto>> getArticleList(
		@RequestParam(required = false) String sort,
		@RequestParam(required = false) String filter,
		@RequestParam(required = false) String keyword,
		@RequestParam(required = false) String searchType,
		@PageableDefault(page = 0, size = 10) Pageable pageable
	) {
		Object parsedFilter = parseFilter(filter);
		Page<ArticleInfoDto> result = articleService.getArticles(
			Optional.ofNullable(sort).orElse("latest"),
			(parsedFilter instanceof Position) ? (Position) parsedFilter : null,
			(parsedFilter instanceof String) ? (String) parsedFilter : "",
			Optional.ofNullable(keyword).orElse(""),
			Optional.ofNullable(searchType).orElse(""),
			pageable
		);

		return ResponseEntity.ok(result);
	}

	@GetMapping("/user/{userId}")
	public ResponseEntity<Page<ArticleInfoDto>> getArticleListByUser(
		@PathVariable(name = "userId") Long userId,
		@PageableDefault(page = 0, size = 10) Pageable pageable
	) {
		Page<ArticleInfoDto> result = articleService.getArticlesByUserId(userId, pageable);

		return ResponseEntity.ok(result);
	}

	@GetMapping("/likes")
	public ResponseEntity<Page<ArticleInfoDto>> getArticleLikes(
		@PageableDefault(page = 0, size = 10) Pageable pageable
	) {
		Page<ArticleInfoDto> result = articleService.getArticlesLikedByUserId(pageable);

		return ResponseEntity.ok(result);
	}

	@GetMapping("/{articleId}")
	public ResponseEntity<ArticleInfoDto> getArticle(
		@PathVariable(name = "articleId") Integer articleId
	) {
		ArticleInfoDto result = articleService.getArticleDetail(articleId);

		return ResponseEntity.ok(result);
	}

	@DeleteMapping("/{articleId}")
	public ResponseEntity<Void> deleteArticle(
		@PathVariable Integer articleId
	) {
		articleService.deleteArticle(articleId);
		return ResponseEntity.noContent().build();
	}

	@PostMapping("/{articleId}/likes")
	public ResponseEntity<Void> likeArticle(
		@PathVariable Integer articleId
	) {
		articleService.likeArticle(articleId);
		return ResponseEntity.noContent().build();
	}

	private Object parseFilter(String filter) {
		if (filter == null || filter.isEmpty()) {
			return null;
		}

		try {
			return Position.valueOf(filter.toUpperCase());
		} catch (IllegalArgumentException e) {
			return filter;
		}
	}

	/* Comment */

	@GetMapping("{articleId}/comments")
	public ResponseEntity<List<CommentInfoDto>> getCommentsByArticle(
		@PathVariable Integer articleId
	) {
		List<CommentInfoDto> result = commentService.getCommentsByArticleId(articleId);

		return ResponseEntity.ok(result);
	}

	@GetMapping("/comments/user/{userId}")
	public ResponseEntity<List<CommentInfoDto>> getCommentsByUser(
		@PathVariable Long userId
	) {
		List<CommentInfoDto> result = commentService.getCommentsByUserId(userId);

		return ResponseEntity.ok(result);
	}

	@PostMapping("/{articleId}/comments")
	public ResponseEntity<CommentInfoDto> postComment(
			@PathVariable Integer articleId,
			@RequestBody CommentDto commentDto
	) {
		CommentInfoDto result = commentService.createComment(articleId, commentDto);

		return ResponseEntity.ok(result);
	}

	@PostMapping("/{articleId}/comments/{commentId}")
	public ResponseEntity<CommentInfoDto> postReplyComment(
			@PathVariable Integer articleId,
			@PathVariable Integer commentId,
			@RequestBody CommentDto commentDto
	) {
		CommentInfoDto result = commentService.createReply(articleId, commentId, commentDto);

		return ResponseEntity.ok(result);
	}

	@PatchMapping("/{articleId}/comments/{commentId}")
	public ResponseEntity<Void> updateComment(
			@PathVariable Integer articleId,
			@PathVariable Integer commentId,
			@RequestBody CommentDto commentDto
	) {
		commentService.updateComment(articleId, commentId, commentDto);

		return ResponseEntity.noContent().build();
	}

	@DeleteMapping("/{articleId}/comments/{commentId}")
	public ResponseEntity<Void> deleteComment(
			@PathVariable Integer articleId,
			@PathVariable Integer commentId
	) {
		commentService.deleteComment(articleId, commentId);

		return ResponseEntity.noContent().build();
	}
}
