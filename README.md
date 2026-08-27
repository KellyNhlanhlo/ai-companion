# AI Companion

Build a polished, modern SaaS web application called **AI Workplace Productivity Assistant**.

This is a frontend-only student/project demonstration.

## IMPORTANT

Do NOT create:

* Login

* Registration

* Authentication

* User accounts

* Database

* Supabase

* Backend

* Payment system

The application must work without users signing in.

## Main Features

Build exactly these 3 tools:

### 1. Smart Email Generator

Create an email-writing assistant.

Inputs:

* Recipient — optional

* Your Name — optional

* What is the email about? — large natural-language textarea

* Tone:

  * Formal

  * Friendly

  * Persuasive

The most important behavior:

If the user writes:

"Write an email to my boss reminding him about tomorrow's meeting."

the application must immediately generate the COMPLETE email.

It must automatically create:

**Subject:** appropriate subject generated from the request

**Email Body:** complete professional email including greeting, message, and sign-off.

DO NOT ask the user to provide a subject.

DO NOT ask unnecessary questions.

DO NOT respond with "Happy to help."

DO NOT give an outline or suggestions instead of the email.

The user should be able to copy the generated email and send it immediately.

The generated email must be fully editable.

Output buttons:

* Copy

* Regenerate

* Clear

### 2. AI Research Assistant

Create a research workspace.

Input:

**What would you like to research?**

Allow the user to enter either a question, topic, or pasted article/content.

Generate a structured response containing:

* Summary

* Key Insights

* Benefits / Opportunities

* Risks / Challenges

* Recommendations

* Key Takeaways

Include:

* Copy

* Regenerate

* Clear

Do not ask unnecessary follow-up questions.

If the user provides article text, summarize the provided text and do not pretend to have browsed the internet if no browsing capability is available.

### 3. AI Chatbot

Create a modern workplace AI chat interface.

Include:

* Conversation area

* User messages

* AI responses

* Text input

* Send button

* Clear conversation

Add suggested prompts:

"Help me write a professional email."

"Research the impact of AI in the workplace."

"Help me prepare for a presentation."

"Rewrite this message professionally."

The chatbot should actually respond to the user's request rather than simply saying "How can I help?"

## Dashboard

Create a beautiful dashboard inspired by a premium SaaS productivity application.

Hero:

**Your AI workplace assistant**

Subtitle:

**Write better emails, research smarter, and get instant workplace assistance — all from one simple workspace.**

Buttons:

**Start with Email**

**Open AI Chat**

Below the hero, display three feature cards:

**Smart Email Generator**

Write polished workplace emails in seconds.

**AI Research Assistant**

Summarize topics and generate useful insights.

**AI Chat**

Get instant assistance with everyday workplace tasks.

Add simple visual statistics:

**3 AI Tools**

**Instant Responses**

**100% Editable**

These are display statistics only and do not require a backend.

## Design

Use a premium dark SaaS design.

Colors:

* Deep navy/black background

* Blue and purple accents

* Coral/red gradient highlights

* White/light gray text

Use:

* Rounded cards

* Subtle borders

* Soft shadows

* Gradient buttons

* Modern typography

* Spacious layouts

* Professional icons

* Smooth hover effects

Desktop:

* Left sidebar

* Main dashboard content

Mobile:

* Collapsible sidebar/hamburger menu

* Single-column layout

* Touch-friendly controls

* No horizontal scrolling

Sidebar:

**AI Workplace**

Navigation:

* Dashboard

* Email Generator

* Research Assistant

* AI Chat

At the bottom display:

**AI-generated content may require human review**

## Responsible AI

Display this disclaimer:

**AI-generated content may contain errors. Review and verify important information before using it.**

For research results, clearly indicate that important information should be independently verified.

## Quality

Make the application look like a real professional SaaS product, not a basic school form.

All navigation must work.

All buttons must work.

Include loading, empty, and error states.

Generated content must be editable.

Prioritize excellent UI/UX and functionality.

MOST IMPORTANT:

When the user gives a clear instruction, perform the task immediately.

For example:

User:

"Write an email to my boss reminding him about tomorrow's meeting."

The app must write the complete email with an automatically generated subject.

Do not ask the user what the subject should be.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/bc68bfa7-265b-4fe9-82e6-5552f4aa7f94).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
