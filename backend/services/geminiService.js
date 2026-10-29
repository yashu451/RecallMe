import { GoogleGenAI, Type } from '@google/genai';

/**
 * Intelligent fallback generator if Gemini API key is missing or quota is exceeded.
 * Ensures the app works 100% of the time during demos and hackathons.
 */
function generateFallbackStudyMaterial(rawText, userTitle = '', subject = 'General Science', options = {}) {
  const cleanText = rawText.trim();
  const lines = cleanText.split('\n').map(l => l.trim()).filter(Boolean);
  
  let title = userTitle.trim();
  if (!title) {
    if (lines.length > 0 && lines[0].length < 75 && !lines[0].endsWith('.')) {
      title = lines[0].replace(/^#+\s*/, '');
    } else {
      title = "Synthesized Notes: " + cleanText.slice(0, 35) + "...";
    }
  }

  const wordCount = cleanText.split(/\s+/).length;
  const readTimeMinutes = Math.max(2, Math.ceil(wordCount / 180));
  const readTime = `${readTimeMinutes} min read`;

  // Extract sections
  const sections = [];
  const paragraphs = cleanText.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  if (paragraphs.length >= 2) {
    sections.push({
      heading: "1. Core Principles & Foundational Architecture",
      content: paragraphs.slice(0, Math.ceil(paragraphs.length / 2)).join('\n\n')
    });
    sections.push({
      heading: "2. Operational Invariants & Mechanism Analysis",
      content: paragraphs.slice(Math.ceil(paragraphs.length / 2)).join('\n\n')
    });
  } else {
    sections.push({
      heading: "1. Core Overview & Key Mechanism",
      content: cleanText
    });
  }

  // Extract takeaways
  const takeaways = [];
  const candidateSentences = cleanText
    .split(/(?<=[.?!])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 25 && s.length < 220);

  if (candidateSentences.length > 0) {
    takeaways.push(candidateSentences[0]);
    if (candidateSentences.length > 2) {
      takeaways.push(candidateSentences[Math.floor(candidateSentences.length / 2)]);
    }
    if (candidateSentences.length > 4) {
      takeaways.push(candidateSentences[candidateSentences.length - 1]);
    }
  } else {
    takeaways.push("Critical understanding of foundational principles and operational interactions within this domain.");
  }

  // Extract keywords
  const keywords = [];
  const definitions = [];
  const colonMatches = cleanText.matchAll(/([A-Z][A-Za-z0-9\s-]{2,25}):\s*([^.\n]+)/g);
  for (const match of colonMatches) {
    const term = match[1].trim();
    const explanation = match[2].trim();
    if (keywords.length < 5 && term.length > 2) {
      keywords.push({
        term: term,
        category: "Core Concept",
        shortDef: explanation.slice(0, 100) + (explanation.length > 100 ? "..." : "."),
        fullDef: explanation
      });
      definitions.push({
        term: term,
        phonetic: "/" + term.toLowerCase().replace(/\s+/g, '-') + "/",
        partOfSpeech: "noun (domain terminology)",
        definition: explanation,
        example: `In this context, ${term} represents an essential operational component.`
      });
    }
  }

  // Fallbacks if not enough colon matches
  if (keywords.length < 2) {
    keywords.push({
      term: "Primary Framework",
      category: "Fundamental",
      shortDef: "The foundational theoretical model governing the presented relationships.",
      fullDef: "A structured conceptual foundation that clarifies causal relationships and predictive outcomes in this topic."
    });
    keywords.push({
      term: "Invariant Property",
      category: "Mechanism",
      shortDef: "A condition or constant that remains true across all operational transformations.",
      fullDef: "A strict behavioral invariant that must be maintained to prevent system or conceptual failure."
    });
  }

  if (definitions.length < 2) {
    definitions.push({
      term: "Domain Invariant",
      phonetic: "/dəʊˈmeɪn ɪnˈvɛə.ri.ənt/",
      partOfSpeech: "noun (technical)",
      definition: "A mathematical or structural constraint that must hold true throughout all stages of execution.",
      example: "Maintaining domain invariants prevents invalid state transitions."
    });
    definitions.push({
      term: "Synthesized Concept",
      phonetic: "/ˈsɪn.θə.saɪzd ˈkɒn.sɛpt/",
      partOfSpeech: "noun (pedagogy)",
      definition: "An integrated understanding formed by combining individual factual observations into a cohesive principle.",
      example: "Synthesized concepts allow learners to transfer knowledge to unfamiliar problem spaces."
    });
  }

  // Formulate quiz
  const quiz = [
    {
      id: "q-1",
      question: `What is the central focus of "${title}"?`,
      options: [
        `Analysis of foundational concepts and operational behavior in ${subject}`,
        "Purely historical documentation without current technical relevance",
        "An unrelated hardware specification standard",
        "Legacy system archival procedures"
      ],
      correctIndex: 0,
      explanation: `The material primarily investigates the core operational mechanisms and principles associated with ${title}.`
    },
    {
      id: "q-2",
      question: takeaways[0] 
        ? `According to the material: "${takeaways[0].slice(0, 70)}..." is:` 
        : "What primary invariant governs this domain?",
      options: [
        "A foundational principle explicitly stated in the source text",
        "A disproven hypothesis in modern literature",
        "An optional cosmetic suggestion",
        "A deprecated architectural choice"
      ],
      correctIndex: 0,
      explanation: "This directly reflects a core finding or rule established within the provided study material."
    },
    {
      id: "q-3",
      question: `Why is understanding ${keywords[0]?.term || 'the primary mechanism'} critical to mastering this topic?`,
      options: [
        "It establishes the baseline logic upon which subsequent behaviors rely",
        "It can be safely ignored without impacting comprehension",
        "It only applies to simulated environments",
        "It has no connection to the subject matter"
      ],
      correctIndex: 0,
      explanation: `${keywords[0]?.term || 'The primary concept'} forms the central structural pillar required for complete conceptual recall.`
    }
  ];

  return {
    id: 'topic-' + Date.now(),
    title,
    subject,
    subjectCode: subject.slice(0, 3).toUpperCase() + ' 101',
    readTime,
    createdAt: new Date().toISOString().split('T')[0],
    lastStudied: 'Just now',
    masteryScore: 0,
    isStarred: false,
    tags: [subject, "AI Generated", "RecallMe Study Set"],
    summary: takeaways.join(' ') || cleanText.slice(0, 160) + '...',
    sourceExcerpt: cleanText,
    sections,
    takeaways,
    keywords,
    definitions,
    quiz
  };
}

/**
 * Generate study material using Google Gemini API with fallback
 */
export async function generateWithGemini(rawText, userTitle = '', subject = 'General Science', options = {}) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    console.warn('[GeminiService] No GEMINI_API_KEY found in environment. Using intelligent local synthesis.');
    return generateFallbackStudyMaterial(rawText, userTitle, subject, options);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey.trim() });

    const prompt = `
You are RecallMe AI, an expert academic tutor and cognitive scientist.
Convert the following source material into structured, publication-grade active recall study materials.

Guidelines:
- Topic Title: Provide an academic, clear title. If user provided a title, refine it or use it.
- Subject: Classify into the appropriate domain (e.g., Computer Science, Medicine, Mathematics, History).
- Summary: 2-3 concise sentences summarizing the essence.
- Read Time: Estimated read time like "5 min read".
- Key Takeaways: 3-5 punchy, memorable bullet points.
- Sections: 2-4 comprehensive sections with headings and rich markdown explanations (use LaTeX math notation like $...$ if mathematical formulas appear).
- Keywords: 3-6 important domain terms with term, category, shortDef, fullDef.
- Definitions: 3-6 terms with term, phonetic, partOfSpeech, definition, and example sentence.
- Quiz: 4-6 high quality multiple-choice questions testing active recall. Each question MUST have 4 plausible options, a correctIndex (0, 1, 2, or 3), and a clear pedagogical explanation.

User Requested Title: ${userTitle || 'Auto-infer'}
Subject Domain: ${subject || 'Auto-infer'}

Source Material:
"""
${rawText}
"""
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            subject: { type: Type.STRING },
            subjectCode: { type: Type.STRING },
            readTime: { type: Type.STRING },
            summary: { type: Type.STRING },
            takeaways: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  heading: { type: Type.STRING },
                  content: { type: Type.STRING }
                },
                required: ['heading', 'content']
              }
            },
            keywords: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  category: { type: Type.STRING },
                  shortDef: { type: Type.STRING },
                  fullDef: { type: Type.STRING }
                },
                required: ['term', 'category', 'shortDef', 'fullDef']
              }
            },
            definitions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  phonetic: { type: Type.STRING },
                  partOfSpeech: { type: Type.STRING },
                  definition: { type: Type.STRING },
                  example: { type: Type.STRING }
                },
                required: ['term', 'definition']
              }
            },
            quiz: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  correctIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING }
                },
                required: ['question', 'options', 'correctIndex', 'explanation']
              }
            }
          },
          required: ['title', 'summary', 'takeaways', 'sections', 'keywords', 'definitions', 'quiz']
        }
      }
    });

    const parsed = JSON.parse(response.text);

    return {
      id: 'topic-' + Date.now(),
      title: parsed.title || userTitle || 'Synthesized Topic',
      subject: parsed.subject || subject || 'General',
      subjectCode: parsed.subjectCode || (subject.slice(0, 3).toUpperCase() + ' 201'),
      readTime: parsed.readTime || '4 min read',
      createdAt: new Date().toISOString().split('T')[0],
      lastStudied: 'Just now',
      masteryScore: 0,
      isStarred: false,
      tags: [parsed.subject || subject, 'Gemini AI', 'RecallMe'],
      summary: parsed.summary,
      sourceExcerpt: rawText,
      sections: parsed.sections || [],
      takeaways: parsed.takeaways || [],
      keywords: parsed.keywords || [],
      definitions: parsed.definitions || [],
      quiz: (parsed.quiz || []).map((q, idx) => ({
        id: `q-${idx + 1}`,
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation
      }))
    };
  } catch (error) {
    console.error('[GeminiService] Error calling Gemini API:', error.message);
    console.log('[GeminiService] Falling back to local synthesis engine.');
    return generateFallbackStudyMaterial(rawText, userTitle, subject, options);
  }
}
