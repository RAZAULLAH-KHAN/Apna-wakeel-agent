# 03 — Security & Access Document
**Product:** Apna Wakil AI
Users will share frightening, private situations. Security is a trust feature, not a bonus.

Legend: 🟢 = must do in the 10 dev hours (P0) • 🟡 = do if time allows / quick win • ⚪ = post-hackathon

---

## 1. Your Security Checklist, Mapped to This App

### Left column
| # | Item | Status | How to implement here |
|---|---|---|---|
| 1 | Hide API keys | 🟢 | Keys only in `.env.local` and Vercel env vars. Gemini + service-role keys used only in `/api/*` routes and `scripts/`. Never `NEXT_PUBLIC_` for secrets. |
| 2 | Purge Git secrets | 🟢 | Add `.env*` to `.gitignore` **before first commit**. Before pushing: `git log -p \| grep -i "key\|secret"` or run `npx gitleaks detect`. If a key ever leaked: **rotate it**, don't just delete the file. |
| 3 | Use public DB key | 🟢 | Browser uses only the Supabase **anon** key. Service role key stays server-side. |
| 4 | Enable row-level security | 🟢 | RLS on every table (SQL below). |
| 5 | Encrypt sensitive data | 🟡 | In transit: HTTPS (Vercel + Supabase). At rest: Supabase encrypts disks. Extra: don't store anything beyond chat text; optionally avoid storing user phone/address. App-level encryption of message content = ⚪. |
| 6 | Enforce server-side auth | 🟢 | In every API route call `supabase.auth.getUser()` (server client) and return 401 if null. `middleware.ts` guards `/app/*`. Never trust a `userId` sent from the client. |
| 7 | Lock record access | 🟢 | RLS: `user_id = auth.uid()`; queries also filter by user. |
| 8 | Block field tampering | 🟢 | Server sets `user_id`, `role`, `created_at`. Ignore those fields from request bodies. Validate with zod and only whitelist expected keys. |
| 9 | Secure session cookies | 🟢 | Use `@supabase/ssr` (httpOnly, Secure, SameSite=Lax cookies). Don't store tokens in localStorage. |
| 10 | Hash passwords | 🟢 | Handled by Supabase Auth (bcrypt). Never store passwords yourself. |

### Right column
| # | Item | Status | How to implement here |
|---|---|---|---|
| 11 | Rate limit login | 🟡 | Supabase Auth has built-in rate limits (configure in dashboard). Add UI lockout message after repeated failures. |
| 12 | Add bot protection | 🟡 | Cloudflare Turnstile on signup (free, ~30 min). Skip if short on time; rely on email verification. |
| 13 | Parameterize queries | 🟢 | Use Supabase client / `.rpc()` only. **No string-built SQL.** |
| 14 | Validate all input | 🟢 | zod schemas on every API route: message ≤ 2000 chars, enum for category/language/draft type. |
| 15 | Escape user content | 🟢 | Render with React (auto-escaped). **Never** use `dangerouslySetInnerHTML` for chat. If rendering Markdown, use `react-markdown` without raw HTML. |
| 16 | Restrict file uploads | 🟢 | **MVP has no uploads.** Keep it that way (reduces risk). |
| 17 | Trim API responses | 🟢 | Select only needed columns. Never return `embedding` vectors or other users' data. |
| 18 | Add security headers | 🟢 | `next.config.js` headers (below). |
| 19 | Force HTTPS | 🟢 | Vercel does it automatically; add HSTS header. |
| 20 | Scan dependencies | 🟡 | `npm audit` before deploy; enable GitHub Dependabot (1 click). |

