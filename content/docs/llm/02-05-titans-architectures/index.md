---
title: "Titans 三种架构"
weight: 2005
chapter: 2
page_number: "2.5"
chapter_slug: "02-transformer-and-titans"
is_section: true
root_heading_level: 3
type: docs
math: true
toc: false
---
<div class="fta-document">
<article class="fta-post">
<h3 id="section-21">Titans 三种架构</h3>
<p>Titans 提出了三种将长期记忆与注意力结合的具体架构。</p>
<h4 id="section-22">MAC</h4>
<p>MAC 的核心思想是：<strong>把长期记忆的读出结果当作额外的上下文 token 拼接到当前输入中，让注意力机制决定如何利用这些历史信息</strong>。</p>
<p>对于第 $t$ 个输入段 $S^{(t)}$，MAC 的计算流程为：</p>
<p><strong>步骤1 —— 从记忆中读取历史摘要：</strong></p>
<div class="fta-math fta-numbered-math" data-equations="1.109,1.110">\[
\begin{aligned}
q_t &amp;= S^{(t)} W_Q \quad \text{(query 投影)}\\
h_t &amp;= \mathcal{M}_{\phi_{t-1}}^\ast(q_t) \quad \text{(读取，不更新)}
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.109、1.110"><span class="fta-equation-number" aria-hidden="true">(1.109)</span><span class="fta-equation-number" aria-hidden="true">(1.110)</span></span></div>
<p><strong>步骤2 —— 构造增强输入序列：</strong></p>
<div class="fta-math fta-numbered-math" data-equations="1.111">\[
\begin{aligned}
\widetilde{S}^{(t)} = [P \,\|\, h_t \,\|\, S^{(t)}],
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.111"><span class="fta-equation-number" aria-hidden="true">(1.111)</span></span></div>
<p>即将持久记忆 $P$（任务先验）、历史摘要 $h_t$（长期记忆读出）、当前输入 $S^{(t)}$ 按顺序拼接。</p>
<p><strong>步骤3 —— 注意力处理：</strong></p>
<div class="fta-math fta-numbered-math" data-equations="1.112">\[
\begin{aligned}
y_t = \Attn(\widetilde{S}^{(t)}),
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.112"><span class="fta-equation-number" aria-hidden="true">(1.112)</span></span></div>
<p>让注意力在增强序列上自由决定如何分配权重。</p>
<p><strong>步骤4 —— 更新记忆并融合输出：</strong></p>
<div class="fta-math fta-numbered-math" data-equations="1.113,1.114">\[
\begin{aligned}
\mathcal{M}_{\phi_t} &amp;= \text{Update}(\mathcal{M}_{\phi_{t-1}}, y_t),\\
o_t &amp;= y_t \otimes \mathcal{M}_{\phi_t}^\ast(y_t).
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.113、1.114"><span class="fta-equation-number" aria-hidden="true">(1.113)</span><span class="fta-equation-number" aria-hidden="true">(1.114)</span></span></div>
<p>其中 $\otimes$ 是某种融合操作（如门控或加性组合）。</p>
<p>MAC 的直观意义是：<strong>先让长期记忆"提名"相关历史，再让注意力"决定"如何确切使用这些历史。</strong></p>
<figure class="fta-figure" style="--fta-figure-width: 437px"><img src="/p/from-transformer-to-agent-full/TitansMAC.png" alt="Titans MAC 架构图" loading="lazy" decoding="async"><figcaption>MAC 架构：长期记忆读出作为注意力上下文。</figcaption></figure>
<h4 id="section-23">MAG</h4>
<p>MAG 的核心思想是：<strong>用滑动窗口注意力处理局部上下文，用长期记忆处理远期依赖，最后通过门控机制动态融合两者的输出。</strong></p>
<div class="fta-math fta-numbered-math" data-equations="1.115,1.116,1.117">\[
\begin{aligned}
\widetilde{x} &amp;= [P \,\|\, x] \quad \text{(将持久记忆拼接到输入前)}\\
y_{\text{local}} &amp;= \text{SW-Attn}(\widetilde{x}) \quad \text{(滑动窗口注意力，只看局部)}\\
y_{\text{mem}} &amp;= \mathcal{M}(\widetilde{x}) \quad \text{(长期记忆的全局读出)}
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.115、1.116、1.117"><span class="fta-equation-number" aria-hidden="true">(1.115)</span><span class="fta-equation-number" aria-hidden="true">(1.116)</span><span class="fta-equation-number" aria-hidden="true">(1.117)</span></span></div>
<p>门控融合使用一个可学习的门控标量 $g\in(0,1)$：</p>
<div class="fta-math fta-numbered-math" data-equations="1.118,1.119">\[
\begin{aligned}
g &amp;= \sigma(W_g [y_{\text{local}}; y_{\text{mem}}] + b_g),\\
o &amp;= g \odot y_{\text{local}} + (1-g) \odot y_{\text{mem}}.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.118、1.119"><span class="fta-equation-number" aria-hidden="true">(1.118)</span><span class="fta-equation-number" aria-hidden="true">(1.119)</span></span></div>
<p>其中 $\sigma(u) = 1/(1+e^{-u})$ 是 sigmoid 函数，$\odot$ 是逐元素乘法。</p>
<p>门控的好处是：<strong>模型可以动态决定在当前上下文中，应该更依赖局部精确的注意力信息（$g$ 大），还是更依赖压缩的长期记忆（$g$ 小）。</strong></p>
<h4 id="section-24">MAL</h4>
<p>MAL 是最简洁的一种：把长期记忆模块当作一层神经网络，先压缩再注意力。</p>
<div class="fta-math fta-numbered-math" data-equations="1.120,1.121,1.122">\[
\begin{aligned}
\widetilde{x} &amp;= [P \,\|\, x],\\
y_{\text{mem}} &amp;= \mathcal{M}(\widetilde{x}),\\
o &amp;= \text{SW-Attn}(y_{\text{mem}}).
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.120、1.121、1.122"><span class="fta-equation-number" aria-hidden="true">(1.120)</span><span class="fta-equation-number" aria-hidden="true">(1.121)</span><span class="fta-equation-number" aria-hidden="true">(1.122)</span></span></div>
<p>MAL 将压缩放在前面——先让长期记忆模块对整个输入做非线性变换，然后再让注意力处理。这种设计更适合"记忆作为预处理"的场景，但牺牲了 MAC 那种"先召回再决策"的互补性。</p>
<h4 id="section-25">三者对比表</h4>
<figure class="fta-table-figure"><figcaption>MAC、MAG、MAL 三种 Titans 架构对比</figcaption><div class="fta-table-scroll"><table class="fta-table"><tr><th>架构</th><th>记忆如何接入</th><th>优点</th><th>代价或适用边界</th></tr><tr><td>MAC</td><td>长期记忆读出后作为额外上下文 token 拼接到注意力输入中</td><td>结构透明，注意力可以直接选择是否使用记忆读出</td><td>增强上下文会带来额外 token 与注意力计算</td></tr><tr><td>MAG</td><td>局部注意力分支与长期记忆分支并行，再用门控融合</td><td>能动态选择依赖局部上下文还是长期记忆</td><td>门控质量会影响融合效果，训练稳定性更关键</td></tr><tr><td>MAL</td><td>把长期记忆模块作为网络中的一层，先变换再交给注意力处理</td><td>形式简洁，容易嵌入层级结构</td><td>长期记忆与注意力的互补关系不如 MAC 直观</td></tr></table></div></figure>
<aside class="fta-callout fta-summary"><div class="fta-callout-title">Summary</div>
<p>三种架构的核心差异：</p>
<ol>
<li><strong>MAC</strong>：长期记忆读出 $\to$ 拼接为上下文 $\to$ 注意力决定怎么用——"先回忆，再判断"；</li>
<li><strong>MAG</strong>：注意力与长期记忆并行计算 $\to$ 门控融合——"两条通路，动态选择"；</li>
<li><strong>MAL</strong>：长期记忆作为预处理层 $\to$ 注意力后处理——"先压缩，再精细"。</li>
</ol>
<p>从"短期精确 + 长期压缩"的互补性看，MAC 往往最自然，也是实验中最强的变体。</p>
</aside>
<aside class="fta-callout fta-example"><div class="fta-callout-title">Example 20</div>
<p>在我们的翻译句子中，三种架构处理 "it$\to$cat" 依赖的方式：</p>
<p><strong>MAC</strong>（效果最好）：读到第8个 token "it" 时，$q_8$ 从长期记忆中读取出 "cat" 的语义向量 $h_8$。然后 $h_8$ 作为额外 token 拼入当前注意力窗口。注意力机制可以自由地让 "it" 直接关注这个代表 "cat" 的历史摘要——就像在上下文窗口中凭空插入了一个"cat 的记忆 token"。</p>
<p><strong>MAG</strong>：局部滑动窗口注意力只看 "it" 附近的 token（如 "because it was"），不直接看到 "cat"。但长期记忆分支从累积参数中检索到 "cat" 信息。门控机制判断代词的翻译更需要长期记忆（$g\approx 0.2$，偏向记忆分支），从而正确输出。</p>
<p><strong>MAL</strong>：所有输入先经过记忆模块压缩变换，此时 "cat" 的信息已经融入变换后的表示中，即使后续注意力窗口有限，处理 "it" 时也能感知到 "cat"。</p>
<p>可以看出，MAC 的方案最透明：长期记忆的读出就是一个"虚拟 token"，注意力可以直接看到它。这就是为什么 MAC 在长程依赖任务上表现最优。</p>
</aside>
</article>
</div>
