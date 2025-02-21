import json
import logging
import sys
from bs4 import BeautifulSoup


# 로그 설정
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] [Python] %(message)s",
    handlers=[logging.StreamHandler(sys.stderr)]
)


def sanitize_html(html_doc):
    soup = BeautifulSoup(html_doc, 'html.parser')

    # <script> 태그 제거 후 내부 텍스트 유지
    for script_tag in soup.find_all('script'):
        script_text = script_tag.get_text()
        script_tag.replace_with(script_text)

    # <a> 태그를 <span> 태그로 변경
    for a_tag in soup.find_all('a'):
        span_tag = soup.new_tag("span")
        span_tag.string = a_tag.get_text()
        a_tag.replace_with(span_tag)

    return str(soup)


# 태그 별 분리 후 리스트로 저장
def process_html(html_doc):
    soup = BeautifulSoup(html_doc, 'html.parser')
    elements = soup.find_all(['p', 'ul', 'ol', 'h1', 'h2', 'h3', 'h4', 'code'])
    paragraphs = []
    pOrder = 1

    for element in elements:
        tag = element.name
        if not element.text.strip():
            continue

        content = str(element)

        paragraphs.append({
            "pOrder": pOrder,
            "tag": tag,
            "content": content
        })
        pOrder += 1

    return paragraphs


if __name__ == "__main__":
    try:
        logging.info("[Python] 스크립트 실행 시작")

        # 표준 입력(STDIN)에서 파일 데이터 읽기
        html_content = sys.stdin.read().strip()

        logging.info(f"[Python] 받은 데이터 길이: {len(html_content)}")
        logging.info(f"[Python] 받은 데이터 미리보기: {html_content[:100]}")

        if not html_content:
            raise ValueError("파일 내용이 비어 있습니다.")

        sanitized_html = sanitize_html(html_content)
        parsed_data = process_html(sanitized_html)

        logging.info("[Python] 파이썬 실행 완료")
        print(json.dumps(parsed_data, ensure_ascii=False))
        sys.stdout.flush()

    except Exception as e:
        logging.error(f"[Python] 에러 발생: {str(e)}", exc_info=True)
        sys.stderr.flush()
        sys.exit(1)
