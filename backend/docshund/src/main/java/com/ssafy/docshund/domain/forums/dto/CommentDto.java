package com.ssafy.docshund.domain.forums.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CommentDto {
    @NotBlank(message = "COMMENT CANNOT BE BLANK")
    @Size(max = 5000, message = "COMMENT IS TOO LONG")
    private String content;
}
