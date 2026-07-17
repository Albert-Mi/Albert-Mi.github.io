---
title: "KL 散度非负性证明"
weight: 4002
chapter: 4
page_number: "4.2"
chapter_slug: "04-mathematical-appendix"
is_section: true
root_heading_level: 3
type: docs
math: true
toc: false
---
<div class="fta-document">
<article class="fta-post">
<h3 id="section-79">KL 散度非负性证明</h3>
<p>使用 $-\log u$ 的凸性和 Jensen 不等式：</p>
<div class="fta-math fta-numbered-math" data-equations="A.2">\[
\begin{aligned}
D_{KL}(P\Vert Q)
= \sum_x P(x)\left[-\log\frac{Q(x)}{P(x)}\right]
\ge -\log\left(\sum_x P(x)\frac{Q(x)}{P(x)}\right)
= -\log 1 = 0.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 A.2"><span class="fta-equation-number" aria-hidden="true">(A.2)</span></span></div>
<p>等号当且仅当 $P=Q$。</p>
</article>
</div>
