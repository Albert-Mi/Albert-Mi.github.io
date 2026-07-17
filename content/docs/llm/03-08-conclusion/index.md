---
title: "结论：概率层、推理层、控制层"
weight: 3008
chapter: 3
page_number: "3.8"
chapter_slug: "03-llm-and-agent"
is_section: true
root_heading_level: 3
type: docs
math: true
toc: false
---
<div class="fta-document">
<article class="fta-post">
<h3 id="section-76">结论：概率层、推理层、控制层</h3>
<p>如果把整件事压缩成一个统一的框架：</p>
<ol>
<li><strong>概率层（LLM 基础）：</strong> 语言模型 = 自回归条件概率分解 + 最大似然训练 + softmax 输出。这是"理解"和"生成"的数学基础。</li>
<li><strong>训练与推理层：</strong> 预训练 $\to$ 指令微调 $\to$ RLHF 三个阶段分别塑造模型的知识分布、行为格式和价值偏好。推理通过自回归采样（温度/Top-k/Top-p）从概率分布中生成文本。</li>
<li><strong>控制层（Agent 闭环）：</strong> Agent = 状态 $s_t$ + 策略 $\pi_\theta$ + 工具 $E$ + 状态更新 $U$。通过规划（任务分解、ReAct）、工具调用、RAG 检索和安全校验，形成"感知 $\to$ 行动 $\to$ 观测 $\to$ 修正"的闭环。</li>
</ol>
<aside class="fta-callout fta-summary"><div class="fta-callout-title">Summary</div>
<p>一句话总结：<strong>LLM 学会了概率建模，Agent 让它学会与外部世界互动。</strong> 前者提供"智能"，后者提供"闭环"——两者的结合才构成了能够感知、规划、执行和校验的智能系统。</p>
</aside>
<aside class="fta-callout fta-example"><div class="fta-callout-title">Example 41</div>
<p>回到我们的谐振子数值分析例子，全章总结如下：</p>
<p><strong>问题：</strong> 用户想用数值方法分析一维谐振子，比较 Euler 和 RK4 的能量守恒。</p>
<p><strong>概率层：</strong> LLM 基于预训练学到的物理知识和 Python 语法，为 "实现 Euler 法积分" 等指令中的每个 token 分配合理的条件概率。</p>
<p><strong>训练层：</strong> 模型经历了预训练（学习物理和编程知识）、指令微调（学会从"帮我实现..." 映射到代码块格式）、RLHF（学会在代码中包含文档字符串、能量校验和错误处理）。</p>
<p><strong>控制层：</strong> Agent 将模糊请求分解为参数提取 $\to$ 代码生成 $\to$ 执行 $\to$ 校验 $\to$ 报告 的子任务序列。每一步都有明确的输入、输出和校验标准。能量守恒检验充当了"可观测事实"——如果数值结果违背物理定律，Agent 会自我修正。</p>
<p><strong>本质：</strong> Agent 不是一个"更聪明的 LLM"，而是一个让 LLM 嵌入闭环控制系统的架构。LLM 提供认知能力，闭环提供可靠性保障——就像物理实验中，理论计算（LLM）需要通过实验观测（工具返回）和守恒律检查（校验模块）来验证一样。</p>
</aside>
</article>
</div>
