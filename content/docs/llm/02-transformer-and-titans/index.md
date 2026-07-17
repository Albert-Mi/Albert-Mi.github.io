---
title: "总览：Transformer 与 Titans 的核心差异"
weight: 2000
chapter: 2
page_number: "2"
chapter_slug: "02-transformer-and-titans"
is_section: false
root_heading_level: 2
type: docs
math: true
toc: false
---
<div class="fta-document">
<article class="fta-post">
<h2 id="section-2">总览：Transformer 与 Titans 的核心差异</h2>
<aside class="fta-callout fta-summary"><div class="fta-callout-title">Summary</div>
<p>本章的核心思想是：<strong>Transformer 的注意力更像"高精度、有限窗口的短期记忆"；Titans 额外引入的神经记忆模块更像"可持续更新的长期记忆"。</strong> 两者结合后，模型才能在很长的上下文中既保留局部精确依赖，又不丢失远处信息。</p>
<p>文本进入 Transformer 后，大致经过以下步骤:</p>
<ol>
<li><strong>Tokenization</strong></li>
<p>将原始文本切分成 token 序列：$\text{文本}\to(x_1,x_2,\ldots,x_n).$</p>
<li><strong>Embedding</strong></li>
<p>将离散 token 映射为连续向量（第 $t$ 个 token 的向量是$e_t$）：$e_t=E_{\mathrm{emb}}[x_t]$.</p>
<li>由于注意力机制本身知道 token 的顺序，因此要<strong>加入位置编码</strong>：$H_t^{(0)}=e_t+P_t$. 其中，$P_t$ 表示第 $t$ 个位置的位置编码。</li>
<li><strong>Self-Attention</strong>: 模型根据当前隐藏状态 $H$ 计算 Query、Key 和 Value：</li>
<div class="fta-math fta-numbered-math" data-equations="1.1">\[
\begin{aligned}
Q = HW_Q, K = HW_K, V = HW_V.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.1"><span class="fta-equation-number" aria-hidden="true">(1.1)</span></span></div>
<p>然后通过注意力机制完成不同位置之间的信息交互：</p>
<div class="fta-math fta-numbered-math" data-equations="1.2">\[
\begin{aligned}
O=\operatorname{softmax}
    \left(
    \frac{QK^\top}{\sqrt{d_k}}
    \right)V.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.2"><span class="fta-equation-number" aria-hidden="true">(1.2)</span></span></div>
<li><strong>Multi-Head Attention</strong></li>
<p>多个注意力头在不同表示空间中并行工作。</p>
<ul>
<li>有的头可能关注代词指代关系；</li>
<li>有的头可能关注主谓关系；</li>
<li>有的头可能关注局部短语结构；</li>
<li>有的头可能关注语义相似关系。</li>
</ul>
<li><strong>FFN、残差连接和 LayerNorm</strong></li>
<p>注意力负责 token 之间的信息交流，前馈网络负责对单个 token 的表示进行非线性加工：</p>
<div class="fta-math fta-numbered-math" data-equations="1.3,1.4">\[
\begin{aligned}
H&#x27;&amp;=\operatorname{LayerNorm}
    \left(H+\operatorname{MHA}(H)\right),\\
    H&#x27;&#x27;&amp;=\operatorname{LayerNorm}\left(
    H&#x27;+\operatorname{FFN}(H&#x27;)
    \right).
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.3、1.4"><span class="fta-equation-number" aria-hidden="true">(1.3)</span><span class="fta-equation-number" aria-hidden="true">(1.4)</span></span></div>
<li><strong>多层堆叠并生成输出</strong></li>
<p>多个 Transformer 层逐步形成更高层的语义表示。在自回归语言模型中，还会加入因果掩码，使模型预测当前位置时不能看到未来 token。</p>
</ol>
</aside>
<figure class="fta-figure"><img src="/p/from-transformer-to-agent-full/TransOverview.png" alt="Overview of Transformer" loading="lazy"><figcaption>Overview of Transformer</figcaption></figure>
<aside class="fta-callout fta-example"><div class="fta-callout-title">Example 2</div>
<p><strong>贯穿全章的例子：</strong>我们以<strong>机器翻译</strong>（English $\to$ 中文）为统一例子。具体来说，翻译句子</p>
<div class="fta-math">\[
\begin{aligned}
&amp;\text{EN: ``The cat sat on the mat because it was tired.&#x27;&#x27;}\\
&amp;\text{ZH: ``猫坐在垫子上，因为它累了.&#x27;&#x27;}
\end{aligned}
\]</div>
<p>代词"it"需要跨越6个 token 与"cat"建立联系——这正是长程依赖的核心难点。本章所有计算和说明都围绕这个翻译例子展开。</p>
</aside>
<figure class="fta-table-figure"><figcaption>Transformer 与 Titans 的核心差异</figcaption><div class="fta-table-scroll"><table class="fta-table"><tr><th>比较维度</th><th>Transformer</th><th>Titans</th></tr><tr><td>核心记忆形式</td><td>注意力窗口内的 Key--Value 表示，强调局部精确读取</td><td>可在线更新的神经长期记忆，强调远程历史压缩与召回</td></tr><tr><td>计算重点</td><td>在显式上下文中计算 token 与 token 的关系</td><td>在短窗口注意力之外，把重要历史写入记忆参数</td></tr><tr><td>长上下文瓶颈</td><td>注意力矩阵随序列长度呈 $O(T^2)$ 增长</td><td>用长期记忆缓解远程信息丢失，但引入更新稳定性问题</td></tr><tr><td>适合场景</td><td>短到中等上下文、局部依赖、精确 token 交互</td><td>长上下文、长链推理、需要跨段保持实体或事实的任务</td></tr></table></div></figure>
<aside class="fta-callout fta-summary"><div class="fta-callout-title">Summary</div>
<p>第一，先把 Transformer 的标准流程讲清楚；第二，说明自注意力为什么在长上下文中遇到计算与记忆瓶颈；第三，用记忆视角引出 Titans 的长期神经记忆、测试时学习与三种架构。</p>
</aside>
</article>
</div>
