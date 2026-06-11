(() => {
  const root = document.getElementById('transformer-explainer');
  if (!root) return;

  const examples = [
    'Data visualization empowers users to see',
    'The cat sat on the mat because it was',
    'An agent checks tools before it',
    'Transformers connect tokens through attention'
  ];

  const nextWords = ['visualize', 'create', 'see', 'make', 'easily', 'quickly', 'explore', 'find', 'understand', 'build', 'compare', 'reason'];
  const base = [0.55, 0.21, 0.12, 0.06, 0.04, 0.02, 0.015, 0.01, 0.008, 0.006, 0.004, 0.002];
  let state = { text: examples[0], temp: 0.8, mode: 'top-k', k: 5, p: 0.9, active: 0, head: 1 };

  root.className = 'tx-demo';
  root.innerHTML = `
    <div class="tx-shell">
      <div class="tx-toolbar">
        <div class="tx-logo">TRANSFORMER EXPLAINER</div>
        <select class="tx-examples" aria-label="Examples">${examples.map((x, i) => `<option value="${i}">Examples ${i + 1}</option>`).join('')}</select>
        <input class="tx-input" type="text" value="${examples[0]}" aria-label="Prompt">
        <button class="tx-generate" type="button">Generate</button>
        <label class="tx-control">Temperature <input class="tx-temp" type="range" min="0.2" max="1.6" step="0.1" value="0.8"><span class="tx-temp-label">0.8</span></label>
        <div class="tx-radio" role="radiogroup" aria-label="Sampling">
          <label><input type="radio" name="tx-mode" value="top-k" checked> Top-k</label>
          <label><input type="radio" name="tx-mode" value="top-p"> Top-p</label>
          <span class="tx-sampling-label">k=5</span>
        </div>
      </div>
      <div class="tx-canvas">
        <svg class="tx-stage" viewBox="0 0 1180 610" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Transformer explainer"></svg>
        <div class="tx-head-controls">
          <span class="tx-head-label">Head 1 of 12</span>
          <button type="button" class="tx-prev" aria-label="Previous head">‹</button>
          <button type="button" class="tx-next" aria-label="Next head">›</button>
        </div>
      </div>
    </div>`;

  const svg = root.querySelector('.tx-stage');
  const input = root.querySelector('.tx-input');
  const temp = root.querySelector('.tx-temp');
  const tempLabel = root.querySelector('.tx-temp-label');
  const samplingLabel = root.querySelector('.tx-sampling-label');
  const headLabel = root.querySelector('.tx-head-label');

  function tokens() {
    return state.text.trim().split(/\s+/).filter(Boolean).slice(0, 8);
  }

  function scaledProbs() {
    const logits = base.map(p => Math.log(p + 1e-9) / state.temp);
    const max = Math.max(...logits);
    let probs = logits.map(v => Math.exp(v - max));
    const sum = probs.reduce((a, b) => a + b, 0);
    probs = probs.map(v => v / sum);
    if (state.mode === 'top-k') {
      probs = probs.map((v, i) => i < state.k ? v : 0);
    } else {
      let acc = 0;
      probs = probs.map(v => {
        acc += v;
        return acc <= state.p || acc - v === 0 ? v : 0;
      });
    }
    const norm = probs.reduce((a, b) => a + b, 0) || 1;
    return probs.map(v => v / norm);
  }

  function attention(i, j) {
    const d = Math.abs(i - j);
    const focus = state.head % 3;
    let v = Math.exp(-d * (0.42 + focus * 0.13));
    if (focus === 0 && j === 0) v += 0.8;
    if (focus === 1 && j === Math.max(0, i - 1)) v += 0.55;
    if (focus === 2 && j === tokens().length - 1) v += 0.5;
    return Math.min(1, v / 1.8);
  }

  function path(x1, y1, x2, y2, color, width, opacity = .5) {
    const cx = (x1 + x2) / 2;
    return `<path class="tx-flow" d="M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}" stroke="${color}" stroke-width="${width}" opacity="${opacity}"/>`;
  }

  function render() {
    const t = tokens();
    const probs = scaledProbs();
    state.active = Math.min(state.active, Math.max(0, t.length - 1));
    headLabel.textContent = `Head ${state.head} of 12`;
    tempLabel.textContent = Number(state.temp).toFixed(1);
    samplingLabel.textContent = state.mode === 'top-k' ? `k=${state.k}` : `p=${state.p.toFixed(1)}`;

    const y0 = 110;
    const gap = 58;
    let out = '';
    out += `<text x="35" y="38" class="tx-label">Embedding</text>`;
    out += `<text x="325" y="38" class="tx-label">Multi-head Self Attention</text>`;
    out += `<text x="835" y="38" class="tx-label">MLP</text>`;
    out += `<text x="1005" y="38" class="tx-label">Probabilities</text>`;
    out += `<text x="245" y="18" class="tx-label">Transformer Block 1</text>`;
    out += `<text x="905" y="18" class="tx-label">11 more identical Transformer Blocks</text>`;

    t.forEach((tok, i) => {
      const y = y0 + i * gap;
      const active = i === state.active ? ' is-active' : '';
      out += `<g class="tx-token${active}" data-token="${i}"><rect x="35" y="${y - 23}" width="126" height="42"></rect><text x="98" y="${y + 4}" text-anchor="middle">${escapeXml(tok)}</text></g>`;
      out += `<rect x="175" y="${y - 23}" width="14" height="42" fill="var(--tx-border)" opacity=".45"></rect>`;
      ['Q','K','V'].forEach((qkv, q) => {
        const yy = y - 23 + q * 14;
        out += `<rect class="tx-${qkv.toLowerCase()}" x="205" y="${yy}" width="18" height="13" opacity=".7"></rect><text x="214" y="${yy + 10}" text-anchor="middle" font-size="11" fill="#fff">${qkv}</text>`;
      });
      out += path(161, y, 205, y, 'var(--tx-blue)', 2, .35);
    });

    t.forEach((tok, i) => {
      const y = y0 + i * gap;
      const a = attention(state.active, i);
      out += path(225, y, 520, 245, i === state.active ? 'var(--tx-purple)' : 'var(--tx-red)', 1 + 6 * a, .16 + .45 * a);
      out += `<text x="410" y="${230 + i * 15}" text-anchor="end" fill="var(--tx-text)" font-size="12">${escapeXml(tok)}</text>`;
    });

    out += `<rect x="310" y="88" width="375" height="330" fill="var(--tx-bg)" stroke="var(--tx-border)" opacity=".78"></rect>`;
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const v = attention(r % Math.max(1, t.length), c % Math.max(1, t.length));
        out += `<circle class="tx-attention-dot" cx="${455 + c * 18}" cy="${230 + r * 18}" r="7" fill="var(--tx-purple)" opacity="${.12 + v * .78}"></circle>`;
      }
    }
    out += `<text x="512" y="334" class="tx-label" text-anchor="middle">Attention</text>`;
    out += `<text x="420" y="165" fill="var(--tx-red)" font-size="16">Key</text>`;
    out += `<text x="414" y="285" fill="var(--tx-blue)" font-size="16">Query</text>`;
    out += `<text x="416" y="382" fill="var(--tx-green)" font-size="16">Value</text>`;

    t.forEach((tok, i) => {
      const y = y0 + i * gap;
      out += path(675, 245, 790, y, 'var(--tx-purple)', 2, .52);
      out += `<g class="tx-token"><rect x="792" y="${y - 23}" width="110" height="42"></rect><text x="847" y="${y + 4}" text-anchor="middle">${escapeXml(tok)}</text></g>`;
      out += `<rect x="910" y="${y - 23}" width="26" height="42" fill="var(--tx-purple)" opacity=".2"></rect>`;
      out += `<rect x="943" y="${y - 23}" width="14" height="42" fill="var(--tx-blue)" opacity=".25"></rect>`;
    });

    probs.slice(0, 11).forEach((p, i) => {
      const y = 108 + i * 37;
      const top = p === Math.max(...probs);
      out += `<g class="tx-prob${top ? ' is-top' : ''}"><text x="1010" y="${y + 5}" text-anchor="end">${escapeXml(nextWords[i])}</text><line class="tx-prob-line" x1="1024" y1="${y}" x2="1110" y2="${y}"></line><line class="tx-prob-fill" x1="1024" y1="${y}" x2="${1024 + p * 150}" y2="${y}"></line><text x="1120" y="${y + 5}">${(p * 100).toFixed(1)}%</text></g>`;
    });

    svg.innerHTML = out;
    svg.querySelectorAll('.tx-token[data-token]').forEach(el => {
      el.addEventListener('click', () => {
        state.active = Number(el.getAttribute('data-token'));
        render();
      });
    });
  }

  function chooseNext() {
    const probs = scaledProbs();
    let r = Math.random();
    let idx = probs.length - 1;
    for (let i = 0; i < probs.length; i++) {
      r -= probs[i];
      if (r <= 0) { idx = i; break; }
    }
    const words = state.text.trim().split(/\s+/).filter(Boolean);
    words.push(nextWords[idx]);
    state.text = words.slice(-8).join(' ');
    input.value = state.text;
    state.active = Math.max(0, tokens().length - 1);
    render();
  }

  function escapeXml(value) {
    return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }

  root.querySelector('.tx-examples').addEventListener('change', e => {
    state.text = examples[Number(e.target.value)];
    input.value = state.text;
    state.active = 0;
    render();
  });
  input.addEventListener('input', e => {
    state.text = e.target.value;
    state.active = 0;
    render();
  });
  temp.addEventListener('input', e => {
    state.temp = Number(e.target.value);
    render();
  });
  root.querySelector('.tx-generate').addEventListener('click', chooseNext);
  root.querySelectorAll('input[name="tx-mode"]').forEach(radio => {
    radio.addEventListener('change', e => {
      state.mode = e.target.value;
      render();
    });
  });
  root.querySelector('.tx-prev').addEventListener('click', () => {
    state.head = state.head === 1 ? 12 : state.head - 1;
    render();
  });
  root.querySelector('.tx-next').addEventListener('click', () => {
    state.head = state.head === 12 ? 1 : state.head + 1;
    render();
  });

  render();
})();
