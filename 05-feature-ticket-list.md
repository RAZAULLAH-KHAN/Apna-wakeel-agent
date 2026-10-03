# 05 — Feature Ticket List
**Product:** Apna Wakil AI
**Dev budget:** 10 hours (P0 + P1). P2 and later only if time is left.
**Rule:** Work top to bottom. Do not start a ticket before the one above it is done. If a ticket runs over by 50%, cut scope, don't skip ahead.

Legal corpus preparation (3h) happens **before/outside** these 10 hours. Have `/data/law/*.md` ready before T05.

---

## Time Summary
| Priority | Tickets | Hours |
|---|---|---|
| P0 | T01–T10 | 8.0 |
| P1 | T11–T14 | 2.0 |
| **Total dev** | | **10.0** |
| P2 / stretch | T15–T18 | only if spare |

---

## P0 — Must Have

### T01 — Project setup (0.5h)
- `npx create-next-app@latest` (TypeScript, Tailwind, App Router)
- Install: `@supabase/supabase-js @supabase/ssr ai @ai-sdk/google zod react-markdown lucide-react`
- Add `.gitignore` entries for `.env*` **first**; create `.env.example`
- Tailwind colors from doc 04; fonts via `next/font`
- `git init` + first commit (after secret check)
**Done when:** `npm run dev` shows a styled home page; `.env.local` not tracked.

### T02 — Supabase project, schema, RLS (0.75h)
- Create Supabase project; copy URL + anon + service role keys
- Run schema SQL (doc 02 §5) and RLS SQL (doc 03 §2)
- Auth settings: enable email confirm; set Site URL (localhost for now)
**Done when:** tables show RLS lock; `match_legal_chunks` exists; signup creates a `profiles` row.

### T03 — Auth: signup, login, verify, reset, logout (0.75h)
- `lib/supabase/server.ts` + `client.ts` using `@supabase/ssr`
- Pages `/signup`, `/login`, `/reset`; "check your email" screen
- `middleware.ts` redirects unauthenticated users from `/app/*`
- Error messages in plain language
**Done when:** new user can sign up, verify, log in, log out, reset password; `/app` blocked when logged out.

### T04 — Corpus ingestion script (1.0h)
- `scripts/ingest.ts`: read md files → chunk by section (300–500 tokens, overlap 50) → batch embed (Gemini) → insert into `legal_chunks` with `law_name`, `section`, `categories`
- Idempotent (delete by `law_name` first); small delay between batches
- Run: `npx tsx scripts/ingest.ts`
**Done when:** `select count(*) from legal_chunks` > 150 and each category has chunks.

### T05 — Retrieval function `lib/rag.ts` (0.5h)
- `searchLaw(query, category)`: optional English query rewrite → embed → `rpc('match_legal_chunks')` → top 5
- Return only `content, law_name, section, source_url, similarity`; drop results below a similarity threshold
**Done when:** test script returns sensible chunks for "arrest without FIR", "blackmail photos", "bribe from police".

### T06 — Agent: prompt, tools, `/api/chat` (1.5h)
- `lib/agent/prompt.ts` (rules + Action Brief format, doc 02 §3)
- `lib/agent/tools.ts`: `classify_situation`, `search_law`, `get_emergency_contacts`
- `/api/chat`: zod validate → `getUser()` (401) → rate limit → create/load conversation → `streamText` with tools, `maxSteps: 4` → save user + assistant messages with `sources`
- Refusal behaviour for evading lawful arrest / fabricating evidence
**Done when:** 4 scenario prompts produce full 7-section briefs with real citations; unauthenticated call returns 401.

### T07 — Chat UI + ActionBrief + AgentSteps (1.5h)
- `ChatWindow`, `MessageBubble`, streaming display, sticky input, char counter
- `AgentSteps` strip while tools run
- `ActionBrief` splits markdown by `##` headings into colored cards; ScriptBox with Copy; tap-to-call links; collapsible SourceChips
- Fallback to raw Markdown if parse fails
**Done when:** answer looks like doc 04 §5.3 on a 360px phone.

