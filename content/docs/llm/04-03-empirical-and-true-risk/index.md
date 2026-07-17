---
title: "经验风险与真实风险"
weight: 4003
chapter: 4
page_number: "4.3"
chapter_slug: "04-mathematical-appendix"
is_section: true
root_heading_level: 3
type: docs
math: true
toc: false
---
<div class="fta-document">
<article class="fta-post">
<h3 id="section-80">经验风险与真实风险</h3>
<p>真实风险 $\mathcal{R}(\theta) = \mathbb{E}_{x\sim P_{\rm data}}[\ell(x;\theta)]$，经验风险 $\widehat{\mathcal{R}}_N(\theta) = \frac{1}{N}\sum_{i=1}^{N}\ell(x^{(i)};\theta)$。对固定 $\theta$，大数定律保证 $\widehat{\mathcal{R}}_N(\theta)\to\mathcal{R}(\theta)$（$N\to\infty$）。但训练会在大量 $\theta$ 中选择最优者，因此还需泛化理论、正则化和验证集评估。</p>
</article>
</div>
