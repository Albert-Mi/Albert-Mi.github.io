---
title: "符号表"
weight: 5000
chapter: 5
page_number: "5"
chapter_slug: "05-notation"
is_section: false
root_heading_level: 2
type: docs
math: true
toc: false
---
<div class="fta-document">
<article class="fta-post">
<h2 id="section-83">符号表</h2>
<figure class="fta-table-figure"><figcaption>符号说明</figcaption><div class="fta-table-scroll"><table class="fta-table"><tr><th>序号</th><th>符号</th><th>含义</th></tr><tr><td>1</td><td>$x_{1:T}$</td><td>长度为 $T$ 的 token 序列</td></tr><tr><td>2</td><td>$\mathcal{V}$</td><td>词表（vocabulary）</td></tr><tr><td>3</td><td>$V = |\mathcal{V}|$</td><td>词表大小</td></tr><tr><td>4</td><td>$\theta$</td><td>模型所有可训练参数的集合</td></tr><tr><td>5</td><td>$P_\theta(x_t\mid x_{&lt;t})$</td><td>条件概率：给定前文预测第 $t$ 个 token</td></tr><tr><td>6</td><td>$\mathcal{L}_{\rm NLL}$</td><td>负对数似然损失</td></tr><tr><td>7</td><td>$D_{KL}(P\Vert Q)$</td><td>KL 散度</td></tr><tr><td>8</td><td>$\tau$</td><td>采样温度</td></tr><tr><td>9</td><td>$s_t$</td><td>Agent 第 $t$ 步的内部状态</td></tr><tr><td>10</td><td>$g$</td><td>用户目标</td></tr><tr><td>11</td><td>$a_t$</td><td>第 $t$ 步行动</td></tr><tr><td>12</td><td>$o_t$</td><td>第 $t$ 步观测</td></tr><tr><td>13</td><td>$\pi_\theta$</td><td>行动策略</td></tr><tr><td>14</td><td>$E$</td><td>环境/工具响应函数</td></tr><tr><td>15</td><td>$\mathcal{T}_r$</td><td>第 $r$ 个工具</td></tr><tr><td>16</td><td>$\phi$</td><td>嵌入模型（RAG 中用于向量化文本）</td></tr><tr><td>17</td><td>$r_\phi$</td><td>奖励模型（RLHF 中用于评分）</td></tr></table></div></figure>
</article>
</div>
