import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.argv[2];
if (!root) throw new Error('Usage: node normalize-notes-math.mjs <markdown-directory>');

async function markdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => {
    const file = join(directory, entry.name);
    return entry.isDirectory() ? markdownFiles(file) : entry.name.endsWith('.md') ? [file] : [];
  }))).flat();
}

function normalize(source) {
  let text = source
    .replace(/page_number:\s*"13\.(\d+)"/g, 'page_number: "1.$1"')
    .replace(/page_number:\s*"14\.(\d+)"/g, 'page_number: "2.$1"');

  // `aligned` and `cases` are display environments. The source occasionally
  // wrapped them in single-dollar delimiters, which makes MathJax lose sync.
  text = text.replace(
    /(?<!\$)\$\s*(\\begin\{(?:aligned|cases|array)\}[\s\S]*?\\end\{(?:aligned|cases|array)\})\s*\$(?!\$)/g,
    (_, environment) => `\n$$\n${environment}\n$$\n`,
  );

  // Markdown treats `<t` in expressions such as `x_{<t}` as an HTML tag
  // before MathJax can see it. Use TeX's explicit comparison command instead.
  text = text
    .replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => `$$${math.replace(/</g, '\\lt ')}$$`)
    .replace(/(?<!\$)\$([^\n$]+?)\$(?!\$)/g, (_, math) => `$${math.replace(/</g, '\\lt ')}$`);
  const lines = text.split(/\r?\n/);
  const output = [];
  let fenced = false;
  let quotedMath = false;

  for (const originalLine of lines) {
    if (/^\s*```/.test(originalLine)) fenced = !fenced;
    if (fenced) {
      output.push(originalLine);
      continue;
    }

    let line = originalLine.replace(/^>\s*>\s*(?:>\s*)?/, '> ');
    const quoteBody = line.replace(/^>\s?/, '');

    if (!quotedMath && /^\s*\$\$\s*$/.test(quoteBody) && /^>/.test(line)) {
      output.push('$$');
      quotedMath = true;
      continue;
    }
    if (quotedMath) {
      if (/^\s*\$\$\s*$/.test(quoteBody)) {
        output.push('$$');
        quotedMath = false;
      } else {
        output.push(quoteBody);
      }
      continue;
    }

    // Goldmark requires display delimiters on their own lines. Splitting only
    // an accidental adjacent delimiter keeps all normal inline math intact.
    line = line.replace(/(\S)\s*\$\$\s*$/, '$1\n$$');
    line = line.replace(/^\$\$\s*(\S)/, '$$\n$1');
    output.push(line);
  }

  if (quotedMath) throw new Error('Unclosed quoted display formula');
  return output.join('\n');
}

const files = await markdownFiles(root);
for (const file of files) {
  const before = await readFile(file, 'utf8');
  const after = normalize(before);
  if (after !== before) await writeFile(file, after, 'utf8');
}
console.log(`Normalized ${files.length} Markdown files in ${root}`);

