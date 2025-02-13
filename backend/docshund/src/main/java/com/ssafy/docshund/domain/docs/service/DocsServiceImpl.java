package com.ssafy.docshund.domain.docs.service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.docshund.domain.docs.dto.DocumentDto;
import com.ssafy.docshund.domain.docs.dto.OriginDocumentDto;
import com.ssafy.docshund.domain.docs.dto.TranslatedDocumentDto;
import com.ssafy.docshund.domain.docs.entity.Document;
import com.ssafy.docshund.domain.docs.entity.DocumentLike;
import com.ssafy.docshund.domain.docs.entity.OriginDocument;
import com.ssafy.docshund.domain.docs.entity.Status;
import com.ssafy.docshund.domain.docs.entity.TranslatedDocument;
import com.ssafy.docshund.domain.docs.repository.CustomDocumentRepository;
import com.ssafy.docshund.domain.docs.repository.DocumentLikeRepository;
import com.ssafy.docshund.domain.docs.repository.DocumentRepository;
import com.ssafy.docshund.domain.docs.repository.OriginDocumentRepository;
import com.ssafy.docshund.domain.docs.repository.TranslatedDocumentLikeRepository;
import com.ssafy.docshund.domain.docs.repository.TranslatedDocumentRepository;
import com.ssafy.docshund.domain.users.entity.User;
import com.ssafy.docshund.global.util.user.UserUtil;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DocsServiceImpl implements DocsService {

	private final DocumentRepository documentRepository;
	private final DocumentLikeRepository documentLikeRepository;
	private final OriginDocumentRepository originDocumentRepository;
	private final CustomDocumentRepository customDocumentRepository;
	private final TranslatedDocumentRepository translatedDocumentRepository;
	private final TranslatedDocumentLikeRepository translatedDocumentLikeRepository;
	private final ObjectMapper objectMapper = new ObjectMapper();
	private final UserUtil userUtil;

	// 전체 문서 목록 조회
	@Override
	public List<DocumentDto> getAllDocuments(String sort, String order) {

		// 정렬 방식 설정
		Sort.Direction direction = order.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;

		// 정렬 기준 설정
		Sort sortOption = switch (sort.toLowerCase()) {
			case "newest" -> Sort.by(direction, "createdAt");
			case "view" -> Sort.by(direction, "viewCount");
			default -> Sort.by(direction, "documentName");
		};

		// 문서 목록 조회
		List<Document> documents = documentRepository.findAll(sortOption);

		// 문서 ID 목록 추출
		List<Integer> documentIds = documents.stream().map(Document::getDocsId).toList();

		// 다수의 문서 좋아요 정보 가져오기
		Map<Integer, List<Long>> likeUsersMap = documentLikeRepository.findLikedUserIdsByDocumentIds(documentIds)
			.stream()
			.collect(Collectors.groupingBy(
				result -> (Integer)result[0],
				Collectors.mapping(result -> (Long)result[1], Collectors.toList())
			));

		return documents.stream().map(document -> {
			List<Long> likeUserIds = likeUsersMap.getOrDefault(document.getDocsId(), List.of());
			return new DocumentDto(
				document.getDocsId(),
				document.getDocumentCategory(),
				document.getDocumentName(),
				document.getDocumentLogo(),
				document.getDocumentVersion(),
				document.getViewCount(),
				likeUserIds.size(),
				document.getPosition(),
				document.getLicense(),
				document.getDocumentLink(),
				document.getCreatedAt(),
				likeUserIds
			);
		}).toList();
	}

	// 특정 문서 상세 조회
	@Override
	@Transactional
	public DocumentDto getDocumentDetail(Integer docsId) {

		Document document = documentRepository.findById(docsId)
			.orElseThrow(() -> new EntityNotFoundException("Document not found with id: " + docsId));

		// 조회수 증가
		document.setViewCount(document.getViewCount() + 1);

		// 좋아요한 유저들 조회
		List<Long> likeUserIds = documentLikeRepository.findLikedUserIdsByDocumentId(docsId);

		// DocumentDto 생성 후 반환
		return new DocumentDto(
			document.getDocsId(),
			document.getDocumentCategory(),
			document.getDocumentName(),
			document.getDocumentLogo(),
			document.getDocumentVersion(),
			document.getViewCount(),
			likeUserIds.size(),    // 좋아요 갯수
			document.getPosition(),
			document.getLicense(),
			document.getDocumentLink(),
			document.getCreatedAt(),
			likeUserIds
		);
	}

	// 문서 생성
	@Override
	@Transactional
	public DocumentDto createDocument(DocumentDto documentDto, User user) {

		if(!userUtil.isAdmin(user)) {
			throw new SecurityException("Only admins can create documents.");
		}

		Document document = new Document(
			documentDto.documentCategory(),
			documentDto.documentName(),
			documentDto.documentLogo(),
			documentDto.documentVersion(),
			documentDto.viewCount() != null ? documentDto.viewCount() : 0,
			documentDto.position(),
			documentDto.license(),
			documentDto.documentLink()
		);

		Document savedDocument = documentRepository.save(document);
		return DocumentDto.fromEntity(savedDocument, 0, List.of());
	}

	// 관심문서 등록 및 해제
	@Override
	@Transactional
	public DocumentDto toggleLikes(Integer docsId, User user) {
		// 현재 사용자가 해당 문서를 좋아요 했는지 확인
		boolean isLiked = documentLikeRepository.existsByDocument_DocsIdAndUser_UserId(docsId, user.getUserId());

		if (isLiked) {
			// 좋아요 취소
			documentLikeRepository.deleteByDocument_DocsIdAndUser_UserId(docsId, user.getUserId());
		} else {
			// 좋아요 등록
			Document document = documentRepository.findById(docsId)
				.orElseThrow(() -> new EntityNotFoundException("Document not found with id: " + docsId));

			DocumentLike documentLike = new DocumentLike(document, user);
			documentLikeRepository.save(documentLike);
		}

		// 문서 정보 조회
		Document targetDocument = documentRepository.findById(docsId)
			.orElseThrow(() -> new EntityNotFoundException("Document not found with id: " + docsId));

		// 갱신된 좋아요 유저들 조회
		List<Long> likeUserIds = documentLikeRepository.findLikedUserIdsByDocumentId(docsId);

		// 좋아요 개수 갱신
		int updatedLikeCount = likeUserIds.size();

		return DocumentDto.fromEntity(targetDocument, updatedLikeCount, likeUserIds);
	}

	// 유저 관심 문서 조회
	@Override
	public List<DocumentDto> getLikesDocument(Long userId) {
		List<Document> documents = customDocumentRepository.findLikedDocumentByUserId(userId);

		List<Integer> documentIds = documents.stream().map(Document::getDocsId).toList();

		// 다수의 문서 좋아요 정보 가져오기
		Map<Integer, List<Long>> likeUsersMap = documentLikeRepository.findLikedUserIdsByDocumentIds(documentIds)
			.stream()
			.collect(Collectors.groupingBy(
				result -> (Integer)result[0],
				Collectors.mapping(result -> (Long)result[1], Collectors.toList())
			));

		return documents.stream().map(document -> {
			List<Long> likeUserIds = likeUsersMap.getOrDefault(document.getDocsId(), List.of());
			return new DocumentDto(
				document.getDocsId(),
				document.getDocumentCategory(),
				document.getDocumentName(),
				document.getDocumentLogo(),
				document.getDocumentVersion(),
				document.getViewCount(),
				likeUserIds.size(),
				document.getPosition(),
				document.getLicense(),
				document.getDocumentLink(),
				document.getCreatedAt(),
				likeUserIds
			);
		}).toList();
	}

	// 문서 원본(origin_document) 조회
	@Override
	public List<OriginDocumentDto> getAllOriginDocuments(Integer docsId) {
		List<OriginDocument> originDocuments = originDocumentRepository.findByDocument_DocsId(docsId);
		return originDocuments.stream()
			.map(OriginDocumentDto::fromEntity)
			.collect(Collectors.toList());
	}

	// 특정 단락 원본 조회
	@Override
	public OriginDocumentDto getOriginDocumentDetail(Integer originId) {
		OriginDocument originDocument = originDocumentRepository.findByOriginId(originId);
		if (originDocument == null) {
			throw new EntityNotFoundException("OriginDocument not found with id: " + originId);
		}
		return OriginDocumentDto.fromEntity(originDocument);
	}

	// 원본 생성
	@Override
	@Transactional
	public List<OriginDocumentDto> createOriginDocuments(Integer docsId, String content, User user) {

		// 유저가 존재하지 않을 시 예외 처리
		if (user == null) {
			throw new IllegalArgumentException("User not found");
		}
		// 관리자가 아닐 시 예외 처리
		if (!userUtil.isAdmin(user)) {
			throw new SecurityException("Only admins can create origin documents.");
		}
		// 내용이 없을 시 예외 처리
		if (content == null || content.trim().isEmpty()) {
			throw new IllegalArgumentException("Content is empty or null");
		}

		System.out.println("[Service] Received docsId: " + docsId);
		System.out.println("[Service] Content Length: " + content.length());
		System.out.println("[Service] Preparing to run Python script...");

		try {

			String scriptPath = "src/main/resources/python/divide_by_tags.py";
			ProcessBuilder processBuilder = new ProcessBuilder("python", scriptPath);
			processBuilder.environment().put("PYTHONIOENCODING", "UTF-8");

			Process process = processBuilder.start();
			System.out.println("[Service] Python script started...");

			// Python에 데이터 전달
			try (OutputStream outputStream = process.getOutputStream()) {
				outputStream.write(content.getBytes(StandardCharsets.UTF_8));
				outputStream.flush();
				System.out.println("[Service] Sent content to Python script...");
			}

			// Python 출력 스트림 읽기
			StringBuilder resultJsonBuilder = new StringBuilder();
			try (BufferedReader reader = new BufferedReader(
				new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8))) {
				String line;
				while ((line = reader.readLine()) != null) {
					resultJsonBuilder.append(line);
				}
			}
			System.out.println("[Service] Received response from Python script...");

			// Python 에러 스트림 읽기
			StringBuilder errorBuilder = new StringBuilder();
			try (BufferedReader errorReader = new BufferedReader(
				new InputStreamReader(process.getErrorStream(), StandardCharsets.UTF_8))) {
				String line;
				while ((line = errorReader.readLine()) != null) {
					errorBuilder.append(line).append(System.lineSeparator());
				}
			}
			if (!errorBuilder.isEmpty()) {
				System.err.println("[Service] Python Script Error: " + errorBuilder.toString());
			}

			process.waitFor();
			if (process.exitValue() != 0) {
				throw new RuntimeException("Python script execution failed with exit code: " + process.exitValue());
			}

			String resultJson = resultJsonBuilder.toString();
			System.out.println(
				"[Service] Parsed JSON: " + (resultJson.length() > 100 ? resultJson.substring(0, 100) : resultJson));
			List<OriginDocumentDto> documents = objectMapper.readValue(resultJson,
				new TypeReference<List<OriginDocumentDto>>() {
				});

			Document document = documentRepository.findById(docsId)
				.orElseThrow(() -> new RuntimeException("Document not found with id: " + docsId));

			return documents.stream().map(dto -> {
				OriginDocument originDocument = new OriginDocument(
					document,
					dto.pOrder(),
					dto.tag(),
					dto.content()
				);

				OriginDocument savedEntity = originDocumentRepository.save(originDocument);
				return OriginDocumentDto.fromEntity(savedEntity);
			}).toList();

		} catch (Exception e) {
			throw new RuntimeException("Failed to process HTML content: " + e.getMessage(), e);
		}
	}

	// 특정 문서에 대한 번역 문서 목록 전체 조회하기
	@Transactional(readOnly = true)
	public List<TranslatedDocumentDto> getAllTranslatedDocuments(Integer docsId) {

		List<TranslatedDocument> translatedDocuments = translatedDocumentRepository.findByOriginDocument_Document_DocsId(
			docsId);

		// 번역 문서 ID 목록 추출
		List<Long> transIds = translatedDocuments.stream().map(TranslatedDocument::getTransId).toList();

		// 다수의 번역 문서 좋아요 정보 가져오기
		Map<Long, List<Long>> likeUsersMap = translatedDocumentLikeRepository.findLikedUserIdsByDocumentIds(transIds)
			.stream()
			.collect(Collectors.groupingBy(
				result -> (Long)result[0], // 첫 번째 값 = 번역 문서 ID
				Collectors.mapping(result -> (Long)result[1], Collectors.toList()) // 두 번째 값 = 유저 ID
			));

		return translatedDocuments.stream().map(translatedDocument -> {
			List<Long> likeUserIds = likeUsersMap.getOrDefault(translatedDocument.getTransId(), List.of());
			return new TranslatedDocumentDto(
				translatedDocument.getTransId(),
				translatedDocument.getOriginDocument().getOriginId(),
				translatedDocument.getUser().getUserId(),
				translatedDocument.getContent(),
				translatedDocument.getReportCount(),
				translatedDocument.getStatus(),
				translatedDocument.getCreatedAt(),
				translatedDocument.getUpdatedAt(),
				likeUserIds.size(),
				likeUserIds
			);
		}).toList();
	}

	// 특정 문서 내에서 베스트 번역본 조회
	@Transactional(readOnly = true)
	@Override
	public List<TranslatedDocumentDto> getBestTranslatedDocuments(Integer docsId) {
		// 베스트 번역본 가져오기
		List<TranslatedDocumentDto> bestTransDocuments = customDocumentRepository.findBestTrans(docsId);

		// transId 목록 추출
		List<Long> transIds = bestTransDocuments.stream().map(TranslatedDocumentDto::transId).toList();

		// 좋아요한 유저 목록 조회
		Map<Long, List<Long>> likeUsersMap = translatedDocumentLikeRepository.findLikedUserIdsByDocumentIds(transIds)
			.stream()
			.collect(Collectors.groupingBy(
				result -> (Long)result[0], // transId
				Collectors.mapping(result -> (Long)result[1], Collectors.toList())
			));

		return bestTransDocuments.stream().map(transDoc -> {
			List<Long> likeUserIds = likeUsersMap.getOrDefault(transDoc.transId(), List.of());
			return transDoc.withLikeUserIds(likeUserIds);
		}).toList();
	}

	// 특정 문단의 번역 전체 조회
	@Transactional(readOnly = true)
	@Override
	public List<TranslatedDocumentDto> getTranslatedDocuments(Integer docsId, Integer originId, String sort,
		String order) {
		// 번역문 조회
		List<TranslatedDocumentDto> translatedDocuments = customDocumentRepository.findTranslatedDocs(docsId, originId,
			sort, order);

		// 번역 문서 ID 목록 추출
		List<Long> transIds = translatedDocuments.stream().map(TranslatedDocumentDto::transId).toList();

		// 좋아요한 유저 목록 조회
		Map<Long, List<Long>> likeUsersMap = translatedDocumentLikeRepository.findLikedUserIdsByDocumentIds(transIds)
			.stream()
			.collect(Collectors.groupingBy(
				result -> (Long)result[0], // transId
				Collectors.mapping(result -> (Long)result[1], Collectors.toList()) // 좋아요한 userId 리스트로 매핑
			));

		// 4. 좋아요 정보 추가하여 DTO 변환 후 반환
		return translatedDocuments.stream().map(transDoc -> {
			List<Long> likeUserIds = likeUsersMap.getOrDefault(transDoc.transId(), List.of());
			return transDoc.withLikeUserIds(likeUserIds);
		}).toList();
	}

	// 번역 작성하기
	@Override
	@Transactional
	public TranslatedDocumentDto createTranslatedDocument(Integer docsId, Integer originId, User user,
		String content) {
		// 원본 문서 조회
		OriginDocument originDocument = originDocumentRepository.findById(originId)
			.orElseThrow(() -> new EntityNotFoundException("OriginDocument not found with id: " + originId));

		// 번역 문서 생성
		TranslatedDocument translatedDocument = new TranslatedDocument(originDocument, user, content, 0,
			Status.VISIBLE);
		translatedDocumentRepository.save(translatedDocument);

		return TranslatedDocumentDto.fromEntity(translatedDocument, 0, List.of());
	}

	// 특정 유저가 작성한 번역 조회
	@Transactional(readOnly = true)
	@Override
	public List<TranslatedDocumentDto> getUserTransDocument(Long userId) {
		List<TranslatedDocument> userTransDocuments = translatedDocumentRepository.findByUser_UserId(userId);

		// 번역 문서 ID 목록 추출
		List<Long> transIds = userTransDocuments.stream().map(TranslatedDocument::getTransId).toList();

		// 해당 번역 문서들의 좋아요한 유저 목록 가져오기
		Map<Long, List<Long>> likeUsersMap = translatedDocumentLikeRepository.findLikedUserIdsByDocumentIds(transIds)
			.stream()
			.collect(Collectors.groupingBy(
				result -> (Long)result[0], // transId
				Collectors.mapping(result -> (Long)result[1], Collectors.toList()) // userId 리스트로 매핑
			));

		return userTransDocuments.stream().map(transDoc -> {
			List<Long> likeUserIds = likeUsersMap.getOrDefault(transDoc.getTransId(), List.of());
			return new TranslatedDocumentDto(
				transDoc.getTransId(),
				transDoc.getOriginDocument().getOriginId(),
				transDoc.getUser().getUserId(),
				transDoc.getContent(),
				transDoc.getReportCount(),
				transDoc.getStatus(),
				transDoc.getCreatedAt(),
				transDoc.getUpdatedAt(),
				likeUserIds.size(),
				likeUserIds
			);
		}).toList();
	}

	// 번역 상세 조회
	@Transactional(readOnly = true)
	@Override
	public TranslatedDocumentDto getTranslatedDocumentDetail(Integer docsId, Integer transId) {
		// 번역 문서 조회
		TranslatedDocument translatedDocument = translatedDocumentRepository.findById(transId)
			.orElseThrow(() -> new IllegalArgumentException("해당 번역문이 존재하지 않습니다: transId=" + transId));

		// 해당 번역 문서가 docsId에 속하는지 확인
		if (!translatedDocument.getOriginDocument().getDocument().getDocsId().equals(docsId)) {
			throw new IllegalArgumentException("해당 번역문이 주어진 문서(docsId)에 속하지 않습니다.");
		}

		// 좋아요한 유저 목록 가져오기
		List<Long> likeUserIds = translatedDocumentLikeRepository.findLikedUserIdsByTransId(Long.valueOf(transId));

		return new TranslatedDocumentDto(
			translatedDocument.getTransId(),
			translatedDocument.getOriginDocument().getOriginId(),
			translatedDocument.getUser().getUserId(),
			translatedDocument.getContent(),
			translatedDocument.getReportCount(),
			translatedDocument.getStatus(),
			translatedDocument.getCreatedAt(),
			translatedDocument.getUpdatedAt(),
			likeUserIds.size(),
			likeUserIds
		);
	}

	// 번역 수정하기
	@Override
	@Transactional
	public TranslatedDocumentDto updateTranslatedDocument(Integer docsId, Integer transId, User user, String content) {
		// 해당하는 번역 문서 찾기
		TranslatedDocument translatedDocument = translatedDocumentRepository.findById(transId)
			.orElseThrow(() -> new EntityNotFoundException("Translated document not found with id: " + transId));

		// docsId와 transId가 일치하는지 검증
		if (!translatedDocument.getOriginDocument().getDocument().getDocsId().equals(docsId)) {
			throw new IllegalArgumentException("Invalid transId or docsId does not match");
		}

		// 작성자가 맞는지 확인 (작성자가 아니면 수정 불가)
		if (!translatedDocument.getUser().getUserId().equals(user.getUserId())) {
			throw new SecurityException("You are not the owner of this translation.");
		}

		// 내용 업데이트 후 저장
		translatedDocument.updateContent(content);

		// 좋아요한 유저 목록 가져오기
		List<Long> likeUserIds = translatedDocumentLikeRepository.findLikedUserIdsByTransId(Long.valueOf(transId));

		return TranslatedDocumentDto.fromEntity(translatedDocument, likeUserIds.size(), likeUserIds);
	}

	// 번역 삭제하기
	@Override
	@Transactional
	public void deleteTranslatedDocument(Integer docsId, Integer transId, User user) {
		// 번역 문서 조회
		TranslatedDocument translatedDocument = translatedDocumentRepository.findById(transId)
			.orElseThrow(() -> new EntityNotFoundException("Translated document not found with id: " + transId));

		// docsId와 transId의 문서가 일치하는지 검증
		if (!translatedDocument.getOriginDocument().getDocument().getDocsId().equals(docsId)) {
			throw new IllegalArgumentException("Invalid transId or docsId does not match");
		}

		// 삭제 권한 확인 (작성자 본인만 삭제 가능)
		if (!translatedDocument.getUser().getUserId().equals(user.getUserId())) {
			throw new SecurityException("You are not authorized to delete this translation.");
		}

		// 번역 삭제
		translatedDocumentRepository.delete(translatedDocument);
	}

	// 번역 투표 / 투표해제
	@Override
	@Transactional
	public boolean toggleVotes(Integer docsId, Integer transId, User user) {
		TranslatedDocument translatedDocument = translatedDocumentRepository.findById(transId)
			.orElseThrow(() -> new EntityNotFoundException("Translated document not found with id: " + transId));

		if (!translatedDocument.getOriginDocument().getDocument().getDocsId().equals(docsId)) {
			throw new IllegalArgumentException("Invalid transId or docsId does not match");
		}

		boolean hasVoted = translatedDocumentLikeRepository.existsByTranslatedDocument_TransIdAndUser_UserId(
			Long.valueOf(transId), user.getUserId());

		if (hasVoted) {
			translatedDocumentLikeRepository.deleteByTranslatedDocument_TransIdAndUser_UserId(
				Long.valueOf(transId), user.getUserId());
		} else {
			translatedDocumentLikeRepository.addVote(translatedDocument, user);
		}

		return !hasVoted;
	}

	// 특정 유저가 좋아한 번역본 목록 조회
	@Override
	public List<TranslatedDocumentDto> getUserLikedTrans(Long userId) {
		List<TranslatedDocument> userLikedTrans =
			translatedDocumentLikeRepository.findLikedTranslatedDocsByUserId(userId);

		List<Long> transIds = userLikedTrans.stream().map(TranslatedDocument::getTransId).toList();

		Map<Long, List<Long>> likeUsersMap = translatedDocumentLikeRepository.findLikedUserIdsByDocumentIds(transIds)
			.stream()
			.collect(Collectors.groupingBy(
				result -> (Long)result[0], // transId
				Collectors.mapping(result -> (Long)result[1], Collectors.toList()) // 좋아요한 userId 리스트로 매핑
			));

		return userLikedTrans.stream().map(transDoc -> {
			List<Long> likeUserIds = likeUsersMap.getOrDefault(transDoc.getTransId(), List.of());
			return new TranslatedDocumentDto(
				transDoc.getTransId(),
				transDoc.getOriginDocument().getOriginId(),
				transDoc.getUser().getUserId(),
				transDoc.getContent(),
				transDoc.getReportCount(),
				transDoc.getStatus(),
				transDoc.getCreatedAt(),
				transDoc.getUpdatedAt(),
				likeUserIds.size(),
				likeUserIds
			);
		}).toList();
	}
}


