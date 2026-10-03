# Apna Wakil AI (اپنا وکیل)
## Presentation Slide Deck — Agentic AI Hackathon 2026

---

### Slide 1: Title & Team
* **Project Name:** Apna Wakil AI (اپنا وکیل)
* **Tagline:** *"Every person deserves a personal lawyer."*
* **Event:** Agentic AI Hackathon 2026
* **Live Application:** https://apna-wakeel-agent.vercel.app
* **GitHub Repository:** https://github.com/RAZAULLAH-KHAN/Apna-wakeel-agent

**Team Members:**
* **Team Leader:** Raza Ullah
* **Team Member:** Sahrish Yaseen
* **Team Member:** Laiba Noor
* **Team Member:** Hamna Arshad
* **Team Member:** Fiza Kausar
* **Team Member:** Saira Rehman

---

### Slide 2: The Core Problem in Pakistan
* **Legal Inequality:** Wealthy individuals and corporations have advocates on retainer; ordinary Pakistani citizens, small shopkeepers, women, and cyber victims do not.
* **The Panic Dilemma:** When an individual receives an informal midnight call from a police station, faces street extortion (*"chai pani"*), suffers physical assault, or is blackmailed online with private photos:
  * They panic due to lack of legal awareness.
  * They do not know their statutory rights or what exact words to say.
  * They succumb to bribery, unlawful detention, or blackmail payments.
* **The Core Need:** Citizens do not need generic essay answers; they need immediate, calm, legally grounded, and actionable procedural direction.

---

### Slide 3: Our Solution — Apna Wakil AI
* **An Autonomous Legal Agent in Everyone's Pocket:**
  * Delivers instant, calm, step-by-step guidance grounded in Pakistani statutory law.
  * Tells a frightened citizen: **"First, do not panic. Here is what the law says, what to do right now, and the exact words to say."**
* **Strict Legal Safeguards:**
  * Procedural empowerment and legal education — not courtroom representation.
  * Grounded exclusively in verified Pakistani statutes with zero hallucinated section numbers.

---

### Slide 4: Autonomous Agent Pipeline
* **Not Just a Chatbot — An Autonomous Multi-Step Agent:**
  1. **Situation Classification:** Intelligently categorizes the problem (e.g., Police Summon, Street Assault/Slapping, Armed Robbery/Snatching, Cyber Blackmail, Business Extortion).
  2. **Vetted Statutory Retrieval (RAG):** Evaluates relevant legal sections from the Pakistan Penal Code (PPC), Code of Criminal Procedure (CrPC), Prevention of Electronic Crimes Act (PECA), and Constitution of 1973.
  3. **Multi-Model Fallback Engine:** Resilient pipeline prioritizing high-throughput Gemini Flash models with automatic retry logic.
  4. **Action Brief Synthesis:** Generates a personalized, situational 7-part legal roadmap.

---

### Slide 5: The Structured 7-Part Action Brief
Every legal consultation generates a standardized, accessible brief:
1. **Stay Calm:** Psychological de-escalation tailored to the incident.
2. **Your Legal Rights:** Key constitutional and statutory protections (e.g., CrPC 160, PPC 351/392, PECA 21).
3. **What To Do Right Now:** Numbered tactical steps (e.g., Medico-Legal Certificate (MLC) procedures, Safe City CCTV requests, PTA IMEI blocking).
4. **What To Say (Verbatim Script):** Exact, polite, assertive lawful words with a **1-click Copy button**.
5. **What NOT To Do:** Safeguards against self-incrimination, signing blank papers, or paying blackmailers.
6. **Who To Contact:** Relevant emergency helplines with direct tap-to-call links.
7. **Statutory Citations:** Formal section references verifying the legal grounding.

---

### Slide 6: Product Capabilities & Demo Highlights
* **Automated Legal Application Generator (`/app/drafts`):**
  * Application to SHO for written clarification of summons under Section 160 CrPC.
  * Formal complaint to FIA Cyber Crime Wing (NR3C) under PECA Sections 20/21/24.
  * Official complaint against extortion and bribe demands under Section 161 PPC.
  * Features 1-click text copying and plaintext file export.
* **National Emergency Directory (`/emergency`):**
  * One-tap direct dialers for Police 15, FIA 1991, Women Helpline 1043/1094, Human Rights 1099, and Legal Aid Society 0800-70806.
* **Bilingual English & Urdu Interface:**
  * Seamless language switching with native Right-to-Left (RTL) layout rendering.
  * Dynamic multilingual understanding across English, Roman Urdu, and formal Urdu script.

---

### Slide 7: Technical Architecture
* **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS.
* **AI & Agent Core:** Google Gemini Flash AI Engine + Custom Grounded RAG Pipeline.
* **Database & Auth:** Supabase PostgreSQL with `pgvector` semantic search, Row-Level Security (RLS) data isolation, and secure HTTP-only cookies.
* **Deployment:** Production serverless deployment on Vercel with zero cold-start latency.

---

### Slide 8: Real-World Scenarios Handled Dynamically
* **Scenario A (Road Assault / Slap):** Addresses PPC Section 351/352, Section 337 bodily hurt, hospital casualty MLC documentation, and Roznamcha filing.
* **Scenario B (Mobile Phone Robbery):** Addresses armed robbery under PPC Section 392/397, mandatory FIR registration under CrPC Section 154, and PTA DIRBS IMEI deactivation.
* **Scenario C (Police Night Call):** Explains Section 160 CrPC written summons requirement and Article 10 constitutional safeguards.
* **Scenario D (Cyber Blackmail):** Advises immediate cessation of money transfer, evidence preservation, and formal reporting under PECA Section 21/24.

---

### Slide 9: Impact & Vision
* **Democratizing Legal Justice:** Providing every Pakistani citizen with a pocket advocate that levels the playing field.
* **Combating Corruption & Extortion:** Empowering shopkeepers and vulnerable individuals with the exact legal language to resist unlawful demands.
* **Future Roadmap:**
  * Voice note input/output in regional languages (Pashto, Punjabi, Sindhi, Balochi).
  * Direct referral API to verified pro-bono advocates and Legal Aid clinics.

---

### Slide 10: Conclusion & Demo Access
* **Live Web App:** https://apna-wakeel-agent.vercel.app
* **GitHub Repository:** https://github.com/RAZAULLAH-KHAN/Apna-wakeel-agent
* **Evaluation Test Account:** `demo@apnawakil.ai` | `Password123!`

**Thank you! We welcome your questions.**
