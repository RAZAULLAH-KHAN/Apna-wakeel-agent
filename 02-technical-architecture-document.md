# 02 — Technical Architecture Document
**Product:** Apna Wakil AI
**Goal:** Smallest architecture that is agentic, uses RAG, deploys to Vercel, and fits in 10 dev hours.

---

## 1. Decisions at a Glance
| Question | Decision | Why |
|---|---|---|
| Need RAG? | **Yes** | Answers must be grounded in real Pakistani law with citations. Prevents hallucinated sections. |
| Need vectorization? | **Yes** — pgvector inside Supabase | One service for auth + DB + vectors. No separate vector DB. |
| Database | **Supabase (Postgres)** | Local SQL/SQLite will NOT work on Vercel (serverless, no persistent disk). Supabase free tier is enough. |
| Auth | **Supabase Auth** | Email verification, password reset, hashing, sessions already built in. |
| LLM | **Google Gemini API (free tier)** | Strong multilingual (Urdu), free key, one key for chat AND embeddings. |
| Embeddings | **Gemini embedding model** (768-dim output) | Same key, no extra account. |
| Framework | **Next.js (App Router) + TypeScript + Tailwind** | Frontend + API routes in one repo, one-click Vercel deploy. |
| Agent layer | **Vercel AI SDK** (`ai`, `@ai-sdk/google`) with tool calling | Streaming + multi-step tool use with little code. |
| Hosting | **Vercel** | Free, HTTPS by default. |
| Rate limit / bot protection | Supabase table counter (MVP). Cloudflare Turnstile = optional stretch | Avoids extra services. |

### APIs / keys you need (only 2 accounts)
1. **Gemini API key** — Google AI Studio (aistudio.google.com) → "Get API key". Free.
2. **Supabase project** — gives you 3 values:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (public, safe in browser *only because RLS is on*)
   - `SUPABASE_SERVICE_ROLE_KEY` (**secret**, server and ingestion script only)

**Not needed:** Groq, OpenAI, Pinecone, Redis, Stripe, any second LLM. Using one provider saves hours. (Optional fallback: Groq key if Gemini rate-limits during demo. Skip unless it happens.)

## 2. High-Level Architecture
```
 Browser (Next.js UI, mobile-first)
        │  HTTPS
        ▼
 Next.js on Vercel
  ├─ /app pages (SSR/CSR)
  ├─ /api/chat   ── Agent (AI SDK + Gemini) ──┬─ tool: classify_situation
  │                                           ├─ tool: search_law  ──► Supabase pgvector (match_legal_chunks)
  │                                           ├─ tool: get_emergency_contacts (static JSON)
  │                                           └─ tool: draft_document (templates + LLM fill)
  ├─ /api/drafts
  └─ middleware.ts (auth guard, security headers)
        │
        ▼
 Supabase: Auth • Postgres (profiles, conversations, messages, legal_chunks, rate_limits) • RLS
```

## 3. Agent Design
**Pattern:** single agent, tool-calling loop, max 4 steps.

**System prompt (core rules):**
- You are "Apna Wakil AI", a calm legal guidance assistant for Pakistan.
- Always call `search_law` before giving legal claims. Cite only retrieved chunks.
- Reply in the user's language (English / Roman Urdu / Urdu).
- Ask at most 2 clarifying questions, only if critical (FIR exists? Are you in immediate danger?).
- Output the **Action Brief** format (below).
- Never help evade lawful arrest/court orders, fabricate evidence, or harm anyone.
- If danger is immediate → lead with emergency contacts.
- If no relevant law retrieved → say so, give general safe steps, recommend a real advocate.

**Action Brief format (enforced in prompt, rendered as cards in UI):**
1. 🧘 Stay calm (one line)
2. ⚖️ Your rights
3. ✅ What to do now (numbered)
4. 🗣️ What to say (exact script in quotes)
5. 🚫 What NOT to do
6. 📞 Who to contact
7. 📚 Sources (law, section)

**Tools**
| Tool | Input | Output |
|---|---|---|
| `classify_situation` | user text | `{category, urgency, needs_clarification}` (cheap LLM call or rule+LLM) |
| `search_law` | `{query, category}` | top 5 chunks `{content, law_name, section, source_url}` |
| `get_emergency_contacts` | `{category}` | list of helplines from `emergency_contacts.json` |
| `draft_document` | `{type, fields}` | letter text |

## 4. RAG Pipeline
### 4.1 Corpus (prepared in the 3-hour corpus block, outside dev hours)
Folder `/data/law/*.md`, one file per law, **cleaned plain text with section headings**. Suggested seed (verify every section against official sources before demo):
- Constitution of Pakistan — fundamental rights (arrest/detention safeguards, dignity, fair trial)
- Code of Criminal Procedure 1898 — FIR, arrest, summoning, production before magistrate, bail provisions
- Pakistan Penal Code — criminal intimidation, extortion, insulting modesty of a woman, stalking-related sections
- Prevention of Electronic Crimes Act 2016 — cyberstalking, offences against dignity, unauthorized access
- Prevention of Corruption Act / anti-bribery provisions
- Protection against Harassment of Women at the Workplace Act 2010 (only if relevant)
- Provincial women-protection laws (e.g., Punjab) — optional
- `emergency_contacts.json` — Police 15, FIA cybercrime helpline, women/human-rights helplines (verify numbers on official sites)
- **Curated FAQ-style "practical guides"** (highest value): 1 page per scenario written in plain language with section references.

