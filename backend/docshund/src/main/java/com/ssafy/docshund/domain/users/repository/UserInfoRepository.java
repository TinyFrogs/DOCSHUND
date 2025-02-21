package com.ssafy.docshund.domain.users.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ssafy.docshund.domain.users.entity.User;
import com.ssafy.docshund.domain.users.entity.UserInfo;

public interface UserInfoRepository extends JpaRepository<UserInfo, Long> {

	Optional<UserInfo> findByUser(User user);

	@Query("SELECT uf FROM UserInfo uf JOIN FETCH uf.user u WHERE u.userId = :reportedUserId")
	Optional<UserInfo> findByUserAndUserInfo(Long reportedUserId);

}
