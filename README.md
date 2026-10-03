# Apna Wakil AI (اپنا وکیل)
> **"Every person deserves a personal lawyer."** — An Autonomous Agentic Legal Guidance System for Pakistan.

---

## Overview

Legal representation in Pakistan is historically skewed toward corporations and wealthy individuals who keep advocates on retainer. Ordinary citizens, street vendors, women, and cybercrime victims often lack direct access to immediate legal direction. When confronted with late-night police summons without an FIR, unlawful extortion by officials, public assault, or online blackmail, citizens frequently experience panic, succumb to bribery, or suffer rights violations.

**Apna Wakil AI** bridges this critical access-to-justice gap by acting as an autonomous legal guidance assistant that provides immediate, calm, and actionable direction grounded in verified statutory law:
> *"First, do not panic. Here is precisely what the law provides, what immediate actions to take, and what to state."*

---

## Core Capabilities

### 1. Autonomous Legal Reasoning Engine
* **Contextual Fact Analysis:** Classifies disputes across police summons, public sector bribery, physical assault, armed robbery, and digital extortion.
* **Grounded Retrieval-Augmented Generation (RAG):** Evaluates relevant statutory provisions before formulating guidance, eliminating hallucinated sections.
* **Structured 7-Part Action Brief:**
  1. **Stay Calm:** Immediate de-escalation and safety assessment.
  2. **Legal Rights:** Constitutional and statutory rights applicable to the incident.
  3. **Immediate Actions:** Tactical procedural checklist (e.g., Medico-Legal Certificate procedures, Safe City CCTV preservation, PTA device blocking).
  4. **Verbatim Script:** Exact lawful statements to communicate to law enforcement officers, assailants, or hospital duty staff.
  5. **Critical Prohibitions:** Actionable warnings against self-incrimination, signing unverified documents, or yielding to extortion.
  6. **Designated Helplines:** Immediate official contact numbers for the situation.
  7. **Statutory Citations:** Formal legal provisions referenced in the brief.

### 2. Legal Application and Complaint Generator
* **Application to Police SHO (CrPC Section 160):** Formal request for clarification and written documentation regarding informal or telephonic summons.
* **Complaint to FIA Cybercrime Wing (PECA Sections 20/21/24):** Official submission for cyber harassment, unauthorized imagery distribution, and digital blackmail.
* **Report Against Extortion and Bribery (PPC Section 161 / Prevention of Corruption Act):** Formal complaint regarding unlawful demands for illegal gratification.
* Provides one-click text copying and plaintext file downloads.

### 3. Emergency Directory
* Verified 24/7 national helplines:
  * Police Emergency: 15
  * Federal Investigation Agency Cyber Crime Wing (NR3C): 1991
  * Punjab Women Protection Helpline: 1043
  * Sindh Women Development Helpline: 1094
  * Ministry of Human Rights Helpline: 1099
  * Legal Aid Society Pakistan: 0800-70806
  * National Accountability Bureau / Anti-Corruption: 111-622-622

### 4. Multilingual and RTL Architecture
* Dual-language user interface supporting English and Urdu script (اردو) with native bidirectional layout management.
* Processes queries submitted in English, formal Urdu, and Roman Urdu.

---

## Statutory Legal Corpus

The knowledge base is drawn directly from official Pakistani statutes:

* **Constitution of the Islamic Republic of Pakistan (1973):**
  * Article 4: Right of individuals to be dealt with in accordance with law
  * Article 9: Security of person
  * Article 10: Safeguards as to arrest and detention
  * Article 10A: Right to fair trial and due process
  * Article 14: Inviolability of dignity of man and privacy of home
  * Article 25: Equality of citizens

* **Code of Criminal Procedure (1898):**
  * Section 54: Statutory limitations on arrest without warrant
  * Sections 61 & 167: Mandatory 24-hour magistrate production and remand rules
  * Section 154: Mandatory First Information Report (FIR) in cognizable offenses
  * Section 155: Daily Diary (*Roznamcha*) entry for non-cognizable disputes
  * Section 160: Requirement for formal written orders for witness attendance
  * Sections 22-A & 22-B: Ex-Officio Justice of the Peace remedies against police inaction

* **Pakistan Penal Code (1860):**
  * Section 161: Public servant taking illegal gratification
  * Sections 337 & 337-A: Causing bodily hurt (*Shajjah* and *Jurh*)
  * Sections 350, 351 & 352: Criminal force and assault
  * Sections 383 & 384: Extortion
  * Sections 390, 392 & 397: Robbery and armed robbery with deadly weapons
  * Sections 503 & 506: Criminal intimidation
  * Section 509: Word, gesture, or act intended to insult the modesty of a woman

* **Prevention of Electronic Crimes Act (2016):**
  * Section 20: Offenses against dignity of a natural person
  * Section 21: Offenses against modesty of a natural person and minor
  * Section 24: Cyberstalking

---

## System Architecture

```
 Browser Client (Next.js 16, TypeScript, Tailwind CSS, Bi-directional RTL)
        │
        ▼
 Application Layer (Next.js App Router on Vercel)
  ├─ /api/chat     ──► Agent Pipeline (Gemini Flash + Dynamic RAG)
  ├─ /api/drafts   ──► Structured Document Generation
  └─ /middleware   ──► Session Authentication & Cookie Security
        │
        ▼
 Data Layer (Supabase PostgreSQL + pgvector + Row-Level Security)
```

---

## Deployment & Setup

### 1. Clone Repository
```bash
git clone https://github.com/RAZAULLAH-KHAN/Apna-wakeel-agent.git
cd Apna-wakeel-agent
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file using `.env.example` as a template:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-api-key
GEMINI_API_KEY=your-gemini-api-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Execute Development Server
```bash
npm run dev
```

---

## Evaluation Credentials

For evaluators and demonstration testing, a pre-verified evaluation account is available:
* **Email:** `demo@apnawakil.ai`
* **Password:** `Password123!`

---

## Legal Notice

*Apna Wakil AI provides legal information and procedural guidance based on Pakistani statutory law. It is not a licensed advocate, does not provide legal representation in judicial forums, and does not establish an advocate-client relationship under the Legal Practitioners and Bar Councils Act 1973.*
