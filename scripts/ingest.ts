import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Load .env.local manually if running via tsx
const envFile = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf-8');
const envVars = Object.fromEntries(
  envFile
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const idx = line.indexOf('=');
      return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
    })
);

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = envVars.SUPABASE_SERVICE_ROLE_KEY;
const geminiApiKey = envVars.GOOGLE_GENERATIVE_AI_API_KEY || envVars.GEMINI_API_KEY;

if (!supabaseUrl || !serviceRoleKey || !geminiApiKey) {
  console.error('Missing environment variables. Check .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function getEmbedding(text: string): Promise<number[]> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${geminiApiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: { parts: [{ text }] },
      outputDimensionality: 768,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Embedding API error (${res.status}): ${errorBody}`);
  }

  const data = await res.json();
  return data.embedding.values;
}

interface LegalChunk {
  law_name: string;
  section: string;
  categories: string[];
  content: string;
  source_url?: string;
}

function parseMarkdownFile(filePath: string): LegalChunk[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const filename = path.basename(filePath);
  const lines = content.split('\n');

  let currentLawName = filename.replace('.md', '').toUpperCase();
  const chunks: LegalChunk[] = [];
  let currentSection = '';
  let currentCategories: string[] = ['general'];
  let currentBody: string[] = [];

  for (const line of lines) {
    if (line.startsWith('# ')) {
      currentLawName = line.replace('# ', '').trim();
    } else if (line.startsWith('## ')) {
      if (currentSection && currentBody.length > 0) {
        chunks.push({
          law_name: currentLawName,
          section: currentSection,
          categories: currentCategories,
          content: currentBody.join('\n').trim(),
        });
      }
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

  if (currentSection && currentBody.length > 0) {
    chunks.push({
      law_name: currentLawName,
      section: currentSection,
      categories: currentCategories,
      content: currentBody.join('\n').trim(),
    });
  }

  return chunks;
}

async function ingest() {
  console.log('--- Starting Apna Wakil AI Legal Corpus Ingestion ---');
  const lawDir = path.join(process.cwd(), 'data', 'law');
  const files = fs.readdirSync(lawDir).filter((f) => f.endsWith('.md'));

  let totalChunks = 0;

  for (const file of files) {
    const filePath = path.join(lawDir, file);
    console.log(`\nProcessing: ${file}`);
    const chunks = parseMarkdownFile(filePath);
    console.log(`Parsed ${chunks.length} sections from ${file}`);

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const textToEmbed = `${chunk.law_name} - ${chunk.section}\n${chunk.content}`;
      console.log(`  Embedding [${i + 1}/${chunks.length}]: ${chunk.section.slice(0, 45)}...`);

      try {
        const embedding = await getEmbedding(textToEmbed);

        const { error } = await supabase.from('legal_chunks').insert({
          law_name: chunk.law_name,
          section: chunk.section,
          categories: chunk.categories,
          content: chunk.content,
          embedding: embedding,
        });

        if (error) {
          console.error(`  Error inserting chunk:`, error.message);
        } else {
          totalChunks++;
        }
      } catch (err: any) {
        console.error(`  Error embedding chunk:`, err.message);
      }

      // Small throttle to be courteous to Gemini free rate limits
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
  }

  console.log(`\n🎉 Ingestion finished! Successfully indexed ${totalChunks} legal chunks with vector embeddings.`);
}

ingest().catch(console.error);
