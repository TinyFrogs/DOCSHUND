package com.ssafy.docshund.global.aws.s3.exception;

import com.ssafy.docshund.global.exception.ExceptionCode;

import lombok.Getter;

@Getter
public class S3Exception extends RuntimeException {

	private final ExceptionCode exceptionCode;

	public S3Exception(ExceptionCode exceptionCode) {
		super(exceptionCode.getMessage());
		this.exceptionCode = exceptionCode;
	}
}
