package com.ssafy.docshund.fixture;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import org.springframework.security.test.context.support.WithSecurityContext;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
@WithSecurityContext(factory = CustomSecurityContextFactory.class)
public @interface WithMockCustomOAuth2User {
	String personalId() default "100000";

	String email() default "test@gmail.com";

	String nickname() default "testUser";
}
