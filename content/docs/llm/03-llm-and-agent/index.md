---
title: "LLM与Agent：从概率模型到闭环智能系统"
weight: 3000
chapter: 3
page_number: "3"
chapter_slug: "03-llm-and-agent"
is_section: false
root_heading_level: 2
type: docs
math: true
toc: false
---
<div class="fta-document">
<article class="fta-post">
<h2 id="section-38">LLM与Agent：从概率模型到闭环智能系统</h2>
<aside class="fta-callout fta-summary"><div class="fta-callout-title">Summary</div>
<p>本章的核心思想是：<strong>LLM 是一个从数据中学到的条件概率模型；Agent 是把这个概率模型接入外部世界后的闭环控制系统。</strong> 两者结合，模型才能从"只会续写文本"变成"能感知、规划、执行、校验"的智能系统。</p>
<p>本章的目标不是介绍软件工具，而是回答以下更深的问题：</p>
<ol>
<li>LLM 的训练目标到底是什么？预训练、指令微调、RLHF 各自改变了模型的什么性质？</li>
<li>LLM 如何从概率分布中"生成"文本？不同采样策略（温度、Top-k、Top-p）背后的统计物理直觉是什么？</li>
<li>LLM 为什么会"幻觉"？从概率和信息论的角度如何理解并缓解？</li>
<li>Agent 的数学定义是什么？它与 MDP、Bellman 方程、闭环控制系统的关系是什么？</li>
<li>工具调用、RAG、安全约束如何让 Agent 变得可靠？</li>
</ol>
<p>本章假设读者已通过第一章掌握了 Transformer 和自注意力的基本结构。这里不再重复 Q/K/V、多头注意力、FFN、残差连接等细节，仅在需要时引用第一章的结论。</p>
</aside>
<aside class="fta-callout fta-example"><div class="fta-callout-title">Example 25</div>
<p>我们以<strong>一维谐振子的数值分析</strong>为统一例子。具体来说，用户向 Agent 提出以下请求：</p>
<blockquote>
<p>"我想用数值方法分析一维谐振子的运动，并比较 Euler 法和 RK4 法的能量守恒表现。初始条件 $x_0=1$, $v_0=0$, $\omega=1$，模拟10个周期。帮我实现代码并分析结果。"</p>
</blockquote>
<p>这个例子的精妙之处在于：它天然包含了物理建模（谐振子方程）、数值方法（Euler vs RK4）、代码生成与执行、守恒量校验（能量 $E=\frac{1}{2}v^2+\frac{1}{2}\omega^2x^2$ 的漂移）、可视化比较——恰好覆盖了 LLM Agent 从概率建模到工具闭环的所有核心概念。</p>
</aside>
</article>
</div>
