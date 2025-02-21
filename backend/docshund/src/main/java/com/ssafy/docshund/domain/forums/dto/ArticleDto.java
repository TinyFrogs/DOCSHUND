package com.ssafy.docshund.domain.forums.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ArticleDto {
    @Size(max = 50, message = "ARTICLE TITLE IS TOO LONG")
    private String title;

    @Size(max = 15000, message = "ARTICLE CONTENT IS TOO LONG")
    private String content;
    
    private String category;
}
