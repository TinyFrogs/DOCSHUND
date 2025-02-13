package com.ssafy.docshund.domain.supports.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.docshund.domain.supports.dto.inquiry.AnswerRequestDto;
import com.ssafy.docshund.domain.supports.dto.inquiry.InquiryRequestDto;
import com.ssafy.docshund.domain.supports.dto.inquiry.page.InquiryAndAnswerDto;
import com.ssafy.docshund.domain.supports.entity.Answer;
import com.ssafy.docshund.domain.supports.entity.Inquiry;
import com.ssafy.docshund.domain.supports.repository.AnswerRepository;
import com.ssafy.docshund.domain.supports.repository.InquiryRepository;
import com.ssafy.docshund.domain.users.entity.User;
import com.ssafy.docshund.global.aws.s3.S3FileUploadService;
import com.ssafy.docshund.global.mail.MailSendService;
import com.ssafy.docshund.global.util.user.UserUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class InquiryServiceImpl implements InquiryService {

	private final InquiryRepository inquiryRepository;
	private final AnswerRepository answerRepository;
	private final MailSendService mailSendService;
	private final S3FileUploadService fileUploadService;
	private final UserUtil userUtil;

	@Override
	@Transactional
	public void createInquiry(InquiryRequestDto inquiryRequestDto, MultipartFile file) {
		User user = userUtil.getUser();
		String imageUrl = null;
		if (file != null) {
			imageUrl = fileUploadService.uploadFile(file, "inquiry");
		}

		Inquiry inquiry = Inquiry.createInquiry(user, inquiryRequestDto, imageUrl);
		inquiryRepository.save(inquiry);

		inquiryRequestDto.emailTextGenerator();
		mailSendService.sendEmail(inquiryRequestDto.getEmail(), inquiryRequestDto.getTitle(),
			inquiryRequestDto.getContent(), imageUrl);

	}

	@Override
	public Page<InquiryAndAnswerDto> getInquiries(Long userId, Pageable pageable) {
		User user = userUtil.getUser();
		if (user == null) {
			throw new SecurityException("조회할 수 있는 권한이 없습니다.");
		}
		
		if (userUtil.isAdmin(user) || (userId != null && userUtil.isMine(userId, user))) {
			return inquiryRepository.searchInquiryAndAnswer(userId, pageable);
		}

		throw new SecurityException("조회할 수 있는 권한이 없습니다.");
	}

	@Override
	@Transactional
	public void respondToInquiry(Long inquiryId, AnswerRequestDto answerRequestDto) {
		Inquiry inquiry = inquiryRepository.findById(inquiryId).orElseThrow(
			() -> new RuntimeException("문의가 존재하지 않습니다."));

		Answer answer = Answer.createAnswer(answerRequestDto, inquiry);

		mailSendService.sendEmail(inquiry.getEmail(), inquiry.getTitle() + "에 대한 답변이 등록되었습니다.", answer.getContent(),
			null);

		inquiry.isAnsweredTrue();
		answerRepository.save(answer);
	}

}
