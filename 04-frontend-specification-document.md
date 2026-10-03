# 04 — Frontend Specification Document
**Product:** Apna Wakil AI
**Design goal:** A scared, non-technical person should know what to tap within 3 seconds. Calm, trustworthy, warm.

---

## 1. Design Principles
1. **One obvious action per screen.** Big cards, big buttons.
2. **Calm first.** Colors and wording reduce panic ("First, don't panic.").
3. **Plain language.** No legal jargon without a one-line explanation.
4. **Emergency always reachable.** A red "Emergency" button in the header on every screen.
5. **Mobile first.** Design at 360px, then scale up.
6. **Bilingual.** English + Urdu with RTL support.

## 2. Visual Identity
### Colors
| Token | Hex | Use |
|---|---|---|
| `navy-900` | `#0F2A4A` | Primary: header, headings, trust |
| `teal-600` | `#0E9F8E` | Primary actions, links, active states |
| `amber-400` | `#F5A524` | Highlight, "what to say" callouts |
| `red-600` | `#DC2626` | Emergency only |
| `bg` | `#F7F9FC` | Page background |
| `card` | `#FFFFFF` | Cards |
| `text` | `#1F2937` | Body text |
| `muted` | `#6B7280` | Secondary text |
| `success` | `#16A34A` | Confirmations |

Contrast: body text on white ≥ 7:1; white text on teal-600 button ≥ 4.5:1 (verify with a checker).

### Typography
- English: **Inter** (Google Fonts via `next/font`)
- Urdu: **Noto Nastaliq Urdu** (headings can use Noto Naskh Arabic for readability; Nastaliq needs larger line-height ~2)
- Base 16–18px, line-height 1.6, headings 24/28/36px
- Buttons: min height 48px, radius 12px

### Style
Rounded cards (16px), soft shadow, generous spacing, simple line icons (lucide-react). Scale-balance logo mark + wordmark "Apna Wakil AI".

## 3. Tech Stack (frontend)
Next.js App Router • TypeScript • Tailwind CSS • lucide-react • react-markdown (no raw HTML) • zod • next-intl **or** a tiny custom `t()` dictionary (faster; recommended: custom dictionary with `en.json` / `ur.json`).

Tailwind config extends colors above and sets `dir` on `<html>` from language.

## 4. Site Map & Routes
| Route | Auth | Purpose |
|---|---|---|
| `/` | public | Landing |
| `/login`, `/signup`, `/reset` | public | Auth |
| `/app` | auth | Home: scenario cards + quick input |
| `/app/chat/[id]` | auth | Chat with agent |
| `/app/drafts` | auth | Draft generator |
| `/app/history` | auth | Past conversations |
| `/app/settings` | auth | Language, delete account |
| `/emergency` | public | Helplines |
| `/terms`, `/privacy` | public | Legal pages |
| `*` | public | Custom 404 |

## 5. Screen Specs

### 5.1 Landing `/`
- Header: logo • language toggle • Emergency (red) • Log in
- Hero H1: **"Your personal lawyer, in your pocket."** Sub: "Know your rights. Know what to say. Know what to do next." CTA: **Get started free** (teal)
- Section "When do you need Apna Wakil?" → 4 cards (Police • Business • Women • Online blackmail) with icon + one-line example
- Section "How it works" 3 steps: Tell us what happened → Get your plan → Take action
- Trust strip: "Based on Pakistani law • Shows sources • Private to you"
- Footer: disclaimer, Terms, Privacy, Emergency

### 5.2 Home `/app`
- Greeting: "Assalam-o-Alaikum 👋 What's happening?"
- **Four large scenario cards** (2×2 on mobile):
  - 🚔 Police problem
  - 🏪 Business / bribe demand
  - 👩 Harassment / stalking
  - 📱 Blackmail / cyberbullying
- Below: text box "Or describe your situation…" + Send
- Secondary row: ✍️ Draft a letter • 🕘 History • 📞 Emergency
- Tapping a card opens chat with a **guided starter**: 3 tappable example prompts (e.g., "Police called me, no FIR") + free text.

### 5.3 Chat `/app/chat/[id]`
Layout: header (back, category chip, language) → message list → input bar (sticky bottom).
- **User bubble:** right-aligned, teal.
- **Agent steps strip** (while loading): `Understanding → Searching law → Building your plan` with animated check marks.
- **Assistant answer = ActionBrief component** rendered as stacked cards:
  1. 🧘 Stay calm (soft blue)
  2. ⚖️ Your rights
  3. ✅ What to do now (numbered list)
  4. 🗣️ What to say (**amber** quote box with Copy button)
  5. 🚫 What NOT to do (soft red)
  6. 📞 Who to contact (tap-to-call links `tel:`)
  7. 📚 Sources (collapsible chips: "CrPC §…", tap to expand excerpt)
