package com.ssafy.docshund.domain.users.entity;

import com.ssafy.docshund.domain.users.dto.profile.ProfileRequestDto;
import com.ssafy.docshund.global.audit.BaseTimeEntityWithUpdatedAt;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;

@Getter
@Entity
@Table(name = "user_info")
public class UserInfo extends BaseTimeEntityWithUpdatedAt {

	private static final String INTRODUCE_TEXT = "자기소개를 설정해주세요.";

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_info_id")
	private Long userInfoId;

	@OneToOne
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@Column(name = "is_darkmode", nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
	private boolean isDarkmode;

	@Enumerated(EnumType.STRING)
	@Column(name = "hobby", length = 30)
	private Hobby hobby;

	@Column(name = "introduce")
	private String introduce;

	@Column(name = "report_count", nullable = false, columnDefinition = "INT DEFAULT 0")
	private int reportCount;

	public static UserInfo createUserInfo(User user) {
		UserInfo userInfo = new UserInfo();
		userInfo.user = user;
		userInfo.isDarkmode = false;
		userInfo.introduce = INTRODUCE_TEXT;

		return userInfo;
	}

	public void modifyInfo(ProfileRequestDto profileRequestDto) {
		this.introduce = profileRequestDto.getIntroduce();
		this.isDarkmode = profileRequestDto.getIsDarkmode();
		this.hobby = profileRequestDto.getHobbyEnum();
	}

}
