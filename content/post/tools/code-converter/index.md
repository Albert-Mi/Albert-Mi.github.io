---
title: "Code Converter - Image/PDF to LaTeX & Markdown"
date: 2026-01-13
description: "A free, browser-based tool to convert screenshots, photos, PDFs, and Word documents into clean LaTeX or Markdown code. Perfect for research notes, academic papers, and VSCode documentation."
slug: code-converter
tags: 
    - Tools
    - LaTeX
    - Markdown
    - Productivity
categories:
    - Tools
image: cover.png
weight: 1
math: true
draft: false
---

## 🚀 Launch the Tool

**[➡️ Open Code Converter](https://albert-mi.github.io/tools/code-converter.html)**

Convert your screenshots, photos, PDFs, and Word documents into clean, usable **LaTeX** or **Markdown** code — all for free, running entirely in your browser!

<!--more-->

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **📷 Image OCR** | Extract text from screenshots and photos using Tesseract.js |
| **📄 PDF Support** | Parse multi-page PDF documents with automatic OCR fallback |
| **📝 Word Docs** | Convert .docx files directly to structured text |
| **🔢 Math Detection** | Automatic conversion of mathematical symbols to LaTeX syntax |
| **📊 Table Recognition** | Converts tabular data to proper Markdown/LaTeX tables |
| **🌐 Multi-language** | Supports English, Chinese, Japanese, Korean, and more |
| **🆓 100% Free** | No account required, no data uploaded to servers |
| **🔒 Privacy First** | All processing happens locally in your browser |

## 📖 How to Use

### Step 1: Upload Your Files

Drag and drop or click to upload your files. Supported formats:
- **Images**: PNG, JPG, JPEG, GIF, WebP
- **Documents**: PDF, DOCX

### Step 2: Select Output Format

Choose between:

**Markdown** - Best for:
- VSCode documentation
- GitHub README files
- Research notes
- Blog posts

**LaTeX** - Best for:
- Academic papers
- Mathematical content
- Formal reports
- Thesis documents

### Step 3: Configure Options

| Option | Description |
|--------|-------------|
| **OCR Language** | Select the primary language of your document |
| **Document Structure** | Auto-detect, Article, Research Notes, or Slides |
| **Detect Math** | Automatically convert mathematical symbols to LaTeX |
| **Detect Tables** | Convert tabular content to proper table format |
| **Include Images** | Add placeholder references for embedded images |

### Step 4: Convert & Download

Click **Convert Files** to process. The tool shows:
- Real-time progress percentage
- Estimated time remaining
- File-by-file status

Once complete, you can:
- **Preview** the rendered output
- **Copy** to clipboard
- **Download** as `.md` or `.tex` file

## 💡 LaTeX Math Examples

The converter automatically detects and converts common mathematical expressions:

### Inline Math

Write inline math using single dollar signs:

```markdown
The golden ratio is $\varphi = \frac{1+\sqrt{5}}{2}$
```

Renders as: The golden ratio is $\varphi = \frac{1+\sqrt{5}}{2}$

### Block Math

Use double dollar signs for display equations:

```markdown
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

Renders as:

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

### Aligned Equations

For multi-line equations:

```latex
\begin{align}
E &= mc^2 \\
F &= ma \\
p &= mv
\end{align}
```

$$
\begin{align}
E &= mc^2 \\
F &= ma \\
p &= mv
\end{align}
$$

### Common Symbols Detected

| Symbol | LaTeX Code | Rendered |
|--------|-----------|----------|
| Greek letters | `\alpha, \beta, \gamma` | $\alpha, \beta, \gamma$ |
| Fractions | `\frac{a}{b}` | $\frac{a}{b}$ |
| Square root | `\sqrt{x}` | $\sqrt{x}$ |
| Summation | `\sum_{i=1}^{n}` | $\sum_{i=1}^{n}$ |
| Integral | `\int_a^b` | $\int_a^b$ |
| Infinity | `\infty` | $\infty$ |

## 📊 Markdown Tables

The converter recognizes tabular data and formats it properly:

```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
| Data 4   | Data 5   | Data 6   |
```

## 🖼️ Adding Images to GitHub

After converting, you may want to add images. Here's how to embed GitHub-hosted images:

### Step 1: Upload Image to Your Repository

1. Go to your GitHub repository
2. Navigate to the folder where you want to store images
3. Click **Add file** → **Upload files**
4. Drag your image and commit

### Step 2: Get the Raw URL

1. Click on the uploaded image
2. Click **Raw** button
3. Copy the URL (format: `https://raw.githubusercontent.com/USERNAME/REPO/main/path/image.png`)

### Step 3: Use in Markdown

```markdown
![Description of image](https://raw.githubusercontent.com/USERNAME/REPO/main/path/image.png)
```

### Step 4: Use in LaTeX

```latex
\begin{figure}[h]
    \centering
    \includegraphics[width=0.8\textwidth]{image.png}
    \caption{Your caption here}
    \label{fig:label}
\end{figure}
```

## 🔧 Technical Details

The Code Converter uses these open-source libraries:

| Library | Purpose | Version |
|---------|---------|---------|
| [Tesseract.js](https://tesseract.projectnaptha.com/) | OCR text extraction | 5.x |
| [PDF.js](https://mozilla.github.io/pdf.js/) | PDF parsing | 3.11 |
| [Mammoth.js](https://github.com/mwilliamson/mammoth.js) | DOCX conversion | 1.6 |
| [MathJax](https://www.mathjax.org/) | Math rendering | 3.x |

**All processing happens locally** — your files never leave your browser. This ensures complete privacy and works offline after the initial page load.

## 🎯 Use Cases

### Research Notes
Convert handwritten or scanned research notes into structured Markdown with proper sections:
- Abstract
- Introduction  
- Methods
- Results
- Conclusion

### Academic Papers
Transform PDF papers or images of equations into LaTeX-ready content with:
- Proper document structure
- Mathematical notation
- Table formatting
- Bibliography placeholders

### Course Materials
Digitize lecture slides and handouts into editable formats for:
- Study guides
- Flashcard creation
- Note compilation

### Documentation
Convert screenshots of code or technical diagrams into:
- README documentation
- Wiki pages
- Technical specifications

## 📱 Mobile Support

The tool works on mobile devices! Simply:
1. Open the tool in your mobile browser
2. Tap the upload zone to access your camera or photo library
3. Process and copy the results

## 🔗 Quick Links

- **[🚀 Launch Code Converter](https://albert-mi.github.io/tools/code-converter.html)**
- **[📖 Math Typesetting Guide](/post/begining/math-typesetting/)**
- **[📝 Markdown Syntax Guide](/post/begining/markdown/)**

## 💬 Feedback

Found a bug or have a feature request? Feel free to reach out or contribute to improving this tool!

---

*Similar to [Snip](https://mathpix.com/snip) but 100% free and open-source, running entirely in your browser.*