### T08 — Home screen with 4 scenario cards (0.5h)
- 2×2 big cards + free text box; each card starts a conversation with category and 3 example prompts
- Quick links: Draft, History, Emergency
**Done when:** every scenario is reachable in ≤ 2 taps and opens chat with the right category.

### T09 — Emergency page + header button (0.25h)
- `data/emergency_contacts.json` (verify numbers on official sites); public `/emergency`; red header button on all pages
**Done when:** works logged out; `tel:` links work on a phone.

### T10 — Landing page + Terms + Privacy + disclaimer (0.75h)
- Landing per doc 04 §5.1; Terms and Privacy using commitments in doc 03 §7; disclaimer in footer and first chat
**Done when:** no placeholder text; legal pages linked from footer and signup.

---

## P1 — Should Have

### T11 — Draft generator (0.75h)
- `/app/drafts`: 3 templates, short form, `/api/drafts` (zod + auth + rate limit), editable result, Copy, Download .txt, review banner
**Done when:** each template yields a usable letter from 5 fields.

### T12 — History + delete conversation (0.5h)
- `/app/history` list, open, delete with confirm; empty state
**Done when:** user sees only own chats (verify with a second account).

### T13 — Language toggle EN / اردو + RTL (0.5h)
- Tiny `t()` dictionary for UI strings; toggle sets `dir` and font; agent replies in user's language; save preference in `profiles.language`
**Done when:** UI flips to RTL; 5 Roman Urdu prompts give correct Urdu/Roman Urdu answers.

### T14 — Security pass + states + SEO basics (0.25h core, finish in testing block if needed)
- Security headers in `next.config.js` (doc 03 §3)
- Loading / empty / error / offline / 429 states
- Custom 404, favicon, page titles, meta descriptions, `robots.txt`, `sitemap.xml`, OG image
**Done when:** doc 03 §9 checklist items marked; no console errors.

> Note: T14 is deliberately lean. States and headers are part of every earlier ticket; this ticket just verifies they exist.

---

## P2 — Stretch (only if time remains)
| ID | Ticket | Est. |
|---|---|---|
| T15 | Account deletion endpoint + settings page (required before public release; do in post-deploy block if skipped) | 0.5h |
| T16 | 👍/👎 feedback stored per message | 0.25h |
| T17 | Cloudflare Turnstile on signup | 0.5h |
| T18 | Offline caching of `/emergency` (service worker) | 0.5h |

---

## Suggested Hour-by-Hour Plan
| Hour | Work |
|---|---|
| 0–0.5 | T01 |
| 0.5–1.25 | T02 |
| 1.25–2 | T03 |
| 2–3 | T04 |
| 3–3.5 | T05 |
| 3.5–5 | T06 |
| 5–6.5 | T07 |
| 6.5–7 | T08 |
| 7–7.25 | T09 |
| 7.25–8 | T10 |
| 8–8.75 | T11 |
| 8.75–9.25 | T12 |
| 9.25–9.75 | T13 |
| 9.75–10 | T14 |

## After Development (outside the 10 hours)
| Step | Time |
|---|---|
| Security checklist (doc 03 §9) + `npm audit` | 0.5h |
| Push to GitHub | 0.25h |
| Vercel deploy + env vars + Supabase redirect URL | 0.75h |
| Run ingestion on production DB | 0.25h |
| Live smoke test on phone (all 4 scenarios, Urdu, emergency) | 0.5h |
| Answer tuning + corpus fixes | 2h |
| Demo video / README / slides | 3h |

## Global Definition of Done
- [ ] All P0 + P1 tickets meet their "Done when"
- [ ] Live Vercel URL works from a phone, signup to answer
- [ ] Every demo answer shows sources that exist in the corpus
- [ ] RLS verified with two accounts
- [ ] No secrets in repo or git history
- [ ] README has: what it is, architecture picture, setup steps, env var names, demo credentials
- [ ] Disclaimer, Terms, Privacy visible
- [ ] Legal corpus and emergency numbers reviewed by a human

## If You Fall Behind (cut order)
1. T13 Urdu toggle (keep agent multilingual replies, drop UI translation)
2. T12 History
3. T11 Drafts (keep one template)
4. Agent steps animation (keep text)
Never cut: auth, RAG with citations, disclaimer, RLS, emergency page.
