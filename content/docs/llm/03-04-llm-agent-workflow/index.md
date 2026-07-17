---
title: "第三层：LLM Agent 的六步工作流"
weight: 3004
chapter: 3
page_number: "3.4"
chapter_slug: "03-llm-and-agent"
is_section: true
root_heading_level: 3
type: docs
math: true
toc: false
---
<div class="fta-document">
<article class="fta-post">
<h3 id="section-57">第三层：LLM Agent 的六步工作流</h3>
<p>将 LLM 放入 Agent 系统后，一个完整任务不是一次性生成答案，而是一个可重复的闭环过程：</p>
<div class="fta-math fta-numbered-math" data-equations="2.34">\[
\begin{aligned}
\text{任务输入}
\to \text{目标理解}
\to \text{任务分解}
\to \text{行动选择}
\to \text{工具调用}
\to \text{观察校验}
\to \text{最终输出}.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.34"><span class="fta-equation-number" aria-hidden="true">(2.34)</span></span></div>
<aside class="fta-callout fta-summary"><div class="fta-callout-title">Summary</div>
<p>LLM Agent 的六步闭环可以概括为：</p>
<ol>
<li><strong>理解任务：</strong> 从用户输入中提取目标、约束、参数和输出格式；</li>
<li><strong>任务分解：</strong> 将大目标拆成可执行、可观测、可校验的子目标；</li>
<li><strong>行动选择：</strong> 根据当前状态决定直接回答、调用工具、检索资料、执行代码或请求人工确认；</li>
<li><strong>工具调用：</strong> 把行动转化为外部工具的结构化输入；</li>
<li><strong>观察与校验：</strong> 读取工具返回，检查代码错误、数值误差、事实来源和物理约束；</li>
<li><strong>终止与输出：</strong> 当目标完成且校验通过时，生成最终答案或报告。</li>
</ol>
</aside>
<h4 id="section-58">理解任务</h4>
<p>理解任务是把用户的自然语言请求转换为结构化目标。Agent 至少需要识别：目标 $g$、已知条件、约束条件、可用工具和期望输出形式。若这些信息不足，Agent 应先请求澄清，而非直接执行。</p>
<aside class="fta-callout fta-example"><div class="fta-callout-title">Example 31</div>
<p>本节将谐振子数值分析的完整 Agent 工作流展开，展示从用户请求到最终报告的全过程。</p>
<p>用户请求：</p>
<blockquote>
<p>"我想用数值方法分析一维谐振子的运动，并比较 Euler 法和 RK4 法的能量守恒表现。初始条件 $x_0=1$, $v_0=0$, $\omega=1$，模拟10个周期。帮我实现代码并分析结果。"</p>
</blockquote>
<p>物理系统：一维谐振子 $\ddot x + \omega^2 x = 0$，等价一阶系统$ x = v, v = -^2 x$.</p>
<p>解析解：$x(t) = x_0\cos(\omega t) + (v_0/\omega)\sin(\omega t) = \cos t$（在给定初始条件下）。</p>
<p>守恒量：$E(t) = \frac{1}{2}v(t)^2 + \frac{1}{2}\omega^2 x(t)^2 \equiv E_0 = 0.5$（在给定初始条件下）。</p>
<p><strong>解析任务参数</strong></p>
<p>Agent 从用户请求中提取关键参数：</p>
<div class="fta-math fta-numbered-math" data-equations="2.35">\[
\begin{aligned}
\text{params} = \{x_0=1,\; v_0=0,\; \omega=1,\; T_{\rm sim}=10\times \frac{2\pi}{\omega} \approx 62.8,\; \text{methods}=[\text{Euler}, \text{RK4}]\}.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.35"><span class="fta-equation-number" aria-hidden="true">(2.35)</span></span></div>
</aside>
<h4 id="section-59">分解规划</h4>
<h5 id="section-60">任务分解的形式化</h5>
<p>给定目标 $g$，规划模块找到子目标序列 $g \to (g_1, g_2, \dots, g_K)$。每个子目标 $g_k$ 对应行动序列 $a_{k,1},\dots,a_{k,n_k}$，完整任务变成轨迹（可执行序列）$\tau = (a_1, a_2, \dots, a_M)$.</p>
<ol>
<li>每步可执行（行动在当前状态下是可行的）；</li>
<li>每步结果可观测（执行后有明确的成功/失败信号）；</li>
<li>失败时可回滚或修正（不因单步失败导致全局失败）；</li>
<li>子目标之间的依赖关系明确（某些步骤必须在前序步骤完成后才能开始）。</li>
</ol>
<h5 id="section-61">搜索树</h5>
<p>每个状态 $s$ 是搜索树节点，每个行动 $a$ 是边。规划是寻找从初态 $s_0$ 到目标集合 $\mathcal{G}$ 的路径。</p>
<p>现实中状态空间巨大且环境不确定，无法精确求解最优路径。因此常使用启发式规划：LLM 生成候选步骤，工具执行和反馈修正。</p>
<aside class="fta-callout fta-example"><div class="fta-callout-title">Example 32</div>
<p>在我们的谐振子数值分析任务中，目标可以分解为：</p>
<div class="fta-math fta-numbered-math" data-equations="2.36">\[
\begin{aligned}
g \to (g_1,\dots,g_6)
= (\text{理解系统}, \text{检索数值方法}, \text{生成执行代码}, \text{校验结果}, \text{可视化}, \text{输出报告}).
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.36"><span class="fta-equation-number" aria-hidden="true">(2.36)</span></span></div>
<p>这个分解满足要求：失败时可以回到对应步骤修正。例如，如果 RK4 代码执行失败，Agent 不需要重做问题理解，而只需要回到“生成并执行代码”这一步。</p>
</aside>
<h4 id="section-62">行动选择</h4>
<p>行动选择是在当前状态 $s_t$ 下决定下一步做什么。可选行动包括继续推理、直接回答、调用检索、执行代码、读取文件、生成图表或请求人工确认。行动选择的关键是：下一步操作必须能推进目标状态，而不仅仅是生成一段流畅文字。</p>
<h5 id="section-63">ReAct：推理与行动交替</h5>
<p>ReAct（Reasoning + Acting）<span class="fta-cite">[yao2023react]</span> 是一种将推理和行动交替进行的范式：</p>
<div class="fta-math fta-numbered-math" data-equations="2.37,2.38,2.39,2.40">\[
\begin{aligned}
\text{Thought}_t &amp;\leftarrow f_{\theta}(s_t, g) \quad \text{(LLM 生成&quot;思考&quot;)},\\
a_t &amp;\leftarrow \text{ActionParser}(\text{Thought}_t) \quad \text{(将文本解析为工具调用)},\\
o_{t+1} &amp;\leftarrow E(s_t, a_t) \quad \text{(执行工具)},\\
s_{t+1} &amp;\leftarrow U(s_t, a_t, o_{t+1}) \quad \text{(状态更新)}.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.37、2.38、2.39、2.40"><span class="fta-equation-number" aria-hidden="true">(2.37)</span><span class="fta-equation-number" aria-hidden="true">(2.38)</span><span class="fta-equation-number" aria-hidden="true">(2.39)</span><span class="fta-equation-number" aria-hidden="true">(2.40)</span></span></div>
<aside class="fta-callout fta-explanation"><div class="fta-callout-title">Explanation: ReAct 中的"思考"不是神秘主义</div>
<p>"思考"步骤相当于把模型的中间推理过程显式化为文本。它的作用包括：</p>
<ul>
<li>分析当前状态和目标之间的差距；</li>
<li>检查上一步工具返回的结果是否合理；</li>
<li>决定下一步应该做什么（信息检索、计算、还是直接回答）；</li>
<li>在复杂决策点（方法选择、参数设置）记录推理依据。</li>
</ul>
<p>这本质上是一种用自然语言实现的、可检查的中间工作区。</p>
</aside>
<aside class="fta-callout fta-example"><div class="fta-callout-title">Example 33</div>
<p>在我们的谐振子例子中，Agent 使用 ReAct 模式处理"分析数值结果"这个阶段：</p>
<p><strong>Thought$_t$：</strong> "Euler 法代码已成功运行。输出数据显示10个周期后的能量相对误差为 0.052（5.2%），且系统总能量单调递增，出现能量漂移。下一步运行 RK4 代码，预期其能量误差应远小于 Euler 法，因为 RK4 是四阶方法。也需要检查时间步长是否满足稳定性条件 $\Delta t &lt; 2/\omega = 2$。</p>
<p><strong>Action$_t$：</strong> <code>execute(&quot;python rk4_harmonic_oscillator.py&quot;)</code></p>
<p><strong>Observation$_{t+1}$：</strong> RK4 运行成功，10周期后能量相对误差 $=8\times10^{-6}$（$0.0008\%$），相位图显示轨道闭合，无明显漂移。</p>
<p><strong>Thought$_{t+1}$：</strong> "RK4 的能量误差（$8\times10^{-6}$）比 Euler 法（$5.2\times10^{-2}$）小约 6500 倍，符合四阶方法 vs 一阶方法的预期。现在需要：(1) 用不同步长验证收敛阶；(2) 生成对比图；(3) 撰写分析报告。先做收敛阶测试——用 $\Delta t = 0.05, 0.02, 0.01, 0.005$ 分别跑 RK4 和 Euler，记录每个步长的全局误差，拟合法验证收敛阶。"</p>
<p>关键在于：每一步思考不仅描述了"做什么"，还包含了物理判断（"能量单调递增意味着非辛"、"稳定性条件的检查"）——这些判断引导着后续的行动选择。</p>
</aside>
<h4 id="section-64">工具调用</h4>
<p>LLM 自身不能执行代码、搜索网络或查询数据库。工具调用使 LLM 从"只会生成文本"变成"能请求外部计算和信息"。</p>
<p>设系统有工具集合 $\mathcal{T} = \{\mathcal{T}_1,\dots,\mathcal{T}_R\}$。第 $r$ 个工具 $\mathcal{T}_r$ 接受参数 $u$，返回结果 $y = \mathcal{T}_r(u)$。Agent 的行动拆分为两部分：$a_t = (r_t, u_t)$——选择工具编号 $r_t$ 和参数 $u_t$。</p>
<p>工具调用的可靠性是关键。令 $o_{t+1} = (y_{t+1}, e_{t+1})$，其中 $e_{t+1}$ 是错误状态。若 $e_{t+1}\neq 0$，Agent 必须识别错误并选择恢复行动。</p>
<aside class="fta-callout fta-explanation"><div class="fta-callout-title">Explanation: 工具调用与实验仪器</div>
<p>在物理实验中，仪器读数需要校准、误差条和故障检测。工具调用也是如此：搜索引擎返回的结果可能过时，代码执行器可能因语法错误而失败，计算器可能因表达式错误而报错。Agent 的可靠性不只取决于 LLM 本身，还取决于工具链是否可观测、可校验、可追踪。</p>
</aside>
<aside class="fta-callout fta-example"><div class="fta-callout-title">Example 34</div>
<p><strong>检索相关知识（RAG）</strong></p>
<p>Agent 从知识库中检索 Euler 法和 RK4 法的数学定义：</p>
<ul>
<li>Euler 法：$y_{n+1} = y_n + h f(t_n, y_n)$，一阶方法，局部截断误差 $O(h^2)$；</li>
<li>RK4 法：$y_{n+1} = y_n + \frac{h}{6}(k_1+2k_2+2k_3+k_4)$，四阶方法，局部截断误差 $O(h^5)$。</li>
</ul>
<p><strong>生成并执行代码</strong></p>
<p>Agent 生成 Python 代码，包含：Euler 一步更新函数；RK4 一步更新函数；主循环（时间推进 + 能量计算）；结果保存。</p>
<p>代码通过 Python 工具执行器运行。如果执行出错，Agent 阅读错误信息并修正代码。</p>
</aside>
<h4 id="section-65">观察、校验与修正</h4>
<p>工具执行后，Agent 读取观测 $o_{t+1}$，并将其写回状态 $s_{t+1}$。观察不是被动地“看结果”，而是要检查结果是否满足任务约束：代码是否报错、数值是否稳定、物理量是否守恒、事实是否有来源、输出是否符合格式。若校验失败，Agent 应回到任务分解、行动选择或工具调用阶段进行修正。</p>
<h5 id="section-66">外部校验：让语言模型进入实验闭环</h5>
<p>可靠使用 LLM 的正确方式与物理实验相同——引入独立可观测量的校验。对于不同类型的任务：</p>
<div class="fta-math fta-numbered-math" data-equations="2.41,2.42,2.43,2.44">\[
\begin{aligned}
\text{数学推导} &amp;\to \text{代数检验或数值代入},\\
\text{代码任务} &amp;\to \text{运行测试},\\
\text{事实问题} &amp;\to \text{检索可信来源},\\
\text{物理计算} &amp;\to \text{守恒量检查与量纲分析}.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.41、2.42、2.43、2.44"><span class="fta-equation-number" aria-hidden="true">(2.41)</span><span class="fta-equation-number" aria-hidden="true">(2.42)</span><span class="fta-equation-number" aria-hidden="true">(2.43)</span><span class="fta-equation-number" aria-hidden="true">(2.44)</span></span></div>
<p>这是 Agent 思想的入口：不把一次生成当最终答案，而是让模型生成行动，再用环境反馈校验。</p>
<aside class="fta-callout fta-example"><div class="fta-callout-title">Example 35</div>
<p>在我们的谐振子数值分析中，Agent 生成了 Euler 法和 RK4 法的 Python 代码并运行。完整的校验闭环包括：</p>
<p><strong>校验1——解析解对比：</strong> 谐振子有精确解析解 $x_\mathbf{exact}(t)=A\cos(\omega t+\phi)$。Agent 计算$|x_{\rm num}(t) - x_{\rm exact}(t)|$。Euler 法的最大偏差应随 $\Delta t$ 减小而一阶减小；RK4 应四阶减小。如果 Euler 法的误差随 $t$ 线性增长（$O(\Delta t)$ 全局误差）而 RK4 的误差保持极小（$O(\Delta t^4)$ 全局误差），说明数值方法实现正确。</p>
<p><strong>校验2——能量守恒：</strong> 谐振子系统总能量 $E(t)=\frac{1}{2}v(t)^2+\frac{1}{2}\omega^2 x(t)^2$ 理论上守恒。Agent 自动计算10个周期后 $\max_t|E(t)-E(0)|/E(0)$：</p>
<ul>
<li>Euler 法：能量漂移 $\approx 5\%$（$\Delta t=0.01$ 时）——说明一阶方法的能量不守恒是固有缺陷；</li>
<li>RK4 法：能量漂移 $\approx 0.001\%$——四阶方法几乎完美保持能量守恒。</li>
</ul>
<p><strong>校验3——步长收敛性：</strong> Agent 用不同步长（$\Delta t = 0.1, 0.05, 0.01, 0.005$）重复实验，验证 Euler 法的全局误差与 $\Delta t^1$ 成正比、RK4 与 $\Delta t^4$ 成正比。</p>
<p>如果上述任一校验失败（如 RK4 的能量漂移异常大），Agent 应标记该结论为"[需人工审查：数值结果异常]"——这就是外部校验闭环的价值：代码的成功执行不等于物理结果的正确性。</p>
</aside>
<h4 id="section-67">终止条件与最终输出</h4>
<p>终止条件决定 Agent 何时停止闭环。可靠的 Agent 不应仅凭模型自称“完成了”就结束，而应显式检查任务目标、工具执行、校验结果、错误状态和步数上限。</p>
<p>可靠终止需满足：目标已输出、必要工具已运行、校验已通过、无未处理错误、步数未超上限 $T_{\max}$。</p>
<aside class="fta-callout fta-example"><div class="fta-callout-title">Example 36</div>
<p>谐振子分析 Agent 的实现：</p>
<p><strong>初始化：</strong></p>
<div class="fta-math fta-numbered-math" data-equations="2.45">\[
\begin{aligned}
s_0 = (g=\text{&quot;分析谐振子 Euler、 RK4 能量&quot;},\; h_0=\text{[用户请求]},\; \ell_0=\emptyset,\; b_0=\{ \text{&quot;start&quot;}\}).
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.45"><span class="fta-equation-number" aria-hidden="true">(2.45)</span></span></div>
<p><strong>停止条件：</strong></p>
<div class="fta-math fta-numbered-math" data-equations="2.46">\[
\begin{aligned}
\operatorname{Done}(s_t) = \begin{cases}
1, &amp; \text{Euler 和 RK4 代码均已成功执行 } \land \text{ 能量分析已完成 } \land \text{ 校验已通过},\\
1, &amp; t \ge T_{\max}=20,\\
0, &amp; \text{其他}.
\end{cases}
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.46"><span class="fta-equation-number" aria-hidden="true">(2.46)</span></span></div>
<p>通过显式维护 $b_t$（黑板），Agent 始终知道自己完成了什么、还需要做什么——这是一种"可审计"（auditable）的状态管理方式。</p>
</aside>
<aside class="fta-callout fta-example"><div class="fta-callout-title">Example 37</div>
<p><strong>生成可视化与报告</strong></p>
<p>Agent 生成：</p>
<ul>
<li>相位图 $(x(t), v(t))$——Euler 轨道螺旋外扩（能量增加），RK4 轨道闭合（能量守恒）；</li>
<li>能量相对误差随时间的变化曲线；</li>
<li>收敛阶对数图（$\log(\text{error})$ vs $\log(h)$，斜率 $\approx$ 方法阶数）。</li>
</ul>
<p><strong>最终输出</strong></p>
<p>Agent 输出一份结构化的分析报告，包含：</p>
<ul>
<li>方法概述（Euler 一阶显式 vs RK4 四阶显式）；</li>
<li>数值结果摘要（能量漂移对比表）；</li>
<li>物理解释（Euler 不是辛积分器 $\to$ 能量漂移；RK4 的高阶精度在有限时间内提供了良好的能量守恒近似）；</li>
<li>建议（对长期哈密顿系统模拟，推荐使用辛积分器如 Verlet/leapfrog——这可以在后续扩展中实现）。</li>
</ul>
</aside>
</article>
</div>
