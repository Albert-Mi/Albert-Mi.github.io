---
title: "数学附录"
weight: 2009
chapter: 2
page_number: "2.9"
chapter_slug: "02-transformer-and-titans"
is_section: true
root_heading_level: 3
type: docs
math: true
toc: false
---
<div class="fta-document">
<article class="fta-post">
<h3 id="section-33">数学附录</h3>
<h4 id="section-34">概率建模基础</h4>
<h5 id="pdf-autoregressive-factorization">自回归分解的严格推导</h5>
<p>给定一个由 $T$ 个 token 组成的序列 $x_{1:T}=(x_1,x_2,\dots,x_T)$，其中每个 $x_t$ 取自有限词表 $\mathcal{V}$（$|\mathcal{V}|=V$）。所谓"语言模型"，就是一个能够为任意 token 序列分配概率的函数 $P(x_{1:T})$。</p>
<p>根据概率论的<strong>链式法则</strong>（chain rule），任意联合概率分布都可以分解为条件概率的乘积。从两个变量开始：对任意两个随机变量 $X_1,X_2$，</p>
<div class="fta-math">\[
\begin{aligned}
P(X_1=x_1, X_2=x_2) = P(X_1=x_1)\,P(X_2=x_2\mid X_1=x_1).
\end{aligned}
\]</div>
<p>这是因为条件概率的定义 $P(X_2\mid X_1)=P(X_1,X_2)/P(X_1)$。对 $T$ 个变量重复应用此恒等式：</p>
<div class="fta-math fta-numbered-math" data-equations="1.127,1.128">\[
\begin{aligned}
P(x_{1:T}) &amp;= P(x_1)\,P(x_2\mid x_1)\,P(x_3\mid x_1,x_2)\,\cdots\,P(x_T\mid x_1,\dots,x_{T-1})\\
&amp;= \prod_{t=1}^{T} P(x_t \mid x_{&lt;t}).
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.127、1.128"><span class="fta-equation-number" aria-hidden="true">(1.127)</span><span class="fta-equation-number" aria-hidden="true">(1.128)</span></span></div>
<p>其中 $x_{&lt;t}$ 是 $x_{1:t-1}$ 的简写。当 $t=1$ 时 $x_{&lt;1}$ 为空序列，$P(x_1\mid x_{&lt;1})$ 就是 $x_1$ 的先验概率。</p>
<p>自回归语言模型的思想是用参数化函数 $P_\theta$ 来近似每一个条件概率 $P(x_t\mid x_{&lt;t})$，其中 $\theta$ 表示模型的所有可训练参数（权重矩阵、偏置向量等）的集合。</p>
<aside class="fta-callout fta-explanation"><div class="fta-callout-title">Explanation: 链式法则与翻译</div>
<p>在我们 EN$\to$ZH 的翻译例子中，输入序列为 $x=(\text{The, cat, sat, on, the, mat, because, it, was, tired})$，共 $T=10$ 个 token。自回归翻译模型按顺序生成中文 token：</p>
<div class="fta-math fta-numbered-math" data-equations="1.129">\[
\begin{aligned}
P_\theta(\text{猫, 坐, 在, }\ldots \mid \text{The, cat, }\ldots) = \prod_{t=1}^{T&#x27;} P_\theta(y_t \mid y_{&lt;t}, x_{1:T}).
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.129"><span class="fta-equation-number" aria-hidden="true">(1.129)</span></span></div>
<p>这里 $y_t$ 是第 $t$ 个中文输出 token，$x_{1:T}$ 是整个英文源句（作为条件上下文）。输出长度 $T&#x27;$ 不一定等于输入长度 $T$：中文"猫坐在垫子上"只需约6个 token 即可表达英文10个 token 的语义。</p>
</aside>
<h5 id="pdf-negative-log-likelihood">负对数似然损失</h5>
<p>训练时，我们希望找到参数 $\theta$ 使得训练数据在模型下的概率最大。设训练集 $\mathcal{D}=\{x^{(1)},x^{(2)},\dots,x^{(N)}\}$ 包含 $N$ 条独立同分布序列，则似然函数为</p>
<div class="fta-math fta-numbered-math" data-equations="1.130">\[
\begin{aligned}
\mathcal{J}(\theta) = \prod_{i=1}^{N} P_\theta(x^{(i)}).
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.130"><span class="fta-equation-number" aria-hidden="true">(1.130)</span></span></div>
<p>最大似然估计（Maximum Likelihood Estimation, MLE）选择</p>
<div class="fta-math fta-numbered-math" data-equations="1.131">\[
\begin{aligned}
\theta^\star = \operatorname*{arg\,max}_{\theta} \mathcal{J}(\theta).
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.131"><span class="fta-equation-number" aria-hidden="true">(1.131)</span></span></div>
<p>乘积在数值上容易下溢（很多小于1的数相乘趋近于0），取对数：</p>
<div class="fta-math fta-numbered-math" data-equations="1.132">\[
\begin{aligned}
\theta^\star = \operatorname*{arg\,max}_{\theta} \sum_{i=1}^{N} \log P_\theta(x^{(i)}).
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.132"><span class="fta-equation-number" aria-hidden="true">(1.132)</span></span></div>
<p>机器学习中将优化写成"最小化损失"，定义<strong>负对数似然损失</strong>（Negative Log-Likelihood, NLL）：</p>
<div class="fta-math fta-numbered-math" data-equations="1.133">\[
\begin{aligned}
\mathcal{L}_{\text{NLL}}(\theta) = -\frac{1}{N}\sum_{i=1}^{N} \log P_\theta(x^{(i)}).
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.133"><span class="fta-equation-number" aria-hidden="true">(1.133)</span></span></div>
<p>$1/N$ 是归一化因子，使损失在不同大小的数据集上可比。将自回归分解代入：</p>
<div class="fta-math fta-numbered-math" data-equations="1.134">\[
\begin{aligned}
\mathcal{L}_{\text{NLL}}(\theta) = -\frac{1}{N}\sum_{i=1}^{N}\sum_{t=1}^{T_i} \log P_\theta(x_t^{(i)}\mid x_{&lt;t}^{(i)}).
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.134"><span class="fta-equation-number" aria-hidden="true">(1.134)</span></span></div>
<p>这意味着：训练时，模型在每一个位置都执行一次"根据前文预测下一个 token"的分类任务。</p>
<h5 id="pdf-softmax-logit-probability">Softmax：从 logit 到概率</h5>
<p>模型对下一个 token 的预测产生一个实数向量 $z_t\in\mathbb{R}^V$，称为<strong>logit</strong>（未归一化对数概率）。logit 的第 $j$ 个分量 $z_{t,j}$ 是第 $j$ 个候选 token 的原始打分。Logit 本身不满足概率公理：其值可以为负，且各分量之和不必等于1。</p>
<p><strong>softmax</strong> 函数将 logit 转化为概率分布：</p>
<div class="fta-math fta-numbered-math" data-equations="1.135">\[
\begin{aligned}
P_\theta(x_t = j \mid x_{&lt;t}) = \frac{\exp(z_{t,j})}{\sum_{k=1}^{V} \exp(z_{t,k})}, \quad j=1,\dots,V.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.135"><span class="fta-equation-number" aria-hidden="true">(1.135)</span></span></div>
<p>Softmax 保证输出非负且和为1。从统计物理的角度看，若定义能量 $E_j=-z_{t,j}$ 并令逆温度 $\beta=1$，则 softmax 就是 Gibbs/Boltzmann 分布：</p>
<div class="fta-math fta-numbered-math" data-equations="1.136">\[
\begin{aligned}
p_j = \frac{\exp(-\beta E_j)}{\sum_k \exp(-\beta E_k)}.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.136"><span class="fta-equation-number" aria-hidden="true">(1.136)</span></span></div>
<p>这个类比在分析训练稳定性和采样策略时非常有用。</p>
<h5 id="pdf-softmax-jacobian-full">Softmax 雅可比矩阵的完整推导</h5>
<p>令 $p = \operatorname{softmax}(z)$，即 $p_i = e^{z_i} / \sum_k e^{z_k}$。记 $S = \sum_k e^{z_k}$。对任意 $i,j$，用商法则求导：</p>
<div class="fta-math fta-numbered-math" data-equations="1.137">\[
\begin{aligned}
\frac{\partial p_i}{\partial z_j}
= \frac{\partial}{\partial z_j}\left(\frac{e^{z_i}}{S}\right)
= \frac{\mathbb{1}_{i=j}\, e^{z_i}\, S - e^{z_i}\, e^{z_j}}{S^2}
= \frac{e^{z_i}}{S}\left(\mathbb{1}_{i=j} - \frac{e^{z_j}}{S}\right)
= p_i(\delta_{ij} - p_j).
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.137"><span class="fta-equation-number" aria-hidden="true">(1.137)</span></span></div>
<p>其中 $\delta_{ij}$ 是 Kronecker delta（$i=j$ 时为1，否则为0）。</p>
<p>写成矩阵形式：</p>
<div class="fta-math fta-numbered-math" data-equations="1.138">\[
\begin{aligned}
J_{\operatorname{softmax}}(z) = \operatorname{diag}(p) - p p^\top \;\in\; \mathbb{R}^{V\times V}.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.138"><span class="fta-equation-number" aria-hidden="true">(1.138)</span></span></div>
<p>其中 $\operatorname{diag}(p)$ 是以 $p$ 为对角元素的对角矩阵，$p p^\top$ 是外积矩阵（第 $(i,j)$ 元为 $p_i p_j$）。</p>
<p>这个雅可比矩阵具有半正定性。对任意向量 $u\in\mathbb{R}^V$，</p>
<div class="fta-math fta-numbered-math" data-equations="1.139">\[
\begin{aligned}
u^\top J_{\operatorname{softmax}} u
= \sum_i p_i u_i^2 - \sum_{i,j} p_i p_j u_i u_j
= \sum_i p_i u_i^2 - \left(\sum_i p_i u_i\right)^2
= \mathrm{Var}_{i\sim p}(u_i) \ge 0.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.139"><span class="fta-equation-number" aria-hidden="true">(1.139)</span></span></div>
<p>所以 softmax 雅可比矩阵本质上是<strong>以 $p$ 为概率分布的协方差矩阵</strong>。当 $p$ 接近 one-hot（即某个 $p_i\approx 1$）时，方差趋近于0，雅可比矩阵接近零矩阵——这是梯度消失的一个来源。</p>
<aside class="fta-callout fta-explanation"><div class="fta-callout-title">Explanation: 统计物理直觉</div>
<p>从统计物理角度看，softmax 的梯度矩阵本质上是在一个离散 Gibbs 分布下的协方差矩阵。当某个 logit 远远大于其余项时，分布几乎塌缩到一个状态（类似低温极限），协方差趋小，梯度变弱。这就是后面解释为什么点积注意力要除以 $\sqrt{d_k}$ 的关键物理直觉。</p>
</aside>
<aside class="fta-callout fta-example"><div class="fta-callout-title">Example 23</div>
<p>在翻译例子中，假设在生成中文 token "猫" 时，模型的 logit 向量（简化到5个候选）为：</p>
<div class="fta-math fta-numbered-math" data-equations="1.140">\[
\begin{aligned}
z = [3.0,\; 0.5,\; -1.0,\; -2.0,\; 0.2]^\top.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.140"><span class="fta-equation-number" aria-hidden="true">(1.140)</span></span></div>
<p>计算 softmax：$S=e^{3.0}+e^{0.5}+e^{-1.0}+e^{-2.0}+e^{0.2}\approx 20.086+1.649+0.368+0.135+1.221=23.459$。</p>
<div class="fta-math fta-numbered-math" data-equations="1.141">\[
\begin{aligned}
p = [0.856,\; 0.070,\; 0.016,\; 0.006,\; 0.052]^\top.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.141"><span class="fta-equation-number" aria-hidden="true">(1.141)</span></span></div>
<p>模型对"猫"（第1个候选）有85.6%的置信度。雅可比矩阵为：</p>
<div class="fta-math fta-numbered-math" data-equations="1.142">\[
\begin{aligned}
J = \begin{bmatrix}
0.123 &amp; -0.060 &amp; -0.014 &amp; -0.005 &amp; -0.045\\
-0.060 &amp; 0.065 &amp; -0.001 &amp; -0.0004 &amp; -0.004\\
-0.014 &amp; -0.001 &amp; 0.016 &amp; -0.0001 &amp; -0.001\\
-0.005 &amp; -0.0004 &amp; -0.0001 &amp; 0.006 &amp; -0.0003\\
-0.045 &amp; -0.004 &amp; -0.001 &amp; -0.0003 &amp; 0.049
\end{bmatrix}.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.142"><span class="fta-equation-number" aria-hidden="true">(1.142)</span></span></div>
<p>对角线元素 $J_{11}=p_1(1-p_1)=0.856\times 0.144=0.123$ 最大（因为 $p_1$ 最接近0.5），而非对角元素为负。这意味着优化时增大 $z_1$ 会增大 $p_1$ 而减小其他 $p_j$。</p>
</aside>
<aside class="fta-callout fta-summary"><div class="fta-callout-title">Summary</div>
<p>语言建模的核心是将离散符号序列的概率建模转化为一系列条件概率的乘积。Softmax 是连接 logit 和概率的桥梁，其雅可比矩阵的协方差结构直接影响训练梯度。翻译任务中，模型在每一个输出位置都在词表上做一次 softmax 分类。</p>
</aside>
<h4 id="section-35">更深的数学：深记忆为什么比线性记忆更强？</h4>
<h5 id="pdf-linear-memory-limit">线性记忆的表达能力上限</h5>
<p>线性记忆本质上实现的是 $y = qM = \sum_{j=1}^{t} (q \cdot k_j) v_j$。这是关于 $q$ 的<strong>线性函数</strong>。对于需要非线性组合、条件化、门控的复杂规律——例如"如果主语是阴性单数，使用代词 she；如果是阳性单数，使用 he；如果是复数，使用 they"——线性记忆无法很好地捕捉。</p>
<h5 id="pdf-two-layer-mlp-gradient">两层 MLP 记忆模块的梯度分析</h5>
<p>设记忆模块为一个带隐藏层的 MLP：</p>
<div class="fta-math fta-numbered-math" data-equations="1.143">\[
\begin{aligned}
\mathcal{M}_\phi(x) = W_2\,\sigma(W_1 x + b_1) + b_2,
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.143"><span class="fta-equation-number" aria-hidden="true">(1.143)</span></span></div>
<p>其中 $W_1\in\mathbb{R}^{h\times d}$，$W_2\in\mathbb{R}^{d\times h}$，$\sigma$ 是逐元素非线性激活函数（如 ReLU 或 GELU）。</p>
<p>对于均方误差损失 $\ell(\phi) = \frac{1}{2}\|\mathcal{M}_\phi(x) - t\|^2$，记 $a = W_1 x + b_1$（预激活），$h = \sigma(a)$（隐藏层输出），$\hat{y} = W_2 h + b_2$（最终输出），$e = \hat{y} - t$（误差向量）。</p>
<p>对 $W_2$ 的梯度：</p>
<div class="fta-math fta-numbered-math" data-equations="1.144">\[
\begin{aligned}
\frac{\partial \ell}{\partial W_2} = e \cdot h^\top = e \cdot \sigma(W_1 x + b_1)^\top.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.144"><span class="fta-equation-number" aria-hidden="true">(1.144)</span></span></div>
<p>对 $W_1$ 的梯度：</p>
<div class="fta-math fta-numbered-math" data-equations="1.145">\[
\begin{aligned}
\frac{\partial \ell}{\partial W_1} = \left[(W_2^\top e) \odot \sigma&#x27;(W_1 x + b_1)\right] x^\top.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.145"><span class="fta-equation-number" aria-hidden="true">(1.145)</span></span></div>
<p>其中 $\odot$ 是逐元素乘法，$\sigma&#x27;$ 是激活函数的导数。</p>
<p>关键观察：$W_1$ 的梯度依赖于三项的乘积——$W_2^\top e$（反向传播的误差）、$\sigma&#x27;(a)$（激活函数的导数，即"门控"）、$x$（当前输入）。这意味着：</p>
<ul>
<li>如果 $\sigma&#x27;(a)\approx 0$（神经元处于饱和区），该神经元的 $W_1$ 几乎不更新——这是一种自然的"选择性遗忘"；</li>
<li>$W_2^\top e$ 依赖于当前输出层的误差——更新是"状态依赖"的；</li>
<li>$x$ 提供了输入方向——更新沿着与输入对齐的方向进行。</li>
</ul>
<h5 id="pdf-function-approximation">从函数逼近论看深记忆的优势</h5>
<p>根据通用逼近定理，具有足够隐藏单元的两层 MLP 可以在紧集上逼近任意连续函数。而线性记忆只能逼近线性函数。</p>
<p>对于长链推理中的记忆需求，模型本质上是在学习一个<strong>函数逼近问题</strong>：</p>
<div class="fta-math fta-numbered-math" data-equations="1.146">\[
\begin{aligned}
f_{\text{ideal}}: (\text{当前 query } q) \longmapsto (\text{需要从历史中检索的信息}).
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.146"><span class="fta-equation-number" aria-hidden="true">(1.146)</span></span></div>
<p>线性记忆给出 $f(q) = qM$ 只能表达线性检索规则；深记忆可以表达非线性、条件化的检索规则——例如"如果 query 中检测到代词，检索先行词；如果 query 中检测到数学符号，检索上一公式"。</p>
<aside class="fta-callout fta-example"><div class="fta-callout-title">Example 24</div>
<p>在我们的翻译例子中，比较线性记忆和深层记忆对于 "it$\to$cat" 代词消解的效果。</p>
<p><strong>线性记忆：</strong> 输出 $y_8 = q_8 M_8$，其中 $M_8 = \sum_{j=1}^{8} k_j^\top v_j$。因为线性记忆平等地累加所有 token，"it" 的读出结果会是所有前文 value 的加权混合——除了 "cat" 之外，"The"、"sat"、"mat" 等 token 的信息也混入其中。代词消解需要从嘈杂的混合信号中提取出正确的先行词，这可能不可靠。</p>
<p><strong>深层记忆（两层 MLP）：</strong> 读入 "cat"（位置2）时，记忆网络的梯度更新为：</p>
<div class="fta-math fta-numbered-math" data-equations="1.147">\[
\begin{aligned}
\Delta W_1 \propto [(W_2^\top e) \odot \sigma&#x27;(a)] \cdot x_{\text{cat}}^\top.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 1.147"><span class="fta-equation-number" aria-hidden="true">(1.147)</span></span></div>
<p>这个更新将 "cat" 的信息以非线性方式编码进网络参数。当后续 query $q_8$（"it" 的 query）进入时，网络通过前向传播 $\mathcal{M}_{\phi_8}(q_8)$ 自动"判断"：这个 query 的特征（第三人称单数、有生命）与之前编码的 "cat" 最匹配。非线性的激活函数 $\sigma$ 自然地抑制了不匹配的信息（如 "mat"、"sat"），放大了匹配的信息。</p>
<p>这就是深层记忆的核心优势：它不仅仅是"记住"所有信息，而是学会了"根据 query 选择性地提取相关信息"。</p>
</aside>
<h4 id="section-36">符号表</h4>
<figure class="fta-table-figure"><figcaption>符号说明</figcaption><div class="fta-table-scroll"><table class="fta-table"><tr><th>序号</th><th>符号</th><th>含义</th></tr><tr><td>1</td><td>$T$</td><td>序列长度</td></tr><tr><td>2</td><td>$d$ 或 $d_{\text{model}}$</td><td>模型隐藏维度</td></tr><tr><td>3</td><td>$Q, K, V$</td><td>Query, Key, Value 矩阵</td></tr><tr><td>4</td><td>$d_k, d_v$</td><td>Key / Value 的维度</td></tr><tr><td>5</td><td>$\mathcal{M}_\phi$</td><td>长期记忆神经网络，参数为 $\phi$</td></tr><tr><td>6</td><td>$g_t$</td><td>第 $t$ 步记忆损失梯度</td></tr><tr><td>7</td><td>$m_t$</td><td>动量累积项</td></tr><tr><td>8</td><td>$\eta$</td><td>学习率</td></tr><tr><td>9</td><td>$\beta$</td><td>动量系数</td></tr><tr><td>10</td><td>$\lambda$</td><td>遗忘 / 权重衰减系数</td></tr><tr><td>11</td><td>$P = [p_1,\dots,p_{N_p}]$</td><td>Persistent memory 参数组</td></tr><tr><td>12</td><td>$s_t$</td><td>Surprise 分数 $= \|\nabla_\phi \ell_t\|$</td></tr><tr><td>13</td><td>$H$</td><td>多头注意力头数</td></tr><tr><td>14</td><td>$A_{tj}$</td><td>注意力权重矩阵 $A$ 的元素</td></tr><tr><td>15</td><td>$x_{1:T}$</td><td>token 序列 $(x_1,\dots,x_T)$</td></tr><tr><td>16</td><td>$\mathcal{V}$</td><td>词表（vocabulary）</td></tr></table></div></figure>
<h4 id="section-37">参考文献</h4>
</article>
</div>
