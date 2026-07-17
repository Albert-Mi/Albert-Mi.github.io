from __future__ import annotations

import html
import json
import re
import shutil
from dataclasses import dataclass
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "content/post/research/LLM/index.md"
OUTPUT = ROOT / "content/docs/llm"
ASSET_ROOT = "/p/from-transformer-to-agent-full/"


CHAPTER_SLUGS = {
    "section-1": "01-transformer-alm-llm-agent",
    "section-2": "02-transformer-and-titans",
    "section-38": "03-llm-and-agent",
    "section-77": "04-mathematical-appendix",
    "section-83": "05-notation",
    "section-84": "06-learning-path-and-exercises",
    "references": "07-references",
}

SECTION_SLUGS = {
    "section-3": "02-01-transformer-standard-workflow",
    "section-13": "02-02-transformer-context-bottleneck",
    "section-14": "02-03-memory-attention-kv-cache",
    "section-15": "02-04-titans-neural-memory",
    "section-21": "02-05-titans-architectures",
    "section-26": "02-06-titans-long-chain-reasoning",
    "section-27": "02-07-experiments-and-boundaries",
    "section-30": "02-08-limitations-and-summary",
    "section-33": "02-09-mathematical-appendix",
    "section-39": "03-01-why-llm-needs-agent",
    "section-40": "03-02-llm-probabilistic-model",
    "section-52": "03-03-agent-closed-loop-system",
    "section-57": "03-04-llm-agent-workflow",
    "section-68": "03-05-rag-and-external-knowledge",
    "section-69": "03-06-safety-alignment-reliability",
    "section-73": "03-07-minimal-agent",
    "section-76": "03-08-conclusion",
    "section-78": "04-01-softmax-jacobian",
    "section-79": "04-02-kl-divergence",
    "section-80": "04-03-empirical-and-true-risk",
    "section-81": "04-04-local-truncation-error",
    "section-82": "04-05-euler-vs-rk4",
    "section-85": "06-00-01-learning-route",
    "section-86": "06-00-02-sampling-exercise",
    "section-87": "06-00-03-harmonic-agent-exercise",
    "section-88": "06-00-04-extended-analysis",
}


HEADING_RE = re.compile(
    r'^<h(?P<level>[2-5]) id="(?P<id>[^"]+)">(?P<title>.*?)</h[2-5]>$'
)
TOC_NUMBER_RE = re.compile(
    r'<span class="fta-toc-number"[^>]*>(?P<number>[^<]+)</span>'
    r'<a href="#(?P<id>[^"]+)">'
)
RELATIVE_IMAGE_RE = re.compile(r'src="(?!/|https?://|data:)([^"]+)"')


@dataclass(frozen=True)
class Heading:
    index: int
    level: int
    anchor: str
    title: str


@dataclass(frozen=True)
class Page:
    title: str
    number: str
    slug: str
    chapter: int
    chapter_slug: str
    is_section: bool
    root_level: int
    weight: int
    body: list[str]


def plain_title(value: str) -> str:
    return html.unescape(re.sub(r"<[^>]+>", "", value)).strip()


def front_matter(page: Page) -> str:
    values = [
        "---",
        f"title: {json.dumps(page.title, ensure_ascii=False)}",
        f"weight: {page.weight}",
        f"chapter: {page.chapter}",
        f"page_number: {json.dumps(page.number)}",
        f"chapter_slug: {json.dumps(page.chapter_slug)}",
        f"is_section: {'true' if page.is_section else 'false'}",
        f"root_heading_level: {page.root_level}",
        "type: docs",
        "math: true",
        "toc: false",
    ]
    if page.slug == "01-transformer-alm-llm-agent":
        values.extend(["aliases:", '  - "/p/from-transformer-to-agent/"'])
    values.append("---")
    return "\n".join(values) + "\n"


def wrap_body(lines: list[str]) -> str:
    body = "\n".join(lines).strip()
    body = RELATIVE_IMAGE_RE.sub(lambda match: f'src="{ASSET_ROOT}{match.group(1)}"', body)
    return f'<div class="fta-document">\n<article class="fta-post">\n{body}\n</article>\n</div>\n'


def parse_source() -> tuple[list[str], list[Heading], dict[str, str]]:
    text = SOURCE.read_text(encoding="utf-8")
    lines = text.splitlines()
    headings: list[Heading] = []
    for index, line in enumerate(lines):
        match = HEADING_RE.match(line)
        if match:
            headings.append(
                Heading(
                    index=index,
                    level=int(match.group("level")),
                    anchor=match.group("id"),
                    title=plain_title(match.group("title")),
                )
            )
    numbers = {
        match.group("id"): match.group("number")
        for match in TOC_NUMBER_RE.finditer(text)
    }
    return lines, headings, numbers


def build_pages(lines: list[str], headings: list[Heading], numbers: dict[str, str]) -> list[Page]:
    chapters = [heading for heading in headings if heading.level == 2]
    pages: list[Page] = []

    for chapter_index, chapter in enumerate(chapters):
        chapter_number = int(numbers[chapter.anchor])
        chapter_slug = CHAPTER_SLUGS[chapter.anchor]
        chapter_end = chapters[chapter_index + 1].index if chapter_index + 1 < len(chapters) else len(lines) - 2
        inside = [heading for heading in headings if chapter.index < heading.index < chapter_end]
        split_level = 3 if any(heading.level == 3 for heading in inside) else 4
        sections = [heading for heading in inside if heading.level == split_level]
        intro_end = sections[0].index if sections else chapter_end

        pages.append(
            Page(
                title=chapter.title,
                number=str(chapter_number),
                slug=chapter_slug,
                chapter=chapter_number,
                chapter_slug=chapter_slug,
                is_section=False,
                root_level=2,
                weight=chapter_number * 1000,
                body=lines[chapter.index:intro_end],
            )
        )

        for section_index, section in enumerate(sections):
            section_end = sections[section_index + 1].index if section_index + 1 < len(sections) else chapter_end
            pages.append(
                Page(
                    title=section.title,
                    number=numbers[section.anchor],
                    slug=SECTION_SLUGS[section.anchor],
                    chapter=chapter_number,
                    chapter_slug=chapter_slug,
                    is_section=True,
                    root_level=section.level,
                    weight=chapter_number * 1000 + section_index + 1,
                    body=lines[section.index:section_end],
                )
            )

    return pages


def write_pages(pages: list[Page]) -> None:
    if OUTPUT.exists():
        for child in OUTPUT.iterdir():
            if child.name != "_index.md":
                if child.is_dir():
                    shutil.rmtree(child)
                else:
                    child.unlink()
    else:
        OUTPUT.mkdir(parents=True)

    (OUTPUT / "_index.md").write_text(
        "---\n"
        'title: "LLM Notes"\n'
        'description: "From Transformer to Agent, organized as fast chapter and section pages."\n'
        "type: docs\n"
        "---\n",
        encoding="utf-8",
    )

    for page in pages:
        page_dir = OUTPUT / page.slug
        page_dir.mkdir(parents=True)
        (page_dir / "index.md").write_text(
            front_matter(page) + wrap_body(page.body),
            encoding="utf-8",
        )


def main() -> None:
    lines, headings, numbers = parse_source()
    pages = build_pages(lines, headings, numbers)
    write_pages(pages)
    section_count = sum(page.is_section for page in pages)
    print(f"Generated {len(pages)} pages: {len(pages) - section_count} chapters, {section_count} sections")


if __name__ == "__main__":
    main()
