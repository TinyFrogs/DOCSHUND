package com.ssafy.docshund.global.util.jwt;

import static com.ssafy.docshund.domain.users.exception.auth.AuthExceptionCode.*;

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

		if (exception == null) {
			log.info("잘못된 요청");
			setResponse(response, BAD_REQUEST_EXCEPTION);
			return;
		}

		if (exception.equals(REQUEST_TOKEN_NOT_FOUND.getCode())) {
			log.info("AccessToken이 없음");
			setResponse(response, REQUEST_TOKEN_NOT_FOUND);
			return;
		}

		if (exception.equals(AUTH_MEMBER_NOT_FOUND.getCode())) {
			setResponse(response, AUTH_MEMBER_NOT_FOUND);
			return;
		}

		if (exception.equals(EXPIRED_TOKEN.getCode())) {
			log.info("토큰 만료됨, http://localhost:5173로 리다이렉트");
			response.sendRedirect("http://localhost:5173"); // ✅ 만료된 토큰이면 리다이렉트
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
