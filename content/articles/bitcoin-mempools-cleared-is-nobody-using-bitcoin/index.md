---
title: "Bitcoin Mempools Cleared: Is Nobody Using Bitcoin?"
date: 2025-02-09
modified: 2025-02-11
description: Bitcoin mempools have cleared before and there's no immediate reason to panic.
tags:
- bitcoin
posse:
  𝕏: https://x.com/CameronOtsuka/status/1889014482145579457
  ActivityPub: https://otsuka.social/@cameron/statuses/01JKRH19PJ7HMABRE4A1F8ZYMV
  Bluesky: https://bsky.app/profile/otsuka.haus/post/3lhtqq2u5ck2h
---

{% callout "info" %}
**TL;DR:** Don't panic.
{% endcallout %}

Bitcoin mempools cleared last week and concern for the health of the network started rolling in. Most of the concerns that we're seeing today have already been voiced during past cycles and there are incentive mechanisms built into the Bitcoin protocol that automatically protect against some of these concerns. If we see long-term low transaction volumes, there could be real concerns for the health of the network, but I don't see any immediate reason to panic.

Here's the chart everyone was worried about, showing the dropoff in feerates:

<figure>
    {% image "./mempool-1yr.svg", "Bitcoin mempool by sats/vByte over the last year" %}
    <figcaption>Bitcoin mempool by sats/vByte over the last year. Data from 2024-02-07 through 2025-02-07. Source: <a href="https://mempool.space/graphs/mempool#1y">mempool.space</a>.</figcaption>
</figure>


## Is this abnormal?
I wouldn't call empty mempools abnormal by any means. Zooming out the mempool chart's date range shows prior periods of low mempool utilization:

<figure>
    {% image "./mempool-all-time.svg", "Bitcoin mempool by sats/vByte since beginning of data" %}
    <figcaption>Bitcoin mempool by sats/vByte since beginning of data. Data from beginning of dataset through 2025-02-07. Source: <a href="https://mempool.space/graphs/mempool#all">mempool.space</a>.</figcaption>
</figure>

If you overlay the Bitcoin/USD price chart with this, you'll notice the highest mempool utilization periods mostly align with runups to and during bull markets. I'd also point out that the most recent period of mempool activity reached higher feerates than prior periods largely due to BRC-20 tokens, Runes, and other NFT/NFT-like transactions.

## What were the concerns?
I selected posts that exemplified common themes from the concern posts I saw bubbling up on my feeds.

