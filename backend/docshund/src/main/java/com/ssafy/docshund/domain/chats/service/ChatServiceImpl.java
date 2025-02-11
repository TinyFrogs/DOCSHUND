package com.ssafy.docshund.domain.chats.service;

import static com.ssafy.docshund.domain.docs.exception.DocsExceptionCode.DOCS_NOT_FOUND;
import static com.ssafy.docshund.domain.users.exception.user.UserExceptionCode.USER_NOT_FOUND;

import java.util.NoSuchElementException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.docshund.domain.chats.dto.ChatDto;
import com.ssafy.docshund.domain.chats.dto.ChatInfoDto;
import com.ssafy.docshund.domain.chats.entity.Chat;
import com.ssafy.docshund.domain.chats.entity.Status;
import com.ssafy.docshund.domain.chats.repository.ChatRepository;
import com.ssafy.docshund.domain.docs.entity.Document;
import com.ssafy.docshund.domain.docs.exception.DocsException;
import com.ssafy.docshund.domain.docs.repository.DocumentRepository;
import com.ssafy.docshund.domain.users.entity.User;
import com.ssafy.docshund.domain.users.exception.user.UserException;
import com.ssafy.docshund.domain.users.repository.UserRepository;
import com.ssafy.docshund.global.util.user.UserUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

	private final UserUtil userUtil;
	private final DocumentRepository documentRepository;
	private final ChatRepository chatRepository;
	private final UserRepository userRepository;

	@Override
	@Transactional
	public Chat createChat(Integer docsId, Long userId, ChatDto chatDto) {

		Document document = documentRepository.findByDocsId(docsId);
		if (document == null || document.getDocsId() != chatDto.getDocsId()) {
			throw new DocsException(DOCS_NOT_FOUND);
		}

		User user = userRepository.findById(userId)
			.orElseThrow(() -> new UserException(USER_NOT_FOUND));

		return chatRepository.save(new Chat(document, user, chatDto.getContent()));
	}

	@Override
	@Transactional(readOnly = true)
	public Page<ChatInfoDto> getChatsByDocsId(Integer docsId, Pageable pageable) {

		if(!documentRepository.existsById(docsId)){
			throw new DocsException(DOCS_NOT_FOUND);
		}

		return chatRepository.findAllByDocsId(docsId, pageable);
	}

	@Override
	public void modifyChatStatus(Long chatId, Status status) {
		User user = userUtil.getUser();
		if (!userUtil.isAdmin(user)) {
			throw new RuntimeException("어드민이 아닙니다.");
		}

		Chat chat = chatRepository.findById(chatId).orElseThrow(() -> new RuntimeException("해당 채팅을 찾을 수 없습니다."));

		chat.modifyStatus(status);
	}
}
