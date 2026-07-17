---
title: "第一层：LLM 作为概率生成模型"
weight: 3002
chapter: 3
page_number: "3.2"
chapter_slug: "03-llm-and-agent"
is_section: true
root_heading_level: 3
type: docs
math: true
toc: false
---
<div class="fta-document">
<article class="fta-post">
<h3 id="section-40">第一层：LLM 作为概率生成模型</h3>
<h4 id="section-41">概率建模基础回顾</h4>
<p>在深入 LLM 的训练和推理之前，我们简要回顾第一章建立的核心概率结构。给定 token 序列 $x_{1:T}=(x_1,\dots,x_T)$，自回归语言模型将其联合概率分解为条件概率的乘积（链式法则）：</p>
<div class="fta-math fta-numbered-math" data-equations="2.1">\[
\begin{aligned}
P_\theta(x_{1:T}) = \prod_{t=1}^{T} P_\theta(x_t \mid x_{&lt;t}).
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.1"><span class="fta-equation-number" aria-hidden="true">(2.1)</span></span></div>
<p>训练目标是最小化负对数似然（Negative Log-Likelihood, NLL）：</p>
<div class="fta-math fta-numbered-math" data-equations="2.2">\[
\begin{aligned}
\mathcal{L}_{\rm NLL}(\theta) = -\frac{1}{N}\sum_{i=1}^{N}\sum_{t=1}^{T_i} \log P_\theta(x_t^{(i)}\mid x_{&lt;t}^{(i)}).
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.2"><span class="fta-equation-number" aria-hidden="true">(2.2)</span></span></div>
<p>每个 $P_\theta(x_t\mid x_{&lt;t})$ 由 softmax 从 logit $z_t$ 计算得到：</p>
<div class="fta-math fta-numbered-math" data-equations="2.3">\[
\begin{aligned}
P_\theta(x_t=j\mid x_{&lt;t}) = \frac{\exp(z_{t,j})}{\sum_{k=1}^{V}\exp(z_{t,k})}, \qquad j=1,\dots,V.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.3"><span class="fta-equation-number" aria-hidden="true">(2.3)</span></span></div>
<p>Softmax 交叉熵梯度的核心结果（已在第一章详细推导）为：</p>
<div class="fta-math fta-numbered-math" data-equations="2.4">\[
\begin{aligned}
\frac{\partial\ell}{\partial z_j} = p_j - \mathbb{1}_{j=y}.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.4"><span class="fta-equation-number" aria-hidden="true">(2.4)</span></span></div>
<p>即<strong>梯度 = 模型概率 - 真实标签</strong>。这一简洁形式贯穿所有 LLM 训练。</p>
<p>从信息论角度，NLL 的最小化等价于最小化模型分布与数据分布之间的 KL 散度：</p>
<div class="fta-math fta-numbered-math" data-equations="2.5">\[
\begin{aligned}
D_{KL}(P_{\rm data}\Vert P_\theta) = \mathbb{E}_{x\sim P_{\rm data}}\log\frac{P_{\rm data}(x)}{P_\theta(x)} \ge 0.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.5"><span class="fta-equation-number" aria-hidden="true">(2.5)</span></span></div>
<aside class="fta-callout fta-summary"><div class="fta-callout-title">Summary</div>
<p>第一章的重点是 Transformer 如何将上下文编码为向量并计算条件概率得到自回归模型——这是"计算引擎"层面的问题。</p>
<p>本章的重点是：（1）如何训练这个概率模型（预训练、指令微调、RLHF）；（2）如何从这个概率模型中生成文本（推理策略）；（3）如何将这个概率模型嵌入更大的闭环系统（Agent）。两者互补：第一章讲"引擎内部如何运转"，本章讲"引擎如何被训练、如何使用、如何接入外部世界"。</p>
</aside>
<aside class="fta-callout fta-example"><div class="fta-callout-title">Example 26</div>
<p>在我们的谐振子数值分析例子中，用户请求 "我想用数值方法分析一维谐振子的运动..." 经过 tokenization 后成为 token 序列。LLM 对每个 token 计算其在上下文中的条件概率。例如，在 "一维谐振子的运动，并比较" 之后，模型需要判断下一个 token 是 "Euler" 的概率——这取决于模型在预训练中是否见过足够多的数值方法相关文本。</p>
<p>如果模型在大量物理数值计算文本上训练过，它会给出 $P_\theta(\text{Euler}\mid\text{上下文})\approx 0.7$（因为 Euler 法是最基础的数值积分方法），而 $P_\theta(\text{Verlet}\mid\text{上下文})\approx 0.1$（Verlet 法虽然也是数值积分方法但不如 Euler 基础）。这个概率分布的质量直接决定了 Agent 后续生成的代码是否合理。</p>
</aside>
<aside class="fta-callout fta-summary"><div class="fta-callout-title">Summary</div>
<p>语言模型 = 自回归条件概率分解 + softmax 输出 + NLL 训练。这是本章所有讨论的基础。第一章讲过的东西（Transformer 内部机制）不再重复，本章聚焦于这个概率模型如何被训练、使用和嵌入更大的系统。</p>
</aside>
<h4 id="section-42">LLM 的训练：预训练、指令微调与偏好优化</h4>
<p>LLM 的训练通常分三个阶段。每一阶段改变模型的不同性质。</p>
<h5 id="section-43">预训练：学习语言的统计结构</h5>
<p>设训练语料包含 $N$ 条序列，第 $i$ 条序列长度为 $T_i$。自回归预训练损失以每个 token 为一次预测任务：</p>
<div class="fta-math fta-numbered-math" data-equations="2.6">\[
\begin{aligned}
\mathcal{L}_{\rm pre}(\theta) = -\frac{1}{\sum_{i=1}^{N} T_i}
\sum_{i=1}^{N}\sum_{t=1}^{T_i} \log P_{\theta}(x_t^{(i)}\mid x_{&lt;t}^{(i)}).
\label{pretrain_loss}
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.6"><span class="fta-equation-number" aria-hidden="true">(2.6)</span></span></div>
<p>分母使用 token 总数，使高频序列不会过度主导训练。$P_\theta$ 来自 Transformer 输出的 softmax；$\theta$ 包含所有嵌入、注意力、FFN、归一化和输出层参数。</p>
<p>预训练的本质是拟合一个巨大的条件概率模型。数据不直接存储为可寻址记录，而是通过梯度分布式地改变参数。一个事实（如"谐振子能量 $E=\frac{1}{2}mv^2+\frac{1}{2}kx^2$"）被无数相关文本片段共同编码进参数中——类似凝聚态中宏观性质由大量自由度的集体行为决定。</p>
<p><strong>尺度律（Scaling Laws）：</strong> 经验研究发现，语言模型性能与参数量 $N$、数据量 $D$、计算量 $C$ 之间常呈现近似幂律关系 <span class="fta-cite">[kaplan2020scaling; hoffmann2022training]</span>：</p>
<div class="fta-math fta-numbered-math" data-equations="2.7">\[
\begin{aligned}
\mathcal{L}(N,D,C) \approx \mathcal{L}_{\infty} + a N^{-\alpha} + b D^{-\beta} + c C^{-\gamma}.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.7"><span class="fta-equation-number" aria-hidden="true">(2.7)</span></span></div>
<p>这不是第一性原理定律，而是在某些范围内描述经验趋势。揭示宏观趋势但不替代微观机制。</p>
<aside class="fta-callout fta-example"><div class="fta-callout-title">Example 27</div>
<p>在我们的谐振子例子中，预训练阶段对 Agent 的能力有决定性影响：</p>
<ul>
<li><strong>物理知识：</strong> 模型在大量物理教材、论文、习题解答上训练后，知道谐振子方程 $\ddot x + \omega^2 x = 0$ 的解析解为 $x(t)=A\cos(\omega t+\phi)$，能量守恒为 $E=\frac{1}{2}v^2+\frac{1}{2}\omega^2 x^2$。</li>
<li><strong>数值方法：</strong> 模型在数值分析教材和代码仓库（如 SciPy、NumPy 文档）上训练后，知道 Euler 法是一阶方法、RK4 是四阶方法，二者的局部截断误差分别为 $O(\Delta t^2)$ 和 $O(\Delta t^5)$。</li>
<li><strong>编程能力：</strong> 模型在 Python 代码上训练后，能够生成正确的 <code>numpy</code> 数组操作和 <code>matplotlib</code> 绘图代码。</li>
</ul>
<p>如果预训练语料中缺少数值方法的系统性内容，模型可能写出语法正确但算法错误的 RK4 代码——这恰恰说明预训练阶段的知识覆盖对下游任务至关重要。</p>
</aside>
<h5 id="section-44">指令微调：让模型学会"按指令办事"</h5>
<p>预训练模型主要学会"续写文本"——给定前文，生成最可能的后续内容。但用户需要的是"按照指令完成任务"。例如 "帮我写一段谐振子 Euler 积分的 Python 代码"，模型需要理解这是代码生成请求而非对话续写。</p>
<p>指令微调（Instruction Tuning）使用 <code>(instruction, input)</code>$\to$ <code>response</code> 格式的数据集继续训练模型。训练方式与预训练相同（下一个 token 的交叉熵），但数据分布不同：</p>
<ul>
<li><strong>预训练数据：</strong> 例如语料中出现的文本："谐振子是物理学中最基本的模型之一。一维谐振子的运动方程为..."</li>
<li><strong>指令微调数据：</strong> 使用 (指令, 输入) $\to$ 输出 的格式配对。例如：</li>
</ul>
<pre class="fta-code"><code>[指令] 用 Python 实现一维谐振子的 Euler 法数值积分。
[输入] 初始条件 x0=1, v0=0, omega=1, 步长 dt=0.01。
[输出] &quot;&quot;&quot;用 Euler 法求解一维谐振子&quot;&quot;&quot;
      import numpy as np
      def euler_harmonic_oscillator(x0, v0, omega, dt, n_steps):
      t = np.zeros(n_steps + 1)
      x = np.zeros(n_steps + 1)
      v = np.zeros(n_steps + 1)
    ...</code></pre>
<p>指令微调不引入新的模型架构或损失函数——它只是改变了条件分布 $P_\theta(\text{response}\mid\text{instruction})$ 的统计性质，使模型学会将指令映射到有用的输出格式。</p>
<h5 id="section-45">RLHF：用人类偏好校准模型（Reinforcement Learning from Human Feedback ）</h5>
<p>即使指令微调后的模型能完成任务，其输出未必符合人类偏好。例如，对于 "实现谐振子数值积分" 指令：</p>
<ul>
<li>回答 A：代码有文档字符串、变量名清晰、包含能量守恒检验（$y^+$偏好）</li>
<li>回答 B：代码无注释、变量名随意、只画图不检验能量（$y^-$非偏好）</li>
</ul>
<p>基于人类反馈的强化学习（RLHF）通过以下流程引入偏好信号 <span class="fta-cite">[ouyang2022training]</span>：</p>
<p><strong>步骤1——收集偏好数据：</strong> 对同一提示 $x$，生成两个回答 $y^+$和 $y^-$，由人类标注者做出选择。</p>
<p><strong>步骤2——训练奖励模型：</strong> 使用 Bradley-Terry 模型将偏好概率参数化为</p>
<div class="fta-math fta-numbered-math" data-equations="2.8">\[
\begin{aligned}
P(y^+ \succ y^- \mid x) = \sigma(r_\phi(x, y^+) - r_\phi(x, y^-)),
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.8"><span class="fta-equation-number" aria-hidden="true">(2.8)</span></span></div>
<p>其中 $r_\phi$ 是奖励模型（reward model），$\sigma(u)=\frac{1}{1+e^{-u}}$ 是 sigmoid 函数。通过最大化偏好数据的对数似然$L_{\text{RM}} = -\log \sigma\left(r_\phi(x,y^+) - r_\phi(x,y^-)\right)$来训练 $r_\phi$。</p>
<p><strong>步骤3——强化学习微调：</strong> 使用 近端策略优化（Proximal Policy Optimization，PPO）等算法微调 LLM，使其生成高奖励回答，同时用 KL 散度惩罚防止模型偏离指令微调后的分布太远：</p>
<div class="fta-math fta-numbered-math" data-equations="2.9">\[
\begin{aligned}
\underbrace{\mathcal{L}_{\rm RL}(\theta)}_{\text{强化学习的损失}} = \underbrace{-\mathbb{E}_{y\sim P_\theta}\!\left[r_\phi(x,y)\right]}_{\text{奖励项}} + \underbrace{\beta\,D_{KL}(P_\theta(y\mid x) \,\Vert\, P_{\theta_{\rm SFT}}(y\mid x))}_{\text{约束项}}.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.9"><span class="fta-equation-number" aria-hidden="true">(2.9)</span></span></div>
<p>其中 $P_{\theta_{\rm SFT}}$ 是指令微调后的模型，$\beta$ 控制惩罚强度。</p>
<p>如果只最大化奖励而不加约束，模型可能退化：它可能学会生成奖励模型给高分但毫无意义的文本（奖励模型也是可被"欺骗"的神经网络）。KL 惩罚确保模型不会偏离"基本合理"的行为模式太远——这类似于正则化项防止过拟合。</p>
<aside class="fta-callout fta-example"><div class="fta-callout-title">Example 28</div>
<p>用户提示 $x$：</p>
<pre class="fta-code"><code>分析一维谐振子：x&#x27;&#x27; + w²x = 0。初始条件 x0 = 1, v0 = 0, w = 1。
模拟 10 个周期，比较 Euler 法和 RK4 法的能量守恒表现。
请给出代码和分析。</code></pre>
<p>物理上：$\dot{x} = v , \dot{v} = -\omega^2 x$. 因为 $\omega=1$，所以：$\dot{v} = -x$ 能量是：$E(t) = \frac{1}{2}v(t)^2 + \frac{1}{2}\omega^2 x(t)^2$.</p>
<p>初始能量：$E_0 = 0.5$. 真实解析解中，谐振子能量应该严格守恒。</p>
<ol>
<li>步骤 1：收集偏好数据</li>
<p>RLHF 第一步不是直接训练模型，而是先让模型对同一个 prompt 生成多个回答，然后让人类比较哪个（收集偏好对）。对于这个提示 $x$，模型可能生成两个<span class="fta-ref">[EulerRK4]</span>：</p>
<p>回答 A：人类偏好的回答 $y^+$</p>
<pre class="fta-code"><code>1. 正确写出 dx/dt = v, dv/dt = -ω²x
2. 同时实现 Euler 和 RK4
3. 计算能量 E(t) = 1/2 v² + 1/2 ω²x²
4. 计算相对能量误差
5. 画出 x(t)、相图、能量误差曲线
6. 如果 Euler 能量漂移超过 1%，主动提醒
7. 解释 Euler 不守恒，RK4 更稳定</code></pre>
<p>这类回答符合物理任务的核心要求：</p>
<p><strong>不只是生成代码，还要检查守恒量。</strong></p>
<p>回答 B：非偏好的回答 $y^-$</p>
<pre class="fta-code"><code>1. 只实现 Euler 法
2. 只画 x(t)
3. 没有 RK4
4. 没有能量计算
5. 没有能量守恒误差
6. 没有指出 Euler 法能量漂移</code></pre>
<p>它可能“看起来能跑”，但对于物理数值分析来说是不完整的。</p>
<li>步骤 2：训练奖励模型</li>
<ul>
<li>RLHF 的第二步是训练一个奖励模型：$r_\phi(x,y)$.</li>
<p>它输入 prompt $x$ 和回答 $y$，输出一个分数。分数越高，表示这个回答越符合人类偏好。</p>
<p>文档中用 Bradley-Terry 模型（$\sigma(u) = \frac{1}{1+e^{-u}}$）：</p>
<div class="fta-math fta-numbered-math" data-equations="2.10">\[
\begin{aligned}
P(y^+ \succ y^- | x) = \sigma\left(r_\phi(x,y^+) - r_\phi(x,y^-)\right)
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.10"><span class="fta-equation-number" aria-hidden="true">(2.10)</span></span></div>
<li>给奖励模型设计一个教学版特征</li>
<p>为了手算，我们假设奖励模型不是复杂神经网络，而是一个线性打分器：</p>
<div class="fta-math fta-numbered-math" data-equations="2.11">\[
\begin{aligned}
r_\phi(x,y) = w \cdot f(x,y)
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.11"><span class="fta-equation-number" aria-hidden="true">(2.11)</span></span></div>
<p>其中 $f(x,y)$ 是回答的特征。设 6 个特征：</p>
<div class="fta-table-scroll"><table class="fta-table"><tr><th>特征</th><th>含义</th><th>特征</th><th>含义</th></tr><tr><td>$f_1$</td><td>物理方程是否正确</td><td>$f_4$</td><td>是否计算相对能量误差</td></tr><tr><td>$f_2$</td><td>是否同时实现 Euler 和 RK4</td><td>$f_5$</td><td>是否给出能量漂移警告</td></tr><tr><td>$f_3$</td><td>是否计算能量</td><td>$f_6$</td><td>代码是否清晰、有注释</td></tr></table></div>
<p>回答 A 的特征：$f^+ = [1,1,1,1,1,1]$, 回答 B 的特征：$ f^- = [1,0,0,0,0,0.4]$</p>
<p>解释：回答 B 至少方程可能是对的，所以 $f_1=1$；但它没有 RK4、没有能量、没有误差、没有警告；代码清晰度勉强给 0.4。</p>
<p>设初始权重：$w = [0.2,0.2,0.2,0.2,0.2,0.2]$</p>
<p>那么奖励模型给 A 的分数是：$r_\phi(x,y^+) = 1.2$ 给 B 的分数是：$r_\phi(x,y^-) = 0.28$</p>
<p>所以分数差：$\Delta r = r_\phi(x,y^+) - r_\phi(x,y^-) = 1.2 - 0.28 = 0.92$</p>
<p>偏好概率：</p>
<div class="fta-math fta-numbered-math" data-equations="2.12">\[
\begin{aligned}
P(y^+ \succ y^- | x) = \sigma(0.92) = \frac{1}{1+e^{-0.92}} \approx 0.715
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.12"><span class="fta-equation-number" aria-hidden="true">(2.12)</span></span></div>
<p>也就是说，当前奖励模型认为："A 比 B 好的概率约为 71.5%"; 但人类标签是："A 确实比 B 好". 所以我们希望这个概率更接近 1。</p>
<p>奖励模型的损失是：</p>
<div class="fta-math fta-numbered-math" data-equations="2.13">\[
\begin{aligned}
L_{\text{RM}} = -\log \sigma\left(r_\phi(x,y^+) - r_\phi(x,y^-)\right)\approx 0.335
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.13"><span class="fta-equation-number" aria-hidden="true">(2.13)</span></span></div>
<p>训练奖励模型的目标就是降低这个损失。</p>
<li>一次梯度更新的直觉</li>
<p>因为人类选择了 A，所以训练会让：</p>
<div class="fta-math fta-numbered-math" data-equations="2.14">\[
\begin{aligned}
r_\phi(x,y^+) \ \text{变大}, \quad r_\phi(x,y^-) \ \text{变小}
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.14"><span class="fta-equation-number" aria-hidden="true">(2.14)</span></span></div>
<p>注意 A 和 B 的差别主要在：</p>
<pre class="fta-code"><code>是否有 RK4, 能量检查, 相对误差, 能量漂移警告, 代码清晰</code></pre>
<p>所以训练后，奖励模型会提高这些特征的权重。</p>
<p>例如更新后权重可能变成：</p>
<div class="fta-math fta-numbered-math" data-equations="2.15">\[
\begin{aligned}
w&#x27; = [0.2,\ 0.343,\ 0.343,\ 0.343,\ 0.343,\ 0.286]
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.15"><span class="fta-equation-number" aria-hidden="true">(2.15)</span></span></div>
<p>这时：$r_{'}(x,y^+) = 1.858, r_{'}(x,y^-) = 0.314$</p>
<p>分数差：$\Delta r&#x27; = 1.858 - 0.314 = 1.544$</p>
<p>偏好概率变成：$\sigma(1.544) \approx 0.824$</p>
<p>损失变成：$L_{RM}=-\log(0.824) \approx 0.194$</p>
<p>所以训练后奖励模型更确信："包含能量守恒检查、RK4 对比、误差分析的答案更好".</p>
</ul>
<li>步骤 3：用奖励模型强化学习微调 LLM</li>
<ul>
<li>第三步把 LLM 看成一个策略：$P_\theta(y|x)$.给定提示$x$，模型生成回答$y$的概率。</li>
<p>RLHF 希望模型更常生成高奖励回答。</p>
<p>文档里的目标函数是：</p>
<div class="fta-math fta-numbered-math" data-equations="2.16">\[
\begin{aligned}
L_{\text{RL}}(\theta) = -\mathbb{E}_{y\sim P_\theta}[r_\phi(x,y)] + \beta \, D_{KL}\left( P_\theta(y|x) \| P_{\theta_{\text{SFT}}}(y|x) \right)
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.16"><span class="fta-equation-number" aria-hidden="true">(2.16)</span></span></div>
<p>这有两部分：</p>
<div class="fta-table-scroll"><table class="fta-table"><tr><th>项</th><th>含义</th></tr><tr><td>$-\mathbb{E}[r_\phi]$</td><td>希望奖励越高越好，所以损失里加负号</td></tr><tr><td>$\beta D_{KL}$</td><td>不希望模型离 SFT 模型太远</td></tr></table></div>
<li>简化成三个候选回答</li>
<p>为了手算，我们假设模型只可能生成三类回答：</p>
<div class="fta-table-scroll"><table class="fta-table"><tr><th>回答</th><th>内容</th><th>奖励 $r_\phi(x,y)$</th></tr><tr><td>$y_A$</td><td>高质量：Euler + RK4 + 能量误差 + 警告</td><td>4.8</td></tr><tr><td>$y_B$</td><td>普通：只写 Euler，只画图</td><td>1.0</td></tr><tr><td>$y_C$</td><td>有些花哨，但分析不严谨</td><td>2.8</td></tr></table></div>
<p>指令微调后的 SFT 模型分布为：$P_{\theta_{\text{SFT}}} = [0.30,\ 0.60,\ 0.10]$, 意思是：</p>
<pre class="fta-code"><code>SFT 模型有 30% 概率生成高质量回答 A，
60% 概率生成普通回答 B，
10% 概率生成花哨但不严谨回答 C。</code></pre>
<p>RLHF 后，我们希望模型更多生成 A。</p>
<p>假设当前 RLHF 模型分布为：$P_\theta = [0.70,\ 0.20,\ 0.10]$, 也就是：</p>
<pre class="fta-code"><code>A 的概率从 30% 提高到 70%,B 的概率从 60% 降到 20%,C 保持 10%</code></pre>
<li>计算期望奖励</li>
<div class="fta-math fta-numbered-math" data-equations="2.17">\[
\begin{aligned}
\mathbb{E}_{y\sim P_\theta}[r_\phi(x,y)] = 0.70 \cdot 4.8 + 0.20 \cdot 1.0 + 0.10 \cdot 2.8= 3.84
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.17"><span class="fta-equation-number" aria-hidden="true">(2.17)</span></span></div>
<p>所以奖励项是：$-\mathbb{E}[r_\phi] = -3.84$, 模型越偏向 A，这一项越小，训练越喜欢。</p>
<li>计算 KL 惩罚（代入三类回答）</li>
<div class="fta-math fta-numbered-math" data-equations="2.18">\[
\begin{aligned}
D_{KL}(P_\theta \| P_{\text{SFT}}) = \sum_y P_\theta(y|x) \log\frac{P_\theta(y|x)}{P_{\text{SFT}}(y|x)}
    =0.373
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.18"><span class="fta-equation-number" aria-hidden="true">(2.18)</span></span></div>
<p>如果取：$\beta = 0.2$, 则 KL 惩罚为：$\beta D_{KL} = 0.2 \times 0.373 = 0.0746$, 最终 RLHF 损失：</p>
<div class="fta-math fta-numbered-math" data-equations="2.19">\[
\begin{aligned}
L_{\text{RL}} = -3.84 + 0.0746 = -3.7654
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.19"><span class="fta-equation-number" aria-hidden="true">(2.19)</span></span></div>
<p>这个损失比原来的 SFT 分布更低。</p>
<p>原 SFT 分布: 期望奖励是：$\mathbb{E}_{y\sim P_\theta}[r_\phi(x,y)] = P_{\theta_{SFT}}\cdot r_\phi=2.32$, $D_{KL}=0$.</p>
<p>所以：$L_{\text{SFT-like}} = -2.32$, RLHF 后：$L_{\text{RLHF}} \approx -3.765$</p>
<p>因为我们在最小化损失，所以 RLHF 更偏好新的分布。</p>
</ul>
<li>这个过程到底改变了什么？</li>
<ul>
<li>RLHF 后，模型不是“更懂谐振子方程”了。</li>
<p>1)谐振子的基本知识来自预训练：</p>
<pre class="fta-code"><code>x&#x27;&#x27; + ω²x = 0
E = 1/2 v² + 1/2 ω²x²
Euler 一阶
RK4 四阶</code></pre>
<p>2)RLHF 改变的是模型的 <strong>输出偏好</strong>。</p>
<p>它让模型更倾向于输出：</p>
<pre class="fta-code"><code>不仅给代码，还要做物理校验；
不仅跑数值，还要检查能量守恒；
不仅给图，还要指出 Euler 和 RK4 的差异。</code></pre>
<p>所以对于谐振子任务，RLHF 学到的是：<code>高质量物理计算答案应该包含守恒量检查。</code></p>
<li>三步总结</li>
<div class="fta-table-scroll"><table class="fta-table"><tr><th>RLHF 步骤</th><th>在谐振子例子里具体是什么</th><th>数学形式</th></tr><tr><td>步骤1：收集偏好数据</td><td>人类选择完整物理分析的回答</td><td>$y^+ \succ y^-$</td></tr><tr><td>步骤2：训练奖励模型</td><td>奖励模型给高质量回答高分</td><td>$P(y^+ \succ y^-) = \sigma(r_+ - r_-)$</td></tr><tr><td>步骤3：强化学习微调</td><td>模型更常生成高奖励回答</td><td>$-\mathbb{E}[r_\phi] + \beta D_{KL}$</td></tr></table></div>
<p>一句话：</p>
<p><strong>RLHF 在谐振子例子中的作用，是把模型从“会写一段能跑的代码”，推向“会写一段物理上可信、带能量守恒校验、能比较 Euler 与 RK4 的高质量分析”。</strong></p>
</ul>
</ol>
</aside>
<aside class="fta-callout fta-summary"><div class="fta-callout-title">Summary</div>
<p>LLM 的三阶段训练：</p>
<ul>
<li>预训练让模型学会语言的统计结构和领域知识；</li>
<li>指令微调让模型学会从指令到输出的映射格式；</li>
<li>RLHF 让模型的输出更符合人类对质量、安全性和实用性的偏好。</li>
<p>三个阶段分别改变模型的<strong>知识分布</strong>、<strong>行为格式</strong>和<strong>价值偏好</strong>。</p>
<h4 id="section-46">LLM 的推理：自回归生成与采样策略</h4>
<p>"生成"不是一次性吐出完整答案，而是重复执行：给定上下文，计算下一个 token 分布，选择/采样一个 token，加入上下文，再继续。不同采样策略改变输出的稳定性和多样性。</p>
<h5 id="section-47">自回归生成循环</h5>
<p>设用户输入 tokenized 后为 $x_{1:n}$。生成循环为：</p>
<ol>
<li>计算 $P_{\theta}(x_{n+1}\mid x_{1:n})$——模型对第 $n+1$ 个位置所有可能 token 的概率分布；</li>
<li>选择一个 token $\hat{x}_{n+1}$——通过贪心、采样或搜索策略；</li>
<li>追加到上下文：$x_{1:n+1} = (x_1,\dots,x_n,\hat{x}_{n+1})$；</li>
<li>重复直到遇到结束 token、达到长度上限或触发停止条件。</li>
</ol>
<p>LLM 的回答是一个随机/确定性解码过程。早期 token 的选择会改变后续上下文，从而影响后续所有概率——这被称为"蝴蝶效应"：一个早期的采样选择可能完全改变后文的语义方向。</p>
<h5 id="section-48">贪心解码、温度采样、Top-k 与 Top-p</h5>
<p><strong>贪心解码（Greedy）：</strong> 每步选择概率最高的 token，</p>
<div class="fta-math fta-numbered-math" data-equations="2.20">\[
\begin{aligned}
\hat{x}_{t+1} = \operatorname*{arg\,max}_v P_{\theta}(v\mid x_{\leq t}).
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.20"><span class="fta-equation-number" aria-hidden="true">(2.20)</span></span></div>
<p>稳定但可能重复、死板——一旦进入循环模式，"贪心"会一直维持同一局部最优路径。</p>
<p><strong>温度采样（Temperature Sampling）：</strong> 将 logit 除以温度 $\tau&gt;0$ 后做 softmax：</p>
<div class="fta-math fta-numbered-math" data-equations="2.21">\[
\begin{aligned}
p_j(\tau) = \frac{\exp(z_j/\tau)}{\sum_{k=1}^{V}\exp(z_k/\tau)}.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.21"><span class="fta-equation-number" aria-hidden="true">(2.21)</span></span></div>
<p>$\tau\to 0$：分布趋近 one-hot（贪心模式，输出确定但单一）。 $\tau\to\infty$：分布趋近均匀（完全随机，输出多样但可能无意义）。 $\tau=1$：原始 softmax 分布。</p>
<p>统计物理直觉：logit $z_j$ 类比负能量 $-E_j$，$\tau$ 类比温度 $k_B T$。低温时系统"冻结"到最低能量状态（最可能的 token）；高温时有"热涨落"使低概率 token 也有机会被选中。合理选择 $\tau$ 相当于在不同"温度"下从 Gibbs 分布中采样。</p>
<p><strong>Top-k 采样：</strong> 只保留概率最高的 $k$ 个 token，重归一化后采样。$k$ 固定——但不同上下文的概率分布形状差异巨大，固定 $k$ 可能不合理。</p>
<p><strong>Top-p（Nucleus）采样：</strong> 选择最小集合使累计概率达到阈值 $p_0$，动态调整候选集合大小。这比固定 $k$ 更灵活：当分布集中时选少量 token，分布平坦时选较多 token。</p>
<aside class="fta-callout fta-example"><div class="fta-callout-title">Example 29</div>
<p>在我们的谐振子例子中，当 Agent 生成代码时：</p>
<p><strong>场景：</strong> 上下文为</p>
<pre class="fta-code"><code>def harmonic_oscillator_rk4(x0, v0, omega, dt, n_steps):
用 RK4 方法求解一维谐振子
Args:x0: 初始位置;v0: 初始速度;omega: 角频率;dt: 时间步长
n_steps: 步数
Returns:t, x, v: 时间、位置、速度数组</code></pre>
<p>模型现在需要预测下一个 token。一个合理的下一步是 `t = np.zeros` 或 `x = np.zeros`。</p>
<p>设模型（$\tau=0.8$）对下一个 token 的概率分布（简化到5个候选）为：</p>
<div class="fta-math fta-numbered-math" data-equations="2.22">\[
\begin{aligned}
p(\text{&quot;t&quot;}) = 0.45,\,
p(\text{&quot;x&quot;}) = 0.30,\,
p(\text{&quot;\#&quot;}) = 0.02,\,
p(\text{&quot;import&quot;}) = 0.05,\,
p(\text{&quot;def&quot;}) = 0.01.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.22"><span class="fta-equation-number" aria-hidden="true">(2.22)</span></span></div>
<p>（其余概率分布在其他 token 上）</p>
<p>用 Top-p（$p_0=0.9$）采样：累积 "t"(0.45) + "x"(0.30) = 0.75。继续加 "import"(0.05) = 0.80。继续加 "\#"(0.02) = 0.82。再加 "def"(0.01) = 0.83 &lt; 0.9，继续加入更多候选直到累计超过 0.9。</p>
<p>对于代码生成任务，合理的采样策略至关重要：温度太高可能生成语法错误的代码（如随机插入不存在的函数名），温度太低则代码过于模板化（所有函数都写成一模一样的风格，缺少针对具体物理问题的适配）。对于代码生成，使用较低的 $\tau$（0.2--0.5）和较高的 $p_0$（0.9--0.95）比较合理。</p>
</aside>
<aside class="fta-callout fta-summary"><div class="fta-callout-title">Summary</div>
<p>生成 = 重复采样。贪心 = 确定性最可能路径；温度 = 控制"热涨落"大小；Top-k/Top-p = 截断低概率噪声。采样策略的统计物理直觉：softmax 定义 Gibbs 分布，温度控制熵，截断相当于排除高能态。</p>
</aside>
<h4 id="section-49">LLM 的能力与局限：推理与幻觉</h4>
<h5 id="section-50">推理能力从何而来</h5>
<p>LLM 可以表现出推理能力，但其基本机制仍是条件概率建模。推理能力来自多个因素的复合：</p>
<ol>
<li>大规模语料中的推理示例（数学推导、代码逻辑、因果论证）；</li>
<li>Transformer 的表示能力（通过注意力建立长程依赖，已在第一章详述）；</li>
<li>训练目标对序列中远期依赖关系的压力（预测下一 token 需要理解前文的逻辑结构）；</li>
<li>指令微调中的结构化解题数据（如 Chain-of-Thought 逐步推理 <span class="fta-cite">[wei2022cot]</span>）；</li>
<li>解码时显式的 Chain-of-Thought 提示（让模型在生成答案前先生成中间推理步骤）。</li>
</ol>
<p>从数学角度看，模型学习的是 $P_{\theta}(\text{答案}\mid\text{题目、上下文、示例})$。如果训练和上下文中有大量正确推导模式，模型可能生成类似推导；但这不等于每一步都经过形式化验证。</p>
<h5 id="section-51">幻觉的概率解释</h5>
<p>"幻觉"（hallucination）指模型生成看似合理但事实错误的内容。从概率角度，这是条件概率模型的自然现象：</p>
<div class="fta-math fta-numbered-math" data-equations="2.23">\[
\begin{aligned}
\hat{x}_{1:T} \sim P_{\theta}(x_{1:T}\mid c).
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.23"><span class="fta-equation-number" aria-hidden="true">(2.23)</span></span></div>
<p>生成目标只要求序列在模型分布下概率高，而非保证命题真实。高概率序列可能是流畅的、常见的，但未必与真实世界一致。</p>
<p>为什么模型会在"不懂"的时候仍然自信地生成？因为训练目标（NLL）奖励的是"概率分布接近训练数据分布"，而不是"不确定时表达不确定"。如果训练数据中很少有"我不知道"的示例，模型就学会了——无论什么输入，都应当输出一个"看起来合理"的回答。</p>
<aside class="fta-callout fta-explanation"><div class="fta-callout-title">Explanation: 幻觉的统计物理类比</div>
<p>把 LLM 的生成看作在条件概率曲面上的随机游走。当上下文提供的约束（低能区）不够窄时，有很多条"高概率路径"——其中只有一部分对应事实正确的命题。模型可能在一条高概率但非事实的路径上越走越远，相当于在自由能曲面上滑进了一个"错误但流畅"的局部极小值。</p>
</aside>
<aside class="fta-callout fta-summary"><div class="fta-callout-title">Summary</div>
<p>LLM 可以表现出推理能力，但机制仍是条件概率。幻觉源于模型在缺乏证据时仍生成高概率序列。因此，可靠的 LLM Agent 不能把一次生成直接当作最终答案，而需要在后续工作流中引入工具执行、物理量检查、来源验证等外部校验闭环。</p>
</aside>
</article>
</div>
