---
title: "实现一个最小 Agent"
weight: 3007
chapter: 3
page_number: "3.7"
chapter_slug: "03-llm-and-agent"
is_section: true
root_heading_level: 3
type: docs
math: true
toc: false
---
<div class="fta-document">
<article class="fta-post">
<h3 id="section-73">实现一个最小 Agent</h3>
<p>一个最小 Agent 不需要复杂框架。只要有状态 $s_t$、策略 $\pi$、工具执行 $E$ 和状态更新 $U$ 四部分，就能形成闭环。</p>
<h4 id="section-74">系统状态设计</h4>
<p>一个简单但完整的状态可以写成</p>
<div class="fta-math fta-numbered-math" data-equations="2.53">\[
\begin{aligned}
s_t = (g,\, h_t,\, \ell_t,\, b_t),
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.53"><span class="fta-equation-number" aria-hidden="true">(2.53)</span></span></div>
<p>$g$ 是目标，$h_t$ 是对话历史，$\ell_t$ 是执行日志，$b_t$ 是当前任务黑板（中间结果、文件路径、错误信息等）。</p>
<p>状态更新函数可拆为三步：</p>
<div class="fta-math fta-numbered-math" data-equations="2.54,2.55,2.56">\[
\begin{aligned}
\ell_{t+1} &amp;= \ell_t \oplus (a_t, o_{t+1}) \quad \text{(追加日志)},\\
f_{t+1} &amp;= \operatorname{Extract}(o_{t+1}) \quad \text{(抽取结构化事实)},\\
b_{t+1} &amp;= \operatorname{Merge}(b_t, f_{t+1}) \quad \text{(合并到黑板)}.
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.54、2.55、2.56"><span class="fta-equation-number" aria-hidden="true">(2.54)</span><span class="fta-equation-number" aria-hidden="true">(2.55)</span><span class="fta-equation-number" aria-hidden="true">(2.56)</span></span></div>
<p>本节侧重最小 Agent 的状态设计与参考架构。</p>
<h4 id="section-75">从零实现的参考架构</h4>
<p>一个可实现的 Agent 架构需要清晰的模块边界和数据流。</p>
<figure class="fta-figure" style="--fta-figure-width: 409px"><img src="/p/from-transformer-to-agent-full/AgentArchitecture.png" alt="Agent 参考架构图" loading="lazy" decoding="async"><figcaption>最小可实现 Agent 架构：每条箭头都应有明确数据结构。箭头上的数据依次为：输入文本、状态摘要、策略提示、结构化行动、工具参数、工具返回、校验结果。</figcaption></figure>
<p>策略模型接收的提示拆为五部分：</p>
<div class="fta-math fta-numbered-math" data-equations="2.57">\[
\begin{aligned}
\text{Prompt}_t = (I, R, S, T, F),
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 2.57"><span class="fta-equation-number" aria-hidden="true">(2.57)</span></span></div>
<p>其中 $I$ 是系统指令（角色定义），$R$ 是可用工具规则（工具描述、参数格式），$S$ 是当前状态摘要（已完成、待做），$T$ 是任务目标，$F$ 是输出格式约束（如 "以 JSON 格式输出行动"）。</p>
<p>每个模块的功能可单独测试：输入标准化独立于 LLM 策略；工具执行独立于状态管理；校验模块独立于规划。这种模块化设计使得 Agent 的调试和增量改进变得可控。</p>
</article>
</div>
