---
title: "Analyze Loss Run Data in 3 Minutes"
description: "Transform raw loss run reports into actionable insights — frequency and severity trends, top loss causes, loss ratio calculations, and risk improvement recommendations."
time: 3
difficulty: "intermediate"
insuranceSector: "Risk Management"
aiTool: "ChatGPT / Claude"
prompt: |
  You are an insurance data analyst specializing in loss analysis. I will provide a loss run report. Please analyze the data and produce a comprehensive report with the following sections:

  1. **Executive Summary**: A 3-5 sentence overview of the loss history and key takeaways.
  2. **Loss Frequency & Severity Trends**: Analyze the number of claims and average claim amounts over the reporting period. Identify any upward or downward trends.
  3. **Top Causes of Loss**: Rank the causes of loss by total incurred amount and by frequency. Identify the top 3-5 drivers.
  4. **Open vs. Closed Claims Summary**: Summarize the number and value of open claims versus closed claims. Flag any aging open claims that may need reserve review.
  5. **Loss Ratio Calculation**: Calculate the loss ratio (total incurred losses / earned premium) for each year if premium data is available. Note the trend.
  6. **Reserve Adequacy Assessment**: For open claims, assess whether reserves appear adequate based on the claim descriptions and current incurred amounts. Flag any claims where reserves may need adjustment.
  7. **Year-Over-Year Comparison**: Compare each year's loss experience to the prior year. Highlight significant changes in frequency, severity, or loss causes.
  8. **Risk Improvement Recommendations**: Based on the loss patterns identified, provide 5-7 specific, actionable recommendations to reduce future losses. Prioritize by expected impact.

  Format with clear headings, tables where appropriate, and bullet points for readability. Include a summary table at the end.

  Here is the loss run data:

  [PASTE LOSS RUN REPORT HERE]
tips:
  - "For best results, include all columns from the loss run: claim number, date of loss, report date, claimant, cause of loss, status, paid amounts, reserved amounts, and total incurred."
  - "If premium data is available, include it so the AI can calculate loss ratios. Without premium data, the analysis will focus on loss trends only."
  - "Follow up with: 'Based on this analysis, what underwriting questions would a carrier likely ask at renewal?' to prepare for renewal negotiations."
  - "Run this analysis annually and ask the AI to compare the current year's results to last year's analysis to track whether risk improvements are working."
cautions:
  - "Loss run data may contain errors or inconsistencies from the carrier's system. Verify key figures against your own records before relying on the analysis."
  - "AI cannot assess reserve adequacy with the same precision as an experienced adjuster who knows the individual claim circumstances. Use reserve assessments as flags for further review, not as final determinations."
  - "Loss run reports may contain personally identifiable information. Redact claimant names and sensitive details before pasting into AI tools."
  - "Historical loss patterns do not guarantee future results. Use trend analysis as one input to risk management decisions, not the sole basis."
sources:
  - type: industry-report
    title: "Sigma Report: Natural Catastrophes and Man-Made Disasters"
    author: "Swiss Re Institute"
    date: "2024-03-21"
    url: "https://www.swissre.com/institute/research/sigma-research.html"
    note: "Industry benchmarks for loss frequency and severity trends across major insurance lines."
  - type: news
    title: "How Predictive Analytics Is Transforming Risk Management"
    author: "Insurance Journal"
    date: "2024-05-10"
    url: "https://www.insurancejournal.com/news/national/"
    note: "Coverage of AI and analytics adoption in insurance risk management and loss analysis workflows."
order: 6
---

## What This Quick Win Does

Loss run analysis is a cornerstone of risk management and renewal preparation. A loss run report — the detailed record of an insured's claims history provided by their carrier — contains critical data about what is going wrong, how often, and at what cost. But raw loss run data is often delivered as dense spreadsheets or flat PDF tables that require significant manual effort to interpret.

AI can process a loss run report and produce a structured analysis in approximately 3 minutes. The output identifies frequency and severity trends, ranks the top causes of loss, calculates loss ratios, flags open claims that may need attention, and provides specific risk improvement recommendations. This gives you a working analysis to refine and present, rather than starting from a blank page.

This Quick Win is especially valuable when preparing for renewals, conducting stewardship reviews, or helping clients develop risk management programs based on their actual loss experience.

## How to Use It

### Step 1: Gather the Loss Run Data

Obtain the loss run report from the carrier. Ideally, request at least 3-5 years of data to enable meaningful trend analysis. Convert the report to text format if it is in PDF. Include all available data fields — claim number, date of loss, date reported, cause of loss, status, paid amounts, reserved amounts, and total incurred.

If premium data is available for the same period, include it so the AI can calculate loss ratios.

### Step 2: Redact and Paste

Remove any personally identifiable information (claimant names, Social Security numbers, medical details) before pasting into your AI tool. Replace names with generic identifiers if needed (e.g., "Claimant 1," "Claimant 2").

Paste the prompt and the cleaned data into your AI tool.

### Step 3: Review the Analysis

Read the output with a critical eye:
- Do the frequency and severity trends match your understanding of the account?
- Are the top causes of loss accurately identified?
- Do the loss ratio calculations align with what you would expect?
- Are the reserve adequacy flags reasonable given what you know about the open claims?

Correct any errors and add context that the AI cannot know — for example, that a spike in claims was due to a specific weather event, or that a particular open claim is in litigation.

### Step 4: Apply the Recommendations

The risk improvement recommendations are based on the patterns in the data. Evaluate each one for feasibility and relevance to the client's operations. Prioritize recommendations that address the top loss drivers and present them to the client as part of a risk management plan.

## What This Does Not Replace

This Quick Win accelerates loss run analysis. It does not replace an experienced risk manager's assessment of individual claim circumstances, actuarial analysis for reserve setting or loss projection, or the professional judgment required to translate data patterns into effective risk management strategies.
