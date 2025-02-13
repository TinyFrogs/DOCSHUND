package com.ssafy.docshund.domain.forums.dto;

import java.time.LocalDateTime;

import com.querydsl.core.annotations.QueryProjection;
import com.ssafy.docshund.domain.docs.entity.Position;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ArticleInfoDto {

	private Integer articleId;
	private Integer docsId;
	private Position position;
	private String documentName;
	private String title;
	private String content;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private Integer viewCount;
	private Integer likeCount;
	private Integer commentCount;
	private Long userId;
	private String nickname;
	private String profileImage;
	private boolean isLiked;

	@QueryProjection
	public ArticleInfoDto(Integer articleId, Integer docsId, Position position, String documentName,
						  String title, String content, LocalDateTime createdAt, LocalDateTime updatedAt,
						  Integer viewCount, Integer likeCount, Integer commentCount,
						  Long userId, String nickname, String profileImage, boolean isLiked) {
		this.articleId = articleId;
		this.docsId = docsId;
		this.position = position;
		this.documentName = documentName;
		this.title = title;
		this.content = content;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.viewCount = viewCount;
		this.likeCount = likeCount;
		this.commentCount = commentCount;
		this.userId = userId;
		this.nickname = nickname;
		this.profileImage = profileImage;
		this.isLiked = isLiked;
	}

}
