# Apna Wakil AI (اپنا وکیل) ⚖️🇵🇰
> **"Every person deserves a personal lawyer."** — An Autonomous Agentic AI Legal Platform for Pakistan.

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database_%26_Auth-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Gemini](https://img.shields.io/badge/Google_Gemini-Flash_AI-orange?style=for-the-badge&logo=google)](https://aistudio.google.com/)

---

## 📌 Overview

Rich individuals and large corporations have lawyers on retainer. Ordinary Pakistani citizens, street vendors, women, and cyber victims usually do not. When faced with a late-night police summons without an FIR, unlawful extortion, street assault, or cyber blackmail, citizens often panic, pay bribes, or suffer in silence.

**Apna Wakil AI** is an intelligent AI legal agent in your pocket that provides:
> *"First, don't panic. Here is exactly what to do, what to say, and what the law says."*

---

## 🌟 Key Features

### 1. 🛡️ Autonomous Agentic Legal Reasoning
* **Real-time Situation Analysis:** Accurately classifies problems across police misconduct, business extortion, street assault/slapping, armed robbery, and online blackmail.
* **Grounded RAG (Retrieval-Augmented Generation):** Retrieves verified Pakistani statutes to ground every answer and eliminate hallucinations.
* **Structured 7-Section Action Brief:**
  1. 🧘 **Stay Calm** (Immediate psychological reassurance)
  2. ⚖️ **Your Legal Rights** (Specific constitutional & statutory guarantees)
  3. ✅ **What To Do Right Now** (Tactical checklist, MLC hospital procedures, evidence preservation)
  4. 🗣️ **What To Say** (Verbatim script with 1-click clipboard copy)
  5. 🚫 **What NOT To Do** (Safeguards against self-incrimination, signing blank papers, or paying extortion)
  6. 📞 **Who To Contact** (Tap-to-call emergency helplines)
  7. 📚 **Legal Citations & Sources** (Exact statutory sections)

### 2. 📝 Formal Legal Application & Complaint Generator (`/app/drafts`)
* **Police Station / SHO Application:** Requesting written record & FIR clarification for informal summons under Section 160 CrPC.
* **FIA Cybercrime Complaint:** Formal reporting for leaked private photos, online blackmail, and extortion under PECA 2016 Sections 20/21/24.
* **Anti-Corruption Complaint:** Lodging official complaints against demands for bribes (*"chai pani"*) or shop-sealing threats under Section 161 PPC.
* Features **1-Click Copy** and **Download as .txt**.

### 3. 🚨 24/7 Verified Pakistan Helplines Directory (`/emergency`)
* Direct tap-to-call dialers (`tel:`):
  * **Police Emergency:** `15`
  * **FIA Cybercrime Wing (NR3C):** `1991`
  * **Punjab Women Protection Helpline:** `1043`
  * **Sindh Women Development Helpline:** `1094`
  * **Ministry of Human Rights Helpline:** `1099`
  * **Legal Aid Society Pakistan:** `0800-70806`
  * **NAB Anti-Corruption:** `111-622-622`

### 4. 🌐 Bilingual & RTL Support
* Full native support for **English** and **Urdu (اردو)** with automatic `dir="rtl"` layout switching.
* Responds intelligently to queries in English, Urdu script, or Roman Urdu.

---

## 📚 Vetted Pakistani Legal Corpus

* **Constitution of Pakistan 1973:** Articles 4 (Right to be dealt in accordance with law), 9 (Security of person), 10 (Safeguards as to arrest/detention), 10A (Fair trial), 14 (Inviolability of dignity), 25 (Equality).
* **Code of Criminal Procedure 1898 (CrPC):** Sections 54 (Arrest without warrant limits), 61 & 167 (24-hour detention & Remand rules), 154 (Mandatory FIR), 155 (Non-cognizable Roznamcha), 160 (Written summons only), 22-A / 22-B (Justice of Peace remedy).
* **Pakistan Penal Code 1860 (PPC):** Sections 161 (Bribery), 350-352 (Criminal force & Assault), 337 (Physical hurt / MLC procedure), 383/384 (Extortion), 392/397 (Robbery / Armed mugging), 503/506 (Criminal intimidation), 509 (Insulting modesty of a woman).
* **Prevention of Electronic Crimes Act 2016 (PECA):** Sections 20 (Dignity violations), 21 (Non-consensual media / blackmail), 24 (Cyberstalking).

---

## 🛠️ Tech Stack & Architecture

```
 Browser (Next.js 16 + Tailwind CSS, Bilingual RTL)
        │
        ▼
 Next.js App Router (Vercel)
  ├─ /api/chat     ──► Multi-model AI Engine (Gemini Flash) + RAG
  ├─ /api/drafts   ──► Automated Legal Application Builder
  └─ /middleware   ──► Session Guard & Secure Cookies
        │
        ▼
 Supabase (PostgreSQL with pgvector + Supabase Auth + RLS)
```

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/RAZAULLAH-KHAN/Apna-wakeel-agent.git
cd Apna-wakeel-agent
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file based on `.env.example`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-api-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Account Credentials (For Hackathon Judges)

You can log in directly at `/login` using the pre-verified test credentials:
* **Email:** `demo@apnawakil.ai`
* **Password:** `Password123!`
* *(Or simply click the **"🚀 Quick Demo: Fill Test Account"** button on the login screen).*

---

## ⚖️ Legal Disclaimer

*Apna Wakil AI provides legal information and guidance based on Pakistani law. It is not a licensed advocate, does not provide legal representation in court, and does not create an advocate-client relationship under the Legal Practitioners and Bar Councils Act 1973.*

---
Built with pride for the **Agentic AI Hackathon 2026**.
