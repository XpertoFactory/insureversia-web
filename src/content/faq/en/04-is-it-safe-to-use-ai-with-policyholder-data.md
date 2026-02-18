---
title: "Is it safe to use AI with policyholder data?"
category: "skeptical"
order: 4
sources:
  - type: regulation
    title: "NAIC Model Bulletin: Use of Artificial Intelligence Systems by Insurers"
    author: "National Association of Insurance Commissioners"
    date: "2023-12-04"
    note: "Regulatory guidance on data privacy and AI use in insurance"
  - type: industry-report
    title: "Data Privacy and AI in Insurance: A Risk-Based Framework"
    author: "International Association of Insurance Supervisors (IAIS)"
    date: "2024-01-15"
    note: "Global framework for managing data privacy risks in AI-driven insurance"
---

This is one of the most important questions in AI adoption, and the honest answer is: it depends on how you use it and which tools you choose.

**When cloud AI is risky:** General-purpose AI tools like ChatGPT, Claude, and Gemini process data on external servers. Entering policyholder names, policy numbers, claims details, medical information, or Social Security numbers into these platforms creates real confidentiality and compliance risks. Most AI providers' terms of service state that input data may be used for model training — a direct conflict with insurance data protection obligations.

**When cloud AI is appropriate:** These same tools are perfectly safe for non-confidential work: summarizing public regulatory documents, drafting template language, brainstorming coverage concepts, or analyzing anonymized, aggregated data. The key is ensuring no personally identifiable information (PII) or protected health information (PHI) enters the prompt.

**Enterprise and local AI options exist:** Enterprise versions of major AI platforms (ChatGPT Enterprise, Claude for Business) offer data processing agreements and commitments that input data will not be used for training. Local AI models running on your own hardware — such as Ollama with open-source models — keep all data on-premises, eliminating cloud exposure entirely.

**A practical protocol:**

1. **Classify your data** before using any AI tool: public, internal, confidential, or restricted.
2. **Never input PII or PHI** into consumer AI tools.
3. **Use enterprise or local AI** for confidential insurance work.
4. **Establish a firm-wide AI data policy** that all team members understand and follow.

The NAIC Model Bulletin explicitly addresses data privacy in AI use, requiring insurers to maintain appropriate governance over how AI systems handle consumer data. Compliance is not optional — it is a regulatory obligation.
