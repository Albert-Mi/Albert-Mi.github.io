---
title: "Euler和RK4解法对比"
weight: 4005
chapter: 4
page_number: "4.5"
chapter_slug: "04-mathematical-appendix"
is_section: true
root_heading_level: 3
type: docs
math: true
toc: false
---
<div class="fta-document">
<article class="fta-post">
<h3 id="section-82">Euler和RK4解法对比</h3>
<p>为什么人类会偏好 A？因为谐振子问题的关键不是“画个轨迹”而是：<code>数值方法是否尊重物理守恒量？</code></p>
<p>我们甚至可以直接算 Euler 法为什么糟糕。</p>
<p>显式 Euler： $\{ x_{n+1} &amp;= x_n + t v_n \\ v_{n+1} &amp;= v_n - t x_n .$. 能量：$E_n = \frac{1}{2}(x_n^2 + v_n^2)$</p>
<p>下一步能量：</p>
<div class="fta-math fta-numbered-math" data-equations="A.5,A.6,A.7,A.8">\[
\begin{aligned}
E_{n+1} &amp;= \frac{1}{2}\left[(x_n+\Delta t v_n)^2 + (v_n-\Delta t x_n)^2\right]\\
    &amp;= \frac{1}{2}
    \left[
    x_n^2 + 2\Delta t x_n v_n + \Delta t^2 v_n^2
    +
    v_n^2 - 2\Delta t x_n v_n + \Delta t^2 x_n^2
    \right]\\
    &amp;= \frac{1}{2}(1+\Delta t^2)(x_n^2 + v_n^2)\\
    &amp;= (1+\Delta t^2)E_n
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 A.5、A.6、A.7、A.8"><span class="fta-equation-number" aria-hidden="true">(A.5)</span><span class="fta-equation-number" aria-hidden="true">(A.6)</span><span class="fta-equation-number" aria-hidden="true">(A.7)</span><span class="fta-equation-number" aria-hidden="true">(A.8)</span></span></div>
<p>这说明显式 Euler 每一步都会把能量乘上 $1+\Delta t^2$，所以能量必然指数增长。</p>
<p>如果取：$\Delta t = 0.1$, 10 个周期$T_{\text{end}} = 10 \cdot 2\pi \approx 62.83$, 步数约为：$n = \frac{62.83}{0.1} \approx 628$</p>
<p>所以 Euler 最终能量大约是：</p>
<div class="fta-math fta-numbered-math" data-equations="A.9">\[
\begin{aligned}
E_{628} = E_0 (1+0.1^2)^{628}
    = 0.5 \times 1.01^{628} \approx 258.70
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 A.9"><span class="fta-equation-number" aria-hidden="true">(A.9)</span></span></div>
<p>相对误差：</p>
<div class="fta-math fta-numbered-math" data-equations="A.10">\[
\begin{aligned}
\frac{E_{628} - E_0}{E_0} = \frac{258.70 - 0.5}{0.5} \approx 516.4
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 A.10"><span class="fta-equation-number" aria-hidden="true">(A.10)</span></span></div>
<p>也就是：<code>Euler 法能量漂移约 51640%</code>.这非常严重。</p>
<p>而 RK4 在同样 $\Delta t=0.1$、10 个周期下，数值上最终能量大约：$E_{\text{RK4}} \approx 0.4999956$</p>
<p>相对误差：</p>
<div class="fta-math fta-numbered-math" data-equations="A.11">\[
\begin{aligned}
\frac{0.4999956 - 0.5}{0.5} \approx -8.7 \times 10^{-6}
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 A.11"><span class="fta-equation-number" aria-hidden="true">(A.11)</span></span></div>
<p>也就是：<code>RK4 的能量误差约为 -0.00087%</code></p>
<p>所以人类标注者会选择：</p>
<div class="fta-math fta-numbered-math" data-equations="A.12">\[
\begin{aligned}
y^+ = \text{回答 A}, \quad y^- = \text{回答 B}
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 A.12"><span class="fta-equation-number" aria-hidden="true">(A.12)</span></span></div>
</article>
</div>
