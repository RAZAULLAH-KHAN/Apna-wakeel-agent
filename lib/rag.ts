import fs from 'fs';
import path from 'path';
import { createAdminClient } from '@/lib/supabase/admin';

export interface LegalMatch {
  id?: number | string;
  law_name: string;
  section: string;
  content: string;
  source_url?: string;
  similarity?: number;
}

// Resilient local corpus search over data/law/*.md
function searchLocalCorpus(query: string, category?: string): LegalMatch[] {
  try {
    const lawDir = path.join(process.cwd(), 'data', 'law');
    if (!fs.existsSync(lawDir)) return [];

    const files = fs.readdirSync(lawDir).filter((f) => f.endsWith('.md'));
    const results: LegalMatch[] = [];
    const queryTerms = query
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 2);

    for (const file of files) {
      const filePath = path.join(lawDir, file);
      const text = fs.readFileSync(filePath, 'utf-8');
      const lines = text.split('\n');

      let currentLawName = file.replace('.md', '').toUpperCase();
      let currentSection = '';
      let currentCategories: string[] = ['general'];
      let currentBody: string[] = [];

      const flushSection = () => {
        if (!currentSection || currentBody.length === 0) return;
        const bodyText = currentBody.join('\n');
        const combined = `${currentLawName} ${currentSection} ${bodyText}`.toLowerCase();

        // Calculate matching score
        let score = 0;
        for (const term of queryTerms) {
          if (combined.includes(term)) {
            score += 2;
          }
        }

        // Specific category bonuses
        if (category) {
          const catLower = category.toLowerCase();
          if (currentCategories.includes(catLower)) {
            score += 4;
          }
          if (
            (catLower === 'assault' && combined.includes('slap')) ||
            (catLower === 'assault' && combined.includes('force')) ||
            (catLower === 'theft_robbery' && combined.includes('robbery')) ||
            (catLower === 'theft_robbery' && combined.includes('snatch')) ||
            (catLower === 'theft_robbery' && combined.includes('gunpoint'))
          ) {
            score += 5;
          }
        }

        if (score > 0) {
          results.push({
            law_name: currentLawName,
            section: currentSection,
            content: bodyText.trim(),
            similarity: Math.min(score / (queryTerms.length + 3), 1.0),
          });
        }
      };

      for (const line of lines) {
        if (line.startsWith('# ')) {
          currentLawName = line.replace('# ', '').trim();
        } else if (line.startsWith('## ')) {
          flushSection();
          currentSection = line.replace('## ', '').trim();
          currentCategories = ['general'];
          currentBody = [];
        } else if (line.toLowerCase().startsWith('**category:')) {
          const catMatch = line.match(/\*\*category:\s*([^*]+)\*\*/i);
          if (catMatch) {
            currentCategories = catMatch[1]
              .split(',')
              .map((c) => c.trim().toLowerCase())
              .filter(Boolean);
          }
        } else {
          currentBody.push(line);
        }
      }
      flushSection();
    }

    return results
      .sort((a, b) => (b.similarity || 0) - (a.similarity || 0))
      .slice(0, 5);
  } catch (err) {
    console.error('Error searching local corpus:', err);
    return [];
  }
}

async function getEmbedding(text: string): Promise<number[] | null> {
  const geminiApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
  if (!geminiApiKey) return null;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${geminiApiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: { parts: [{ text }] },
        outputDimensionality: 768,
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.embedding?.values || null;
  } catch {
    return null;
  }
}

export async function searchLaw(query: string, category?: string): Promise<LegalMatch[]> {
  try {
    const embedding = await getEmbedding(query);

    if (embedding) {
      try {
        const supabase = createAdminClient();
        const { data, error } = await supabase.rpc('match_legal_chunks', {
          query_embedding: embedding,
          match_count: 5,
          filter_category: category && category !== 'general' ? category : null,
        });

        if (!error && Array.isArray(data) && data.length > 0) {
          return data;
        }
      } catch (dbErr) {
        // Fall back to local search
      }
    }
  } catch (err) {
    // Fall back to local search
  }

  return searchLocalCorpus(query, category);
}
