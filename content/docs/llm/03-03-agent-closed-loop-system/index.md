---
title: "第二层：Agent 作为闭环决策系统"
weight: 3003
chapter: 3
page_number: "3.3"
chapter_slug: "03-llm-and-agent"
is_section: true
root_heading_level: 3
type: docs
math: true
toc: false
---
<div class="fta-document">
<article class="fta-post">
<h3 id="section-52">第二层：Agent 作为闭环决策系统</h3>
<h4 id="section-53">Agent 的状态、目标与行动</h4>
<p>LLM 是强大的，但它只是一个会生成文本的模型。Agent 是更大的系统——它使用 LLM 作为认知核心，但额外包含了状态维护、目标分解、工具执行、环境反馈、错误恢复和安全约束。</p>
<h5 id="section-54">Agent 的抽象定义</h5>
<p>定义第 $t$ 步 Agent 的内部状态为</p>
<div class="fta-math fta-numbered-math" data-equations="2.24">\[
\begin{aligned}
s_t = (c_t, m_t, r_t),
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.24"><span class="fta-equation-number" aria-hidden="true">(2.24)</span></span></div>
<p>其中 $c_t$ 是当前上下文（对话历史、工具返回），$m_t$ 是长期或外部记忆（检索到的文档、已确认的事实），$r_t$ 是任务进度记录（哪些子目标已完成、哪些待做）。</p>
<p>策略给出行动分布（用户目标记为 $g$）：</p>
<div class="fta-math fta-numbered-math" data-equations="2.25">\[
\begin{aligned}
a_t \sim \pi_{\theta}(a_t \mid s_t, g).
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.25"><span class="fta-equation-number" aria-hidden="true">(2.25)</span></span></div>
<p>这里 $a_t$ 可以是一个结构化的行动：可能是"直接输出文本回答"、"调用搜索工具"、"运行 Python 代码"、"读取文件"或"请求人工确认"。</p>
<p>执行行动后，环境或工具返回观测</p>
<div class="fta-math fta-numbered-math" data-equations="2.26">\[
\begin{aligned}
o_{t+1} = E(s_t, a_t)
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.26"><span class="fta-equation-number" aria-hidden="true">(2.26)</span></span></div>
<p>状态更新函数 $U$ 将旧状态、行动和新观测合成为新状态：</p>
<div class="fta-math fta-numbered-math" data-equations="2.27">\[
\begin{aligned}
s_{t+1} = U(s_t, a_t, o_{t+1}).
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.27"><span class="fta-equation-number" aria-hidden="true">(2.27)</span></span></div>
<p>Agent 的闭环可以写为状态机的演化：$s_0 \xrightarrow{a_0,o_1} s_1 \xrightarrow{a_1,o_2} \cdots \xrightarrow{a_{M-1},o_M} s_M \in \mathcal{G}$.其中$\mathcal{G}$ 是目标状态集合（任务完成）， 是完成任务需要的总步数。</p>
<figure class="fta-figure" style="--fta-figure-width: 386px"><img src="/p/from-transformer-to-agent-full/AgentLoop.png" alt="Agent 闭环结构图" loading="lazy" decoding="async"><figcaption>Agent 的闭环：策略产生行动，环境返回观测，状态更新后再次影响策略。这等价于一个带反馈的离散动力系统。</figcaption></figure>
<h4 id="section-55">MDP 与 Bellman 方程</h4>
<p>Agent 的决策过程可以形式化为马尔可夫决策过程（MDP），定义在五元组 $(\mathcal{S}, \mathcal{A}, P, R, \gamma)$ ：</p>
<ul>
<li>$\mathcal{S}$：状态空间（Agent 所有可能的内外部状态）；</li>
<li>$\mathcal{A}$：行动空间（所有可执行的操作）；</li>
<li>$P(s_{t+1}\mid s_t, a_t)$：状态转移概率（环境/工具的响应不确定时）；</li>
<li>$R(s_t, a_t)$：奖励函数（衡量行动对目标的推进程度）；</li>
<li>$\gamma\in[0,1)$：折扣因子（近期奖励比远期奖励重要）。</li>
</ul>
<p>目标是最大化折扣回报 $G_t = \sum_{k=0}^{\infty}\gamma^k R(s_{t+k}, a_{t+k})$。值函数 $V^{\pi}(s) = \mathbb{E}_{\pi}[G_t\mid s_t=s]$ 满足 Bellman 方程：</p>
<div class="fta-math fta-numbered-math" data-equations="2.28">\[
\begin{aligned}
V^{\pi}(s) = \sum_{a}\pi(a\mid s)\sum_{s&#x27;}P(s&#x27;\mid s,a)\left[R(s,a) + \gamma V^{\pi}(s&#x27;)\right].
\label{bellman}
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.28"><span class="fta-equation-number" aria-hidden="true">(2.28)</span></span></div>
<p>最优值函数 $V^\star(s) = \max_{\pi} V^{\pi}(s)$ 满足 Bellman 最优方程：</p>
<div class="fta-math fta-numbered-math" data-equations="2.29">\[
\begin{aligned}
V^\star(s) = \max_{a}\sum_{s&#x27;}P(s&#x27;\mid s,a)\left[R(s,a) + \gamma V^\star(s&#x27;)\right].
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.29"><span class="fta-equation-number" aria-hidden="true">(2.29)</span></span></div>
<aside class="fta-callout fta-explanation"><div class="fta-callout-title">Explanation: Agent 不一定是 RL 训练的</div>
<p>大多数当前 Agent 并非通过显式求解 Bellman 方程来决策——它们使用 LLM 来隐式估计"什么行动在当前状态下最有用"。但 MDP 形式帮助我们理解：Agent 的行动应该考虑未来反馈（通过 $V^\star$ 中的递归期望），而非只优化当前 token 概率。LLM 的上下文窗口和 Chain-of-Thought 推理可以被看作一种隐式的、基于模型的 roll-out 和规划。</p>
</aside>
<h4 id="section-56">Agent 的模块结构</h4>
<p>一个实用 Agent 常包含七个模块：</p>
<ol>
<li><strong>感知模块</strong>：接收用户输入、文件、工具返回$0_{t+1}$；</li>
<li><strong>状态模块</strong>：维护当前任务状态 $s_t,s_{t+1}$；</li>
<li><strong>记忆模块</strong>：保存短期上下文和长期资料（含 RAG 知识库）, $s_t$ 或$U$ 的一部分 ；</li>
<li><strong>规划模块</strong>：把目标 $g$ 分解为子目标序列，$g$到$\pi_\theta$的过程；</li>
<li><strong>策略模块</strong>：选择行动 $a_t$（通常由 LLM + 提示词 + 工具协议实现）；</li>
<li><strong>工具模块</strong>：执行搜索、计算、代码、读写文件、调用 API；</li>
<li><strong>反馈与安全模块</strong>：检查结果、处理错误、限制危险行动。</li>
</ol>
<aside class="fta-callout fta-example"><div class="fta-callout-title">Example 30</div>
<p>在我们的谐振子数值分析任务中，Agent 使用 MDP 框架的形式化如下：</p>
<p><strong>目标 $g$：</strong> 分析一维谐振子运动，比较 Euler 和 RK4 的能量守恒。</p>
<p><strong>初始状态 $s_0$：</strong></p>
<div class="fta-math fta-numbered-math" data-equations="2.30,2.31,2.32">\[
\begin{aligned}
c_0 &amp;= \text{[用户请求: &quot;我想用数值方法分析一维谐振子的运动...&quot;]},\\
m_0 &amp;= \emptyset,\\
r_0 &amp;= \text{&quot;未开始&quot;}.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.30、2.31、2.32"><span class="fta-equation-number" aria-hidden="true">(2.30)</span><span class="fta-equation-number" aria-hidden="true">(2.31)</span><span class="fta-equation-number" aria-hidden="true">(2.32)</span></span></div>
<p><strong>子目标分解（规划模块）：</strong></p>
<div class="fta-math fta-numbered-math" data-equations="2.33">\[
\begin{aligned}
g \to (g_1,\dots,g_6) = (\text{理解物理系统}, \text{实现Euler法h和RK4法}, \text{运行模拟}, \text{分析能量守恒}, \text{生成报告}).
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.33"><span class="fta-equation-number" aria-hidden="true">(2.33)</span></span></div>
<p><strong>闭环过程：</strong></p>
<div class="fta-table-scroll"><table class="fta-table"><tr><th>$t$</th><th>行动 $a_t$</th><th>观测 $o_{t+1}$</th><th>状态更新</th></tr><tr><td>0</td><td>解析用户请求，提取参数</td><td>$\{x_0=1,v_0=0,\omega=1,T=10\text{周期}\}$</td><td>$r_1$: 参数已提取</td></tr><tr><td>1</td><td>生成 Euler 法 Python 代码</td><td>代码片段</td><td>$b_1$: Euler 代码</td></tr><tr><td>2</td><td>执行 Euler 代码</td><td>$\{t,x,v\}$ 数组，能量漂移 5.2%</td><td>$b_2$: Euler 结果已记录</td></tr><tr><td>3</td><td>生成 RK4 法 Python 代码</td><td>代码片段</td><td>$b_3$: RK4 代码</td></tr><tr><td>4</td><td>执行 RK4 代码</td><td>$\{t,x,v\}$ 数组，能量漂移 0.0008%</td><td>$b_4$: RK4 结果已记录</td></tr><tr><td>5</td><td>生成对比分析（含相位图）</td><td>分析文本 + 图表</td><td>$b_5$: 对比完成</td></tr><tr><td>6</td><td>校验：解析解 vs 数值解残差</td><td>残差正常</td><td>Done=1</td></tr></table></div>
<p>在 $t=6$ 时，所有校验通过，Agent 输出最终结论："RK4 方法在 $\Delta t=0.01$ 下模拟10个周期后能量相对漂移仅为 $8\times10^{-6}$，远优于 Euler 法的 $5.2\times10^{-2}$。Euler 法的能量单调递增（系统表现如同被持续注入能量），这是辛积分缺失的典型表现；RK4 虽然不是严格辛方法，但其高阶精度在实际中保持了很好的长期能量稳定性。"</p>
</aside>
<aside class="fta-callout fta-summary"><div class="fta-callout-title">Summary</div>
<p>Agent = 状态 $s_t$ + 策略 $\pi_\theta$ + 工具 $E$ + 状态更新 $U$。LLM 实现策略的大部分，但 Agent 还需要显式的状态管理、目标分解和反馈处理。MDP 和 Bellman 方程为理解 Agent 的序贯决策提供了理论框架。</p>
</aside>
</article>
</div>
