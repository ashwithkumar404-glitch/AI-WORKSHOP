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
  'can', 'are', 'is', 'was', 'were', 'will', 'would', 'should', 'could', 'please',
  'i', 'me', 'my', 'you', 'your', 'in', 'on', 'at', 'to', 'a', 'an'
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
 * Conversational intent classifier for greetings, system inquiries, and private data protection
 */
export function handleConversationalIntent(query: string): AssistantAnswer | null {
  const q = query.trim().toLowerCase().replace(/[?!.,]/g, '');

  // 1. Greetings
  const greetingPatterns = [
    /^(hello|hi|hey|hiya|namaste)$/,
    /^(good\s+(morning|afternoon|evening|day))$/,
    /^(hello|hi|hey)\s+(sahyadri|there|assistant|bot)$/
  ];

  if (greetingPatterns.some(p => p.test(q))) {
    return {
      content: `Hello! Welcome to **SAHYADRI ONE**. I am your campus intelligence assistant for Sahyadri College of Engineering & Management (SCEM), Mangaluru.

I can help you explore verified college information and placement preparation, including:
• **Placement Guidelines & Cutoffs** (Eligibility criteria, Dream tier guidelines, CTC brackets)
• **Academic & VTU Attendance Regulations** (85% VTU attendance mandate, condonation rules)
• **Examinations & Autonomous Grading** (SGPA/CGPA evaluation, passing minimums)
• **Campus Amenities & Hostel Hours** (Central Library schedule, 9:00 PM hostel gate timings)
• **Student Technical Clubs** (Team Challengers, NAIN, SCAIR)

What would you like to know?`,
      citations: [
        {
          id: 'kd-portal-welcome',
          title: 'SAHYADRI ONE Campus Intelligence Portal',
          category: 'Academics & Regulations',
          snippet: 'Official student placement intelligence and academic navigation portal for SCEM Mangaluru.',
          sourceUrl: 'https://sahyadri.edu.in'
        }
      ],
      grounded: true,
      modelUsed: 'SCEM Conversational Intent Engine'
    };
  }

  // 2. Identity and Capabilities
  const identityPatterns = [
    /^(who\s+are\s+you|what\s+is\s+your\s+name|what\s+are\s+you)$/,
    /^(what\s+can\s+you\s+(help\s+me\s+with|do))$/,
    /^what\s+is\s+(sahyadri\s+one|campuspilot)$/,
    /^tell\s+me\s+about\s+yourself$/
  ];

  if (identityPatterns.some(p => p.test(q))) {
    return {
      content: `I am **Ask Sahyadri AI**, the official campus intelligence assistant engineered for **SAHYADRI ONE** at Sahyadri College of Engineering & Management (SCEM), Mangaluru.

My purpose is to deliver authentic, document-verified answers regarding college academic regulations, placement training eligibility, campus facilities, and student opportunities without speculation or hallucination.`,
      citations: [
        {
          id: 'kd-about-us',
          title: 'SCEM Autonomous Status, Accreditation and Affiliation',
          category: 'Academics & Regulations',
          snippet: 'Sahyadri College of Engineering & Management (SCEM), Mangaluru, established in 2007, Autonomous NAAC A Grade institute.',
          sourceUrl: 'https://sahyadri.edu.in/about-us'
        }
      ],
      grounded: true,
      modelUsed: 'SCEM Conversational Intent Engine'
    };
  }

  // 3. Courtesy and Farewells
  const courtesyPatterns = [
    /^(thank\s+you|thanks|thank\s+you\s+very\s+much|thx)$/,
    /^(bye|goodbye|see\s+you|cya)$/
  ];

  if (courtesyPatterns.some(p => p.test(q))) {
    return {
      content: `You're very welcome! If you have any further questions regarding placement drives, academic regulations, or campus facilities at Sahyadri College, feel free to ask anytime.

Wishing you great success in your placement preparation!`,
      citations: [],
      grounded: true,
      modelUsed: 'SCEM Conversational Intent Engine'
    };
  }

  // 4. General Placement Preparation Roadmap Guidance
  const prepPatterns = [
    /how\s+(can\s+i|to)\s+prepare\s+for\s+placements?/i,
    /placement\s+preparation\s+(tips|roadmap|guide)/i,
    /how\s+to\s+get\s+placed/i
  ];

  if (prepPatterns.some(p => p.test(q))) {
    return {
      content: `### Placement Preparation Strategy for SCEM Students

Preparing for campus recruitment requires a disciplined combination of institutional compliance and technical mastery:

#### 1. Official SCEM Placement Cell Requirements:
• **Academic Eligibility**: Maintain >= 7.0 CGPA with no active backlogs to unlock **Dream Tier (>= 10.0 LPA)** opportunities.
• **Mandatory Attendance**: Maintain >= 90% attendance in institutional training bootcamps (DSA, Aptitude, Soft Skills).
• **Offer Policy**: Strict one-student-one-offer policy applies unless elevated to a higher tier.

#### 2. Systematic 4-Pillar Preparation Plan:
1. **Quantitative & Logical Aptitude**:
   • Solve 20 questions daily on the **SAHYADRI ONE Aptitude Assessment Engine** across Number Systems, Time & Work, Syllogisms, and Data Interpretation.
2. **Data Structures & Algorithms**:
   • Practice in our **Guided Coding Lab**. Master Arrays, Two Pointers, Sliding Window, Linked Lists, Binary Trees, and Dynamic Programming (Striver SDE Sheet).
3. **Core CS Fundamentals**:
   • Review DBMS (SQL queries, indexing, ACID properties), Operating Systems (Paging, concurrency, deadlocks), and Computer Networks (TCP/IP, HTTP/HTTPS).
4. **Interview Debriefs & Mock Drills**:
   • Review real senior interview experiences for Infosys, Google, and Cisco in our **Interview Hub**.

*Note: General preparation advice is provided for skill enhancement and does not replace official department circulars.*`,
      citations: [
        {
          id: 'kd-005',
          title: 'Placement & Career Guidance Cell Eligibility Guidelines',
          category: 'Placements & Training',
          snippet: 'Mandatory 90% attendance in training bootcamps and 7.0+ CGPA requirement for Dream tier drives.',
          sourceUrl: 'https://sahyadri.edu.in/placements'
        }
      ],
      grounded: true,
      modelUsed: 'SCEM Placement Guidance Engine'
    };
  }

  // 5. Unsupported Personal / Real-time Data Guard
  const privateDataPatterns = [
    /what\s+is\s+my\s+(attendance|marks|grade|cgpa|sgpa)/i,
    /who\s+is\s+my\s+(faculty|advisor|teacher)\s+for/i,
    /today'?s\s+(timetable|class\s+schedule|room)/i,
    /is\s+[a-z]+\s+placed/i
  ];

  if (privateDataPatterns.some(p => p.test(q))) {
    return {
      content: `**Privacy & Data Policy Notice:**
Personal academic records (individual attendance logs, internal marks, daily classroom timetables, and personal placement offers) are restricted to authorized institutional ERP sessions to comply with data privacy policies.

Please access your authenticated records via the official portal:
• **SCEM ERP Student Portal**: [erp.sahyadri.edu.in](https://sahyadri.edu.in)
• **Department Academic Coordinator**: academics@sahyadri.edu.in
• **Controller of Examinations**: exam@sahyadri.edu.in`,
      citations: [],
      grounded: false,
      modelUsed: 'SCEM Privacy & Policy Guard'
    };
  }

  return null;
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

  // Check conversational intents (Greetings, Who are you, Placement guidance)
  const conversationalResponse = handleConversationalIntent(trimmed);
  if (conversationalResponse) {
    return conversationalResponse;
  }

  // 1. Retrieve knowledge
  const retrieved = retrieveGroundedKnowledge(trimmed, 3);

  // 2. Fallback when no grounded source exists
  if (retrieved.length === 0) {
    return {
      content: `I could not find verified information regarding this specific inquiry in the approved Sahyadri College of Engineering & Management (SCEM) knowledge repository.

To ensure academic and regulatory accuracy, SAHYADRI ONE does not speculate or invent college policies, exam dates, fees, or administrative regulations.

Please consult the official SCEM department contacts:
• **Academic & Examinations**: exam@sahyadri.edu.in
• **Dean Student Affairs & Attendance**: academics@sahyadri.edu.in
• **Training & Placements**: placements@sahyadri.edu.in
• **General Administration & Admissions**: +91 824 2277222 / admissions@sahyadri.edu.in
• **Official Website**: https://sahyadri.edu.in
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
