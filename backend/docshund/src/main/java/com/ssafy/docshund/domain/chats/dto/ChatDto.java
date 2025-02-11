package com.ssafy.docshund.domain.chats.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ChatDto {
    @Positive
    @NotNull
    private Integer docsId;

    @NotBlank(message = "CHAT CANNOT BE BLANK")
    @Size(max = 200, message = "CHAT IS TOO LONG")
    private String content;
}
