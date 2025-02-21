package com.ssafy.docshund.domain.alerts.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.docshund.domain.alerts.entity.Alert;
import com.ssafy.docshund.domain.users.entity.User;

public interface AlertRepository extends JpaRepository<Alert, Long> {

	// 유저별 알림 조회
	List<Alert> findByUserUserId(Long userId);
	
	// 유저별 알림 일괄 삭제
	void deleteAllByUser(User user);

	// 유저 존재 여부
    boolean existsByUser(User user);
}
