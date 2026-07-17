---
title: "数值方法的局部截断误差"
weight: 4004
chapter: 4
page_number: "4.4"
chapter_slug: "04-mathematical-appendix"
is_section: true
root_heading_level: 3
type: docs
math: true
toc: false
---
<div class="fta-document">
<article class="fta-post">
<h3 id="section-81">数值方法的局部截断误差</h3>
<p>对一阶 ODE $\dot y = f(t,y)$，Euler 法的局部截断误差为</p>
<div class="fta-math fta-numbered-math" data-equations="A.3">\[
\begin{aligned}
\text{LTE}_{\rm Euler} = \frac{h^2}{2}y&#x27;&#x27;(\xi) = O(h^2).
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 A.3"><span class="fta-equation-number" aria-hidden="true">(A.3)</span></span></div>
<p>经典 RK4 法的局部截断误差为</p>
<div class="fta-math fta-numbered-math" data-equations="A.4">\[
\begin{aligned}
\text{LTE}_{\rm RK4} = O(h^5).
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 A.4"><span class="fta-equation-number" aria-hidden="true">(A.4)</span></span></div>
<p>全局误差分别积累为 $O(h)$ 和 $O(h^4)$。</p>
</article>
</div>
