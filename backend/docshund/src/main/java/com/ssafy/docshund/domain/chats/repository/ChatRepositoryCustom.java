package com.ssafy.docshund.domain.chats.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.ssafy.docshund.domain.chats.dto.ChatInfoDto;

public interface ChatRepositoryCustom {
    Page<ChatInfoDto> findAllByDocsId(Integer docsId, Pageable pageable);
}
