---
title: "Create a Regulatory Compliance Checklist"
description: "Generate a comprehensive regulatory compliance checklist for a specific jurisdiction and line of business — covering licensing, filing, market conduct, claims handling, data privacy, and AI governance requirements."
time: 5
difficulty: "advanced"
insuranceSector: "Compliance"
aiTool: "ChatGPT / Claude"
prompt: |
  You are an insurance compliance officer creating a regulatory compliance checklist. Based on the jurisdiction and line of business I specify, create a comprehensive checklist covering the following areas:

  1. **Licensing Requirements**: What licenses and appointments are required to transact this line of business in this jurisdiction? Include producer, adjuster, and company-level requirements.

  2. **Rate & Form Filing Obligations**: What are the filing requirements for policy forms and rates? Is this a prior approval, file-and-use, or use-and-file state for this line? What are the filing timelines and procedures?

  3. **Market Conduct Standards**: What are the key market conduct requirements? Include advertising standards, producer supervision obligations, and prohibited practices.

  4. **Claims Handling Requirements**: What are the regulatory requirements for claims handling? Include prompt payment laws, claims acknowledgment timelines, and required disclosures to claimants.

  5. **Data Privacy Obligations**: What data privacy and security requirements apply? Include state-specific data breach notification laws, consumer data rights, and data retention requirements.

  6. **Anti-Discrimination Requirements**: What are the prohibited underwriting and rating factors? Include fair lending crossovers, protected classes, and any specific guidance on proxy discrimination.

  7. **Consumer Notification Requirements**: What notices must be provided to policyholders and applicants? Include adverse action notices, cancellation/non-renewal notices, and privacy notices.

  8. **AI & Algorithmic Governance Requirements**: What requirements exist for the use of AI, predictive models, or algorithmic decision-making in underwriting, rating, or claims? Include any testing, validation, or disclosure obligations.

  For each item in the checklist, provide:
  - The specific requirement
  - The applicable statute, regulation, or bulletin (cite by name and number where possible)
  - The compliance deadline or frequency (e.g., "within 15 days," "annually," "prior to use")
  - The consequence of non-compliance (e.g., fines, license action, private right of action)

  Format as a structured checklist with checkboxes for each requirement.

  Jurisdiction: [STATE OR JURISDICTION]
  Line of business: [e.g., "Commercial General Liability," "Workers' Compensation," "Personal Auto," "Homeowners"]
  Company type: [e.g., "Admitted carrier," "Surplus lines," "Managing General Agent," "Independent agency"]
tips:
  - "Run this prompt separately for each state where you operate to build a jurisdiction-by-jurisdiction compliance matrix."
  - "After generating the checklist, follow up with: 'What are the most common compliance violations in [state] for [line of business], and how can we proactively avoid them?'"
  - "Update the checklist quarterly by running the prompt again and asking the AI to identify any new regulations, bulletins, or enforcement actions since the last review."
  - "Use the output as a starting framework for your compliance management system, not as a finished compliance program."
cautions:
  - "AI knowledge of specific state regulations may be outdated or incomplete. Every item on the checklist must be independently verified against current statutes, regulations, and department bulletins."
  - "Insurance regulation changes frequently. New bulletins, enforcement actions, and legislative amendments can alter compliance requirements at any time. This checklist is a snapshot, not a living document."
  - "AI governance requirements are evolving rapidly across jurisdictions. The NAIC and individual states are actively developing new requirements. Verify this section particularly carefully."
  - "This checklist does not constitute legal advice. Consult with compliance counsel for definitive guidance on regulatory obligations."
sources:
  - type: regulation
    title: "NAIC Model Bulletin on the Use of Artificial Intelligence Systems by Insurers"
    author: "National Association of Insurance Commissioners"
    date: "2023-12-04"
    url: "https://content.naic.org/sites/default/files/inline-files/2023-12-4%20Model%20Bulletin_Artificial%20Intelligence%20Systems.pdf"
    note: "Regulatory framework for AI governance in insurance, adopted or under consideration in multiple states."
  - type: industry-report
    title: "Insurance Regulation in the Age of AI"
    author: "PwC"
    date: "2024-07-09"
    url: "https://www.pwc.com/us/en/industries/financial-services/insurance.html"
    note: "Analysis of the evolving regulatory landscape for AI and algorithmic decision-making in insurance."
order: 8
---

## What This Quick Win Does

Insurance compliance is a complex, multi-jurisdictional challenge. A company operating in multiple states must track hundreds of regulatory requirements spanning licensing, rate filings, market conduct, claims handling, data privacy, and — increasingly — AI governance. Building and maintaining compliance checklists for each jurisdiction and line of business is a significant ongoing effort.

AI can generate a structured first-draft checklist in approximately 5 minutes, covering the major categories of regulatory requirements for a specific state and line of business. The output provides a framework that your compliance team can verify, refine, and incorporate into your compliance management program. It is especially useful when entering a new state, launching a new product line, or conducting an internal compliance audit.

This is an advanced Quick Win because the output requires substantial verification. Insurance regulation is detailed, jurisdiction-specific, and frequently changing. The AI-generated checklist is a starting point for research, not a finished compliance program.

## How to Use It

### Step 1: Define the Scope

Determine the jurisdiction, line of business, and company type you need to assess. The more specific you are, the more targeted the checklist will be. For example, "admitted carrier writing personal auto in California" will produce a more useful output than "auto insurance."

If you operate in multiple states, run the prompt separately for each jurisdiction to build a comparative compliance matrix.

### Step 2: Generate the Checklist

Paste the prompt into your AI tool with the specific jurisdiction and line of business details. The AI will return a structured checklist organized by regulatory category.

### Step 3: Verify Every Item

This is the most critical step. For each item on the checklist:
- Confirm the cited statute or regulation exists and is current
- Verify the specific requirements match the actual regulatory text
- Check for recent bulletins, enforcement actions, or amendments that may modify the requirement
- Consult your compliance counsel for any items that are ambiguous or high-risk

Do not assume the AI's citations are accurate. Cross-reference against official sources: state insurance department websites, the NAIC's model law database, and your compliance counsel's guidance.

### Step 4: Integrate into Your Compliance Program

Once verified, incorporate the checklist into your compliance management system. Assign owners to each requirement, set monitoring frequencies, and establish a process for tracking regulatory changes that may affect the checklist.

## What This Does Not Replace

This Quick Win generates a compliance research starting point. It does not replace a qualified compliance officer's review of actual regulatory text, legal counsel's interpretation of how requirements apply to your specific operations, or an ongoing regulatory monitoring program that tracks new legislation, regulations, and enforcement actions in real time.
