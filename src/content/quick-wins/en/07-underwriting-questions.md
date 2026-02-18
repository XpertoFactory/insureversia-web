---
title: "Generate Targeted Underwriting Questions"
description: "Produce a comprehensive set of supplemental underwriting questions from an insurance application — organized by risk category with explanations of why each question matters."
time: 2
difficulty: "beginner"
insuranceSector: "Prospecting & Underwriting"
aiTool: "ChatGPT / Claude"
prompt: |
  You are a senior underwriter reviewing an insurance application. Based on the application information I provide, generate a comprehensive set of supplemental underwriting questions organized into the following categories:

  1. **Risk Characteristics Needing Clarification**: Questions about the applicant's operations, exposures, or risk profile that need further detail before a coverage decision can be made.
     - For each question, note: *Why it matters* — briefly explain how the answer affects the underwriting decision.

  2. **Coverage Adequacy Concerns**: Questions about whether the requested limits, deductibles, and coverage structure are appropriate for the applicant's risk profile.
     - For each question, note: *Why it matters* — explain what coverage gap or over-insurance risk you are probing.

  3. **Loss History Follow-Up**: Questions about the applicant's reported claims history that require clarification, such as open claims, trends, or missing details.
     - For each question, note: *Why it matters* — explain what the answer reveals about future loss potential.

  4. **Safety & Risk Management Practices**: Questions about the applicant's risk control measures, safety programs, business continuity plans, and loss prevention efforts.
     - For each question, note: *Why it matters* — explain how the presence or absence of these practices affects risk quality.

  5. **Regulatory & Compliance Considerations**: Questions about the applicant's compliance with industry regulations, licensing requirements, or contractual obligations that affect insurability.
     - For each question, note: *Why it matters* — explain the regulatory or contractual risk at stake.

  For each category, provide 3-5 targeted questions. Prioritize questions that would meaningfully change the underwriting outcome — do not include generic questions that apply to every risk.

  Here is the application information:

  [PASTE THE INSURANCE APPLICATION OR SUMMARIZE THE KEY DETAILS: applicant name, business type, industry, revenue, employees, locations, requested coverages, limits, deductibles, loss history, and any notable risk factors]
tips:
  - "The more detail you provide from the application, the more specific and useful the questions will be. Include industry, operations description, revenue, and any unusual risk factors."
  - "This is an excellent training tool for junior underwriters. Have them compare the AI-generated questions to their own list and discuss any differences."
  - "After receiving the questions, follow up with: 'Based on typical risks for this industry, what are the three most critical pieces of information I need before quoting this account?'"
  - "Run this prompt for each new submission to ensure consistency in your underwriting process and to avoid overlooking important questions."
cautions:
  - "AI-generated questions are based on general underwriting principles. They may miss industry-specific or jurisdiction-specific considerations that an experienced underwriter would catch."
  - "Do not paste confidential applicant information into consumer AI tools. Use enterprise or API versions with appropriate data handling agreements."
  - "Supplemental questions should be relevant and non-discriminatory. Review all questions to ensure compliance with fair underwriting practices and applicable regulations."
sources:
  - type: industry-report
    title: "Transforming Underwriting with AI"
    author: "Deloitte"
    date: "2024-04-18"
    url: "https://www.deloitte.com/global/en/Industries/financial-services/perspectives/ai-in-insurance-underwriting.html"
    note: "Research on how AI is augmenting the underwriting process, including risk assessment and question generation."
  - type: regulation
    title: "Unfair Trade Practices Act — Model Regulation"
    author: "National Association of Insurance Commissioners"
    date: "2023-01-01"
    url: "https://content.naic.org/sites/default/files/model-law-880.pdf"
    note: "Regulatory framework governing fair underwriting practices and prohibited discrimination in insurance."
order: 7
---

## What This Quick Win Does

Reviewing an insurance application and identifying the right follow-up questions is a skill that takes years to develop. Experienced underwriters instinctively know what to ask — what gaps in the application signal elevated risk, what loss history patterns require explanation, and what operational details determine whether a risk is acceptable. For newer underwriters, or for experienced underwriters working outside their usual line of business, this pattern recognition takes time.

AI can analyze an application and generate a structured set of supplemental questions in approximately 2 minutes. Each question comes with an explanation of why it matters, making the output both a practical tool and a learning resource. For experienced underwriters, it serves as a quick checklist to ensure nothing is overlooked during a busy submission cycle.

## How to Use It

### Step 1: Prepare the Application Information

Copy the key details from the insurance application, or summarize them. At minimum, include:
- Applicant name and business description
- Industry and operations
- Revenue and employee count
- Locations and territory
- Requested coverages, limits, and deductibles
- Loss history for the past 3-5 years
- Any risk factors that stand out to you

The more context you provide, the more targeted the questions will be.

### Step 2: Generate the Questions

Paste the prompt and the application information into your AI tool. The AI will return a categorized set of questions with explanations.

### Step 3: Review and Prioritize

Not every generated question will be relevant to every submission. Review the list and:
- Keep questions that address genuine gaps in the application
- Remove questions that the application already answers
- Add any questions specific to your company's underwriting guidelines or appetite that the AI would not know about
- Prioritize questions that would materially affect your pricing or coverage decision

### Step 4: Send to the Agent or Broker

Compile your final list of supplemental questions and send them to the submitting agent or broker. The "Why it matters" explanations can help you articulate to the agent why you need the information, which often results in faster, more complete responses.

## What This Does Not Replace

This Quick Win helps generate and organize underwriting questions. It does not replace an underwriter's professional judgment about risk acceptability, your company's specific underwriting guidelines and appetite, or the nuanced assessment that comes from experience with a particular line of business or industry segment.
