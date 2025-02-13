package com.ssafy.docshund.domain.alerts.dto;

public record AlertDto(
    Integer alertId,
    String title,
    Integer userId,
    Integer transId,
    Integer articleId,
    Integer commentId,
    Integer inquiryId,
    String checkedAt
) {

}
