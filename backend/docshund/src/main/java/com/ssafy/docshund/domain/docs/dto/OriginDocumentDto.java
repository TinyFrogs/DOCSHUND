package com.ssafy.docshund.domain.docs.dto;

import com.ssafy.docshund.domain.docs.entity.OriginDocument;

public record OriginDocumentDto(
        Integer originId,
        Integer docsId,
        Integer pOrder,
        String tag,
        String content) {

    public static OriginDocumentDto fromEntity(OriginDocument originDocument) {
        return new OriginDocumentDto(
                originDocument.getOriginId(),
                originDocument.getDocument().getDocsId(),
                originDocument.getPOrder(),
                originDocument.getTag(),
                originDocument.getContent()
        );
    }
}
