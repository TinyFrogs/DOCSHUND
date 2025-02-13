package com.ssafy.docshund.domain.forums.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ArticleDto {
    private String title;
    private String content;
    private String category;
}
