package com.ssafy.docshund.domain.supports.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.docshund.domain.supports.entity.Inquiry;

@Repository
public interface InquiryRepository extends JpaRepository<Inquiry, Long>, InquiryRepositoryCustom {
}
