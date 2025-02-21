package com.ssafy.docshund.domain.forums.service;

import java.util.List;

import com.ssafy.docshund.domain.forums.dto.CommentDto;
import com.ssafy.docshund.domain.forums.dto.CommentInfoDto;
import com.ssafy.docshund.domain.forums.entity.Status;

public interface CommentService {

	List<CommentInfoDto> getCommentsByArticleId(Integer articleId);

	List<CommentInfoDto> getCommentsByUserId(Long userId);

	CommentInfoDto createComment(Integer articleId, CommentDto commentDto);

	CommentInfoDto createReply(Integer articleId, Integer commentId, CommentDto commentDto);

	void updateComment(Integer articleId, Integer commentId, CommentDto commentDto);

	void deleteComment(Integer articleId, Integer commentId);

	void modifyCommentStatus(Integer articleId, Status status);
}
