---
title: "Build a Fraud Investigation Outline"
description: "Create a structured fraud investigation outline from claim red flags — covering investigation plan, fraud indicators, applicable statutes, evidence preservation, and investigation milestones."
time: 5
difficulty: "advanced"
insuranceSector: "Claims Processing"
aiTool: "ChatGPT / Claude"
prompt: |
  You are a Special Investigations Unit (SIU) analyst at an insurance company. Based on the claim information and red flags I describe, create a structured fraud investigation outline with the following sections:

  1. **Summary of Red Flags**: Organize the identified red flags by category (e.g., claim circumstances, claimant behavior, documentation inconsistencies, financial indicators). For each red flag, rate its significance as High, Medium, or Low.

  2. **Investigation Plan**: Outline the specific steps to investigate each red flag, including:
     - **Interviews to conduct**: Who should be interviewed, what key questions to ask, and in what order
     - **Documents to obtain**: Specific records to request (police reports, medical records, financial documents, phone records, social media, etc.)
     - **Surveillance considerations**: Whether surveillance is warranted based on the red flags, what type, and what outcome would support or refute the fraud hypothesis
     - **Database searches**: Which industry databases to query (NICB, ISO ClaimSearch, LexisNexis, etc.) and what to look for

  3. **Applicable Fraud Indicators**: List the recognized industry fraud indicators (from NICB, CAIF, or ISO) that match this claim's characteristics. Note how many indicators are present and what threshold typically triggers a referral.

  4. **Relevant State Fraud Statutes**: Identify the applicable state insurance fraud statutes, including:
     - Criminal fraud statute (citation and elements of the offense)
     - Civil fraud remedies available to the insurer
     - Mandatory reporting obligations to the state fraud bureau
     - Immunity provisions for good-faith fraud reporting

  5. **Evidence Preservation Requirements**: List the evidence that must be preserved, proper chain-of-custody procedures, and documentation standards for each type of evidence.

  6. **Investigation Timeline**: Provide a suggested timeline with milestones:
     - Initial review and triage (days 1-3)
     - Document collection phase (days 3-14)
     - Interview phase (days 14-30)
     - Analysis and determination (days 30-45)
     - Reporting and referral (if warranted)

  Format with clear headings, bullet points, and a priority matrix for investigation steps.

  Here is the claim information:

  Claim number: [CLAIM NUMBER]
  Line of business: [e.g., "Auto," "Property," "Workers' Compensation," "Disability"]
  Date of loss: [DATE]
  Jurisdiction: [STATE]
  Claim summary: [BRIEF DESCRIPTION OF THE CLAIMED LOSS]
  Red flags identified: [LIST THE SPECIFIC RED FLAGS THAT TRIGGERED THE SIU REFERRAL]
  Claimant information: [RELEVANT BACKGROUND — e.g., prior claims history, financial status if known, any prior fraud referrals]
tips:
  - "Be specific about the red flags you have identified. The more detail you provide, the more targeted the investigation plan will be."
  - "After generating the outline, follow up with: 'What additional red flags should I look for in a [line of business] claim with these characteristics?' to identify indicators you may have missed."
  - "Use this outline as a case management framework. Update it as the investigation progresses and new information emerges."
  - "For complex or multi-party fraud schemes, run the prompt separately for each claimant or entity involved, then ask the AI to identify connections between them."
cautions:
  - "Fraud investigations have significant legal implications. This outline is a planning tool — all investigation activities must comply with applicable laws, regulations, and your company's SIU protocols."
  - "State fraud statutes cited by the AI must be independently verified. Laws change, and the AI may not reflect the most current amendments or case law interpretations."
  - "Surveillance and recorded statements are subject to state-specific legal requirements. Verify that any planned surveillance or recording complies with your jurisdiction's laws before proceeding."
  - "Do not paste claimant personally identifiable information, medical records, or sensitive investigation details into consumer AI tools. Use enterprise versions with appropriate data protections and legal hold procedures."
sources:
  - type: industry-report
    title: "Insurance Fraud: The Hidden Cost of Deception"
    author: "Coalition Against Insurance Fraud"
    date: "2024-01-22"
    url: "https://insurancefraud.org/research/"
    note: "Comprehensive data on insurance fraud trends, costs, and detection methodologies across all lines of business."
  - type: regulation
    title: "Insurance Fraud Prevention Model Act"
    author: "National Association of Insurance Commissioners"
    date: "2023-01-01"
    url: "https://content.naic.org/sites/default/files/model-law-680.pdf"
    note: "Model legislation for state insurance fraud prevention programs, including mandatory reporting and immunity provisions."
order: 9
---

## What This Quick Win Does

When a claim is referred to the Special Investigations Unit, the SIU analyst must quickly organize a complex set of information — red flags, investigation leads, legal requirements, and evidence considerations — into a structured investigation plan. This planning phase is critical: a disorganized investigation can miss key evidence, violate legal requirements, or fail to build a case that withstands scrutiny.

AI can generate a structured investigation outline in approximately 5 minutes, organizing the red flags, mapping out investigation steps, identifying applicable fraud statutes, and creating an investigation timeline. This gives the SIU analyst a comprehensive framework to work from, ensuring that no major investigation avenue is overlooked.

This is an advanced Quick Win because fraud investigations carry significant legal and regulatory implications. The AI-generated outline is a planning tool that must be reviewed by experienced SIU professionals and, where appropriate, legal counsel before investigation activities begin.

## How to Use It

### Step 1: Document the Red Flags

Before using the prompt, compile all the red flags that triggered the SIU referral. Be specific:
- Instead of "suspicious timing," write "claim filed 3 days after policy inception with no prior insurance history for 6 months"
- Instead of "documentation issues," write "repair estimate from a shop 45 miles from claimant's home, estimate prepared before the inspection appointment"
- Include any relevant background: prior claims history, financial indicators, and information from the adjuster's file notes

### Step 2: Generate the Investigation Outline

Paste the prompt and your claim information into your AI tool. The AI will produce a structured outline covering all major aspects of the investigation.

### Step 3: Review and Customize

Review the outline against your company's SIU protocols and the specific circumstances of the claim:
- Are the recommended investigation steps appropriate and proportional to the claim?
- Do the suggested interviews and document requests align with what is available and legally obtainable?
- Are the cited fraud statutes accurate for your jurisdiction?
- Does the timeline align with any applicable policy or regulatory deadlines?

Add any investigation steps specific to your company's procedures or the unique facts of the case.

### Step 4: Execute and Update

Use the outline as a living document throughout the investigation. Update it as new information emerges, new red flags are identified, or investigation steps are completed. The structured format makes it straightforward to track progress and document the investigation for regulatory reporting or litigation purposes.

## What This Does Not Replace

This Quick Win helps organize an investigation. It does not replace the judgment of an experienced SIU analyst, legal counsel's guidance on investigation procedures and evidence admissibility, or the regulatory requirements specific to your jurisdiction for fraud investigation and reporting.
