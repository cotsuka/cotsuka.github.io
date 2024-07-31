---
title: Minimum UTXO Value
date: 2023-08-04
modified: 2024-01-26
description: A look at what Bitcoin dust is, historical fee rates, how fees are calculated, and a decision on a minimum UTXO value to stay above the dust threshold.
tags:
- bitcoin
---

Due to recent high fee rate periods, many were advocating for consolidating low-value UTXOs to ensure they wouldn't become dust. I was curious whether I had UTXOs that were in danger of becoming dust.

While there is a [technical definition](https://bitcoin.stackexchange.com/a/41082) of dust built into Bitcoin Core's code, I am more broadly referring to the colloquial definition of dust: UTXOs with a value less than the transaction fees required to spend them, which have become uneconomical to move.

Because fee rates are the primary variable determining the dust threshold, whether a UTXO is considered dust can change over time. I took a look at historical fee rates, how fees are calculated, and included qualitative projections of future block space demand to determine a UTXO value that will stay above the dust threshold for myself.

> **TL;DR;**
>
> Taproot UTXO, 65k sats

### Historical Fee Rates
The highest fee periods in Bitcoin history have been 2018, 2021, and 2023:

<figure>
    {% image "./minimum-utxo-value_mempool_vbytes_history.svg", "Historical graph of Bitcoin mempool by vBytes" %}
    <figcaption>Source: <cite><a href="https://mempool.space/graphs/mempool#all">mempool.space</a></cite></figcaption>
</figure>

I've selected 4 blocks to deep dive, based on their proximity to mempool peaks in those three years, as well as a more "normal" current block:
- 504000: January 12, 2018
- 680000: April 21, 2021
- 782400: March 24, 2023
- 801171: July 31, 2023

<figure>
    {% image "./minimum-utxo-value_box-whisker-overall.svg", "Box and whisker plot of fee rates across blocks" %}
    <figcaption>Outliers removed</figcaption>
</figure>

| **Fee Rate (sats/vB)** | **504000** | **680000** | **782400** | **801171** |
|:----------------------:|:----------:|:----------:|:----------:|:----------:|
|         Minimum        |     11     |     19     |      5     |      5     |
|         Median         |     119    |     269    |     27     |     12     |
|          Mode          |     118    |     269    |     27     |     12     |
|         Maximum        |    1099    |    3578    |     301    |    1280    |

The first visible difference based on the box and whisker plot is the noticeable decrease in fee rate variance, likely attributable to better fee estimations. Second, is the 86% decline in median fee rate with an average 194 sats/vB between blocks 504000 and 680000 vs. 27 sats/vB in block 782400.

> **Note**
>
> I'm taking a naïve view of transactions, so transactions pushed through using CPFP aren't coalesced into a single transaction with a blended, "effective" fee rate. In theory, this should reduce fee rate spread, but will be relatively centered around the median.

I don't expect to see major differences in fee rates by script type, but since I have the data available here's what that looks like (it's as expected):

<figure>
    {% image "./minimum-utxo-value_box-whisker-fee-rate-script-type.svg", "Box and whiskper plot of fee rates by script type" %}
    <figcaption>Fee Rate axis capped at 50 sats/vB to better show the differences between script types.</figcaption>
</figure>

Transactions are shifting towards the newer P2WPKH, P2WSH, and P2TR script types:

| **Transactions (%)** | **504000** | **680000** | **782400** | **801171** |
|:--------------------:|:----------:|:----------:|:----------:|:----------:|
|         P2PKH        |     97%    |     51%    |     22%    |     32%    |
|         P2SH         |     3%     |     41%    |     28%    |     26%    |
|        P2WPKH        |     0%     |     7%     |     38%    |     38%    |
|         P2WSH        |     0%     |     0%     |     1%     |     1%     |
|         P2TR         |     0%     |     0%     |     12%    |     3%     |

Where the script types do differ is in the total size of the transaction and therefore, the total fees paid.

<figure>
    {% image "./minimum-utxo-value_box-whisker-fees-script-type.svg", "Box and whisker plot of total fees by script type" %}
    <figcaption>Fee Rate axis capped at 300000 sats/vB to better show the differences between script types.</figcaption>
</figure>

P2WSH and P2TR transactions appear to be paying higher median fees than other script types.

<figure>
    {% image "./minimum-utxo-value_box-whisker-fees-script-type-zoomed.svg", "Box and whisker plot of total fees by script type, zoomed" %}
    <figcaption>Fee Rate axis capped at 18000 sats/vB to better show the differences between script types.</figcaption>
</figure>

To better understand the cause of this, we have to know how vBytes are allocated during the construction of a transaction.

### Calculating Transaction Size
The total fees paid to move a given UTXO depend on the vBytes needed to construct a transaction. Jameson Lopp has a [transaction size calculator](https://jlopp.github.io/bitcoin-transaction-size-calculator/) you can use to see how differing script types, numbers of inputs/outputs, and other variables will impact the resulting transaction size. Bitcoin OpTech has a [transaction size calculator](https://bitcoinops.org/en/tools/calc-size/) that breaks out how each component of a transaction relates to an amount of vBytes.

The table below shows the amount of vBytes required by a transaction consisting of a single input being spent to a single output.

| **Output →{% raw %}<br>{% endraw %}Input ↓** | **P2PKH** | **P2SH** | **P2WPKH** | **P2WSH** | **P2TR** |
|:--------------------:|:---------:|:--------:|:----------:|:---------:|:--------:|
|         P2PKH        |    192    |    190   |     189    |    201    |    201   |
|     P2SH (2-of-3)    |    341    |    339   |     338    |    350    |    350   |
|        P2WPKH        |   112.5   |   110.5  |    109.5   |   121.5   |   121.5  |
|    P2WSH (2-of-3)    |    149    |    147   |     146    |    158    |    158   |
|    P2TR (Keypath)    |    102    |    100   |     99     |    111    |    111   |

So in ideal dust spending conditions, you would hold a P2TR UTXO and spend it to a P2WPKH output. An input requires more vBytes than an output, so the ideal will change if you are spending few inputs to many outputs.

> **Note**
>
> Surprisingly, despite P2SH and P2PKH inputs being the most expensive (in terms of total fees), the fee data above doesn't bear that out. Without doing further digging, I assume it's due to multi-sig being more common with other script types.

### Choosing a Minimum UTXO Value
Putting everything together, here are my assumptions for choosing my minimum UTXO value:
1. I want to be able to send the UTXO to any type of output: assume I'm spending to a P2WSH or P2TR output which are the most expensive
1. Although median fee rates have come down since the last peaks, I'll assume a pretty high fee rate: 300 sats/vB
    1. Additional Bitcoin adoption in the future will put upward pressure on block space demand. Current adoption is estimated in the low single-digit percentage (~2.5%) [of the world's population](https://bitcoinmagazine.com/markets/an-objective-look-at-bitcoin-adoption).
    1. Non-Bitcoin changes could also affect block space demand (e.g., Ordinals)
1. Bitcoin changes slowly and updates that reduce vBytes needed to spend a UTXO may not come. They could require **more** vBytes.

Given the above, I want to hold a P2TR UTXO so my projected dust threshold would be 33,301 sats. That's just the threshold at which I'm able to spend the UTXO without requiring an additional input. To make the UTXO useful, it requires excess value. I've settled on 65,000 sats as a minimum UTXO value for a round number that (at current USD exchange rates) would leave me with ~$10 in spending power.