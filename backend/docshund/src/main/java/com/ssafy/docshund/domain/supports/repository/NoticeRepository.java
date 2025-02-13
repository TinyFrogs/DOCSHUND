package com.ssafy.docshund.domain.supports.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.docshund.domain.supports.entity.Notice;

public interface NoticeRepository extends JpaRepository<Notice, Integer> {

}
