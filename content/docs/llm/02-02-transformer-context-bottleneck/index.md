---
title: "Transformer 的长上下文瓶颈"
weight: 2002
chapter: 2
page_number: "2.2"
chapter_slug: "02-transformer-and-titans"
is_section: true
root_heading_level: 3
type: docs
math: true
toc: false
---
<div class="fta-document">
<article class="fta-post">
<h3 id="section-13">Transformer 的长上下文瓶颈</h3>
<h4 id="pdf-time-space-complexity">时间与空间复杂度的严格分析</h4>
<p>设序列长度为 $T$，隐藏维度为 $d$。分析单层自注意力的计算复杂度。</p>
<p><strong>步骤1：</strong> 先计算 $Q = HW_Q$，其中 $H\in\mathbb{R}^{T\times d}$，$W_Q\in\mathbb{R}^{d\times d_k}$。矩阵乘法复杂度为 $O(T d d_k)$。若 $d_k = d$，则为 $O(T d^2)$。再计算注意力分数矩阵 $S = QK^\top$，其中 $Q\in\mathbb{R}^{T\times d_k}$，$K^\top\in\mathbb{R}^{d_k\times T}$。复杂度为 $O(T^2 d_k)$。</p>
<p><strong>步骤2：</strong> Softmax 操作时对 $T\times T$ 矩阵的每一行做归一化，复杂度 $O(T^2)$。再计算注意力加权求和 $O = AV$，其中 $A\in\mathbb{R}^{T\times T}$，$V\in\mathbb{R}^{T\times d_v}$。复杂度为 $O(T^2 d_v)$。</p>
<p>综合而言，自注意力的复杂度由 $T^2$ 项主导：</p>
<div class="fta-math fta-numbered-math" data-equations="1.77">\[
\begin{aligned}
\text{Time} = O(T^2 d_k + T^2 d_v) = O(T^2 d).
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.77"><span class="fta-equation-number" aria-hidden="true">(1.77)</span></span></div>
<p>空间上，注意力矩阵 $A\in\mathbb{R}^{T\times T}$ 需要 $O(T^2)$ 的内存。</p>
<p>当 $T$ 很大（例如 $T=10^5$，一本书的长度），$T^2 = 10^{10}$，即使GPU高效，这也是巨大的负担。</p>
<h5 id="pdf-attention-short-term-memory">为什么注意力本质上是一种"短期记忆"</h5>
<p>从记忆系统的角度看：</p>
<ul>
<li><strong>注意力的优点：</strong> 读取精确。当前位置可以直接与窗口内任意位置建立联系，权重由数据内容动态决定。这比固定卷积核或循环连接灵活得多。</li>
<li><strong>注意力的缺点：</strong> 窗口有限。即使使用 KV-cache 技术（缓存之前计算的 Key 和 Value 来避免重复计算），模型也必须在计算和存储上承担 $O(T^2)$ 的代价。实际部署中，上下文窗口受显存和延迟的强约束。</li>
</ul>
<p>因此，注意力像一个"短期工作记忆"系统：在当前窗口里查找非常准确，但窗口外的信息只能靠压缩过的隐藏表示、摘要 token 或者额外的记忆模块来间接访问。</p>
<h5 id="pdf-long-chain-dilemma">长链推理的矛盾</h5>
<p>若上下文非常长，模型面临一个根本性的两难困境：</p>
<ol>
<li><strong>保持大窗口：</strong> 精度高，但计算和存储成本以 $O(T^2)$ 增长，迅速变得不可承受；</li>
<li><strong>压缩/截断：</strong> 效率高，但压缩过程中必然丢失细节信息，长距离依赖被削弱。</li>
</ol>
<p>这正引出了 Titans 试图解决的核心问题：<strong>能否保留注意力的短程精确性，同时引入一个可持续更新的长期记忆模块来弥补远处历史的信息损失？</strong></p>
<aside class="fta-callout fta-example"><div class="fta-callout-title">Example 13</div>
<p>在我们的翻译例子中，假设源句后面还有一整段话（共100个 token）。纯 Transformer 要翻译第100个位置时，注意力矩阵是 $100\times 100$ 的。如果源句是整篇文章（10000 token），注意力矩阵就是 $10000^2 = 10^8$ 级别，显存无法承受。</p>
<p>具体到 "it→cat" 的代词消解：如果 "cat" 在第2个位置而 "it" 在第1000个位置，中间隔了998个 token，纯注意力需要存储 $1000\times 1000$ 的矩阵才能建立这个连接。而 Titans 的思路是：当模型读到 "cat" 时，就把它写入长期记忆；读到 "it" 时，从长期记忆中召回 "cat"——不再需要在注意力矩阵中显式保存998个中间 token 的依赖关系。</p>
</aside>
<aside class="fta-callout fta-summary"><div class="fta-callout-title">Summary</div>
<p>Transformer 的核心瓶颈不是"不会建模依赖"，而是"只能在有限上下文中高精度建模依赖"。长链推理需要的信息往往分布在很远的位置，因此必须有某种机制把远处历史压缩并保留下来。这正是 Titans 试图解决的。</p>
</aside>
</article>
</div>
