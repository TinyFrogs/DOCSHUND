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
    @NotNull(message = "DOCS ID CANNOT BE NULL")
    @Positive(message = "DOCS ID MUST BE A POSITIVE NUMBER")
    private Integer docsId;

    @NotBlank(message = "CHAT MESSAGE CANNOT BE BLANK")
    @Size(max = 200, message = "CHAT MESSAGE IS TOO LONG")
    private String content;
}
