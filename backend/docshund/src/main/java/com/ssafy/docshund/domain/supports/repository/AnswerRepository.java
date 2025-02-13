package com.ssafy.docshund.domain.supports.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.docshund.domain.supports.entity.Answer;

public interface AnswerRepository extends JpaRepository<Answer, Long> {
}
