---
title: "安全、对齐与可靠性"
weight: 3006
chapter: 3
page_number: "3.6"
chapter_slug: "03-llm-and-agent"
is_section: true
root_heading_level: 3
type: docs
math: true
toc: false
---
<div class="fta-document">
<article class="fta-post">
<h3 id="section-69">安全、对齐与可靠性</h3>
<p>Agent 的风险高于普通聊天模型，因为它可能执行工具、修改文件或影响真实系统。</p>
<h4 id="section-70">为什么Agent需要安全层</h4>
<p>LLM 输出文本时，错误主要表现为错误答案；Agent 执行行动时，错误可能变成删除文件、发送邮件、运行危险命令或泄露敏感信息。因此需要约束行动集合：</p>
<div class="fta-math fta-numbered-math" data-equations="2.49">\[
\begin{aligned}
\mathcal{A}_{\rm allowed}(s_t) \subseteq \mathcal{A}.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.49"><span class="fta-equation-number" aria-hidden="true">(2.49)</span></span></div>
<p>策略生成的行动 $a_t$ 必须通过安全过滤器 $\operatorname{Safe}(a_t, s_t) = 1$ 才能执行。</p>
<h4 id="section-71">目标错配与评估指标</h4>
<p>如果用户目标 $g$ 表达不完整，Agent 可能优化错误目标。设真实目标为 $g^\star$，模型理解的目标为 $\hat g$。当 $\hat g\neq g^\star$ 时，即使行动序列对 $\hat g$ 最优，也可能对用户有害。</p>
<p>Agent 评估不能只看最终回答是否流畅。关键指标包括：</p>
<div class="fta-math fta-numbered-math" data-equations="2.50">\[
\begin{aligned}
\text{成功率} &amp;= \frac{\text{完成任务数}}{\text{总任务数}},\quad
\text{工具错误率} = \frac{\text{失败工具调用数}}{\text{总工具调用数}},\quad
\text{校验通过率} = \frac{\text{通过外部检查的输出数}}{\text{输出总数}}.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.50"><span class="fta-equation-number" aria-hidden="true">(2.50)</span></span></div>
<p>对物理任务还应关注：单位一致性、量纲检查、数值误差范围、引用准确性和假设清晰度。</p>
<aside class="fta-callout fta-example"><div class="fta-callout-title">Example 39</div>
<p>在我们的谐振子例子中，安全考虑包括：</p>
<p><strong>代码执行安全：</strong></p>
<ol>
<li>Agent 在执行任何 Python 代码前，应先在沙箱环境中测试；</li>
<li>代码中不能包含 <code>import os</code>、<code>import subprocess</code> 等系统调用模块——工具执行器应自动拒绝包含这些导入的代码；</li>
<li>设置执行超时（如 30 秒），防止无限循环。</li>
</ol>
<p><strong>物理可靠性校验：</strong></p>
<ol>
<li>检查能量漂移是否在合理范围内（RK4 在 $\Delta t=0.01$ 下 10 周期能量漂移 $&gt;1\%$ 即有 bug）；</li>
<li>检查步长是否满足数值稳定性条件（$\Delta t$ 小于系统的最短时间尺度）；</li>
<li>检查相位图中轨道是否闭合（不闭合说明积分不准确）；</li>
<li>对每一个数值结论（如"RK4 是四阶方法"）附上收敛阶测试作为证据。</li>
</ol>
<p><strong>目标错配风险：</strong> 用户的目标 $g^\star$ 是"理解 Euler 和 RK4 的能量守恒差异"，但如果 Agent 的隐式目标是"生成最长的分析报告"（$\hat g$），它可能写出大量关于数值方法历史的无关内容而忽略了核心的数值比较——表面上"内容丰富"，实则未触及核心问题。缓解措施是将任务分解为明确、可评估的子目标，并在每一步检查子目标是否确实完成。</p>
</aside>
<h4 id="section-72">准确性评估（Precision / Recall / F1）</h4>
<p>对于开放式问题，模型的回答通常不是简单的“对”或“错”，而是包含多个可以逐条判断的事实点。因此，可以先把标准答案拆成若干个<strong>原子事实</strong>，再把模型回答逐条比对。设：</p>
<ul>
<li><strong>正确的事实点数量</strong>：模型回答说对了，且对应标准答案关键内容的事实点数量；</li>
<li><strong>错误的事实点数量</strong>：模型回答中说错了、没有证据支持，或者额外编造出来的事实点数量；</li>
<li><strong>被遗漏的事实点数量</strong>：标准答案中应该出现，但模型没有覆盖到的关键事实点数量。</li>
</ul>
<p>则定义：</p>
<div class="fta-math">\[
\begin{aligned}
\text{Precision} &amp;= \frac{\text{正确的事实点数量}}{\text{正确的事实点数量}+\text{错误的事实点数量}}, \\
\text{Recall} &amp;= \frac{\text{正确的事实点数量}}{\text{正确的事实点数量}+\text{被遗漏的事实点数量}}, \\
F_1 &amp;= \frac{2 \cdot \text{Precision} \cdot \text{Recall}}{\text{Precision}+\text{Recall}}.
\end{aligned}
\]</div>
<p>其中，Precision 衡量“模型说出来的内容有多少是对的”，Recall 衡量“标准答案中的关键内容模型覆盖了多少”，$F_1$ 则是二者的综合平衡。</p>
<aside class="fta-callout fta-example"><div class="fta-callout-title">Example 40</div>
<p>可以把标准答案拆成如下 8 个原子事实：</p>
<ol>
<li>任务对象是一维谐振子；</li>
<li>目标是比较 Euler 法和 RK4 法；</li>
<li>初始条件为 $x_0=1, v_0=0, \omega=1$；</li>
<li>模拟时间为 10 个周期；</li>
<li>Agent 需要生成并执行数值模拟代码；</li>
<li>需要计算谐振子能量$E(t)=\frac{1}{2}v(t)^2+\frac{1}{2}\omega^2x(t)^2$;</li>
<li>需要比较能量相对漂移$\Delta E_{\mathrm{rel}}=\max_t \frac{|E(t)-E_0|}{E_0}$;</li>
<li>结论：Euler 法能量漂移明显，而 RK4 法能量漂移很小，因此 RK4 的长期数值稳定性更好。</li>
</ol>
<p>假设模型 A 的回答是：</p>
<blockquote>
<p>这个 Agent 会先识别任务是一维谐振子问题，提取参数 $x_0=1, v_0=0, \omega=1$， 并设置模拟 10 个周期。然后它分别实现 Euler 法和 RK4 法，运行代码得到 $x(t)$ 和 $v(t)$。 接着计算能量$E(t)=\frac{1}{2}v(t)^2+\frac{1}{2}\omega^2x(t)^2$ 以及相对能量漂移。通常 Euler 法会出现明显能量漂移，而 RK4 法的能量漂移很小， 所以 RK4 在这个任务中更可靠。</p>
</blockquote>
<p>模型 A 命中了 8 个标准事实，没有明显错误，也没有遗漏关键点。因此：</p>
<div class="fta-math fta-numbered-math" data-equations="2.51">\[
\begin{aligned}
\begin{aligned}
\text{模型 A 的正确的事实点数量} &amp;= 8, \\
\text{模型 A 的错误的事实点数量} &amp;= 0, \\
\text{模型 A 的被遗漏的事实点数量} &amp;= 0.
\end{aligned}
\to
\left\{\begin{aligned}
\text{Precision}_A &amp;= \frac{8}{8+0} = 1.00, \\
\text{Recall}_A &amp;= \frac{8}{8+0} = 1.00, \\
F_{1,A} &amp;= \frac{2 \times 1.00 \times 1.00}{1.00+1.00} = 1.00.
\end{aligned}\right.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.51"><span class="fta-equation-number" aria-hidden="true">(2.51)</span></span></div>
<p>再假设模型 B 的回答是：</p>
<blockquote>
<p>这个 Agent 会用神经网络训练一个谐振子模型，然后只需要看最后的位置误差。 Euler 法通常比 RK4 更稳定，因为 Euler 法更简单。这个任务不需要检查能量守恒， 只要代码能运行就说明结果正确。</p>
</blockquote>
<p>模型 B 中有一些问题：</p>
<ul>
<li>“用神经网络训练一个谐振子模型”不是本文这个例子的核心任务；</li>
<li>只看最后的位置误差，遗漏了能量守恒校验；</li>
<li>“Euler 法通常比 RK4 更稳定”是错误判断；</li>
<li>“代码能运行就说明结果正确”也是错误的，因为本文强调需要外部校验；</li>
<li>它没有明确给出 $x_0=1, v_0=0, \omega=1$；</li>
<li>它没有说明模拟 10 个周期；</li>
<li>它没有写出能量公式；</li>
<li>它没有比较能量相对漂移。</li>
</ul>
<p>模型 B 只命中了“任务与谐振子有关”这一点，其余关键点要么遗漏，要么说错。因此：</p>
<div class="fta-math fta-numbered-math" data-equations="2.52">\[
\begin{aligned}
\begin{aligned}
\text{模型 B 的正确的事实点数量} &amp;= 1, \\
\text{模型 B 的错误的事实点数量} &amp;= 4, \\
\text{模型 B 的被遗漏的事实点数量} &amp;= 7.
\end{aligned}
\to
\left\{\begin{aligned}
\text{Precision}_B &amp;= \frac{1}{1+4} = 0.20, \\
\text{Recall}_B &amp;= \frac{1}{1+7} = 0.125, \\
F_{1,B} &amp;= \frac{2 \times 0.20 \times 0.125}{0.20+0.125} \approx 0.154.
\end{aligned}\right.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.52"><span class="fta-equation-number" aria-hidden="true">(2.52)</span></span></div>
<p>因此，在这个谐振子 Agent 任务上，模型 A 明显比模型 B 更准确。</p>
<p>这个例子说明：判断一个回答是否准确，不能只看它是否“说得像样”，而要看它是否正确覆盖了任务目标、物理模型、数值方法、参数设置、能量公式、误差指标和最终结论。</p>
</aside>
</article>
</div>
