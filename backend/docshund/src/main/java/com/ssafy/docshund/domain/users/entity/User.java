package com.ssafy.docshund.domain.users.entity;

import java.time.LocalDateTime;

import com.ssafy.docshund.domain.users.dto.auth.UserDto;
import com.ssafy.docshund.global.audit.BaseTimeEntityWithUpdatedAt;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.ToString;

@Entity
@Getter
@ToString
@Table(name = "user")
public class User extends BaseTimeEntityWithUpdatedAt {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_id")
	private Long userId;

	@Column(name = "email", nullable = false, unique = true, length = 100)
	private String email;

	@Column(name = "profile_image")
	private String profileImage;

	@Column(name = "nickname", length = 40, unique = true)
	private String nickname;

	@Enumerated(EnumType.STRING)
	@Column(name = "role", nullable = false, columnDefinition = "ENUM('ROLE_USER', 'ROLE_ADMIN') DEFAULT 'ROLE_USER'")
	private Role role;

	@Enumerated(EnumType.STRING)
	@Column(name = "provider", nullable = false, length = 20)
	private Provider provider;

	@Column(name = "personal_id", length = 100)
	private String personalId;

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false, columnDefinition = "ENUM('BANNED', 'WITHDRAWN', 'ACTIVE') DEFAULT 'ACTIVE'")
	private Status status;

	@Column(name = "last_login")
	private LocalDateTime lastLogin;

	public static User createUser(UserDto userDto) {
		User user = new User();
		user.email = userDto.getEmail();
		user.profileImage = "https://docshundbucket.s3.ap-northeast-2.amazonaws.com/small_logo.png";
		user.nickname = userDto.getNickname();
		user.role = Role.ROLE_USER;
		user.provider = userDto.getProvider();
		user.personalId = userDto.getPersonalId();
		user.status = Status.ACTIVE;
		user.lastLogin = LocalDateTime.now();
		return user;
	}

	public void updateLastLogin() {
		this.lastLogin = LocalDateTime.now();
	}

	public void deleteUser() {
		this.status = Status.WITHDRAWN;
	}

	public void modifyNickname(String nickname) {
		this.nickname = nickname;
	}

	public void modifyProfileUrl(String profileImage) {
		this.profileImage = profileImage;
	}

	public void changeAdmin() {
		this.role = Role.ROLE_ADMIN;
	}

	public void changeUser() {
		this.role = Role.ROLE_USER;
	}

	public void modifyStatus(Status status) {
		this.status = status;
	}
}
