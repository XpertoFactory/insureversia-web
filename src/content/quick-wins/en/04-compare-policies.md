---
title: "Compare Two Insurance Policies Side by Side"
description: "Produce a detailed comparison table of two insurance policies covering limits, deductibles, exclusions, conditions, endorsements, and premium structure — with material differences flagged."
time: 5
difficulty: "intermediate"
insuranceSector: "Prospecting & Underwriting"
aiTool: "ChatGPT / Claude"
prompt: |
  You are a senior insurance analyst comparing two insurance policy documents. I will provide the full text of both policies. Please produce a comprehensive side-by-side comparison with the following structure:

  **1. Executive Summary**
  Provide a brief overview (5-8 bullet points) of the most significant differences between the two policies, listed in order of impact on the insured.

  **2. Detailed Comparison Table**
  Create a comparison table covering these categories:

  | Category | Policy A | Policy B | Material Difference? |
  |----------|----------|----------|---------------------|

  Cover the following categories row by row:
  - **Coverage Types & Limits**: Each coverage type, per-occurrence limits, aggregate limits, and sub-limits
  - **Deductibles**: Per-claim and aggregate deductibles for each coverage
  - **Exclusions**: Every exclusion, noting which are shared and which are unique to one policy
  - **Conditions**: Notice requirements, duties after loss, cancellation provisions, subrogation clauses
  - **Endorsements**: All endorsements and riders, noting how they modify base coverage
  - **Premium Structure**: Premium amount, payment schedule, discounts, surcharges, audit provisions

  **3. Material Differences Analysis**
  For each row flagged as a material difference, provide:
  - A plain-language explanation of the difference
  - Which policy offers broader or more favorable coverage for that item
  - The practical impact on the insured

  **4. Overall Assessment**
  - Which policy offers broader coverage overall, and why
  - Any unique provisions in either policy that the other lacks
  - Recommendations for what to negotiate or clarify before binding

  Here are the two policies:

  === POLICY A ===
  [PASTE POLICY A TEXT HERE]

  === POLICY B ===
  [PASTE POLICY B TEXT HERE]
tips:
  - "For best results, include the full text of both policies — declarations pages, insuring agreements, exclusions, conditions, and all endorsements."
  - "If the policies are too long for a single prompt, compare them section by section (e.g., exclusions from both policies first, then conditions, then endorsements)."
  - "After receiving the comparison, follow up with: 'Based on these differences, what negotiation points would you recommend for Policy B to match or exceed Policy A's coverage?'"
  - "Use this comparison as a structured reference during renewal discussions or competitive quoting, not as a standalone coverage opinion."
cautions:
  - "AI may not detect subtle differences in defined terms that materially change coverage scope. Always verify defined terms manually."
  - "Policy language interpretation depends on applicable state law and case precedent. The AI comparison reflects plain-language reading, not legal analysis."
  - "Do not paste confidential client policy documents into consumer AI tools. Use enterprise or API versions with appropriate data handling agreements."
  - "The 'broader coverage' assessment is based on text analysis only — it does not account for insurer financial strength, claims handling reputation, or service quality."
sources:
  - type: industry-report
    title: "Global Insurance Report 2024: The Race to Modernize"
    author: "McKinsey & Company"
    date: "2024-05-20"
    url: "https://www.mckinsey.com/industries/financial-services/our-insights/insurance"
    note: "Analysis of how AI tools are reshaping underwriting and policy analysis workflows."
  - type: regulation
    title: "NAIC Market Regulation Handbook"
    author: "National Association of Insurance Commissioners"
    date: "2024-01-01"
    url: "https://content.naic.org/market-regulation-handbook"
    note: "Standards for policy form review and market conduct examinations."
order: 4
---

## What This Quick Win Does

Comparing two insurance policies is a routine but labor-intensive task. Whether you are evaluating a renewal quote against the expiring policy, comparing competing bids during a marketing exercise, or reviewing coverage in an M&A due diligence process, the work requires methodical section-by-section analysis. A commercial policy comparison that might take 45 minutes to an hour of manual review can be drafted in approximately 5 minutes with AI.

This Quick Win produces a structured comparison table that organizes the differences by category, flags material deviations, and provides a plain-language assessment of which policy offers broader coverage. It gives you a working analysis to refine with your professional judgment, not a finished coverage opinion.

The output is especially useful for renewal reviews where you need to show a client exactly what changed, competitive analyses where you are presenting options to an insured, and due diligence processes where you need to compare coverage across multiple entities.

## How to Use It

### Step 1: Prepare Both Policies

Extract clean text from both policy documents. For each policy, include:
- The declarations page
- The insuring agreement
- All exclusions
- Conditions and definitions
- All endorsements and riders
- Any applicable schedules

Remove headers, footers, and page numbers that may interfere with the analysis. If working from PDFs, convert to text first and verify the conversion is clean.

### Step 2: Paste the Prompt and Both Policies

Copy the prompt into your AI tool. Replace the placeholders with the full text of each policy. Use the clear delimiters (`=== POLICY A ===` and `=== POLICY B ===`) so the AI can distinguish between the two documents.

If the combined text exceeds your AI tool's context window, compare by section: run the exclusions from both policies first, then conditions, then endorsements, and compile the results.

### Step 3: Review the Comparison Table

Start with the executive summary to understand the overall picture. Then review the detailed comparison table row by row, focusing on items flagged as material differences. Verify each difference against the original policy language — the AI may mischaracterize the scope of a defined term or miss a cross-reference to another section.

### Step 4: Focus on Material Differences

For each material difference the AI identifies, determine:
- Is the difference accurately described?
- Does it affect the insured's coverage for their specific risk profile?
- Is it a negotiable point, or a fundamental underwriting position?

Use the AI's analysis as a starting framework for your own coverage comparison memo or client presentation.

## What This Does Not Replace

This Quick Win accelerates the comparison process. It does not replace professional judgment about which policy is appropriate for a specific insured's risk profile, legal interpretation of policy language under applicable state law, or an experienced underwriter's assessment of insurer financial strength and claims handling quality.
