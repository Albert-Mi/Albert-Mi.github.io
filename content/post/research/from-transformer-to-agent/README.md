# From Transformer to Agent

This folder is prepared as a Hugo page bundle.

Copy the whole `from-transformer-to-agent` folder into:

`content/post/research/from-transformer-to-agent/`

The target post file is `index.html`. The `preview.html` file is only for local checking and should not be copied into the public post if you do not want it served.

Notes:
- `index.html` includes the interactive Transformer explainer at the top with no extra introduction text.
- The callout styles cover `sumbox`, `exbox`, and `example` equivalents and include light/dark mode variables.
- Uploaded images were copied directly. LaTeX references to `TransSA.png` and `TransProb.png` are mapped to `TransAttention.png` and `TransDecoding.png`.
- TikZ-only diagrams were converted to lightweight web SVG diagrams, because the original TeX diagrams were not available as image files.
- Your Hugo/theme layout must allow page-level HTML, CSS, and JavaScript in content. If the theme blocks this, move the CSS/JS into the theme assets or a shortcode.