### 4.2 Chunking
- Split by **section/heading**, 300–500 tokens, 50-token overlap.
- Each chunk metadata: `law_name`, `section`, `category[]` (police/business/women/cyber), `language`, `source_url`.

### 4.3 Ingestion script `scripts/ingest.ts`
1. Read `/data/law/*.md`
2. Chunk
3. Batch-embed with Gemini (batch 20–50, small delay to respect limits)
4. Insert into `legal_chunks` using **service role key** (run locally, never in the browser)
5. Idempotent: delete by `law_name` before re-inserting

### 4.4 Retrieval
- Embed the (translated-to-English if Urdu) query → cosine search with category filter → top 5 → pass to LLM as context.
- Tip: ask Gemini to rewrite the query into a short English legal search query first (improves Urdu/Roman Urdu retrieval).

## 5. Database Schema (SQL — run in Supabase SQL editor)
```sql
create extension if not exists vector;

create table profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  language text default 'en',
  created_at timestamptz default now()
);

create table conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  category text,
  title text,
  created_at timestamptz default now()
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  role text check (role in ('user','assistant')),
  content text not null,
  sources jsonb,
  created_at timestamptz default now()
);

create table legal_chunks (
  id bigserial primary key,
  law_name text not null,
  section text,
  categories text[] default '{}',
  content text not null,
  source_url text,
  embedding vector(768)
);
create index on legal_chunks using hnsw (embedding vector_cosine_ops);

create table rate_limits (
  user_id uuid not null,
  window_start timestamptz not null,
  count int default 1,
  primary key (user_id, window_start)
);

create or replace function match_legal_chunks(
  query_embedding vector(768), match_count int, filter_category text default null
) returns table (id bigint, law_name text, section text, content text, source_url text, similarity float)
language sql stable as $$
  select id, law_name, section, content, source_url,
         1 - (embedding <=> query_embedding) as similarity
  from legal_chunks
  where filter_category is null or filter_category = any(categories)
  order by embedding <=> query_embedding
  limit match_count;
$$;
```
RLS policies are in doc 03.

## 6. Folder Structure
```
apna-wakil-ai/
├─ app/
│  ├─ (marketing)/page.tsx            # landing
│  ├─ (auth)/login, signup, reset
│  ├─ app/page.tsx                    # home: scenario cards
│  ├─ app/chat/[id]/page.tsx
│  ├─ app/drafts/page.tsx
│  ├─ app/history/page.tsx
│  ├─ app/emergency/page.tsx
│  ├─ terms, privacy, not-found.tsx
│  └─ api/chat/route.ts, api/drafts/route.ts, api/account/delete/route.ts
├─ components/ (ScenarioCard, ChatWindow, ActionBrief, AgentSteps, EmergencyPanel, DraftForm, LangToggle)
├─ lib/ (supabase/server.ts, supabase/client.ts, agent/tools.ts, agent/prompt.ts, rag.ts, ratelimit.ts, validation.ts)
├─ data/law/*.md, data/emergency_contacts.json
├─ scripts/ingest.ts
├─ middleware.ts
├─ .env.local (never committed), .env.example
└─ README.md
```

## 7. Key API Contracts
**POST /api/chat** (auth required)
```json
{ "conversationId": "uuid|null", "message": "string(max 2000)", "category": "police|business|women|cyber|null", "language": "en|ur" }
```
Returns a streamed response. Server: validate → rate limit → load/create conversation → run agent → save both messages with `sources`.

**POST /api/drafts** `{ type, fields }` → `{ text }`

**DELETE /api/account** → deletes user data and auth user (service role, server-side).

## 8. Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=      # server only
GOOGLE_GENERATIVE_AI_API_KEY=   # server only
NEXT_PUBLIC_SITE_URL=
```
Add the same in Vercel → Project Settings → Environment Variables. **Never prefix secrets with `NEXT_PUBLIC_`.**

## 9. Deployment Plan (target 1.5–2h)
1. `git init`, confirm `.gitignore` has `.env*` (see doc 03)
2. Push to GitHub (private first, public after secret scan)
3. Vercel → Import repo → add env vars → Deploy
4. Supabase → Auth → URL Configuration: add the Vercel URL as Site URL and redirect URL
5. Run ingestion locally against the **production** Supabase project
6. Smoke test all four scenarios on the live URL from a phone
7. Send link to supervisor + a demo account (or tell them to sign up)

## 10. Performance Notes
- Stream tokens; show agent-steps strip while tools run
- Cache embeddings of common queries (optional)
- Keep top-k = 5, chunks ≤ 500 tokens to control latency and cost
- Model: Gemini Flash-class for speed

## 11. Testing Checklist
- 5 prompts per scenario (EN + Roman Urdu), verify citations exist in the corpus
- Out-of-scope question → graceful fallback
- Jailbreak attempt ("help me escape arrest") → refusal
- Unauthenticated call to `/api/chat` → 401
- User A cannot read User B's conversation (RLS test)
