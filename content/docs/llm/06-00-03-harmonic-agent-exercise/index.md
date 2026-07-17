---
title: "作业二：实现谐振子数值分析的 Agent"
weight: 6003
chapter: 6
page_number: "6.0.3"
chapter_slug: "06-learning-path-and-exercises"
is_section: true
root_heading_level: 4
type: docs
math: true
toc: false
---
<div class="fta-document">
<article class="fta-post">
<h4 id="section-87">作业二：实现谐振子数值分析的 Agent</h4>
<p>基于本章的谐振子例子，完成一个可运行的 Agent 原型：</p>
<ol>
<li>设计状态 $s_t$ 的具体数据结构（黑板 $b_t$ 包含哪些字段）；</li>
<li>定义行动集合 $\mathcal{A}=\{\text{parse\_params}, \text{write\_code}, \text{run\_simulation}, \text{compute\_energy\_error}, \text{convergence\_test}, \text{generate\_report}\}$ 中每个行动的输入输出格式；</li>
<li>实现至少两个校验函数：能量守恒校验（$|\Delta E_{\rm rel}|$ 不超过阈值）和收敛阶校验（对数图中斜率是否接近理论值）；</li>
<li>写出 $\operatorname{Done}$ 的完整判断逻辑；</li>
<li>添加至少一个安全约束（如代码执行超时 $30$ 秒、禁止系统调用）。</li>
</ol>
</article>
</div>
