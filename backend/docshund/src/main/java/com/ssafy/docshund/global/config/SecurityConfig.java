package com.ssafy.docshund.global.config;

import java.util.Arrays;
import java.util.Collections;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.web.HttpSessionOAuth2AuthorizationRequestRepository;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.ssafy.docshund.domain.users.repository.UserRepository;
import com.ssafy.docshund.domain.users.service.UserAuthServiceImpl;
import com.ssafy.docshund.global.util.jwt.JwtFilter;
import com.ssafy.docshund.global.util.jwt.JwtUtil;
import com.ssafy.docshund.global.util.oauth2.CustomSuccessHandler;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

	// private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
	private final CustomSuccessHandler customSuccessHandler;
	private final UserAuthServiceImpl userAuthServiceImpl;
	private final JwtUtil jwtUtil;

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http, UserRepository userRepository) throws Exception {
		http
			.cors(cors -> cors.configurationSource(corsConfigurationSource()))
			.csrf(csrf -> csrf.disable())
			.formLogin(form -> form.disable())  // ✅ 기본 로그인 폼 비활성화
			.httpBasic(basic -> basic.disable())
			.addFilterBefore(new JwtFilter(jwtUtil, userRepository), UsernamePasswordAuthenticationFilter.class)
			.oauth2Login(oauth2 -> oauth2
				.authorizationEndpoint(endpoint -> endpoint
					.baseUri("/oauth2/authorization")
					.authorizationRequestRepository(new HttpSessionOAuth2AuthorizationRequestRepository()) // 👈 추가
				)
				.userInfoEndpoint(userInfo -> userInfo.userService(userAuthServiceImpl))
				.successHandler(customSuccessHandler)
			)
			.authorizeHttpRequests(auth -> auth
				.requestMatchers("/login").denyAll()  // 🚫 기본 로그인 경로 차단
				.requestMatchers("/oauth2/**", "/login/oauth2/**").permitAll() // ✅ OAuth2 로그인만 허용
				.requestMatchers(
					"/api/v1/docshund/docs",
					"/api/v1/docshund/docs/*/origin",
					"/api/v1/docshund/docs/*/trans",
					"/api/v1/docshund/forums",
					"/api/v1/docshund/forums/*",
					"/api/v1/docshund/forums/user/*",
					"/api/v1/docshund/forums/*/comments",
					"/api/v1/docshund/forums/comments/user/*",
					"/api/v1/docshund/supports/inquiry",
					"/api/v1/docshund/supports/notice",
					"/api/v1/docshund/supports/notice/*",
					"/api/v1/docshund/users/profile/*",
					"/api/v1/docshund/docs/trans/*"
				).permitAll()
				.anyRequest().authenticated())
			.sessionManagement(session -> session
				.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
		// .exceptionHandling(ex -> ex.authenticationEntryPoint(jwtAuthenticationEntryPoint));

		return http.build();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(Arrays.asList(
			"http://localhost:5173",
			"https://localhost:5173",
			"https://i12a703.p.ssafy.io"
		));
		configuration.setAllowedMethods(Collections.singletonList("*"));
		configuration.setAllowedHeaders(Collections.singletonList("*"));
		configuration.setAllowCredentials(true);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}
}