- Footer line under each answer: "Guidance, not legal representation."
- Action buttons after answer: **Draft a letter** • **Show emergency numbers** • 👍 / 👎
- Input: multiline, max 2000 chars with counter near limit, Send button disabled while empty/streaming.
- Clarifying question appears as a normal message with 2–3 quick-reply chips (Yes / No / Not sure).

Parsing: model returns Markdown with fixed `##` headings; `ActionBrief` splits by heading. If parsing fails, render raw Markdown (never break).

### 5.4 Drafts `/app/drafts`
Step 1: choose template (3 cards):
1. Application to SHO / police station (e.g., request reason for summons)
2. Complaint to FIA cybercrime (blackmail / harassment)
3. Complaint against demand for bribe / harassment by official
Step 2: short form (name, date, location, short description, optional other party) with helper text.
Step 3: result in editable textarea + **Copy** + **Download .txt**. Banner: "Review before submitting. Consider consulting an advocate."

### 5.5 History `/app/history`
List: title, category icon, date. Swipe/tap to open. Delete icon with confirm dialog. Empty state if none.

### 5.6 Emergency `/emergency`
Big tap-to-call tiles from `emergency_contacts.json`: Police emergency, FIA cybercrime, women/human-rights helplines, legal aid. Verify numbers before demo. Works without login.

### 5.7 Settings
Language, display name, **Delete my account** (red, requires typing DELETE), log out.

### 5.8 Auth screens
Email + password, show/hide password, clear error text, "Forgot password?" link, post-signup screen "Check your email to verify".

## 6. Component Inventory
`Header`, `LangToggle`, `EmergencyButton`, `ScenarioCard`, `ExamplePromptChip`, `ChatWindow`, `MessageBubble`, `AgentSteps`, `ActionBrief`, `BriefSection`, `ScriptBox` (copy), `SourceChip`, `QuickReplies`, `DraftForm`, `EmptyState`, `ErrorState`, `Skeleton`, `ConfirmDialog`, `Toast`, `Footer`.

## 7. UI States (required for every data screen)
| State | Behaviour |
|---|---|
| Loading | Skeleton cards; chat shows AgentSteps |
| Empty | Friendly illustration + CTA (History: "No conversations yet. Start with a situation.") |
| Error | Plain message + **Try again** button; never show stack traces |
| Network offline | Banner "You're offline. Emergency numbers are still available." (cache `/emergency` page) |
| Rate-limited (429) | "You've asked a lot — please wait a few minutes." |
| Out-of-corpus | Agent says it couldn't find a specific law, gives general safe steps |

## 8. Accessibility
- Contrast AA+, focus rings visible, all buttons ≥ 48px
- Labels on all inputs, `aria-live="polite"` on chat stream
- Alt text on all images; icons have `aria-label` when standalone
- Respect `prefers-reduced-motion`
- RTL layout for Urdu: set `dir="rtl"` and mirror paddings with logical properties (`ms-`, `me-`)

## 9. SEO & Meta (quick wins only)
- Unique `<title>` and meta description per public page
- One H1 per page; custom 404; favicon; Open Graph image (1200×630, navy + scale logo)
- `robots.txt`, `sitemap.xml`, canonical tags via Next metadata API
- No placeholder text anywhere; `lang` attribute set
- Skip: location pages, local business schema (not relevant)

## 10. Copy Deck (starter)
- Disclaimer: "Apna Wakil AI provides legal information and guidance based on Pakistani law. It is not a licensed lawyer."
- Panic line: "Take a breath. You have rights. Let's go step by step."
- Empty chat: "Tell me what happened, in English, Urdu or Roman Urdu."
- Error: "Something went wrong on our side. Please try again."

## 11. Responsiveness
| Breakpoint | Layout |
|---|---|
| < 640px | single column, bottom-sticky input |
| 640–1024px | centered column max-w-2xl |
| > 1024px | max-w-3xl chat; history as left sidebar (optional, P2) |

## 12. Performance
Use `next/font`, `next/image`, avoid heavy libraries, lazy-load the draft page, no large icon packs (import icons individually).

## 13. Frontend Done-Definition
- Works at 360px on a real phone
- All 4 scenarios reachable in ≤ 2 taps
- Urdu toggle flips direction and text
- No console errors; Lighthouse mobile ≥ 85 performance, ≥ 90 accessibility
