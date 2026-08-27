/**
 * Local, deterministic "AI" generation engine.
 * This is a frontend-only demonstration app: no backend, no network calls.
 * The engine parses the user's natural-language instruction and composes a
 * complete, ready-to-send result immediately — it never asks follow-up questions.
 */

export type Tone = "formal" | "friendly" | "persuasive";

export interface EmailRequest {
  recipient?: string;
  senderName?: string;
  prompt: string;
  tone: Tone;
}

export interface GeneratedEmail {
  subject: string;
  body: string;
}

const STOPWORDS = new Set([
  "write","an","a","the","email","mail","to","my","me","for","about","please","kindly",
  "can","you","i","need","want","would","like","him","her","them","that","this","and",
  "of","on","in","is","it","with","us","our","their","his","hers","asking","tell","let",
  "know","regarding","re","reminding","remind","send","draft","compose","them","we",
]);

function clean(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function titleCase(text: string) {
  return text
    .split(" ")
    .map((w) => (w.length > 3 ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ")
    .replace(/^./, (c) => c.toUpperCase());
}

export function extractTopic(prompt: string): string {
  let t = clean(prompt).replace(/^(please\s+)?(write|draft|compose|create|generate|send)\s+/i, "");
  t = t.replace(/^(me\s+)?(an?|the)\s+(email|mail|message|note)\s*/i, "");
  t = t.replace(/^to\s+[^,.]+?\s+(about|regarding|reminding|asking|telling|confirming|requesting)\s+/i, "");
  t = t.replace(/^(about|regarding|reminding|asking|telling|confirming|requesting)\s+/i, "");
  t = t.replace(/^(him|her|them|us|my boss|my manager|my team)\s+(about|of|that)\s+/i, "");
  t = t.replace(/[.!?]+$/, "");
  return clean(t) || clean(prompt);
}

function keywords(prompt: string, limit = 6) {
  return clean(prompt.toLowerCase())
    .replace(/[^a-z0-9\s'-]/g, " ")
    .split(" ")
    .filter((w) => w.length > 2 && !STOPWORDS.has(w))
    .slice(0, limit);
}

function detectRecipient(prompt: string): string | undefined {
  const m = prompt.match(/\bto\s+(?:my\s+)?([a-z]+(?:\s+[a-z]+)?)/i);
  if (!m) return undefined;
  const who = m[1].toLowerCase().trim();
  const roles: Record<string, string> = {
    boss: "Manager",
    manager: "Manager",
    team: "Team",
    client: "Client",
    colleague: "Colleague",
    professor: "Professor",
    lecturer: "Lecturer",
    supervisor: "Supervisor",
    hr: "HR",
  };
  const first = who.split(" ")[0];
  return roles[first] ?? (STOPWORDS.has(first) ? undefined : titleCase(who));
}

export function generateSubject(req: EmailRequest): string {
  const topic = extractTopic(req.prompt);
  const kw = keywords(req.prompt);
  const lower = topic.toLowerCase();

  if (/remind|reminder/.test(lower)) {
    const when = /tomorrow/.test(lower)
      ? "Tomorrow"
      : /today/.test(lower)
        ? "Today"
        : /next week/.test(lower)
          ? "Next Week"
          : "";
    const what = /meeting/.test(lower)
      ? "Meeting"
      : /deadline/.test(lower)
        ? "Deadline"
        : /call/.test(lower)
          ? "Call"
          : "Schedule";
    return clean(`Reminder: ${when} ${what}`.replace(/\s+/g, " "));
  }
  if (/leave|time off|vacation|day off/.test(lower)) return "Leave Request";
  if (/apolog|sorry|delay/.test(lower)) return "Apologies and Updated Timeline";
  if (/follow[- ]?up/.test(lower)) return "Following Up on Our Conversation";
  if (/thank/.test(lower)) return "Thank You";
  if (/interview/.test(lower)) return "Interview Scheduling";
  if (/invoice|payment|quote|pricing/.test(lower)) return "Invoice and Payment Details";
  if (/propos|pitch|offer|partnership/.test(lower)) return "Proposal for Your Consideration";
  if (/resign/.test(lower)) return "Notice of Resignation";
  if (/introduc/.test(lower)) return "Introduction";
  if (/update|status|progress|report/.test(lower)) return "Project Status Update";
  if (/schedule|book|arrange|meeting|call/.test(lower)) return "Meeting Request";

  const head = kw.slice(0, 4).join(" ");
  return titleCase(head || topic.slice(0, 60)) || "Quick Note";
}

const TONE_OPENERS: Record<Tone, (name: string) => string> = {
  formal: (n) => `Dear ${n},`,
  friendly: (n) => `Hi ${n},`,
  persuasive: (n) => `Hello ${n},`,
};

const TONE_INTRO: Record<Tone, string> = {
  formal: "I hope this message finds you well.",
  friendly: "Hope you're having a good week!",
  persuasive: "I wanted to reach out with something I think is worth your time.",
};

const TONE_CLOSER: Record<Tone, string> = {
  formal: "Kind regards,",
  friendly: "Thanks so much,",
  persuasive: "Looking forward to your thoughts,",
};

export function generateEmail(req: EmailRequest): GeneratedEmail {
  const topic = extractTopic(req.prompt);
  const lower = topic.toLowerCase();
  const recipient = clean(req.recipient || "") || detectRecipient(req.prompt) || "there";
  const sender = clean(req.senderName || "") || "[Your Name]";
  const subject = generateSubject(req);

  const core = topic.replace(/^(that|about)\s+/i, "");
  const sentenceTopic = core.charAt(0).toLowerCase() + core.slice(1);

  const bodyLines: string[] = [];
  bodyLines.push(TONE_OPENERS[req.tone](recipient));
  bodyLines.push("");
  bodyLines.push(TONE_INTRO[req.tone]);
  bodyLines.push("");

  if (/remind|reminder/.test(lower)) {
    bodyLines.push(
      req.tone === "formal"
        ? `I am writing to kindly remind you about ${sentenceTopic}. I wanted to make sure it stays on your radar so we can be fully prepared.`
        : req.tone === "friendly"
          ? `Just a quick reminder about ${sentenceTopic} — wanted to make sure it didn't slip through the cracks.`
          : `A quick reminder about ${sentenceTopic}. Being prepared for it will help us make the most of the time we have together.`,
    );
    bodyLines.push("");
    bodyLines.push(
      "If anything has changed or you would like to move the time, just let me know and I will adjust accordingly.",
    );
  } else if (/leave|time off|vacation|day off/.test(lower)) {
    bodyLines.push(`I would like to request time off regarding ${sentenceTopic}.`);
    bodyLines.push("");
    bodyLines.push(
      "I will make sure all my responsibilities are handed over and that nothing urgent is left outstanding while I am away.",
    );
  } else if (/apolog|sorry|delay/.test(lower)) {
    bodyLines.push(`I want to sincerely apologise regarding ${sentenceTopic}.`);
    bodyLines.push("");
    bodyLines.push(
      "I take full responsibility, and I have already put steps in place so this does not happen again. Please find the updated timeline below and let me know if it works for you.",
    );
  } else if (/propos|pitch|offer|partnership|persuad|convince/.test(lower)) {
    bodyLines.push(`I am reaching out about ${sentenceTopic}.`);
    bodyLines.push("");
    bodyLines.push(
      "Based on what I have seen so far, I believe this is a strong opportunity: it saves time, reduces manual effort, and delivers a clear return with very little risk on your side.",
    );
    bodyLines.push("");
    bodyLines.push("Would you be open to a short 15-minute call this week to walk through the details?");
  } else if (/update|status|progress|report/.test(lower)) {
    bodyLines.push(`I wanted to share a quick update on ${sentenceTopic}.`);
    bodyLines.push("");
    bodyLines.push(
      "Everything is currently progressing as planned. I will continue to keep you posted on any changes, and I am happy to share a more detailed breakdown if that would be useful.",
    );
  } else if (/schedule|book|arrange|meeting|call/.test(lower)) {
    bodyLines.push(`I would like to arrange a time to discuss ${sentenceTopic}.`);
    bodyLines.push("");
    bodyLines.push(
      "Please let me know which day and time suit you best, and I will send through a calendar invite with all the details.",
    );
  } else if (/thank/.test(lower)) {
    bodyLines.push(`I simply wanted to say thank you for ${sentenceTopic}.`);
    bodyLines.push("");
    bodyLines.push("It genuinely made a difference, and I appreciate the time and effort you put in.");
  } else {
    bodyLines.push(
      req.tone === "persuasive"
        ? `I am writing to you about ${sentenceTopic}, and I believe it is worth a few minutes of your attention.`
        : `I am writing to you regarding ${sentenceTopic}.`,
    );
    bodyLines.push("");
    bodyLines.push(
      "Please let me know if you need any additional information from my side, and I will get it to you as quickly as possible.",
    );
  }

  bodyLines.push("");
  bodyLines.push(
    req.tone === "formal"
      ? "Thank you for your time and consideration."
      : req.tone === "friendly"
        ? "Thanks again — really appreciate it!"
        : "Thank you for considering this.",
  );
  bodyLines.push("");
  bodyLines.push(TONE_CLOSER[req.tone]);
  bodyLines.push(sender);

  return { subject, body: bodyLines.join("\n") };
}

/* ---------------------------------- Research ---------------------------------- */

export interface ResearchResult {
  title: string;
  mode: "topic" | "document";
  summary: string;
  insights: string[];
  benefits: string[];
  risks: string[];
  recommendations: string[];
  takeaways: string[];
}

function splitSentences(text: string) {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 25);
}

export function generateResearch(input: string): ResearchResult {
  const text = clean(input);
  const isDocument = text.split(/\s+/).length > 60;
  const kw = keywords(text, 8);
  const topic = titleCase(kw.slice(0, 5).join(" ")) || "Your Research Topic";
  const sentences = splitSentences(text);

  if (isDocument) {
    const lead = sentences.slice(0, 3).join(" ");
    const mid = sentences.slice(3, 8);
    return {
      title: topic,
      mode: "document",
      summary:
        `Summary of the text you provided (no internet browsing was used — this analysis is based only on your pasted content). ` +
        lead,
      insights: (mid.length ? mid : sentences).slice(0, 5).map((s) => s),
      benefits: [
        `The material makes a clear case around ${kw[0] ?? "the core theme"}, which gives you a usable starting position.`,
        "Several points can be reused directly in a report, presentation or briefing note.",
        "The structure of the argument is easy to summarise for a non-technical audience.",
      ],
      risks: [
        "The text is a single source, so any claim inside it may be one-sided or outdated.",
        "Numbers, dates and named entities in the passage were not independently verified.",
        "Context outside the pasted content is missing and may change the conclusion.",
      ],
      recommendations: [
        "Cross-check the key claims against at least two independent, reputable sources.",
        `Pull out the strongest ${kw[1] ?? "supporting"} points and rewrite them in your own words for your audience.`,
        "Add current data or local context before presenting this material as fact.",
      ],
      takeaways: [
        `Central theme: ${kw.slice(0, 3).join(", ") || "the provided text"}.`,
        `${sentences.length} substantive statements were analysed from your input.`,
        "Treat this as a working summary, not a verified source.",
      ],
    };
  }

  const subject = titleCase(text.replace(/^(what|how|why|when|who|is|are|does|do|can)\s+/i, "").replace(/\?$/, "")) || topic;

  return {
    title: subject,
    mode: "topic",
    summary:
      `${subject} is best understood by looking at what it changes in practice, who it affects, and what it costs to adopt. ` +
      `In workplace settings, the topic usually plays out across three layers: the tools and technology involved, the processes and workflows around them, and the people who have to work differently as a result. ` +
      `Progress is typically fastest where the benefit is measurable and the change is small; it stalls where trust, skills or governance are missing. This overview is generated locally from your prompt and is a starting point for your own research, not a cited source.`,
    insights: [
      `Adoption of ${subject.toLowerCase()} is driven more by workflow fit than by raw capability.`,
      "Early value usually comes from removing repetitive, low-judgement work rather than replacing expert decisions.",
      "Teams that define clear review steps get better and more consistent outcomes than teams that adopt informally.",
      "Measurable time saved is the metric most decision-makers respond to.",
      "Resistance is often about job security and clarity of ownership, not about the technology itself.",
    ],
    benefits: [
      "Significant time savings on routine drafting, summarising and coordination tasks.",
      "More consistent quality and tone across a team's written output.",
      "Faster onboarding, because knowledge is captured and reused instead of re-explained.",
      "Lower cost per task, freeing budget and attention for higher-value work.",
    ],
    risks: [
      "Inaccurate or fabricated details that look confident but are wrong.",
      "Over-reliance that erodes skills and critical review over time.",
      "Privacy, confidentiality and compliance exposure when sensitive data is shared carelessly.",
      "Bias in outputs that quietly shapes decisions if nobody checks.",
      "Change fatigue if too many tools are introduced at once without training.",
    ],
    recommendations: [
      "Start with one narrow, high-volume use case and measure the time saved.",
      "Keep a human review step for anything that leaves the organisation or affects a person.",
      "Write a short, plain-language usage policy covering confidential data.",
      "Train the team on how to prompt, verify and edit rather than accept output as-is.",
      "Review results after 30 days and expand only where the benefit is proven.",
    ],
    takeaways: [
      `${subject} delivers the most value in narrow, repetitive workflows.`,
      "Human review is the difference between a productivity gain and a liability.",
      "Measure time saved and quality, not enthusiasm.",
      "Verify every important fact independently before acting on it.",
    ],
  };
}

export function researchToText(r: ResearchResult): string {
  const list = (items: string[]) => items.map((i) => `• ${i}`).join("\n");
  return [
    r.title,
    "",
    "SUMMARY",
    r.summary,
    "",
    "KEY INSIGHTS",
    list(r.insights),
    "",
    "BENEFITS / OPPORTUNITIES",
    list(r.benefits),
    "",
    "RISKS / CHALLENGES",
    list(r.risks),
    "",
    "RECOMMENDATIONS",
    list(r.recommendations),
    "",
    "KEY TAKEAWAYS",
    list(r.takeaways),
    "",
    "Note: AI-generated content may contain errors. Independently verify important information before relying on it.",
  ].join("\n");
}

/* ---------------------------------- Chat ---------------------------------- */

export function generateChatReply(message: string): string {
  const text = clean(message);
  const lower = text.toLowerCase();

  if (/write.*(email|mail)|draft.*(email|mail)|email to/.test(lower)) {
    const email = generateEmail({ prompt: text, tone: "formal" });
    return `Here is a complete email you can send right away:\n\nSubject: ${email.subject}\n\n${email.body}\n\nWant it friendlier or more persuasive? Just say the word — or open the Email Generator to edit it directly.`;
  }

  if (/rewrite|rephrase|more professional|professionally/.test(lower)) {
    const content = text.replace(/^.*?(rewrite|rephrase)[^:]*:?\s*/i, "").trim() || text;
    return [
      "Here is a more professional version:",
      "",
      `"${titleCase(content.replace(/\b(hey|hi guys|yo|gonna|wanna|asap!!)\b/gi, "").trim())}"`,
      "",
      "Rewritten fully:",
      "",
      `Thank you for your message. ${content.replace(/^\W+/, "").replace(/^./, (c) => c.toUpperCase())} I would appreciate your feedback at your earliest convenience.`,
      "",
      "Kind regards,",
      "[Your Name]",
    ].join("\n");
  }

  if (/research|summar|explain|impact of|what is|how does|why/.test(lower)) {
    const r = generateResearch(text);
    return [
      `Here is a structured briefing on ${r.title}:`,
      "",
      "Summary",
      r.summary,
      "",
      "Key insights",
      r.insights.slice(0, 4).map((i) => `• ${i}`).join("\n"),
      "",
      "Risks to watch",
      r.risks.slice(0, 3).map((i) => `• ${i}`).join("\n"),
      "",
      "Recommended next steps",
      r.recommendations.slice(0, 3).map((i) => `• ${i}`).join("\n"),
      "",
      "Please verify important facts independently.",
    ].join("\n");
  }

  if (/presentation|pitch|slide|talk|speech/.test(lower)) {
    return [
      "Here is a presentation plan you can use immediately:",
      "",
      "1. Opening (1 min) — State the single outcome your audience will get. One sentence, no throat-clearing.",
      "2. Context (2 min) — The problem today, with one number that makes it real.",
      "3. Insight (3 min) — What you found that they don't already know.",
      "4. Solution (4 min) — Three points maximum, each with a concrete example.",
      "5. Impact (2 min) — Time saved, cost avoided, risk reduced.",
      "6. Close (1 min) — The exact decision or action you want from them.",
      "",
      "Delivery tips:",
      "• Rehearse the first 30 seconds out loud until it is automatic.",
      "• One idea per slide, large text, no paragraphs.",
      "• Prepare answers to the three hardest questions in advance.",
      "• Pause after each key point instead of filling silence.",
    ].join("\n");
  }

  if (/meeting notes|minutes|agenda/.test(lower)) {
    return [
      "Here is a ready-to-use meeting structure:",
      "",
      "Agenda",
      "• Purpose and desired outcome (2 min)",
      "• Status review (10 min)",
      "• Decisions needed (15 min)",
      "• Risks and blockers (8 min)",
      "• Actions, owners and dates (5 min)",
      "",
      "Notes template",
      "Date / Attendees / Decisions made / Action items (owner + due date) / Follow-up date",
    ].join("\n");
  }

  if (/^(hi|hello|hey|good (morning|afternoon|evening))\b/.test(lower)) {
    return "Hello! Tell me the task directly and I'll do it — for example: \"Write an email to my boss reminding him about tomorrow's meeting\", \"Research the impact of AI in the workplace\", or \"Help me prepare for a presentation\".";
  }

  const kw = keywords(text, 5);
  return [
    `Here's how I'd approach "${text}":`,
    "",
    `1. Clarify the outcome — the goal here appears to be ${kw.slice(0, 3).join(", ") || "completing this task well"}.`,
    "2. Draft fast — get a complete first version down without editing; a full draft beats a perfect paragraph.",
    "3. Tighten — cut anything that doesn't move the reader toward the action you want.",
    "4. Confirm the ask — end with a specific request, owner and date.",
    "",
    "If you want, paste the content or the details and I'll produce the finished version for you.",
  ].join("\n");
}
