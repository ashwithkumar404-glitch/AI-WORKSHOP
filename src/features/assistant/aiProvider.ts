import { KnowledgeDocument } from '@/lib/dbTypes';
import { dbRepository } from '@/lib/storage';

export interface GroundedCitation {
  id: string;
  title: string;
  category: string;
  snippet: string;
  sourceUrl?: string;
}

export interface AssistantAnswer {
  content: string;
  citations: GroundedCitation[];
  grounded: boolean;
  modelUsed: string;
}

export interface LLMProviderConfig {
  provider: 'gemini' | 'openai' | 'anthropic' | 'retrieval-fallback';
  apiKey?: string;
  apiEndpoint?: string;
}

const STOP_WORDS = new Set([
  'what', 'when', 'where', 'which', 'who', 'whom', 'whose', 'why', 'how',
  'the', 'and', 'for', 'with', 'from', 'about', 'tell', 'does', 'have', 'has',
  'can', 'are', 'is', 'was', 'were', 'will', 'would', 'should', 'could', 'please'
]);

/**
 * Knowledge retrieval using full-text keyword matching and scoring
 */
export function retrieveGroundedKnowledge(query: string, limit: number = 3): { doc: KnowledgeDocument; score: number }[] {
  const approvedDocs = dbRepository.getKnowledgeDocs(); // Returns only approved docs for non-admins
  const terms = query
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2 && !STOP_WORDS.has(t));

  if (terms.length === 0) {
    return [];
  }

  const scored = approvedDocs.map(doc => {
    const titleLower = doc.title.toLowerCase();
    const contentLower = doc.content.toLowerCase();
    const categoryLower = doc.category.toLowerCase();

    let score = 0;
    for (const term of terms) {
      if (titleLower.includes(term)) score += 8;
      if (categoryLower.includes(term)) score += 4;
      // Count frequency in content
      const matches = contentLower.split(term).length - 1;
      score += Math.min(matches * 2, 10);
    }

    return { doc, score };
  });

  return scored
    .filter(item => item.score >= 4) // High confidence threshold
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Prompt injection defense: sanitize and detect override attempts
 */
export function isAdversarialInput(query: string): boolean {
  const adversarialPatterns = [
    /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
    /system\s+prompt/i,
    /you\s+are\s+now\s+dan/i,
    /disregard\s+(the\s+)?rules/i,
    /reveal\s+(the\s+)?(api\s+key|password|answer\s+keys)/i,
    /give\s+me\s+the\s+answers\s+to\s+exam/i
  ];

  return adversarialPatterns.some(p => p.test(query));
}

/**
 * Main grounded SCEM AI query function
 */
export async function askScemAssistant(query: string): Promise<AssistantAnswer> {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      content: 'Please enter a valid question regarding Sahyadri College of Engineering and Management (SCEM).',
      citations: [],
      grounded: false,
      modelUsed: 'SCEM Grounded Knowledge Guard',
    };
  }

  // Security check: adversarial guard
  if (isAdversarialInput(trimmed)) {
    return {
      content: 'Security Notice: This inquiry contains patterns that attempt to circumvent institutional safety guidelines. CampusPilot AI strictly operates within verified SCEM policies and cannot bypass system security or disclose exam keys.',
      citations: [],
      grounded: false,
      modelUsed: 'SCEM Security Guard',
    };
  }

  // 1. Retrieve knowledge
  const retrieved = retrieveGroundedKnowledge(trimmed, 3);

  // 2. Fallback when no grounded source exists
  if (retrieved.length === 0) {
    return {
      content: `I could not find verified information regarding this specific inquiry in the approved Sahyadri College of Engineering & Management (SCEM) knowledge repository.

To ensure academic and regulatory accuracy, CampusPilot AI does not speculate or invent college policies, exam dates, fees, or administrative regulations.

Please consult the official SCEM department contacts:
• **Academic & Examinations**: exam@sahyadri.edu.in
• **Dean Student Affairs & Attendance**: academics@sahyadri.edu.in
• **Training & Placements**: placements@sahyadri.edu.in
• **General Administration & Admissions**: +91 824 2277222 / admissions@sahyadri.edu.in
• **Campus Address**: Sahyadri Campus, Adyar, Mangaluru, Karnataka - 575007`,
      citations: [],
      grounded: false,
      modelUsed: 'SCEM Grounded Fallback (Retrieval-Only)',
    };
  }

  // 3. Format Citations
  const citations: GroundedCitation[] = retrieved.map(({ doc }) => {
    const snippet = doc.content.length > 240 ? doc.content.substring(0, 240) + '...' : doc.content;
    return {
      id: doc.id,
      title: doc.title,
      category: doc.category,
      snippet,
      sourceUrl: doc.source_url,
    };
  });

  // 4. Grounded synthesis
  const serverAiEndpoint = import.meta.env.VITE_AI_PROXY_URL;
  if (serverAiEndpoint) {
    try {
      const resp = await fetch(serverAiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: trimmed,
          context: retrieved.map(r => `[Source: ${r.doc.title} (${r.doc.category})]\n${r.doc.content}`).join('\n\n')
        })
      });
      if (resp.ok) {
        const data = await resp.json();
        return {
          content: data.answer,
          citations,
          grounded: true,
          modelUsed: data.model || 'Live AI Integration',
        };
      }
    } catch (e) {
      console.warn('AI Server Proxy unavailable, using Grounded Synthesis Engine:', e);
    }
  }

  // Reliable Grounded Synthesis Fallback Engine
  const topDoc = retrieved[0].doc;
  const secondaryDocs = retrieved.slice(1).map(r => r.doc);

  let synthesized = `Based on official **Sahyadri College of Engineering & Management (SCEM)** records on **${topDoc.title}**:\n\n${topDoc.content}`;

  if (secondaryDocs.length > 0) {
    synthesized += `\n\n**Additional Context (${secondaryDocs[0].title}):**\n${secondaryDocs[0].content}`;
  }

  return {
    content: synthesized,
    citations,
    grounded: true,
    modelUsed: 'SCEM Verified Knowledge Engine (Offline Grounded)',
  };
}
