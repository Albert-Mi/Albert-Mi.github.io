---
title: "About me"
type: "page"
slug: "about"
description: "Resume-style profile with CN/EN toggle"
---

<!-- Top header with logo + title -->
<div class="about-hero">
  <img src="/img/about-logo.svg" alt="About logo" class="about-logo">
  <div class="about-titleblock">
    <h1>About me</h1>
    <button id="langToggle" class="lang-toggle" aria-pressed="false" data-lang="en">English</button>
    <button id="langToggleCN" class="lang-toggle secondary" aria-pressed="true" data-lang="zh">中文</button>
  </div>
</div>

<!--
  We render two language containers and toggle visibility with JS.
  Each section is "modular": a card-like block (similar to posts).
-->

<!-- ================= CN ================= -->
<section class="about lang-zh" data-lang="zh" aria-label="中文简历">
  <!-- 基本信息 -->
  <article class="about-card">
    <h2>基本信息</h2>
    <ul class="about-list">
      <li><strong>姓名：</strong>宓（Mì）选</li>
      <li><strong>当前身份：</strong>博士在读（北京大学物理学院）</li>
      <li><strong>所在地：</strong>中国</li>
      <li><strong>联系方式：</strong>mix@stu.edu.pku.cn · +86 18663508806</li>
      <li><strong>个人网站：</strong><a href="https://albert-mi.github.io/" target="_blank" rel="noopener">albert-mi.github.io</a></li>
    </ul>
  </article>

  <!-- 发表情况 -->
  <article class="about-card">
    <h2>发表情况</h2>
    <ul class="about-list">
      <li>Quantum entanglement in the early universe, <em>Phys. Rev. D</em> 108, 043522.</li>
    </ul>
  </article>

  <!-- 教育经历 -->
  <article class="about-card">
    <h2>教育经历</h2>
    <ul class="about-list">
      <li><strong>北京大学</strong> · 理学博士在读 · 北京，中国（2023–至今）</li>
      <li><strong>爱丁堡大学</strong> · 理学硕士（荣誉）理论物理 · 英国爱丁堡（2022–2023）</li>
      <li><strong>滑铁卢大学</strong> · 理学学士（荣誉）数学物理 · 加拿大滑铁卢（2019–2021）</li>
      <li><strong>山东师范大学</strong> · 理学学士（2+2）物理学 · 中国山东（2017–2019）</li>
    </ul>
  </article>

  <!-- 软件技能 -->
  <article class="about-card">
    <h2>软件技能</h2>
    <p>Office, LaTeX, Matlab, Mathematica, Python</p>
  </article>

  <!-- 项目奖励（模块化块） -->
  <article class="about-card">
    <h2>项目经历</h2>
    <div class="about-project">
      <h3>量子波包动力学及其经典对应 · 北京大学（2022.09–至今）</h3>
      <ul>
        <li><strong>目标：</strong>比较不同 ℏ 下量子/经典动力学的演化，量化二者差异时间尺度。</li>
        <li><strong>方法：</strong>使用 TDAHO 哈密顿量模拟相空间演化，基于普朗克单元格的统计度量评估量子/经典概率分布差异。</li>
        <li><strong>结果：</strong>在混沌区，量子分布于有限“量子时间” τ ∝ 1/ℏ 后显著偏离经典分布。</li>
      </ul>
    </div>
    <div class="about-project">
      <h3>早期宇宙中的量子纠缠 · 爱丁堡大学（2022–2023）</h3>
      <ul>
        <li><strong>目标：</strong>研究膨胀宇宙中标量场亚哈勃/超哈勃模式的动量空间纠缠。</li>
        <li><strong>方法：</strong>在弯曲时空中用微扰量子场论计算纠缠熵。</li>
        <li><strong>结果：</strong>动量空间纠缠熵快速增长，揭示加速膨胀增强量子关联。</li>
      </ul>
    </div>
    <div class="about-project">
      <h3>在非奇异黑洞时空中获取量子纠缠关联 · 滑铁卢大学（2020–2021）</h3>
      <ul>
        <li><strong>目标：</strong>验证两个量子探测器能否从非奇异黑洞附近的真空中提取纠缠。</li>
        <li><strong>方法：</strong>量化探测器间相互作用，分析纠缠度量与参数 k 的关系。</li>
        <li><strong>结果：</strong>纠缠提取与 k 无明确依赖，中心奇点影响可忽略。</li>
      </ul>
    </div>
  </article>

  <!-- 荣誉与实践 -->
  <article class="about-card">
    <h2>荣誉与实践</h2>
    <ul class="about-list">
      <li>麻省理工学院“量子计算”暑期项目（全奖）</li>
      <li>滑铁卢大学优秀毕业生</li>
      <li>2022 年在爱丁堡大学组织“引力与波致现象建模”国际学术会议</li>
      <li>2023–24 学年研究生会“优秀学生干部”</li>
      <li>学生会组织部部长；轮滑协会教练；代表学校参加国际速滑比赛</li>
    </ul>
  </article>
</section>