## 2. Row-Level Security SQL
```sql
alter table profiles enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;
alter table legal_chunks enable row level security;
alter table rate_limits enable row level security;

-- profiles
create policy "own profile read"   on profiles for select using (id = auth.uid());
create policy "own profile update" on profiles for update using (id = auth.uid());

-- conversations
create policy "own convos read"   on conversations for select using (user_id = auth.uid());
create policy "own convos insert" on conversations for insert with check (user_id = auth.uid());
create policy "own convos delete" on conversations for delete using (user_id = auth.uid());

-- messages
create policy "own msgs read"   on messages for select using (user_id = auth.uid());
create policy "own msgs insert" on messages for insert with check (user_id = auth.uid());

-- legal_chunks: readable by logged-in users only, no writes from clients
create policy "auth read law" on legal_chunks for select using (auth.role() = 'authenticated');

-- rate_limits: no client policies at all (service role only)

-- auto-create profile
create or replace function handle_new_user() returns trigger as $$
begin
  insert into profiles (id) values (new.id);
  return new;
end; $$ language plpgsql security definer;
create trigger on_auth_user_created after insert on auth.users
for each row execute function handle_new_user();
```
Note: `match_legal_chunks` is called from the server; keep it `security invoker` (default) so RLS applies.

## 3. Security Headers (`next.config.js`)
```js
const headers = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Content-Security-Policy', value:
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://*.supabase.co; frame-ancestors 'none';" }
];
module.exports = { async headers() { return [{ source: '/(.*)', headers }]; } };
```
If CSP breaks the dev build, relax `script-src` for dev only. Add `https://challenges.cloudflare.com` if you add Turnstile.

## 4. Access Model
| Role | Can do |
|---|---|
| Anonymous | View landing, Terms, Privacy, Emergency numbers page (public, safety-critical) |
| Authenticated user | Chat, drafts, own history, delete own account |
| Service (server only) | Ingest corpus, delete user data, rate-limit writes |

No admin role in MVP.

## 5. App-Specific Threats
| Threat | Mitigation |
|---|---|
| **Prompt injection** (user or retrieved text tries to override rules) | System prompt fixed server-side; treat retrieved chunks as data; never execute tool args without zod validation; refuse jailbreaks |
| **Harmful requests** (evade lawful arrest, harm, fake evidence) | Prompt rules + refusal template; log refusal flag |
| **Hallucinated law** | RAG-only citations; show "not found in our law database" fallback |
| **Data leak between users** | RLS + server-side `user_id` |
| **Abuse of free LLM quota** | Per-user rate limit: e.g., 20 messages / hour via `rate_limits` table; global kill switch env var |
| **Sensitive data in logs** | Don't `console.log` message content in production |
| **Clickjacking / XSS** | X-Frame-Options, CSP, React escaping |

## 6. Rate Limit (simple)
In `/api/chat`: upsert into `rate_limits` for `(user_id, date_trunc('hour', now()))`, increment; if `count > 20` return 429 with a friendly message ("Please wait a few minutes").

## 7. Privacy Commitments (write these in the Privacy page)
- What we collect: email, chat messages, language preference
- Why: to give guidance and show your history
- Not sold, not used to train models, not shared except with service providers (Google Gemini API, Supabase, Vercel)
- Delete anytime: Settings → Delete account removes all data
- Not a lawyer-client relationship; no confidentiality privilege applies to AI chats
- Warn users: don't enter CNIC numbers, passwords, or full addresses

## 8. Account Deletion Flow
`DELETE /api/account` → verify session → delete user via service-role admin API → cascades remove profiles/conversations/messages (FK `on delete cascade`) → clear cookies → redirect to goodbye page.

## 9. Pre-Deploy Security Checklist (run before GitHub push)
- [ ] `.env*` in `.gitignore`; `.env.example` contains only empty names
- [ ] `git grep -i "AIza"` and `git grep -i "service_role"` return nothing
- [ ] `npx gitleaks detect` clean
- [ ] RLS enabled on all tables (Supabase → Table editor shows lock icon)
- [ ] Test: log in as user A, try to fetch user B's conversation id → empty/403
- [ ] `/api/chat` without cookie → 401
- [ ] `npm audit` reviewed
- [ ] Headers visible in browser DevTools → Network
- [ ] Production source maps off (`productionBrowserSourceMaps: false`, default)
- [ ] Gemini key restricted in Google Cloud console if possible; rotate after hackathon
