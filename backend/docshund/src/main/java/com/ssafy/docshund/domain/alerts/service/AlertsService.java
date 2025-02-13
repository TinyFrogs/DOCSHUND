package com.ssafy.docshund.domain.alerts.service;

import com.ssafy.docshund.domain.alerts.dto.AlertDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface AlertsService {
    List<AlertDto> getAllAlerts(Long userId);
}
