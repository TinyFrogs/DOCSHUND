package com.ssafy.docshund.domain.supports.service;

import static com.ssafy.docshund.domain.supports.exception.notice.NoticeExceptionCode.NOTICE_NOT_FOUND;
import static com.ssafy.docshund.domain.users.exception.auth.AuthExceptionCode.INVALID_MEMBER_ROLE;

import java.util.Comparator;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.docshund.domain.supports.dto.notice.NoticeRequestDto;
import com.ssafy.docshund.domain.supports.dto.notice.NoticeResponseDto;
import com.ssafy.docshund.domain.supports.entity.Notice;
import com.ssafy.docshund.domain.supports.exception.notice.NoticeException;
import com.ssafy.docshund.domain.supports.repository.NoticeRepository;
import com.ssafy.docshund.domain.users.exception.auth.AuthException;
import com.ssafy.docshund.global.util.user.UserUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class NoticeServiceImpl implements NoticeService {

	private final NoticeRepository noticeRepository;
	private final UserUtil userUtil;

	@Override
	@Transactional(readOnly = true)
	public Page<NoticeResponseDto> searchNotice(Pageable pageable) {
		List<Notice> notices = noticeRepository.findAll()
			.stream()
			.sorted(Comparator.comparing(Notice::getCreatedAt).reversed()) // 최신순 정렬
			.toList();

		int start = (int)pageable.getOffset();
		int end = Math.min((start + pageable.getPageSize()), notices.size());
		List<NoticeResponseDto> pagedNotices = notices.subList(start, end)
			.stream()
			.map(NoticeResponseDto::new)
			.toList();

		return new PageImpl<>(pagedNotices, pageable, notices.size());
	}

	@Override
	@Transactional(readOnly = true)
	public NoticeResponseDto getNoticeDetail(Integer noticeId) {
		Notice findNotice = findNotice(noticeId);

		return new NoticeResponseDto(findNotice);
	}

	@Override
	public void createNotice(NoticeRequestDto noticeRequestDto) {
		isAdminByNotice();

		Notice notice = Notice.createNotice(noticeRequestDto);
		noticeRepository.save(notice);
	}

	@Override
	public void modifyNotice(NoticeRequestDto noticeRequestDto, Integer noticeId) {
		isAdminByNotice();

		Notice findNotice = findNotice(noticeId);
		findNotice.modifyNotice(noticeRequestDto);
	}

	@Override
	public void deleteNotice(Integer noticeId) {
		isAdminByNotice();

		Notice findNotice = findNotice(noticeId);
		noticeRepository.delete(findNotice);
	}

	private void isAdminByNotice() {
		if (!userUtil.isAdmin(userUtil.getUser())) {
			throw new AuthException(INVALID_MEMBER_ROLE);
		}
	}

	private Notice findNotice(Integer noticeId) {
		return noticeRepository.findById(noticeId)
			.orElseThrow(
				() -> new NoticeException(NOTICE_NOT_FOUND));
	}
}
