---
title: "Transformer、ALM、LLM和Agent"
weight: 1000
chapter: 1
page_number: "1"
chapter_slug: "01-transformer-alm-llm-agent"
is_section: false
root_heading_level: 2
type: docs
math: true
toc: false
aliases:
  - "/p/from-transformer-to-agent/"
---
<p><a href="https://albert-5.gitbook.io/albert-docs/" target="_blank" rel="noopener">在 GitBook 中打开本专题</a></p>
<div class="fta-document">
<article class="fta-post">
<h2 id="section-1">Transformer、ALM、LLM和Agent</h2>
<p>可以把这几个概念按“从底层到应用层”理解：</p>
<div class="fta-math fta-numbered-math" data-equations="0.1">\[
\begin{aligned}
\text{Transformer}
\to
\text{ALM}
\to
\text{LLM}
\to
\text{Agent}
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 0.1"><span class="fta-equation-number" aria-hidden="true">(0.1)</span></span></div>
<p>但它们不是完全同一层级的东西。</p>
<ul>
<li>Transformer：一种神经网络架构</li>
<p><strong>Transformer 是模型的“骨架”或“发动机结构”。</strong></p>
<p>它最核心的机制是<strong>注意力机制 self-attention</strong>，可以让模型在处理一个词时，同时参考上下文里的其他词。</p>
<p>比如句子：<code>苹果发布了新手机，它很贵</code></p>
<p>模型需要知道“它”指的是“新手机”，而不是“苹果”。Transformer 的注意力机制就擅长做这种上下文关联。所以：</p>
<blockquote>
<p><strong>Transformer 不是专门指语言模型，而是一种通用模型架构。</strong></p>
</blockquote>
<p>它可以用于文本、图像、语音、蛋白质结构等任务。很多 LLM 是基于 Transformer 的，但 Transformer 本身不等于 LLM。</p>
<li>ALM：一种生成方式</li>
<p><strong>自回归模型描述的是“怎么生成内容”</strong>：根据前面已经有的内容，预测下一个 token.比如：<code>&quot;我 今天 想 吃&quot;</code>$\underline{\hspace{2em}}$,模型预测下一个 token 可能是“火锅”。然后句子变成：<code>&quot;我 今天 想 吃 火锅 &quot;</code>$\underline{\hspace{2em}}$. 再继续预测下一个 token。</p>
<p>所以自回归模型的生成过程是一步一步往后写：</p>
<div class="fta-math fta-numbered-math" data-equations="0.2">\[
\begin{aligned}
P(x_1,x_2,\ldots,x_n)
&amp;=
P(x_1)P(x_2\mid x_1)P(x_3\mid x_1,x_2)\cdots
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 0.2"><span class="fta-equation-number" aria-hidden="true">(0.2)</span></span></div>
<p>在 LLM 里，很多模型都是自回归的，比如 GPT 系列。</p>
<blockquote>
<p><strong>自回归不是架构，而是一种建模 / 生成范式。</strong></p>
</blockquote>
<p>Transformer 可以被训练成自回归模型，也可以被训练成别的形式，比如 BERT 掩码语言模型。</p>
<li>LLM：“大规模训练出来的语言模型”。</li>
<p>它通常具备几个特点：参数量大、训练数据量大、能理解和生成自然语言、可以做问答、写作、翻译、总结、代码、推理等任务。很多现代 LLM 的内部结构是：</p>
<blockquote>
<p><strong>基于 Transformer 架构的自回归语言模型。</strong></p>
</blockquote>
<p>例如 GPT 类模型大致可以理解为：</p>
<div class="fta-math fta-numbered-math" data-equations="0.3">\[
\begin{aligned}
\mathrm{GPT}
&amp;=
\text{Transformer Decoder}
+
\text{自回归训练方式}
+
\text{大规模语料训练}
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 0.3"><span class="fta-equation-number" aria-hidden="true">(0.3)</span></span></div>
<p>所以 LLM 和前两个概念的关系是：</p>
<blockquote>
<p>Transformer 提供结构，自回归提供生成方式，大规模训练之后形成 LLM。</p>
</blockquote>
<li>Agent：会使用 LLM 自主完成任务的系统</li>
<li>它通常以 LLM 为核心，但不止有 LLM。一个 Agent 可能包含：</li>
<div class="fta-math fta-numbered-math" data-equations="0.4">\[
\begin{aligned}
\text{Agent}
&amp;=
\text{LLM}
+
\text{工具调用}
+
\text{记忆}
+
\text{规划}
+
\text{执行循环}
\end{aligned}
\]<span class="fta-equation-numbers" aria-label="公式 0.4"><span class="fta-equation-number" aria-hidden="true">(0.4)</span></span></div>
<p>比如你让一个 Agent：</p>
<blockquote>
<p>帮我规划一次去东京的旅行，查机票、订酒店、做预算。</p>
</blockquote>
<p>普通 LLM 可能只是给你一段建议。 Agent 则可能会：</p>
<div class="fta-table-scroll"><table class="fta-table"><tr><th>1. 理解目标</th><th>2. 拆分任务</th><th>3. 调用搜索工具</th></tr><tr><td>4. 比较航班和酒店</td><td>5. 生成计划</td><td>6. 根据反馈继续修改</td></tr><tr><td>7. 必要时执行预订动作</td><td></td><td></td></tr></table></div>
<blockquote>
<p><strong>LLM 是 Agent 的“大脑”，但 Agent 是围绕这个大脑搭建出来的行动系统。</strong></p>
</blockquote>
</ul>
<aside class="fta-callout fta-example"><div class="fta-callout-title">Example 1</div>
<p>可以把它们类比成一辆自动驾驶汽车：</p>
<div class="fta-table-scroll"><table class="fta-table"><tr><th><strong>概念</strong></th><th><strong>类比</strong></th><th><strong>作用</strong></th></tr><tr><td>Transformer</td><td>发动机/神经系统结构</td><td>提供强大的信息处理能力</td></tr><tr><td>ALM</td><td>驾驶时一步步决策</td><td>根据前面状态预测下一步</td></tr><tr><td>LLM</td><td>训练好的司机大脑</td><td>能理解语言、推理、生成答案</td></tr><tr><td>Agent</td><td>自动驾驶系统</td><td>会规划路线、调用地图、执行操作</td></tr></table></div>
</aside>
</article>
</div>
