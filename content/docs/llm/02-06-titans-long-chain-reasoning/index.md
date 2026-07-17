---
title: "为什么 Titans 适合长链推理"
weight: 2006
chapter: 2
page_number: "2.6"
chapter_slug: "02-transformer-and-titans"
is_section: true
root_heading_level: 3
type: docs
math: true
toc: false
---
<div class="fta-document">
<article class="fta-post">
<h3 id="section-26">为什么 Titans 适合长链推理</h3>
<h4 id="pdf-multistep-information-fidelity">把长链推理写成多步信息保真问题</h4>
<p>设一个推理任务需要用到 $L$ 个分散在长上下文中的关键事实。对纯有限窗口 Transformer，在时刻 $t$ 能直接访问的只是最近 $W$ 个 token 内的内容。窗口外的事实只能通过压缩过的隐藏状态间接获取。</p>
<p>可以将总推理误差粗略分解为：</p>
<div class="fta-math fta-numbered-math" data-equations="1.123">\[
\begin{aligned}
\epsilon_{\text{total}} \approx \epsilon_{\text{retrieve}} + \epsilon_{\text{compress}} + \epsilon_{\text{reason}}.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.123"><span class="fta-equation-number" aria-hidden="true">(1.123)</span></span></div>
<p>其中 $\epsilon_{\text{retrieve}}$ 是检索不到相关事实导致的误差，$\epsilon_{\text{compress}}$ 是压缩历史时丢失关键细节导致的误差，$\epsilon_{\text{reason}}$ 是推理步骤本身的误差。</p>
<p>对于长链任务，纯 Transformer 的主要瓶颈通常不在 $\epsilon_{\text{reason}}$，而在前两项——检索不到足够远的事实，或者压缩时丢失了关键细节。</p>
<p>Titans 的优势：</p>
<ol>
<li>当前窗口内仍用注意力做 $O(W^2)$ 的高精度关系建模——$\epsilon_{\text{reason}}$ 不受影响；</li>
<li>远期历史通过长期记忆持续写入参数——$\epsilon_{\text{compress}}$ 由 surprise 机制保证重要信息被保留；</li>
<li>读取时根据当前 query 有针对性召回——$\epsilon_{\text{retrieve}}$ 通过记忆查询而非窗口扩展得到改善。</li>
</ol>
<h5 id="pdf-information-theory">信息论视角</h5>
<p>将远期历史记为随机变量 $H$，当前上下文记为 $C$，任务输出记为 $Y$。</p>
<p>纯有限窗口 Transformer 主要利用的是当前上下文与输出的互信息 $I(C;Y)$ 及少量被压缩的历史信息。当任务高度依赖远程事实时，会损失条件互信息：</p>
<div class="fta-math fta-numbered-math" data-equations="1.124">\[
\begin{aligned}
I(H;Y \mid C) = I(H,C;Y) - I(C;Y).
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.124"><span class="fta-equation-number" aria-hidden="true">(1.124)</span></span></div>
<p>这一项度量了"在已知当前上下文 $C$ 之后，远期历史 $H$ 还能为预测 $Y$ 提供多少额外信息"。</p>
<p>Titans 的长期记忆模块 $M$（其参数 $\phi_t$ 中编码了历史 $H$ 的压缩版本）相当于构造了一个额外信息通道，使得：</p>
<div class="fta-math fta-numbered-math" data-equations="1.125">\[
\begin{aligned}
I(M;Y \mid C) &gt; 0.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.125"><span class="fta-equation-number" aria-hidden="true">(1.125)</span></span></div>
<p>这部分互信息补偿了纯 Transformer 中因为窗口有限而丢失的 $I(H;Y\mid C)$。</p>
<h5 id="pdf-dynamical-stability">动力系统稳定性分析</h5>
<p>将记忆参数更新写为离散动力系统：</p>
<div class="fta-math fta-numbered-math" data-equations="1.126">\[
\begin{aligned}
\phi_{t+1} = A_t \phi_t + b_t,
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.126"><span class="fta-equation-number" aria-hidden="true">(1.126)</span></span></div>
<p>其中 $A_t \approx (1-\lambda)I$，$b_t \approx -\eta m_t$。</p>
<p>系统矩阵 $A_t$ 的特征值均为 $1-\lambda$。稳定性条件为 $\rho(A_t) = |1-\lambda| &lt; 1$。由于 $\lambda\in[0,1)$，该条件自动满足。这意味着系统具有<strong>耗散性</strong>：初始条件的影响以指数速率衰减，过去的扰动不会无限放大。</p>
<p>Titans 在稳定性与可塑性之间的平衡由三个超参数控制：</p>
<ul>
<li>$\lambda$ 太大：记忆太快遗忘，系统趋近于"无记忆"；</li>
<li>$\lambda$ 太小：记忆接近饱和，旧信息难以被覆盖；</li>
<li>$\eta$ 太大：更新噪声放大，系统可能震荡；</li>
<li>$\eta$ 太小：写入太慢，重要信息来不及编码；</li>
<li>$\beta$ 合理：提供惯性平滑，把局部 surprise 累积成稳定的长期信号。</li>
</ul>
<aside class="fta-callout fta-example"><div class="fta-callout-title">Example 21</div>
<p>回到翻译例子中的 "it$\to$cat" 长程依赖。假设序列被扩展到100个 token：</p>
<p>纯 Transformer 注意力矩阵为 $100\times 100$，需要计算10000个注意力权重。而 Titans (MAC) 的做法是：</p>
<ol>
<li>读入 "cat"（位置2）时，由于 surprise 高（0.85），长期记忆 $\mathcal{M}_\phi$ 被显著更新；</li>
<li>接下来98个 token 中，由于 $\beta=0.9$ 和 $\lambda=0.001$，"cat" 的记忆痕迹以每步 $1-\lambda\approx 0.999$ 的因子缓慢衰减，98步后仍有 $0.999^{98}\approx 0.907$ 的保留——几乎没忘！</li>
<li>读到 "it"（位置100）时，$q_{100}$ 从长期记忆中检索到 "cat" 的强记忆痕迹，将其作为虚拟 token 拼入注意力窗口；</li>
<li>注意力机制在虚拟 token "cat 记忆" 和当前窗口内的实际 token 之间建立关联，正确翻译。</li>
</ol>
<p>纯 Transformer 需要在 $100\times 100$ 的注意力矩阵中让位置100直接关注位置2——这是可以做到的，但代价是 $O(T^2)$ 的计算和存储。而 Titans 用了 $O(W)$ 的注意力窗口 + $O(1)$ 的记忆查询就达到了同样的效果。</p>
</aside>
</article>
</div>
