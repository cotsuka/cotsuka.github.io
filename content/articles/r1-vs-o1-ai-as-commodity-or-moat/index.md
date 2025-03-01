---
title: "R1 vs. o1: AI as Commodity or Moat"
date: 2025-01-27
modified: 2025-02-07
description: Is DeepSeek's R1 an existential threat to OpenAI?
tags:
- ai
posse:
  𝕏: https://x.com/CameronOtsuka/status/1884001595282907401
  ActivityPub: https://otsuka.social/@cameron/statuses/01JJN5WVS1ZMZ56SK4T3YQ3J8Z
  Bluesky: https://bsky.app/profile/otsuka.haus/post/3lgradsawkc2v
---

{% image "./us-china-ai-model-enjoyers-dabbing-dude.jpg", "US - China AI model enjoyers Dabbing Dude meme" %}

DeepSeek announced the release of its R1 reasoning model[^1] a day before the US announced it would use its executive power to secure the infrastructure needs for a joint venture between OpenAI (developers of the o1 reasoning model), Microsoft, Oracle, and Softbank, titled "Stargate"[^2].

A few days later, markets have taken this as an existential threat to OpenAI's dominance and energy/compute demand. This is a shot across the bow from DeepSeek and zooming out, represents the economic tug-of-war between China and the US, but I don't think it spells disaster for the US' ambitions -- if US companies can continue pushing the performance frontier.

<figure>
    {% image "./nvda-2025-01-27.png", "NVDA price action on 2025-01-27" %}
    <figcaption>Nvidia was down ~17% by end of day on the news.</figcaption>
</figure>

## The Facts
DeepSeek trained R1 for an estimated $5.6MM on A100 and H800 GPUs (not the latest-and-greatest GPUs available). End-user inference pricing is an order of magnitude cheaper than o1.

<figure>
    {% image "./input-output-pricing.jpg", "Input/Output Pricing for o1-Class Inference Models ($/1M Tokens)" %}
    <figcaption>Source: <a href="https://x.com/RnaudBertrand/status/1881709223152878000/photo/1">@RnaudBertrand</a>.</figcaption>
</figure>

Despite less capital expenditure, R1 has comparable performance to o1 due to several technical innovations. I don't pretend to deeply understand everything on this front, so instead I'll direct you [to this paper](https://github.com/deepseek-ai/DeepSeek-R1/blob/main/DeepSeek_R1.pdf), which breaks down what's happening under the hood. Ultimately, R1 is essentially a drop-in replacement for o1.

<figure>
    {% image "./r1-o1-benchmarks.jpg", "Accuracy / Percentile (%) by Benchmark" %}
    <figcaption>Source: <a href="https://github.com/deepseek-ai/DeepSeek-R1/blob/main/DeepSeek_R1.pdf">DeepSeek-AI</a>.</figcaption>
</figure>

This is incredible for the little guy: run your own model, privately, without the need for massive infrastructure.

<figure>
    {% image "./r1-on-iphone-localghost.gif", "R1 running locally on an iPhone" %}
    <figcaption>A distilled version of R1 running locally on an iPhone. Source: <a href="https://x.com/localghost/status/1882109711732154387">@localghost</a>.</figcaption>
</figure>

## Is OpenAI Cooked?
First, the threshold for publicly available, open-source reasoning models will never be lower than this. HuggingFace is attempting to reproduce R1 fully in the open[^3] which would make it an end-to-end public frontier model. I think this is a win for society.

Second, everyone should be significantly shortening their anticipated AI development timelines. The initial market reaction was a first order reaction (80% less compute! 80% less chip demand!) but I don't see why energy infrastructure and chip manufacturing demand would be negatively impacted. I'd more likely guess this is a [Jevon's paradox](https://en.wikipedia.org/wiki/Jevons_paradox) situation, where the excess capacity is immediately saturated to advance model performance at a now more rapid pace.

It's clear with the amount of investment the US and companies are ploughing into OpenAI, their vision for the future is one where OpenAI has the highest horsepower model and defends its moat simply by having the smartest, fastest, best model. Value capture in this version of the world accrues to the model developers.

China's approach, exemplified by R1, envisions a future with commodity AI models used as building blocks within other applications. Incentivizing open development of models with comparable performance to private frontier models ensures the US *can't* develop an AI moat. China codified this objective in 2017 with the release of their, ["New Generation Artificial Intelligence Development Plan" (translated)](https://digichina.stanford.edu/work/full-translation-chinas-new-generation-artificial-intelligence-development-plan-2017/). Some sections that stood out to me:

> *Open-Source and Open.* Advocate the concept of open-source sharing, and promote the concept of industry, academia, research, and production units each innovating and in principal pursuing joint innovation and sharing. Follow the coordinated development law for economic and national defense construction; promote two-way conversion and application for military and civilian scientific and technological achievements and co-construction and sharing of military and civilian innovation resources; form an all-element, multi-domain, highly efficient new pattern of civil-military integration.[^4]

> **(2) Optimize arrangements to build AI innovation bases**
> Guide existing AI-related national focus laboratories, corporate national focus laboratories, national engineering laboratories, and other such bases, and conduct research focused on an advanced direction of a new generation of AI.[^5]

I don't think it's a stretch to compare OpenAI's business model with that of IBM in the 80s and 90s[^6]. History shows tech advancements trend towards commoditization. We'll see if the US' investments can buck the trend.

[^1]: [🚀 DeepSeek-R1 is here!](https://x.com/deepseek_ai/status/1881318130334814301)
[^2]: [Announcing the Stargate Project](https://openai.com/index/announcing-the-stargate-project/)
[^3]: [Open R1](https://github.com/huggingface/open-r1)
[^4]: [Full Translation: China’s ‘New Generation Artificial Intelligence Development Plan’ (2017)](https://digichina.stanford.edu/work/full-translation-chinas-new-generation-artificial-intelligence-development-plan-2017/#:~:text=Open-Source%20and,a%20global%20scale.)
[^5]: [Full Translation: China’s ‘New Generation Artificial Intelligence Development Plan’ (2017)](https://digichina.stanford.edu/work/full-translation-chinas-new-generation-artificial-intelligence-development-plan-2017/#:~:text=(2)%20optimize%20arrangements%20to%20build%20ai%20innovation%20bases)
[^6]: [History of IBM - 1975–1992: Information revolution, rise of software and PC industries](https://en.wikipedia.org/wiki/History_of_IBM#1975%E2%80%931992:_Information_revolution,_rise_of_software_and_PC_industries)