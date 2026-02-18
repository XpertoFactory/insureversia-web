---
title: "Extract Key Dates from a Claims File"
description: "Pull every critical date from a complex claims file — incident dates, reporting deadlines, statute of limitations, policy periods, and more — organized into a timeline."
time: 2
difficulty: "beginner"
insuranceSector: "Claims Processing"
aiTool: "ChatGPT / Claude"
prompt: |
  You are an insurance claims analyst reviewing a claims file. I will provide documents from a claim. Extract every date and deadline mentioned, and organize them into a structured timeline. For each entry, include:

  1. **Date**: The specific date (or date range).
  2. **Event**: What happened or is due on that date.
  3. **Source**: Which document the date appears in (e.g., "Police Report," "Policy Declarations," "Claimant Statement").
  4. **Significance**: Why this date matters for the claim (e.g., "Within 72-hour reporting window," "Statute of limitations expires," "Policy effective date").

  After the timeline, add these sections:

  **Critical Deadlines**: List any upcoming deadlines that require action, sorted by urgency.

  **Potential Issues**: Flag any date-related concerns (e.g., late reporting, coverage gaps between policy periods, statute of limitations risks, inconsistencies between documents).

  Format as a markdown table for the timeline, followed by bullet lists for deadlines and issues.

  Here are the claims documents:

  [PASTE CLAIMS FILE DOCUMENTS HERE]
tips:
  - "For large claims files, process documents in batches by type (police reports, medical records, correspondence, etc.)."
  - "Cross-reference the extracted dates against your claims management system to catch any discrepancies."
  - "Pay special attention to notice requirements — many policies have strict time limits for reporting claims."
  - "Use this timeline as the foundation for a claims diary and follow-up system."
cautions:
  - "Verify all extracted dates against the original documents. AI can misread dates, especially in scanned or handwritten documents."
  - "Statute of limitations periods and notice deadlines vary by jurisdiction and coverage type. Confirm with your legal team."
  - "Do not paste medical records, Social Security numbers, or other sensitive PII into consumer AI tools."
  - "This extraction is a starting point — a claims professional must verify the significance and implications of each date."
sources:
  - type: industry-report
    title: "Claims Management and AI: Opportunities and Risks"
    author: "Swiss Re Institute"
    date: "2024-06-01"
    url: "https://www.swissre.com/institute/"
    note: "Analysis of AI applications in claims processing."
order: 3
---

## What This Quick Win Does

Complex claims files can contain dozens of critical dates scattered across multiple documents — police reports, medical records, policy documents, correspondence, and legal filings. Missing a single deadline can have serious consequences. AI can scan an entire claims file and extract every date into an organized timeline in minutes.

## How to Use It

### Step 1: Compile Your Documents

Gather the text from all relevant claims documents. Redact sensitive PII before processing through AI tools.

### Step 2: Generate the Timeline

Paste the prompt and documents into your AI tool.

### Step 3: Verify and Act

- Cross-check every date against the original documents
- Enter critical deadlines into your claims management system
- Flag any date inconsistencies for investigation
- Set up reminders for upcoming deadlines

## What This Does Not Replace

This does not replace a claims examiner's responsibility to independently verify dates, calculate deadlines, or determine their legal significance.
