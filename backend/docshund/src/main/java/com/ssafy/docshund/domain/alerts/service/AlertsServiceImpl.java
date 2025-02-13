package com.ssafy.docshund.domain.alerts.service;

import com.ssafy.docshund.domain.alerts.dto.AlertDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class AlertsServiceImpl implements AlertsService {
    
    // 알림 전체 조회
    @Override
    public List<AlertDto> getAllAlerts(Long userId) {
        return List.of();
    }
}
