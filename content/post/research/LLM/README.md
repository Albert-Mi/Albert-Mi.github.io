# From Transformer to Agent

This directory is a Hugo page bundle for `content/post/research/LLM/`.

## Source and scope

- Source document: `Advanced Areas.pdf` (80 pages, US Letter).
- PDF page 1 is the cover and is intentionally omitted from the web post.
- `index.md` contains the post body, a manual hierarchical table of contents, 117 headings, 14 tables, and 220 PDF equation numbers.
- `from-transformer-to-agent.css` is scoped under `.fta-document` and supports the Stack theme selector `html[data-theme="dark"]` plus a system dark-mode fallback.
- The old Transformer Explainer JavaScript and mount point were intentionally removed.

## Figure assets

Raster figures embedded in the PDF retain their source pixel dimensions. Vector diagrams are rendered from exact PDF crop coordinates at 3x resolution and displayed at their original physical width (PDF points converted at 96 CSS pixels per inch).

| PDF page | Asset | Stored pixels | CSS display width |
| ---: | --- | ---: | ---: |
| 8 | `TransOverview.png` | 3487 x 1641 | 627 px |
| 10 | `TransEmbedding.png` | 2099 x 796 | 627 px |
| 12 | `TransAttention.png` | 1309 x 627 | 627 px |
| 15 | `TransMultiHeadAttention.png` | 1149 x 191 | 511 px |
| 16 | `TransMLP.png` | 1562 x 630 | 627 px |
| 18 | `TransDecoding.png` | 2689 x 819 | 627 px |
| 23 | `TransEncoderDecoder.png` | 944 x 373 | 420 px |
| 26 | `TransArchitectureComparison.png` | 1154 x 434 | 513 px |
| 38 | `TitansMAC.png` | 982 x 256 | 437 px |
| 63 | `AgentLoop.png` | 869 x 307 | 386 px |
| 75 | `AgentArchitecture.png` | 920 x 265 | 409 px |

All images use responsive `height: auto` sizing, so their aspect ratios remain unchanged on narrow viewports.

## Callouts and color modes

- Example: light title `#1e90ff`; dark title `#58adff`; no filled card surface.
- Summary: light title `#00a9b8`; dark title `#67e8f9`; no filled card surface.
- Explanation: light title `#191970`, surface `#f0f8ff`, border `#30343b`; dark title `#bdc8ff`, surface `#15243a`, border `#738097`.

Equation numbers and long formulas remain horizontally scrollable, and tables use their own horizontal scroll containers on mobile.
