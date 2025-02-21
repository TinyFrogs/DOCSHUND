package com.ssafy.docshund.domain.users.dto.memo;

import com.ssafy.docshund.domain.users.entity.Memo;

import java.time.LocalDateTime;

public record MemoResponseDto(
        Integer memoId,
        Long userId,
        String title,
        String content,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {

    public static MemoResponseDto fromEntity(Memo memo) {
        return new MemoResponseDto(
                memo.getMemoId(),
                memo.getUser().getUserId(),
                memo.getTitle(),
                memo.getContent(),
                memo.getCreatedAt(),
                memo.getUpdatedAt()
        );
    }
}
