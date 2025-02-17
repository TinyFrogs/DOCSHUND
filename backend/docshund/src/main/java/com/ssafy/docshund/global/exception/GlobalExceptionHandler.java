package com.ssafy.docshund.global.exception;

import static com.ssafy.docshund.global.mail.exception.MailExceptionCode.MAIL_NOT_SEND;
import static org.springframework.http.HttpStatus.*;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.support.MethodArgumentNotValidException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.ssafy.docshund.global.mail.exception.MailException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@ControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity processValidationError(MethodArgumentNotValidException exception) {
		BindingResult bindingResult = exception.getBindingResult();

		List<ObjectError> errors = bindingResult.getAllErrors();
		for (ObjectError error : errors) {
			log.error(error.getObjectName());
		}

		return new ResponseEntity<>(errors, BAD_REQUEST);
	}

	@ExceptionHandler(DataIntegrityViolationException.class)
	public ResponseEntity alreadyExistsValueInDataBase(
		DataIntegrityViolationException exception
	) {
		log.error("{}", exception.getMessage());

		return new ResponseEntity<>(
			exception.getMessage(),
			BAD_REQUEST
		);
	}

	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity resourceNotFoundException(
		ResourceNotFoundException exception
	) {
		log.error("{}", exception.getMessage());

		return new ResponseEntity<>(
			exception.getMessage(),
			NOT_FOUND
		);
	}

	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity accessDeniedException(
		AccessDeniedException exception
	) {
		log.error("{}", exception.getMessage());

		return new ResponseEntity<>(
			exception.getMessage(),
			UNAUTHORIZED
		);
	}

	@ExceptionHandler(MailException.class)
	public ResponseEntity handleMailException(MailException e) {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
			new ExceptionResponse(MAIL_NOT_SEND)
		);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity globalException(Exception e) {
		log.error("{}", e);

		return new ResponseEntity(e.getMessage(), INTERNAL_SERVER_ERROR);
	}
}
