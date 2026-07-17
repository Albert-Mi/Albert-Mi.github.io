---
title: "记忆视角：Attention、KV Cache、线性记忆"
weight: 2003
chapter: 2
page_number: "2.3"
chapter_slug: "02-transformer-and-titans"
is_section: true
root_heading_level: 3
type: docs
math: true
toc: false
---
<div class="fta-document">
<article class="fta-post">
<h3 id="section-14">记忆视角：Attention、KV Cache、线性记忆</h3>
<aside class="fta-callout fta-summary"><div class="fta-callout-title">Summary</div>
<p>从记忆视角看，Attention 是窗口内的精确读取机制；KV-cache 是推理时对历史 Key/Value 的缓存机制；线性记忆则进一步把历史压缩进可更新的矩阵参数中。Titans 的长期神经记忆正是在这个方向上，把线性记忆推广为非线性、可在线更新的神经网络记忆。</p>
</aside>
<p>在引入 Titans 的神经长期记忆之前，我们先看一个更简单、更直观的线性记忆模型，它奠定了后续所有讨论的基础。</p>
<p>假设我们持续收到键值对 $(k_1,v_1),(k_2,v_2),\dots$，其中 $k_t\in\mathbb{R}^{d_k}$（key 向量），$v_t\in\mathbb{R}^{d_v}$（value 向量）。我们想设计一个<em>记忆矩阵</em> $M_t\in\mathbb{R}^{d_k\times d_v}$，它通过不断"写入"新的键值对来累积历史信息。</p>
<p>最简单的写入规则是<strong>外积相加</strong>：</p>
<div class="fta-math fta-numbered-math" data-equations="1.78">\[
\begin{aligned}
M_t = M_{t-1} + k_t^\top v_t,
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.78"><span class="fta-equation-number" aria-hidden="true">(1.78)</span></span></div>
<p>其中 $k_t^\top v_t$ 是 $d_k\times 1$ 与 $1\times d_v$ 的外积，得 $d_k\times d_v$ 矩阵。</p>
<p>给定查询 $q_t\in\mathbb{R}^{d_k}$，从记忆中读取：</p>
<div class="fta-math fta-numbered-math" data-equations="1.79">\[
\begin{aligned}
y_t = q_t M_t \in \mathbb{R}^{d_v}.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.79"><span class="fta-equation-number" aria-hidden="true">(1.79)</span></span></div>
<p>展开这个递推关系（假设 $M_0=0$）：</p>
<div class="fta-math fta-numbered-math" data-equations="1.80">\[
\begin{aligned}
y_t = q_t \left(\sum_{j=1}^{t} k_j^\top v_j\right) = \sum_{j=1}^{t} (q_t \cdot k_j) v_j.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.80"><span class="fta-equation-number" aria-hidden="true">(1.80)</span></span></div>
<p>这个展开的结果非常优雅：读出等于所有历史 value 的加权和，权重由查询与各 key 的点积决定。这与注意力机制的形式高度相似，但关键区别在于——<strong>历史信息被写入参数 $M_t$，而不是全部显式保存在上下文窗口中</strong>。</p>
<h4 id="pdf-linear-memory-least-squares">线性记忆与最小二乘的对偶关系</h4>
<p>线性记忆还有一个更深层的数学解释：它等价于在线性回归问题上的在线梯度下降。</p>
<p>假设我们希望找到一个线性映射 $M\in\mathbb{R}^{d_k\times d_v}$，使得对所有已见样本 $j=1,\dots,t$，有 $k_j M \approx v_j$。定义最小二乘损失：</p>
<div class="fta-math fta-numbered-math" data-equations="1.81">\[
\begin{aligned}
\mathcal{L}_t(M) = \frac{1}{2}\sum_{j=1}^{t} \|k_j M - v_j\|_2^2.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.81"><span class="fta-equation-number" aria-hidden="true">(1.81)</span></span></div>
<p>令 $K_t\in\mathbb{R}^{t\times d_k}$ 为所有已见 key 堆叠而成的矩阵，$V_t\in\mathbb{R}^{t\times d_v}$ 为所有已见 value 堆叠的矩阵。则损失可简洁地写为</p>
<div class="fta-math fta-numbered-math" data-equations="1.82">\[
\begin{aligned}
\mathcal{L}_t(M) = \frac{1}{2}\|K_t M - V_t\|_F^2.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.82"><span class="fta-equation-number" aria-hidden="true">(1.82)</span></span></div>
<p>对 $M$ 求导并令其为零（正规方程）：</p>
<div class="fta-math fta-numbered-math" data-equations="1.83">\[
\begin{aligned}
\nabla_M \mathcal{L}_t = K_t^\top(K_t M - V_t) = 0 \quad\Longrightarrow\quad K_t^\top K_t M = K_t^\top V_t.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.83"><span class="fta-equation-number" aria-hidden="true">(1.83)</span></span></div>
<p>若 $K_t^\top K_t$ 可逆，则最优解为</p>
<div class="fta-math fta-numbered-math" data-equations="1.84">\[
\begin{aligned}
M_t^\star = (K_t^\top K_t)^{-1} K_t^\top V_t.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.84"><span class="fta-equation-number" aria-hidden="true">(1.84)</span></span></div>
<p>在线性记忆的外积更新规则下，$M_t = K_t^\top V_t$（假设初始 $M_0=0$）。因此线性记忆实际上存储了 $K_t^\top V_t$。若要得到真正的最小二乘解，还需要左乘 $(K_t^\top K_t)^{-1}$——这就是线性注意力中各种归一化方案的数学根源。</p>
<h5 id="pdf-linear-to-nonlinear">从线性到非线性：Titans 的核心洞察</h5>
<p>线性记忆的表达能力受限于"线性映射"这一函数类。若历史中的有效规律需要非线性组合、条件化、门控——例如"若主语是阴性，则代词用 she；若是阳性，用 he"——线性记忆无法很好地捕捉。</p>
<p>Titans 的核心洞察是：<strong>将记忆矩阵 $M$ 替换为一个深度神经网络 $\mathcal{M}_\phi$，参数 $\phi$ 在测试时持续在线更新</strong>。这样一来，记忆不再是简单的外积累加，而是一个能够表达复杂非线性关系、并且能够"选择性地记住和遗忘"的神经模块。</p>
<aside class="fta-callout fta-example"><div class="fta-callout-title">Example 14</div>
<p>在我们的翻译例子中，线性记忆的工作方式如下。设 $d_k = d_v = 3$，处理前三个 token 时：</p>
<div class="fta-math fta-numbered-math" data-equations="1.85,1.86,1.87">\[
\begin{aligned}
k_1=[1,0,0], v_1=[0.8, 0.1, 0.1] &amp;\quad (\text{&quot;The&quot;})\\
k_2=[0,1,0], v_2=[0.2, 0.7, 0.1] &amp;\quad (\text{&quot;cat&quot;})\\
k_3=[0,0,1], v_3=[0.1, 0.1, 0.8] &amp;\quad (\text{&quot;sat&quot;})
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.85、1.86、1.87"><span class="fta-equation-number" aria-hidden="true">(1.85)</span><span class="fta-equation-number" aria-hidden="true">(1.86)</span><span class="fta-equation-number" aria-hidden="true">(1.87)</span></span></div>
<p>记忆矩阵累积为 $M_3 = k_1^\top v_1 + k_2^\top v_2 + k_3^\top v_3 = \begin{bmatrix}0.8&amp;0.1&amp;0.1\\ 0.2&amp;0.7&amp;0.1\\ 0.1&amp;0.1&amp;0.8\end{bmatrix}$。</p>
<p>当处理到 "it"（第8个 token）时，查询 $q_8=[0.1, 0.9, 0.0]$（高度倾向 "cat" 相关），则读出为 $y_8 = q_8 M_8$，结果会包含大量与 "cat" 相关的信息。</p>
<p>但线性记忆的问题在于：它"平等地"累加所有 token 的信息，无法"选择性遗忘"不重要内容（如冠词 "the"）。Titans 的神经记忆通过 surprise 驱动的梯度更新，自动给重要 token（如实词、实体）更高的写入权重。</p>
</aside>
<aside class="fta-callout fta-summary"><div class="fta-callout-title">Summary</div>
<p>线性记忆把历史压缩进矩阵参数 $M_t$ 中：外积写入、点积读取。它等价于在线最小二乘回归器。Titans 把这个思想从线性映射推广到深度神经网络，获得了更强的表达能力和选择性记忆/遗忘能力。</p>
</aside>
</article>
</div>
