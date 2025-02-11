package com.ssafy.docshund.global.util.jwt;

import static com.ssafy.docshund.domain.users.exception.auth.AuthExceptionCode.EXPIRED_TOKEN;
import static com.ssafy.docshund.domain.users.exception.auth.AuthExceptionCode.INVALID_TOKEN;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.ssafy.docshund.domain.users.exception.auth.AuthExceptionCode;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {
	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response,
		AuthenticationException authException) throws IOException, ServletException {
		String exception = (String)request.getAttribute("exception");
		log.info("JwtAuthenticationEntryPoint - exception 값: " + exception);  // ✅ 로그 추가

		if (exception == null) {
			log.info("잘못된 요청 (exception 값이 없음)");
			setResponse(response, INVALID_TOKEN);
			return;
		}

		if (exception.equals(EXPIRED_TOKEN.getCode())) {
			log.info("토큰 만료됨");
			setResponse(response, INVALID_TOKEN);
			return;
		}

		if (exception.equals(INVALID_TOKEN.getCode())) {
			setResponse(response, INVALID_TOKEN);
		}
	}

	private void setResponse(HttpServletResponse response, AuthExceptionCode errorCode) throws IOException {
		String timestamp = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);

		response.setContentType("application/json;charset=UTF-8");
		response.setStatus(errorCode.getHttpStatus().value());
		response.getWriter().println(
			"{ " +
				"\"statusCode\" : \"" + errorCode.getHttpStatus()
				+ "\", \"code\" : \"" + errorCode.getCode()
				+ "\", \"message\" : \"" + errorCode.getMessage()
				+ "\", \"timestamp\" : \"" + timestamp + "\""
				+ "}");
	}
}