### Security Budget
> In case you were confused, this is not a good thing. This is where mindless maxi hodl narratives lead, a network with less censorship resistance.
>
> Demand for blockspace (specifically black market) ultimately secures the #Bitcoin network from censorship. No fees, no security.
> — [@aeonBTC](https://x.com/aeonBTC/status/1885820706702963058)

This is probably the most common concern you'll come across: no transactions means no fees. In the future, the block subsidy will be miniscule and transaction fees must generate enough revenue for miners to contribute hashrate, thereby securing the network.

æon ties this into censorship resistance[^1] but the incentives for a decentralized miner (e.g., solo miner at home) are the same as a centralized miner.[^2] Even today, centralized miners benefit from scale, generally lower costs of energy due to negotiated rate contracts, and earlier access to ASICs which puts them at an advantage to the decentralized miner.

### Sovereign Disuse
> An empty mempool is a sign that sovereign usage of Bitcoin is extremely low.
> — [@lopp](https://x.com/lopp/status/1885808221610291443)

I don't think empty mempools necessarily point to this. I do think there's transaction volume that never appears on-chain because of custodial solutions, but I would also expect much of the day-to-day transaction volume to occur on Lightning given confirmation times and transaction fees.

And would bartering or exchanging Bitcoin for goods be considered even more sovereign? Those are transactions occurring completely off-chain.

### Hoarding
> An empty mempool whispers what few want to hear—Bitcoin isn't circulating, it's being hoarded.
>
> Trades happen off-chain, value sits idle, and few price in sats. Until more goods, services, and wages abandon fiat entirely, the network will remain a vault rather than a thriving economy.
>
> The mempool should be alive, not a monument to stillness.
> — [@BastienSinclair](https://x.com/BastienSinclair/status/1885810844933739006)

I'd say this is the current state of affairs. Bitcoin is mostly used to HODL. The "digital gold" narrative is strong. I would add that during the higher feerate period, the opposite scalability concern popped up: fees would become so high that Bitcoin usage will only be usable by large entities for high economic value transactions.

Similar to the sovereign disuse argument, I expect much of the day-to-day transaction volume is currently, and will be, on Lightning or off-chain. But yes, if more of the economy denominates in Bitcoin, we'll see more mempool usage as they settle on the base layer.

## Why shouldn't I panic?
### Relative Economic Incentives
The Bitcoin network's security budget is determined by the balance between the economic value at risk and the cost of attacking the network.
- In a low Bitcoin economic value environment, the potential payoff for a successful attack would shrink as well, limiting the incentive to attack.
- In a low fee, high Bitcoin economic value environment, then the economic value those fees represent could still be significant, keeping hashrate online and therefore also keeping the cost to attack the network high.

Regardless, attacking the network only makes sense if the attacker doesn't value Bitcoin, since a successful attack would crater Bitcoin's economic value. So the threat model for this theory would be: nation-state attacker(s) or highly organized and well-capitalized griefers[^3] attempt to destroy Bitcoin. Current Bitcoin users would need to be caught unaware by the attack so they couldn't bring their own hashrate online, multiple nation-states would likely collude to seize mining hardware and energy infrastructure so they control enough hashrate, those nation-states spend billions to keep the attack going, and while planning all this the nation-states still decide the cost of killing Bitcoin is worth it.[^4]

### Difficulty Adjustments
The relative economic incentives impacts miners' hashrate decision, which is more simply explained through hashprice.[^5] In a low fee environment, hashprice decreases, mining profitability decreases, eventually total hashrate decreases, but that in turn causes difficulty to decrease. The difficuly decrease counteracts the falling hashrate.

We haven't seen a significant decline in total hashrate, despite hashprice decreasing over the last few years, meaning miners haven't seen profitability decline enough that would force them to decrease their hashrate.

<figure>
    {% image "./hashprice-index-2yr.png", "Bitcoin hashprice over the last 2 years" %}
    <figcaption>Bitcoin hashprice over the last 2 years. Data from 2023-02-04 through 2025-02-08. Source: <a href="https://data.hashrateindex.com/network-data/bitcoin-hashprice-index">Hashrate Index</a>.</figcaption>
</figure>

<figure>
    {% image "./hashrate-2yr.svg", "Bitcoin hashrate over the last 2 years" %}
    <figcaption>Bitcoin hashrate over the last 2 years. Data from 2023-02-08 through 2025-02-07. Source: <a href="https://mempool.space/graphs/mining/hashrate-difficulty#2y">mempool.space</a>.</figcaption>
</figure>

If energy prices continue to rise and hashprice doesn't increase, Bitcoin miners will eventuallly decrease their hashrate. We've started to see this with news of some miners using their energy for AI training/inference instead. I'd argue this is a good thing for the Bitcoin network, as oversaturating hashrate means we overallocated capital to mining.

### Lightning (and Other Layer 2s)
As Lightning and other layer 2s have matured, we've seen increasing numbers of services adopt them to lower fees and increase transaction speed. Multiple exchanges have enabled Lightning withdrawals[^6], [BTCPayServer](https://btcpayserver.org) includes Lightning payment options, etc. As Bitcoin continues to expand its adoption, I expect the transactions appearing on-chain will look more like larger, net settlement transactions.

This seems generally positive to me. Lightning transactions are faster, cheaper, more private[^7], and are still anchored to Bitcoin's base layer. For the self-sovereign Bitcoiner, running a self-hosted Lightning node is more work and there are certainly challenges to doing so which need to be improved upon. But I don't see why we necessarily want to force people back on-chain for everything unless Lightning fails as a project.

### HODLing is Using
When someone expects Bitcoin's economic value to appreciate, hoarding is a rational decision. Bitcoin's 21MM supply cap is a key feature for many users preserving wealth in an asset free from inflationay pressure. In this view, hoarding is a feature, not a bug.

It's not up to me to tell others how they want to use Bitcoin. I'd like to see more Bitcoin-denominated transactions in the world, but we can't force those who don't want to spend their Bitcoin to do so.

## What should I do then?
Take advantage of the lower fees and make on-chain transactions. Some ideas:
- Transact with Bitcoin!
- Consolidate your UTXOs. [I wrote an article on considerations for minimum UTXO size]({{ "../minimum-utxo-value/index.md" | inputPathToUrl }}).
- Open/close Lightning channels. The initial funding and closing mechanisms require on-chain transactions.
- Create new multisig vaults.

[^1]: [https://x.com/aeonBTC/status/1885943894581583996](https://x.com/aeonBTC/status/1885943894581583996)
[^2]: And this should really be a concern with centralized pools as well, since it really turns into a regulatory concern argument. The jurisdiction of both the miner and the pool will impact decision making on whether hashrate will be pointed at a transaction filtering pool.
[^3]: Some kind of cyberpunk megacorporation that somehow benefits from destroying Bitcoin??? A bitcoin-focused IOI from <cite>Ready Player One</cite>? {% image "./innovative-online-industries.jpg", "Innovative Online Industries logo." %}
[^4]: Braiins put together [a good analysis of this](https://braiins.com/blog/how-much-would-it-cost-to-51-attack-bitcoin) in 2021.
[^5]: [https://docs.luxor.tech/hashrateindex/hashprice](https://docs.luxor.tech/hashrateindex/hashprice)
[^6]: Some that come to mind are [Strike](https://strike.me), [River](https://river.com), and [Kraken](https://www.kraken.com), among others.
[^7]: [https://www.voltage.cloud/blog/lightning-network-privacy-explainer#:~:text=Privacy%20from%20different-,perspectives,-The%20lightning%20network](https://www.voltage.cloud/blog/lightning-network-privacy-explainer#:~:text=Privacy%20from%20different-,perspectives,-The%20lightning%20network)
