package com.ssafy.docshund.domain.chats.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.ssafy.docshund.domain.chats.dto.ChatDto;
import com.ssafy.docshund.domain.chats.dto.ChatInfoDto;
import com.ssafy.docshund.domain.chats.entity.Chat;
import com.ssafy.docshund.domain.chats.entity.Status;

public interface ChatService {

	Chat createChat(Integer docsId, Long userId, ChatDto chatDto);

	Page<ChatInfoDto> getChatsByDocsId(Integer docsId, Pageable pageable);

	void modifyChatStatus(Long chatId, Status status);
}
