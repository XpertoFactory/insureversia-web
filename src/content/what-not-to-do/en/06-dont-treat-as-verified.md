---
title: "Don't Treat AI Output as Verified Data"
number: 6
description: "AI generates text based on statistical patterns, not verified facts. When it produces actuarial figures, loss ratios, market statistics, or regulatory citations, these may look authoritative but could be entirely fabricated. Treating AI output as verified data is a fast path to costly errors."
risk: "Incorrect pricing decisions, flawed reserve calculations, inaccurate regulatory filings, audit failures, financial misstatements"
realExample: "Multiple documented instances exist of AI tools generating plausible but fabricated statistics. When asked about insurance market data, AI might produce specific loss ratios, market share percentages, or premium volumes that sound precise but are not grounded in actual data. In actuarial work, even small data inaccuracies can cascade into significant pricing errors — a 2% error in loss ratio assumptions could translate to millions in under- or over-reserving across a large portfolio."
mitigation: "Never use AI-generated numbers, statistics, or citations in any professional output without verifying them against primary data sources. Treat every AI-generated data point as an unverified claim that must be checked. Use AI for analysis and interpretation, but source your data from verified databases."
insureversiasTake: "Here's what makes this particularly dangerous in insurance: our industry runs on numbers. Loss ratios, combined ratios, reserve adequacy, claim severity trends — these aren't decorative statistics, they're the foundation of pricing, reserving, and strategic decisions. When AI invents a plausible-sounding '78.3% loss ratio for the Southeast commercial property market in 2023,' it's not just wrong — it could cascade through your models and affect real financial decisions. Use AI to analyze your verified data. Don't let AI be your data source."
sources:
  - type: academic
    title: "On the Reliability of Large Language Models as Knowledge Bases"
    date: "2023-09-01"
    note: "Research demonstrating that LLMs can generate fabricated but plausible-sounding statistical claims"
  - type: industry-report
    title: "Actuarial Standards of Practice No. 56: Modeling"
    author: "Actuarial Standards Board"
    date: "2019-12-01"
    note: "Standards requiring actuaries to validate data inputs and understand model limitations"
---

## The Danger in Detail

AI produces two types of output: analysis and data. The analysis can be remarkably useful even when imperfect. But the data — specific numbers, statistics, citations — must be independently verified because AI has no mechanism for distinguishing between a real statistic and a plausible fabrication.

### Where This Goes Wrong

**Actuarial analysis**: AI-generated loss development factors, trend assumptions, or reserve estimates that aren't grounded in actual data.

**Market research**: AI-produced market size estimates, growth rates, or competitive positioning data that sounds authoritative but has no factual basis.

**Regulatory compliance**: AI-cited regulations with specific section numbers that don't exist, or correct section numbers with incorrect requirements.

**Financial reporting**: AI-generated financial metrics or benchmarking data that doesn't match actual industry data.

### The Data Sourcing Protocol

1. **Use AI for analysis, not data generation**: Give AI your verified data to analyze, rather than asking it to provide data.
2. **Verify every number**: Any statistic, percentage, dollar amount, or date produced by AI must be checked.
3. **Source from authoritative databases**: AM Best, S&P, NAIC, state DOI databases, ISO, and published industry reports.
4. **Mark unverified claims**: If you include any AI-generated claim in a working document, mark it as "UNVERIFIED" until confirmed.
5. **Separate analysis from facts**: AI's analytical frameworks and reasoning can be valuable; its "facts" cannot be trusted without verification.
