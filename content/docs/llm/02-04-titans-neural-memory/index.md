---
title: "Titans 的长期神经记忆"
weight: 2004
chapter: 2
page_number: "2.4"
chapter_slug: "02-transformer-and-titans"
is_section: true
root_heading_level: 3
type: docs
math: true
toc: false
---
<div class="fta-document">
<article class="fta-post">
<h3 id="section-15">Titans 的长期神经记忆</h3>
<h4 id="section-16">Key-Value associative memory</h4>
<p>Titans 的长期记忆可以先从 key--value associative memory 的角度理解：输入中的关键信息被写入某种可查询的记忆结构，后续位置通过 query 从该结构中读取相关历史。线性记忆使用矩阵 $M_t$ 表示这种关联；Titans 则把它推广为神经网络 $\mathcal{M}_\phi$。</p>
<h4 id="section-17">Surprise</h4>
<p>Titans 的创新之一是用<strong>梯度范数</strong>来衡量一个新输入的"意外程度"（surprise）。直觉如下：如果当前记忆网络已经很好地"预测"了新输入，那么关于这个输入的损失应该很小，梯度也很小；反之，如果新输入违反了记忆网络的预期，梯度就会很大。</p>
<p>形式化地，设记忆网络为 $\mathcal{M}_\phi$（$\phi$ 是该网络的可训练参数集合），在第 $t$ 步接收输入 $x_t$，输出它根据"已有记忆"做出的预测。定义一个关联记忆的损失函数：</p>
<div class="fta-math fta-numbered-math" data-equations="1.88">\[
\begin{aligned}
\ell_t(\phi) = \ell\!\left(\mathcal{M}_\phi(x_t),\, \text{target}_t\right).
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.88"><span class="fta-equation-number" aria-hidden="true">(1.88)</span></span></div>
<p>其中 $\text{target}_t$ 是某种监督信号——可以是将 $x_t$ 本身作为重建目标（自编码器风格），也可以是预测下一个 token（自回归设置）。</p>
<p>设 $\phi_t$ 是更新前的参数，定义 <strong>surprise</strong> 为损失函数对参数的梯度的 L2 范数：</p>
<div class="fta-math fta-numbered-math" data-equations="1.89">\[
\begin{aligned}
s_t = \|\nabla_\phi \ell_t(\phi_t)\|_2.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.89"><span class="fta-equation-number" aria-hidden="true">(1.89)</span></span></div>
<p>$s_t$ 越大说明梯度越大，当前输入和已有记忆不匹配——这是一个 surprise 事件，更值得被写入记忆。$s_t$ 越小说明模型已经很熟悉这个输入，不需要重点更新记忆。Titans 使用这个 surprise 分数来控制记忆更新的强度。</p>
<aside class="fta-callout fta-example"><div class="fta-callout-title">Example 15</div>
<p>在我们的翻译例子中，计算每个英文 token 的 surprise 分数。简化词表为 $\{\text{The},\text{cat},\text{sat},\text{mat},\text{it}\}$，记忆网络为一个单层模型 $\mathcal M_\phi(x)=W h_t$（其中 $\phi=W\in\mathbb R^{5\times d}$ 是记忆参数矩阵，$h_t$ 是归一化的隐藏表示，$\|h_t\|_2=1$）。使用交叉熵损失，surprise 为 $s_t = \|p_t - e_{c_t}\|_2$。</p>
<p>计算 "cat"（第2个 token，正确类别下标=2）的 surprise。假设当前记忆产生的 logit 为：</p>
<div class="fta-math fta-numbered-math" data-equations="1.90">\[
\begin{aligned}
z_{\text{cat}} = [2.0,\; 0.3,\; 0.1,\; -0.2,\; -0.4]^\top.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.90"><span class="fta-equation-number" aria-hidden="true">(1.90)</span></span></div>
<p>Softmax 后：$p_{\text{cat}} = [0.652,\; 0.119,\; 0.098,\; 0.072,\; 0.059]^\top$。正确类别的 one-hot 为 $e_{\text{cat}} = [0, 1, 0, 0, 0]^\top$，因此</p>
<div class="fta-math fta-numbered-math" data-equations="1.91">\[
\begin{aligned}
s_{\text{cat}} = \|p_{\text{cat}} - e_{\text{cat}}\|_2 \approx 1.104.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.91"><span class="fta-equation-number" aria-hidden="true">(1.91)</span></span></div>
<p>而对冠词 "The"（第1个 token），模型已经非常熟悉这类高频功能词，若其概率接近正确值：</p>
<div class="fta-math fta-numbered-math" data-equations="1.92">\[
\begin{aligned}
p_{\text{The}} = [0.847,\; 0.070,\; 0.042,\; 0.026,\; 0.016]^\top.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.92"><span class="fta-equation-number" aria-hidden="true">(1.92)</span></span></div>
<p>则 $s_{\text{The}} \approx 0.176$。</p>
<p>名词 "cat" 的 surprise（1.104）远大于冠词 "The" 的 surprise（0.176）——实体名词和需要消解的代词产生更大的 surprise，从而被更强烈地写入长期记忆。</p>
</aside>
<h4 id="section-18">Momentum</h4>
<p>Titans 的记忆更新规则可以写成一种带有动量（momentum）和权重衰减（weight decay，即遗忘）的在线梯度下降。</p>
<p>令 $g_t = \nabla_\phi \ell_t(\phi_t)$ 为第 $t$ 步的梯度。动量项 $m_t$ 累积过去的梯度：</p>
<div class="fta-math fta-numbered-math" data-equations="1.93">\[
\begin{aligned}
m_t = \beta m_{t-1} + g_t
= g_t + \beta g_{t-1} + \beta^2 g_{t-2} + \cdots
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.93"><span class="fta-equation-number" aria-hidden="true">(1.93)</span></span></div>
<p>其中 $\beta\in[0,1)$ 是动量系数，决定过去梯度的惯性贡献。$\beta$ 大则旧梯度影响持续更久；$\beta=0$ 退化为普通 SGD；$\beta$ 接近1时动量提供很强的"惯性"，使参数更新方向更平滑。</p>
<p>参数更新规则为：</p>
<div class="fta-math fta-numbered-math" data-equations="1.94">\[
\begin{aligned}
\phi_{t+1} = (1-\lambda)\phi_t - \eta\, m_t.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.94"><span class="fta-equation-number" aria-hidden="true">(1.94)</span></span></div>
<p>各项的物理意义：</p>
<ul>
<li>$\lambda \in [0,1)$：<strong>遗忘率</strong>（weight decay），防止记忆无限累加。$\lambda$ 大则遗忘快、记忆容量有效但历史丢失快；$\lambda$ 小则保留时间长但可能饱和。</li>
<li>$\eta &gt; 0$：<strong>学习率</strong>，新信息写入速度。$\eta$ 大则写入快但噪声大；$\eta$ 小则写入慢但稳定。</li>
</ul>
<h4 id="section-19">动量项与遗忘项的闭式展开</h4>
<p>动量是对过去梯度的<strong>指数加权平均</strong>。</p>
<p>从递推 $m_t = \beta m_{t-1} + g_t$ 出发（设 $m_0=0$）：</p>
<div class="fta-math fta-numbered-math" data-equations="1.95">\[
\begin{aligned}
m_t = \sum_{j=0}^{t-1} \beta^j g_{t-j}.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.95"><span class="fta-equation-number" aria-hidden="true">(1.95)</span></span></div>
<p>旧梯度的权重以指数速度衰减，半衰期约为 $\tau_{1/2} = \ln(1/2) / \ln \beta$ 步。例如 $\beta=0.9$ 时，$\tau_{1/2}\approx 6.6$ 步——约7步前的梯度权重衰减到一半。</p>
<p>若暂时忽略动量（设 $m_t = g_t$），只看遗忘（设 $\phi_1$ 为初始参数）：</p>
<div class="fta-math fta-numbered-math" data-equations="1.96">\[
\begin{aligned}
\phi_{t+1} = (1-\lambda)\phi_t - \eta g_t
= (1-\lambda)^t \phi_1 - \eta\sum_{j=1}^{t} (1-\lambda)^{t-j} g_j.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.96"><span class="fta-equation-number" aria-hidden="true">(1.96)</span></span></div>
<p>这揭示了遗忘机制的关键性质：初始参数的贡献以 $(1-\lambda)^t$ 指数衰减；旧梯度以 $(1-\lambda)^{t-j}$ 加权——越新的梯度权重越大；有效记忆时间约为 $\tau_{\text{mem}} \approx 1/\lambda$ 步。</p>
<aside class="fta-callout fta-explanation"><div class="fta-callout-title">Explanation: 有效记忆时间的推导</div>
<p>当 $\lambda$ 比较小时，$\ln(1-\lambda) \approx -\lambda$，所以 $(1-\lambda)^k = e^{k\ln(1-\lambda)} \approx e^{-\lambda k}$。遗忘近似于指数衰减：$w_k \approx e^{-\lambda k}$。指数衰减的典型时间尺度定义为衰减到 $1/e$ 需要的步数。令 $e^{-\lambda \tau_{\text{mem}}} = e^{-1}$，得 $\tau_{\text{mem}} \approx 1/\lambda$。</p>
</aside>
<aside class="fta-callout fta-example"><div class="fta-callout-title">Example 16</div>
<p>翻译时，模型按顺序读入英文 token，surprise 机制决定哪些 token 被更强地写入长期记忆。</p>
<p>设 $\eta=0.01$，$\beta=0.9$，$\lambda=0.001$。各 token 的 surprise 和写入强度：</p>
<div class="fta-table-scroll"><table class="fta-table"><tr><th>Token</th><th>词性</th><th>Surprise $s_t$</th><th>写入强度 $\eta s_t$</th></tr><tr><td>The</td><td>冠词</td><td>0.05</td><td>0.0005</td></tr><tr><td>cat</td><td>名词</td><td>0.85</td><td>0.0085</td></tr><tr><td>sat</td><td>动词</td><td>0.62</td><td>0.0062</td></tr><tr><td>on</td><td>介词</td><td>0.10</td><td>0.0010</td></tr><tr><td>the</td><td>冠词</td><td>0.03</td><td>0.0003</td></tr><tr><td>mat</td><td>名词</td><td>0.78</td><td>0.0078</td></tr><tr><td>because</td><td>连词</td><td>0.45</td><td>0.0045</td></tr><tr><td>it</td><td>代词</td><td>0.91</td><td>0.0091</td></tr><tr><td>was</td><td>助动词</td><td>0.08</td><td>0.0008</td></tr><tr><td>tired</td><td>形容词</td><td>0.55</td><td>0.0055</td></tr></table></div>
<p>关键观察："cat"（名词，surprise=0.85）和 "it"（代词，surprise=0.91）被赋予最高的写入强度。动量机制确保 "cat" 的记忆不会在被 "on"、"the" 等低 surprise token 冲刷后立即消失——$\beta=0.9$ 意味着 "cat" 的梯度在约7步后仍保留一半的影响。而遗忘率 $\lambda=0.001$ 意味着有效记忆时间约为1000步——在该翻译例子中，"cat" 的记忆在数百步后仍然保留。</p>
</aside>
<aside class="fta-callout fta-summary"><div class="fta-callout-title">Summary</div>
<p>若没有遗忘，长期记忆会像没有耗散的系统一样不断积累，最终饱和甚至失真。Titans 中的 weight decay 提供了一个耗散通道，动量提供惯性，使记忆系统在"可塑性"（写入新信息）和"稳定性"（保留旧信息）之间保持平衡。Surprise 机制确保"意外"信息比"可预期"信息被更强烈地写入。</p>
</aside>
<h4 id="section-20">Test-time learning</h4>
<h5 id="pdf-train-inference-separation">训练与推理的参数更新分离</h5>
<p>传统 Transformer 在推理时参数完全固定——只有隐藏状态和 KV-cache 在变化，权重矩阵保持不变。Titans 的不同之处在于：<strong>长期记忆模块的参数 $\phi_t$ 在测试时继续根据输入进行更新</strong>。</p>
<p>这并非"训练-推理不分"，而是一种架构设计选择：</p>
<ul>
<li><strong>核心注意力模块</strong>的参数（$W_Q, W_K, W_V, W_O$ 等）在训练后固定，推理时不更新——这部分负责"短期精确建模"。</li>
<li><strong>长期记忆模块</strong>的参数 $\phi_t$ 在推理时随输入在线更新——这部分负责"持续写入远期历史"。</li>
</ul>
<h5 id="pdf-read-write-separation">读取与写入的分离</h5>
<p>Titans 将长期记忆的操作明确分为两种模式：</p>
<p><strong>写入模式（Write）：</strong> 用当前输入更新记忆参数，</p>
<div class="fta-math fta-numbered-math" data-equations="1.97">\[
\begin{aligned}
\phi_t \mapsto \phi_{t+1}, \quad \text{通过梯度下降 } \phi_{t+1} = (1-\lambda)\phi_t - \eta m_t.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.97"><span class="fta-equation-number" aria-hidden="true">(1.97)</span></span></div>
<p><strong>读取模式（Read）：</strong> 给定查询 $q_t = x_t W_Q$，用当前记忆参数做前向传播（不更新参数），</p>
<div class="fta-math fta-numbered-math" data-equations="1.98">\[
\begin{aligned}
y_t = \mathcal{M}_{\phi_t}^\ast(q_t).
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.98"><span class="fta-equation-number" aria-hidden="true">(1.98)</span></span></div>
<p>其中星号 $\ast$ 明确表示"只读取、不更新"的前向使用方式。</p>
<p>这个读写分离与计算机的内存架构完全对应：写入是 update（改变存储状态），读取是 query（检索信息而不改变存储状态）。</p>
<h5 id="pdf-rnn-memory-difference">与 RNN 和记忆网络的本质区别</h5>
<p>若只看"参数随时间变化"这一点，Titans 的长期记忆确实像一种递推系统。但关键区别在于：</p>
<ol>
<li><strong>普通 RNN</strong>：将历史压缩到一个固定维度的隐藏状态 $h_t\in\mathbb{R}^d$ 中——容量受限于维度 $d$。</li>
<li><strong>神经图灵机 / 记忆网络</strong>：用一个外部记忆矩阵，通过注意力式读写操作访问——矩阵大小可扩展。</li>
<li><strong>Titans</strong>：将历史压缩到一个神经网络参数 $\phi_t$ ——参数空间是高维函数空间，容量远超单个向量。</li>
</ol>
<p>可以这样类比：RNN 记住的是一个"摘要向量"；线性记忆记住的是一个"关联矩阵"；Titans 记住的是一个"逐步适应历史数据的函数"。</p>
<aside class="fta-callout fta-explanation"><div class="fta-callout-title">Explanation: RNN和Transformer关系</div>
<p>普通 RNN 和 Transformer 都是用于处理序列数据的神经网络模型。它们的共同目标是：把输入序列中的每个 token 转换成包含上下文信息的表示。区别在于，普通 RNN 通过时间步递推来传递信息，而 Transformer 通过自注意力机制直接建模 token 与 token 之间的关系。</p>
<p>普通 RNN 的核心递推形式为</p>
<div class="fta-math fta-numbered-math" data-equations="1.99">\[
\begin{aligned}
h_t &amp;= \phi(W_xx_t+W_hh_{t-1}+b),
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.99"><span class="fta-equation-number" aria-hidden="true">(1.99)</span></span></div>
<p>其中 $x_t$ 是第 $t$ 个 token 的输入向量，$h_t$ 是第 $t$ 步的隐藏状态，$h_{t-1}$ 是上一时刻传来的历史信息，$\phi$ 是非线性激活函数。因此，RNN 处理序列时具有明显的时间顺序：</p>
<div class="fta-math fta-numbered-math" data-equations="1.100">\[
\begin{aligned}
h_1 \rightarrow h_2 \rightarrow h_3 \rightarrow \cdots \rightarrow h_n.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.100"><span class="fta-equation-number" aria-hidden="true">(1.100)</span></span></div>
<p>第 $t$ 个位置的信息需要依赖前面所有状态逐步传递过来。这种结构天然包含顺序信息，但也导致两个问题：第一，训练时不容易并行；第二，长距离信息在多步传递中容易衰减。</p>
<p>Transformer 不再使用这样的递推结构，而是将整个输入序列的向量堆叠为矩阵 $X\in\mathbb{R}^{n\times d}$，然后一次性计算</p>
<div class="fta-math fta-numbered-math" data-equations="1.101">\[
\begin{aligned}
Q = XW_Q,\quad
K = XW_K,\quad
V = XW_V.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.101"><span class="fta-equation-number" aria-hidden="true">(1.101)</span></span></div>
<p>接着通过自注意力计算所有 token 之间的关系：</p>
<div class="fta-math fta-numbered-math" data-equations="1.102">\[
\begin{aligned}
\mathrm{Attention}(Q,K,V)
&amp;=
\mathrm{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}\right)V.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.102"><span class="fta-equation-number" aria-hidden="true">(1.102)</span></span></div>
<p>其中，$QK^\top\in\mathbb{R}^{n\times n}$ 是注意力分数矩阵。它的第 $(i,j)$ 个元素表示第 $i$ 个 token 对第 $j$ 个 token 的关注程度。也就是说，Transformer 可以让任意两个位置的 token 直接建立联系，而不需要像 RNN 那样一层一层沿时间方向传递信息。</p>
<p>因此，可以把二者的核心区别概括为：</p>
<p>普通 RNN 是“顺序递推模型”，当前状态 $h_t$ 依赖上一状态 $h_{t-1}$；Transformer 是“注意力直连模型”，每个 token 可以直接和其他 token 计算关系。</p>
</aside>
<aside class="fta-callout fta-example"><div class="fta-callout-title">Example 17</div>
<p>考虑翻译句子<code>The cat sat on the mat because it was tired</code>. 各 token 的位置为</p>
<div class="fta-math fta-numbered-math" data-equations="1.103">\[
\begin{aligned}
\text{The}_1,\ \text{cat}_2,\ \text{sat}_3,\ \text{on}_4,\ \text{the}_5,\ \text{mat}_6,\
\text{because}_7,\ \text{it}_8,\ \text{was}_9,\ \text{tired}_{10}.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.103"><span class="fta-equation-number" aria-hidden="true">(1.103)</span></span></div>
<p>在这个句子中，模型需要理解位置 $8$ 的 "it" 指代的是位置 $2$ 的 "cat"，而不是位置 $6$ 的 "mat"。</p>
<p>如果使用普通 RNN，"cat" 的信息需要从位置 $2$ 开始，经过多个隐藏状态逐步传递到位置 $8$：</p>
<div class="fta-math fta-numbered-math" data-equations="1.104">\[
\begin{aligned}
h_2 \rightarrow h_3 \rightarrow h_4 \rightarrow h_5 \rightarrow h_6 \rightarrow h_7 \rightarrow h_8.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.104"><span class="fta-equation-number" aria-hidden="true">(1.104)</span></span></div>
<p>也就是说，"cat" 对 "it" 的影响必须经过中间多个位置。如果句子更长， "cat" 和 "it" 相距更远，那么相关信息就需要经过大量递推步骤才能传到后面，这容易导致长距离依赖信息衰减。</p>
<p>而在 Transformer 中，位置 $8$ 的 "it" 可以通过自注意力直接关注位置 $2$ 的 "cat"。设位置 $8$ 的 query 向量为 $q_8$，位置 $2$ 的 key 向量为 $k_2$，则二者的注意力分数为</p>
<div class="fta-math fta-numbered-math" data-equations="1.105">\[
\begin{aligned}
S_{8,2} &amp;= q_8^\top k_2.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.105"><span class="fta-equation-number" aria-hidden="true">(1.105)</span></span></div>
<p>如果 $S_{8,2}$ 较大，则表示模型认为 "it" 与 "cat" 之间关系较强。经过 softmax 归一化后，位置 $8$ 的表示会更多地吸收位置 $2$ 的 value 信息。</p>
<p>因此，RNN 中的信息路径是</p>
<div class="fta-math fta-numbered-math" data-equations="1.106">\[
\begin{aligned}
\text{cat} \rightarrow \text{sat} \rightarrow \text{on} \rightarrow \text{the}
\rightarrow \text{mat} \rightarrow \text{because} \rightarrow \text{it},
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.106"><span class="fta-equation-number" aria-hidden="true">(1.106)</span></span></div>
<p>而 Transformer 中的信息路径可以直接写成</p>
<div class="fta-math fta-numbered-math" data-equations="1.107">\[
\begin{aligned}
\text{it} \rightarrow \text{cat}.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.107"><span class="fta-equation-number" aria-hidden="true">(1.107)</span></span></div>
<p>这说明 Transformer 更容易建模长距离依赖。在翻译时，模型因此更可能生成<code>这只猫坐在垫子上，因为它累了</code>, 而不是错误地把 "it" 理解为 "mat"，生成类似“垫子累了”的错误翻译。</p>
</aside>
<aside class="fta-callout fta-example"><div class="fta-callout-title">Example 18</div>
<p>在我们的翻译例子中，"测试时学习"的具体工作流程如下：</p>
<p><strong>训练阶段：</strong> 模型在大量双语语料上训练，学习注意力参数 $W_Q, W_K, W_V$ 和记忆网络的初始参数 $\phi_0$。此时记忆网络学会了"如何从上下文提取和存储实体信息"这一通用技能。</p>
<p><strong>推理阶段（翻译新句子时）：</strong></p>
<ol>
<li>读入 "The cat sat..."，每读一个 token 就更新长期记忆参数 $\phi_t \to \phi_{t+1}$；</li>
<li>读到 "it" 时，$\phi_8$ 已经包含了 "cat" 的信息；</li>
<li>用 $q_8$（"it" 的 query）从 $\mathcal{M}_{\phi_8}$ 中读取：$y_8 = \mathcal{M}_{\phi_8}^\ast(q_8)$；</li>
<li>读出结果 $y_8$ 强烈激活了 "cat" 的语义表示，帮助模型决定用"它"（动物代词）来翻译。</li>
</ol>
<p>如果模型在推理时不更新记忆参数，$\phi$ 保持不变，那么它就只是一个"静态特征提取器"——输入 "cat" 时的参数和输入 "it" 时的参数完全相同，无法实现"根据上下文积累实体信息"的功能。</p>
</aside>
<aside class="fta-callout fta-summary"><div class="fta-callout-title">Summary</div>
<p>Titans 的"测试时学习"不是 bug 而是 feature：它把长期记忆模块设计为一个在线适应子系统，参数在推理时根据输入动态调整，从而实现对远期历史的持续积累和选择性召回。这与人类阅读时的"边读边记"过程有结构上的相似性。</p>
</aside>
<h5 id="pdf-parallel-training">训练时的并行化策略</h5>
<p>虽然推理时长期记忆是顺序更新的（$\phi_t$ 依赖于 $\phi_{t-1}$），但 Titans 设计了一种巧妙的训练并行化方案。</p>
<p>关键思想是：<strong>训练时不需要严格模拟推理时的在线更新过程</strong>。在训练阶段，我们可以将整个序列分成若干段（segments），对每段独立地训练记忆模块，然后用某种方式保证段之间的连续性。</p>
<p>具体来说，设训练序列被分为 $S$ 段，每段长度为 $L$。第 $s$ 段内的记忆更新可以并行计算，段与段之间只传递记忆参数的最终状态。这种分段策略将原本 $O(T)$ 的串行更新时间降低到 $O(S)$ 的段间通信，而 $S = T/L \ll T$。</p>
<h5 id="pdf-persistent-memory">Persistent Memory：任务级先验知识</h5>
<p>除了与输入相关的长期记忆，Titans 还引入了一类特殊的<strong>持久记忆</strong>（Persistent Memory）参数：</p>
<div class="fta-math fta-numbered-math" data-equations="1.108">\[
\begin{aligned}
P = [p_1, p_2, \dots, p_{N_p}],
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.108"><span class="fta-equation-number" aria-hidden="true">(1.108)</span></span></div>
<p>其中 $p_i \in \mathbb{R}^{d}$ 是可训练的向量，$N_p$ 是持久记忆的"槽位"数。</p>
<p>持久记忆的特点：</p>
<ul>
<li>与输入无关——它们对所有样本都是相同的；</li>
<li>在训练中学习，推理时保持不变（不像长期记忆那样在线更新）；</li>
<li>作用类似于"任务先验"或"固定参考系"——为模型提供与具体输入无关的基础知识。</li>
</ul>
<aside class="fta-callout fta-example"><div class="fta-callout-title">Example 19</div>
<p>在我们的翻译例子中，持久记忆可以存储与翻译任务相关的通用知识：</p>
<ul>
<li>$p_1$ 可能编码"英语的 SVO（主-谓-宾）语序 $\to$ 中文的 SVO 语序"这一先验；</li>
<li>$p_2$ 可能编码"英语代词需要根据先行词确定中文翻译"；</li>
<li>$p_3$ 可能编码"被动语态的中文转换规则"。</li>
</ul>
<p>这些持久记忆在训练中从大量翻译数据中学习得到，对每个新翻译句子都是相同的。而长期记忆则存储当前句子的具体实体信息（如 "cat" 是主语、是动物等）。</p>
</aside>
</article>
</div>
