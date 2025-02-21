package com.ssafy.docshund.domain.supports.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.ssafy.docshund.domain.supports.dto.report.ReportResponseDto;

public interface ReportRepositoryCustom {

	Page<ReportResponseDto> searchReportUsers(Long userId, Pageable pageable);
}
