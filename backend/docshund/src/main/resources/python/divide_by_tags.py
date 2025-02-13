import json
import sys
from bs4 import BeautifulSoup


# HTML에서 <script> 태그를 <p> 태그로 대체
def sanitize_html(html_doc):
    soup = BeautifulSoup(html_doc, 'html.parser')
    for script_tag in soup.find_all('script'):
        new_p = soup.new_tag('p')
        new_p.string = script_tag.get_text()
        script_tag.replace_with(new_p)
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
        print("[Python] Script started", file=sys.stderr)

        html_content = sys.stdin.read().strip()

        print(f"[Python] Raw HTML input length: {len(html_content)}", file=sys.stderr)
        print(f"[Python] Raw HTML preview: {html_content[:100]}", file=sys.stderr)

        if not html_content:
            raise ValueError("No HTML content received from Java")

        sanitized_html = sanitize_html(html_content)

        parsed_data = process_html(sanitized_html)

        print("[Python] Processing complete", file=sys.stderr)
        print(json.dumps(parsed_data, ensure_ascii=False))
        sys.stdout.flush()

    except Exception as e:
        print(f"[Python] Error: {str(e)}", file=sys.stderr)
        sys.stderr.flush()
        sys.exit(1)
