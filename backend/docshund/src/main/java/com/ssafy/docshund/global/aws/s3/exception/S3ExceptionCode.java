package com.ssafy.docshund.global.aws.s3.exception;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

import org.springframework.http.HttpStatus;

import com.ssafy.docshund.global.exception.ExceptionCode;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum S3ExceptionCode implements ExceptionCode {

	IMAGE_TRNAS_BAD_REQUEST(BAD_REQUEST, "S-S-001", "이미지를 변환할 수 없습니다."),
	IMAGE_UPLOAD_BAD_REQUEST(BAD_REQUEST, "S-S-002", "이미지를 업로드할 수 없습니다.");

	private final HttpStatus httpStatus;
	private final String code;
	private final String message;
}
