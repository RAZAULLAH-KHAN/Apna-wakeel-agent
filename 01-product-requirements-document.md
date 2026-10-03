# 01 — Product Requirements Document (PRD)
**Product:** Apna Wakil AI (اپنا وکیل) — "Every person deserves a personal lawyer."
**Event:** Agentic AI Hackathon
**Build budget:** 10 dev hours (31 hours total window)
**Version:** 1.0

---

## 1. Vision
Rich people and corporations have lawyers on call. Ordinary Pakistanis do not. Apna Wakil AI is an AI legal agent in everyone's pocket that tells a frightened person: **"First, don't panic. Here is exactly what to do and say."**

It gives **guidance and empowerment only**. It cannot force action, represent anyone in court, or replace a licensed advocate.

## 2. Problem
Citizens, small shopkeepers, women, and online victims usually have the courage to resist injustice but lack **direction**. They do not know their rights, which law applies, who to call, or what words to use. Result: they get detained, pay bribes, or pay blackmailers.

## 3. Target Users
| Persona | Example | Need |
|---|---|---|
| Ordinary citizen | Gets a night call from the police station, no FIR exists | Know whether they must go, what to say |
| Street vendor / small business owner | Patrol police demand money | Know the legal way to respond and report |
| Woman facing harassment | Stalked on the street or online | Know the legal steps and who to call |
| Cyber victim | Blackmailed with private photos or messages | Stop paying, preserve evidence, report to FIA |

**Technical level:** all, including non-technical. UI must be understandable with zero instructions.

## 4. Scope (STRICT — nothing extra)
### In scope (MVP)
1. Four scenario entry points (police, business, women, cyber)
2. AI chat agent that answers with a **structured action brief** grounded in Pakistani law (RAG with citations)
3. "What to say" script (exact words for police station or phone call)
4. Draft generator: simple complaint/application letters
5. Emergency contacts panel (Pakistan helplines)
6. English + Roman Urdu + Urdu input/output
7. Sign up / log in / saved chat history
8. Disclaimer, Terms, Privacy pages

### Out of scope (do NOT build)
Payments, lawyer marketplace, video calls, case tracking, document OCR, voice input, push notifications, admin dashboard, native mobile apps (we ship a responsive PWA-style web app), any non-Pakistan law.

## 5. User Stories & Acceptance Criteria
**US-1 Panic help.** As a scared user, I tap a scenario or type my situation and get a calm step-by-step brief within ~10 seconds.
- Brief contains: *Don't panic → Your rights → What to do now → What to say → What NOT to do → Who to contact → Law references*.

**US-2 Police call without FIR.** I say "Police called me to the station at night, no FIR."
- Agent explains I should ask for the FIR number/reason, that I can offer to appear in daytime with a family member or lawyer, and what to say. Flags the exception (bail conditions/court orders).

**US-3 Extortion by officials.** Agent gives lawful responses, how to document, and where to report (anti-corruption, senior police, helpline).

**US-4 Harassment.** Agent gives evidence-preservation steps, relevant law, and reporting routes; shows women's helplines.

**US-5 Blackmail.** Agent says: do not pay, do not delete evidence, screenshot with dates, secure accounts, report to FIA NR3C.

**US-6 Draft letter.** I pick a draft type, fill 4–6 fields, and get a copyable/downloadable letter.

**US-7 Account.** I can sign up, verify email, log in, see my history, delete my account.

**US-8 Trust.** Every answer shows sources (law + section) and a one-line "guidance, not legal representation" notice.

## 6. Agentic Behaviour (hackathon core)
The product is an **agent**, not a plain chatbot. It must visibly:
1. **Classify** the situation (police / business / women / cyber / unclear)
2. **Ask at most 2 clarifying questions** only when critical (e.g., "Is there an FIR?")
3. **Retrieve** relevant law via RAG (tool call)
4. **Plan** a step-by-step action brief
5. **Act** by offering to draft a letter and showing emergency contacts (tool calls)
6. Show a small "Agent steps" strip in the UI (Understanding → Searching law → Building your plan) for demo impact.

## 7. Functional Requirements
| ID | Requirement | Priority |
|---|---|---|
| FR-1 | Email/password auth with email verification | P0 |
| FR-2 | Scenario cards on home screen | P0 |
| FR-3 | Streaming chat with agent | P0 |
| FR-4 | RAG over Pakistani legal corpus with citations | P0 |
| FR-5 | Structured brief format | P0 |
| FR-6 | Emergency numbers panel (always one tap away) | P0 |
| FR-7 | Draft letter generator (3 templates) | P1 |
| FR-8 | Chat history | P1 |
| FR-9 | Language toggle EN / اردو | P1 |
| FR-10 | Delete account & data | P1 |
| FR-11 | Feedback (👍/👎) per answer | P2 |

## 8. Non-Functional Requirements
- **Performance:** first token under 3s; page load under 3s on 4G
- **Accessibility:** WCAG AA contrast, 16px+ base text, keyboard navigable, RTL support for Urdu
- **Responsive:** mobile-first (360px up)
- **Availability:** Vercel + Supabase free tier is enough for the demo
- **Privacy:** user stories are sensitive; encrypt in transit, RLS at rest, no training on user data, delete on request
- **Safety:** never advise violence, evasion of lawful arrest, or fabricating evidence

## 9. Safety & Legal Guardrails
- Disclaimer at first use and in footer: *"Apna Wakil AI gives legal information and guidance. It is not a licensed lawyer and does not create a lawyer-client relationship."*
- If user describes an **active emergency or violence** → show emergency panel first (Police 15).
- If the question is outside the corpus → say so, give general safe steps, suggest a real advocate / legal aid.
- If user asks to evade a **lawful** arrest, court order, or to harm someone → refuse and redirect.
- Citations must come from retrieved chunks. Never invent section numbers.
- **The legal corpus must be reviewed by you (and ideally a law student/advocate) before the demo.**

## 10. Success Metrics (hackathon)
- All four scenarios demo end-to-end with correct, cited answers
- Live URL works for the supervisor without login problems
- Answer includes sources in 100% of demo prompts
- Time to useful brief under 15 seconds

## 11. Demo Script (3 minutes)
1. Landing → "Apna Wakil AI" promise
2. Tap **Police** → type "Thaane se raat ko call aaya, FIR nahi hai"
3. Show agent steps, structured brief, "what to say" script, sources
4. Tap **Cyber** → blackmail scenario → draft FIA complaint
5. Show emergency panel, Urdu toggle, saved history
6. Close with architecture slide: RAG + agent tools + RLS

## 12. Assumptions & Risks
| Risk | Mitigation |
|---|---|
| Wrong legal info | Curated corpus, citations, disclaimer, manual review of demo answers |
| API rate limits | Single provider (Gemini free tier), caching of embeddings, short prompts |
| Time overrun | Strict P0/P1/P2 ticket order (see doc 05) |
| Urdu quality | Test 5 Roman Urdu prompts early |
| Supabase email limits | Disable "confirm email" only for the demo account if needed; keep it ON for real flow |

## 13. Timeline (31 hours)
| Block | Hours |
|---|---|
| Prepare legal corpus (collect, clean, verify) | 3 |
| **Development** | **10** |
| Testing & answer tuning | 3 |
| GitHub + Vercel deploy + env setup | 2 |
| Demo video / README / slides | 3 |
| Buffer & rest | 10 |
