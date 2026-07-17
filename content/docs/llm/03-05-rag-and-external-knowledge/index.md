---
title: "RAG 与外部知识"
weight: 3005
chapter: 3
page_number: "3.5"
chapter_slug: "03-llm-and-agent"
is_section: true
root_heading_level: 3
type: docs
math: true
toc: false
---
<div class="fta-document">
<article class="fta-post">
<h3 id="section-68">RAG 与外部知识</h3>
<p>RAG 可以看作工具调用的一种重要形式，但由于它涉及文档切分、向量嵌入、相似度检索和证据注入，因此单独展开。</p>
<p>RAG（Retrieval-Augmented Generation，检索增强生成）<span class="fta-cite">[lewis2020rag]</span> 解决"上下文有限"和"知识需要外部更新"的问题。其数学形式为：文档被切成块 $d_i$，嵌入模型 $\phi$ 将文本块映射为向量 $z_i = \phi(d_i)\in\mathbb{R}^m$。查询 $q$ 的向量为 $z_q = \phi(q)$。余弦相似度：</p>
<div class="fta-math fta-numbered-math" data-equations="2.47">\[
\begin{aligned}
\operatorname{sim}(q, d_i) = \frac{z_q \cdot z_i}{\|z_q\|\,\|z_i\|}.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.47"><span class="fta-equation-number" aria-hidden="true">(2.47)</span></span></div>
<p>检索取相似度最高的 $K$ 个块：$\mathcal{D}_K(q) = \operatorname*{arg\,topK}_{d_i} \operatorname{sim}(q, d_i)$。然后将这些块拼接进 prompt：</p>
<div class="fta-math fta-numbered-math" data-equations="2.48">\[
\begin{aligned}
y \sim P_{\theta}(y\mid q, \mathcal{D}_K(q)).
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.48"><span class="fta-equation-number" aria-hidden="true">(2.48)</span></span></div>
<p>RAG 有三类误差值得关注：（1）<strong>检索误差</strong>——相关文档未被检索到；（2）<strong>证据误差</strong>——检索到的文档本身过时或错误；（3）<strong>生成误差</strong>——模型未忠实使用证据，或将多个来源错误混合。</p>
<aside class="fta-callout fta-example"><div class="fta-callout-title">Example 38</div>
<p>在我们的谐振子例子中，RAG 用于检索数值方法的相关知识：</p>
<p><strong>场景：</strong> 用户问 "RK4 法为什么比 Euler 法能量守恒更好？"</p>
<p><strong>检索过程：</strong></p>
<ol>
<li>Agent 将查询映射为向量 $z_q$；</li>
<li>在知识库（数值分析教材、物理计算手册）中检索 Top-3 片段：</li>
<ul>
<li>片段1："Euler 法是一阶 Runge-Kutta 方法，局部截断误差 $O(h^2)$，全局误差 $O(h)$。该方法不保持辛结构，长期积分导致能量漂移。"</li>
<li>片段2："经典四阶 Runge-Kutta 方法（RK4）的局部截断误差为 $O(h^5)$，全局误差为 $O(h^4)$。对谐振子等周期系统，RK4 的数值耗散远小于低阶方法。"</li>
<li>片段3："辛积分器（如 Verlet 法）专为哈密顿系统设计，精确保持相空间体积和能量。RK4 虽非严格辛方法，但在小步长下能量漂移可忽略。"</li>
</ul>
<li>Agent 将这三个片段放入 prompt，在回答中准确引用："根据 [1]，Euler 法的全局误差为 $O(h)$......根据 [3]，更严格的能量守恒需要辛积分器......"</li>
</ol>
<p><strong>如果没有 RAG：</strong> 模型可能只能给出模糊的回答，如 "RK4 更精确因为它是高阶方法"——缺少了局部截断误差的具体阶数、辛结构的重要性、以及与其他方法（如 Verlet）的比较。这些细节正是区分"大致正确"和"严格正确"的关键。</p>
</aside>
</article>
</div>
