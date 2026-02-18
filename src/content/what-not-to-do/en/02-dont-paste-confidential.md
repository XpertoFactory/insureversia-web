---
title: "Don't Paste Policyholder Data into Public AI Tools"
number: 2
description: "Consumer-grade AI tools (free ChatGPT, free Gemini) may use your inputs for model training. Entering policyholder personally identifiable information, claims data, medical records, or proprietary business information into these tools creates serious privacy and compliance risks."
risk: "Data privacy violations (GDPR, CCPA, state insurance privacy laws), regulatory penalties, policyholder trust breach, competitive intelligence exposure, potential data breach liability"
realExample: "In April 2023, Samsung banned employee use of ChatGPT after engineers inadvertently uploaded proprietary source code and internal meeting notes to the platform. The data became part of ChatGPT's training set. In the insurance context, imagine policyholder medical records, claims histories, or proprietary pricing algorithms being processed by a public AI tool — the privacy implications under HIPAA, GDPR, and state insurance privacy laws would be severe."
mitigation: "Use enterprise-grade AI tools with appropriate data processing agreements for any work involving sensitive data. Establish a clear data classification policy that defines what can and cannot be entered into AI tools. When in doubt, anonymize or use synthetic data."
insureversiasTake: "This is where most organizations get caught. Someone copies a claims file into ChatGPT to 'quickly summarize it,' and suddenly policyholder medical records are floating through OpenAI's servers. The person meant well — they were trying to be efficient. But they just created a privacy violation that could cost the organization millions. Get enterprise tools. Train your people. Make the right thing the easy thing."
sources:
  - type: news
    title: "Samsung Bans ChatGPT Use After Staff Data Leak"
    author: "James Vincent"
    date: "2023-05-02"
    url: "https://www.theverge.com/2023/5/2/23707796/samsung-ban-chatgpt-generative-ai-bing"
    note: "Samsung's ban on ChatGPT after confidential data was entered into the platform"
  - type: regulation
    title: "NAIC Insurance Data Security Model Law"
    author: "National Association of Insurance Commissioners"
    date: "2017-10-24"
    note: "Model law establishing data security standards for insurance licensees"
---

## The Danger in Detail

When you type or paste text into a consumer-grade AI tool, that data is transmitted to the AI provider's servers. Depending on the tool's terms of service, your input may be used to train future versions of the model, reviewed by human moderators, or stored indefinitely.

### What Constitutes Sensitive Data in Insurance

**Policyholder PII**: Names, addresses, Social Security numbers, dates of birth, driver's license numbers, financial information.

**Protected Health Information (PHI)**: Medical records, treatment histories, disability information — particularly relevant for health, life, disability, and workers' compensation insurance.

**Claims data**: Claim descriptions, settlement amounts, adjuster notes, fraud investigation details.

**Proprietary business information**: Pricing algorithms, underwriting guidelines, loss models, competitive analysis, strategic plans.

**Third-party confidential information**: Reinsurance treaty terms, vendor contracts, audit findings.

### Safe Alternatives

**Enterprise AI tools**: Many AI providers offer enterprise versions with data processing agreements that prohibit using your inputs for training. ChatGPT Enterprise/Team, Claude for Business, and Microsoft Copilot for Enterprise all offer these protections.

**On-premise / private models**: For the most sensitive data, consider local AI models that process data entirely within your infrastructure.

**Anonymization**: Before using any AI tool, strip all identifying information. Replace names with "Policyholder A," redact account numbers, and use generic descriptions.

**Synthetic data**: For testing and training purposes, create synthetic datasets that mirror your real data patterns without containing actual policyholder information.