<!-- ================= EN ================= -->
<section class="about lang-en" data-lang="en" aria-label="English resume" hidden>
  <article class="about-card">
    <h2>Profile</h2>
    <ul class="about-list">
      <li><strong>Name:</strong> Xuan Mi (surname “Mi”)</li>
      <li><strong>Status:</strong> Ph.D. student, School of Physics, Peking University</li>
      <li><strong>Location:</strong> China</li>
      <li><strong>Contact:</strong> mix@stu.edu.pku.cn · +86 186 6350 8806</li>
      <li><strong>Website:</strong> <a href="https://albert-mi.github.io/" target="_blank" rel="noopener">albert-mi.github.io</a></li>
    </ul>
  </article>

  <article class="about-card">
    <h2>Publication</h2>
    <ul class="about-list">
      <li><em>Quantum Entanglement in the Early Universe</em>, <strong>Physical Review D</strong> 108, 043522.</li>
    </ul>
  </article>

  <article class="about-card">
    <h2>Education</h2>
    <ul class="about-list">
      <li><strong>Peking University</strong> — Ph.D. in Physics (in progress), Beijing, China (2023–present)</li>
      <li><strong>The University of Edinburgh</strong> — M.Sc. (Hons) in Theoretical Physics, Edinburgh, UK (2022–2023)</li>
      <li><strong>University of Waterloo</strong> — B.Sc. (Hons) in Mathematical Physics, Waterloo, Canada (2019–2021)</li>
      <li><strong>Shandong Normal University</strong> — B.Sc. in Physics (2+2), Shandong, China (2017–2019)</li>
    </ul>
  </article>

  <article class="about-card">
    <h2>Software Skills</h2>
    <p>Office, LaTeX, Matlab, Mathematica, Python</p>
  </article>

  <article class="about-card">
    <h2>Projects</h2>
    <div class="about-project">
      <h3>Quantum Wave-Packet Dynamics vs. Classical Counterpart — Peking University (Sep 2022–present)</h3>
      <ul>
        <li><strong>Goal:</strong> Compare quantum and classical evolution under different ℏ and quantify the time scale of divergence.</li>
        <li><strong>Method:</strong> Model phase-space evolution with a time-dependent driven harmonic oscillator (TDAHO); evaluate distribution gaps via Planck-cell projections and statistical metrics.</li>
        <li><strong>Result:</strong> In chaotic regions, quantum distributions deviate from classical ones after a finite “quantum time” τ ∝ 1/ℏ.</li>
      </ul>
    </div>
    <div class="about-project">
      <h3>Quantum Entanglement in the Early Universe — University of Edinburgh (2022–2023)</h3>
      <ul>
        <li><strong>Goal:</strong> Study momentum-space entanglement between sub-/super-Hubble modes of a scalar field in an inflating universe.</li>
        <li><strong>Method:</strong> Perturbative QFT in curved spacetime to compute entanglement entropy.</li>
        <li><strong>Result:</strong> Momentum-space entanglement entropy grows rapidly, showing how accelerated expansion enhances quantum correlations.</li>
      </ul>
    </div>
    <div class="about-project">
      <h3>Entanglement Harvesting in Nonsingular Black-Hole Spacetimes — University of Waterloo (2020–2021)</h3>
      <ul>
        <li><strong>Goal:</strong> Test whether two initially uncorrelated detectors can harvest entanglement from the vacuum near a nonsingular black hole.</li>
        <li><strong>Method:</strong> Quantify detector–detector coupling; analyze entanglement measures as functions of the spacetime parameter k.</li>
        <li><strong>Result:</strong> No clear dependence on k; the central singularity’s absence has negligible effect on harvesting efficiency.</li>
      </ul>
    </div>
  </article>

  <article class="about-card">
    <h2>Honors & Activities</h2>
    <ul class="about-list">
      <li>MIT “Quantum Computing” Summer Program (full scholarship)</li>
      <li>Outstanding Graduate, University of Waterloo</li>
      <li>Organizer, “Modeling of Gravity & Wave-Induced Phenomena” international workshop (University of Edinburgh, 2022)</li>
      <li>Outstanding Student Leader (Graduate Student Union, 2023–24)</li>
      <li>Student Union (Head of Organization); Inline Skating Coach; Competed in international speed-skating events</li>
    </ul>
  </article>
</section>

<!-- Styles for cards (lightweight, theme-friendly) -->
<style>
  .about-hero{display:flex;align-items:center;gap:14px;margin-bottom:14px}
  .about-logo{width:44px;height:44px;opacity:.9}
  .about-titleblock h1{margin:0 0 6px 0}
  .lang-toggle{border:1px solid var(--content-border,#444);padding:.35rem .7rem;border-radius:999px;cursor:pointer;margin-right:.4rem}
  .lang-toggle.secondary{opacity:.8}
  .about{display:grid;grid-template-columns:1fr;gap:16px}
  .about-card{border:1px solid var(--content-border,#444);border-radius:16px;padding:16px;background:var(--card-bg,transparent)}
  .about-card h2{margin-top:0}
  .about-list{margin:.2rem 0 .2rem 1rem}
  .about-project h3{margin:.6rem 0}
  @media (min-width: 720px){ .about{grid-template-columns:1fr 1fr} }
</style>

<script>
(function(){
  const en = document.querySelector('.lang-en');
  const zh = document.querySelector('.lang-zh');
  const bEn = document.getElementById('langToggle');
  const bZh = document.getElementById('langToggleCN');
  const apply = (lang) => {
    const isEn = lang === 'en';
    en.hidden = !isEn; zh.hidden = isEn;
    bEn.classList.toggle('secondary', !isEn);
    bZh.classList.toggle('secondary', isEn);
    localStorage.setItem('about-lang', lang);
  };
  const saved = localStorage.getItem('about-lang') || 'zh';
  apply(saved);
  bEn.addEventListener('click', ()=>apply('en'));
  bZh.addEventListener('click', ()=>apply('zh'));
})();
</script>

_Notes_: Content translated/adapted from your Chinese résumé. Key items like education, projects, and the PRD paper reflect the source page. :contentReference[oaicite:0]{index=0}
