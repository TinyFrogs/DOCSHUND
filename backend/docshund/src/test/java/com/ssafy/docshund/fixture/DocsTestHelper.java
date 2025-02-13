package com.ssafy.docshund.fixture;

import com.ssafy.docshund.domain.docs.repository.CustomDocumentRepository;
import com.ssafy.docshund.domain.docs.repository.DocumentRepository;
import com.ssafy.docshund.domain.docs.repository.OriginDocumentRepository;
import com.ssafy.docshund.domain.docs.repository.TranslatedDocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DocsTestHelper {

    private final DocumentRepository documentRepository;
    private final OriginDocumentRepository originDocumentRepository;
    private final TranslatedDocumentRepository translatedDocumentRepository;
    private final CustomDocumentRepository customDocumentRepository;
}
