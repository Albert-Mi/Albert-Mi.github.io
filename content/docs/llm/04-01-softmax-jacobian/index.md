---
title: "Softmax 雅可比矩阵"
weight: 4001
chapter: 4
page_number: "4.1"
chapter_slug: "04-mathematical-appendix"
is_section: true
root_heading_level: 3
type: docs
math: true
toc: false
---
<div class="fta-document">
<article class="fta-post">
<h3 id="section-78">Softmax 雅可比矩阵</h3>
<p>Softmax 定义：$p_i = e^{z_i} / S$，$S = \sum_k e^{z_k}$。对 $z_j$ 求导：</p>
<div class="fta-math fta-numbered-math" data-equations="A.1">\[
\begin{aligned}
\frac{\partial p_i}{\partial z_j}
= \frac{\mathbb{1}_{i=j}e^{z_i}S - e^{z_i}e^{z_j}}{S^2}
= p_i(\delta_{ij} - p_j).
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 A.1"><span class="fta-equation-number" aria-hidden="true">(A.1)</span></span></div>
<p>雅可比矩阵：$J_{\operatorname{softmax}}(z) = \operatorname{diag}(p) - pp^\top$。半正定性：$u^\top J u = \operatorname{Var}_{i\sim p}(u_i) \ge 0$。</p>
</article>
</div>
