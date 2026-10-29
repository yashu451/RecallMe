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

  let resolvedSubject = subject && subject !== 'General Science' ? subject : '';
  if (!resolvedSubject) {
    const textLower = cleanText.toLowerCase();
    if (textLower.match(/algorithm|stack|queue|tree|graph|binary|runtime|complexity|memory|cpu|cache|thread|process|database|sql|acid|query|socket|http|network/)) {
      resolvedSubject = 'Computer Science';
    } else if (textLower.match(/cell|protein|enzyme|chemiosmosis|dna|rna|gene|membrane|mitochondria|atp|respiration/)) {
      resolvedSubject = 'Biochemistry & Life Sciences';
    } else if (textLower.match(/inflation|market|taylor rule|rate|monetary|central bank|equilibrium|gdp|capital|finance/)) {
      resolvedSubject = 'Economics & Finance';
    } else if (textLower.match(/quantum|physics|electron|thermodynamics|wave|particle|mechanics|relativity/)) {
      resolvedSubject = 'Physics';
    } else if (textLower.match(/neuron|synapse|plasticity|cortex|cognitive|memory|brain|perception/)) {
      resolvedSubject = 'Cognitive Neuroscience';
    } else {
      resolvedSubject = 'General Academic';
    }
  }

  return {
    id: 'topic-' + Date.now(),
    title,
    subject: resolvedSubject,
    subjectCode: resolvedSubject.slice(0, 3).toUpperCase() + ' 101',
    readTime,
    createdAt: new Date().toISOString().split('T')[0],
    lastStudied: 'Just now',
    masteryScore: 0,
    isStarred: false,
    tags: [resolvedSubject, "AI Generated", "RecallMe Study Set"],
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
      model: 'gemini-2.5-flash',
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

/**
 * Intelligently generates questions grounded strictly in the provided study notes.
 * Used when Gemini is not configured or as a resilient fallback.
 */
export function generateGroundedQuestionsFromNotes(notes = [], difficulty = 'Medium', count = 5) {
  if (!notes || notes.length === 0) {
    throw new Error('At least one saved note is required to generate a quiz.');
  }

  // Filter notes that have actual content
  const validNotes = notes.filter(n => n && (n.title || n.summary || n.sections?.length || n.definitions?.length || n.takeaways?.length || n.sourceExcerpt));
  if (validNotes.length === 0) {
    throw new Error('The selected study notes contain no readable content to generate questions.');
  }

  // Collect candidate questions per note
  const perNoteQuestions = validNotes.map((note) => {
    const list = [];
    const noteTitle = note.title || 'Study Material';

    // 1. Existing pre-synthesized quiz items for this note
    if (Array.isArray(note.quiz) && note.quiz.length > 0) {
      note.quiz.forEach((q, qIdx) => {
        if (q.question && Array.isArray(q.options) && q.options.length >= 2) {
          const correctOpt = q.options[q.correctIndex !== undefined ? q.correctIndex : 0];
          list.push({
            id: `q-${note.id || 'n'}-${qIdx}-${Date.now()}`,
            question: q.question,
            options: [...q.options],
            correctAnswer: correctOpt,
            explanation: q.explanation || `Derived directly from ${noteTitle}.`,
            sourceNoteTitle: noteTitle,
            difficulty: 'Medium'
          });
        }
      });
    }

    // 2. Synthesize questions from Definitions
    if (Array.isArray(note.definitions) && note.definitions.length > 0) {
      note.definitions.forEach((def, dIdx) => {
        if (def.term && def.definition) {
          const otherDefs = note.definitions.filter(o => o.term !== def.term).map(o => o.definition);
          const distractors = [
            otherDefs[0] || `A secondary procedural routine unrelated to ${def.term}`,
            otherDefs[1] || `A deprecated static constant replaced in modern specifications`,
            otherDefs[2] || `An optional configuration flag that has no impact on runtime semantics`
          ];

          list.push({
            id: `def-q-${note.id || 'n'}-${dIdx}`,
            question: `In "${noteTitle}", what is the formal definition or role of "${def.term}"?`,
            options: [def.definition, distractors[0], distractors[1], distractors[2]],
            correctAnswer: def.definition,
            explanation: `In ${noteTitle}, "${def.term}" is defined as: ${def.definition}.${def.example ? ` Example: "${def.example}"` : ''}`,
            sourceNoteTitle: noteTitle,
            difficulty: 'Easy'
          });
        }
      });
    }

    // 3. Synthesize questions from Keywords
    if (Array.isArray(note.keywords) && note.keywords.length > 0) {
      note.keywords.forEach((kw, kIdx) => {
        if (kw.term && (kw.shortDef || kw.fullDef)) {
          const otherTerms = note.keywords.filter(o => o.term !== kw.term).map(o => o.term);
          const distractors = [
            otherTerms[0] || 'Passive Buffering Protocol',
            otherTerms[1] || 'Asynchronous Memory Polling',
            otherTerms[2] || 'Static Stack Allocation'
          ];

          list.push({
            id: `kw-q-${note.id || 'n'}-${kIdx}`,
            question: `In "${noteTitle}", which core concept is defined as: "${kw.shortDef || kw.fullDef}"?`,
            options: [kw.term, distractors[0], distractors[1], distractors[2]],
            correctAnswer: kw.term,
            explanation: `"${kw.term}" in ${noteTitle} represents: ${kw.fullDef || kw.shortDef}.`,
            sourceNoteTitle: noteTitle,
            difficulty: 'Medium'
          });
        }
      });
    }

    // 4. Synthesize questions from Key Takeaways
    if (Array.isArray(note.takeaways) && note.takeaways.length > 0) {
      note.takeaways.forEach((takeaway, tIdx) => {
        if (takeaway && takeaway.length > 20) {
          list.push({
            id: `tk-q-${note.id || 'n'}-${tIdx}`,
            question: `Which of the following is an invariant principle or key takeaway emphasized in "${noteTitle}"?`,
            options: [
              takeaway,
              "Operational invariants can be safely violated without affecting system correctness",
              "Empirical evaluation showed no measurable retention benefit for structured retrieval",
              "Execution is strictly serialized without memory caching or pipeline parallelism"
            ],
            correctAnswer: takeaway,
            explanation: `Explicitly established as a key takeaway in "${noteTitle}": ${takeaway}`,
            sourceNoteTitle: noteTitle,
            difficulty: 'Hard'
          });
        }
      });
    }

    // 5. Synthesize from Sections
    if (list.length < 3 && Array.isArray(note.sections)) {
      note.sections.forEach((sec, sIdx) => {
        if (sec.heading && sec.content) {
          const snippet = sec.content.split('\n')[0].slice(0, 120);
          list.push({
            id: `sec-q-${note.id || 'n'}-${sIdx}`,
            question: `What foundational concept does section "${sec.heading}" in "${noteTitle}" describe?`,
            options: [
              snippet + (snippet.endsWith('.') ? '' : '...'),
              "A deprecated legacy implementation detail superseded in modern practice",
              "A database migration script that only applies to offline environments",
              "A cosmetic formatting rule with no mathematical or logical consequence"
            ],
            correctAnswer: snippet + (snippet.endsWith('.') ? '' : '...'),
            explanation: `Detailed under section "${sec.heading}" of ${noteTitle}.`,
            sourceNoteTitle: noteTitle,
            difficulty: 'Medium'
          });
        }
      });
    }

    return list;
  });

  // Distribute questions evenly across notes (round-robin)
  const result = [];
  const targetCount = Number(count) || 5;

  let noteIdx = 0;
  let attempts = 0;
  const maxAttempts = targetCount * 6;
  const usedIds = new Set();

  while (result.length < targetCount && attempts < maxAttempts) {
    attempts++;
    const notePool = perNoteQuestions[noteIdx % perNoteQuestions.length];
    noteIdx++;

    if (!notePool || notePool.length === 0) continue;

    let candidate = notePool.find(q => !usedIds.has(q.id) && q.difficulty === difficulty);
    if (!candidate) {
      candidate = notePool.find(q => !usedIds.has(q.id));
    }
    if (!candidate) {
      const base = notePool[Math.floor(Math.random() * notePool.length)];
      candidate = { ...base, id: `${base.id}-var-${result.length + 1}` };
    }

    usedIds.add(candidate.id);

    // Shuffle options so correct answer is not always in position 0
    const shuffledOptions = [...candidate.options];
    for (let i = shuffledOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
    }

    const correctIndex = shuffledOptions.indexOf(candidate.correctAnswer);

    result.push({
      id: candidate.id || `q-${result.length + 1}`,
      question: candidate.question,
      options: shuffledOptions,
      correctIndex: correctIndex >= 0 ? correctIndex : 0,
      correctAnswer: candidate.correctAnswer,
      explanation: candidate.explanation,
      sourceNoteTitle: candidate.sourceNoteTitle
    });
  }

  if (result.length === 0) {
    throw new Error('Unable to extract sufficient quiz questions from the provided notes.');
  }

  return result.slice(0, targetCount);
}

/**
 * Generate quiz questions strictly from selected study notes using Gemini AI,
 * falling back to intelligent note-grounded synthesis.
 */
export async function generateQuizFromNotes(notes = [], difficulty = 'Medium', count = 5) {
  if (!notes || notes.length === 0) {
    throw new Error('Please select at least one saved note to generate practice quiz questions.');
  }

  const validNotes = notes.filter(n => n && (n.title || n.summary || n.sections?.length || n.definitions?.length || n.takeaways?.length || n.sourceExcerpt));
  if (validNotes.length === 0) {
    throw new Error('The selected study notes contain no readable content to generate questions.');
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const hasGemini = Boolean(apiKey && apiKey.trim() && apiKey !== 'YOUR_GEMINI_API_KEY_HERE');

  if (hasGemini) {
    try {
      const ai = new GoogleGenAI({ apiKey: apiKey.trim() });

      const compiledContent = validNotes.map((note, idx) => {
        let text = `=== NOTE ${idx + 1}: ${note.title} (Subject: ${note.subject || 'General'}) ===\n`;
        if (note.summary) text += `Summary: ${note.summary}\n\n`;
        if (note.takeaways?.length) text += `Key Takeaways:\n${note.takeaways.map(t => '- ' + t).join('\n')}\n\n`;
        if (note.sections?.length) {
          text += `Sections:\n` + note.sections.map(s => `--- ${s.heading} ---\n${s.content}`).join('\n\n') + '\n\n';
        }
        if (note.definitions?.length) {
          text += `Glossary Terms:\n` + note.definitions.map(d => `- ${d.term}: ${d.definition}`).join('\n') + '\n\n';
        }
        if (note.sourceExcerpt && !note.sections?.length) {
          text += `Source Text:\n${note.sourceExcerpt}\n\n`;
        }
        return text;
      }).join('\n====================================\n\n');

      const prompt = `
You are RecallMe AI, an expert exam creator.
Create exactly ${count} multiple-choice practice quiz questions at "${difficulty}" difficulty based STRICTLY on the content in the following student study notes.

STRICT INSTRUCTIONS:
1. Every question MUST test a specific concept, definition, rule, mechanism, invariant, or key fact directly stated in the notes below.
2. DO NOT use generic or outside trivia. DO NOT generate questions about topics not present in these notes (e.g., do not generate SQL, React, or Arrays unless explicitly in the text).
3. If multiple notes are provided, distribute questions evenly across the notes.
4. Each question must have:
   - "question": clear question prompt
   - "options": an array of exactly 4 plausible choices (one correct, three plausible distractors based on the domain context)
   - "correctIndex": integer (0, 1, 2, or 3) indicating the correct option
   - "explanation": a concise rationale explaining why this option is correct citing the note's concept
   - "sourceNoteTitle": the title of the specific note this question was drawn from
5. Difficulty calibration:
   - Easy: Direct recall of terms, definitions, and core facts explicitly named.
   - Medium: Conceptual understanding, distinguishing mechanisms, and applying rules described in the notes.
   - Hard: Analyzing complex invariants, comparing sections, or identifying subtle implications stated in the notes.

STUDY NOTES:
"""
${compiledContent}
"""
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    question: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    },
                    correctIndex: { type: Type.INTEGER },
                    explanation: { type: Type.STRING },
                    sourceNoteTitle: { type: Type.STRING }
                  },
                  required: ['question', 'options', 'correctIndex', 'explanation']
                }
              }
            },
            required: ['questions']
          }
        }
      });

      const parsed = JSON.parse(response.text.trim());
      if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
        return parsed.questions.slice(0, count).map((q, idx) => ({
          id: q.id || `q-${idx + 1}-${Date.now()}`,
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
          correctAnswer: q.options[q.correctIndex],
          explanation: q.explanation,
          sourceNoteTitle: q.sourceNoteTitle || validNotes[idx % validNotes.length].title
        }));
      }
    } catch (err) {
      console.warn('[GeminiService] Live Gemini quiz generation failed, using intelligent local synthesis from notes:', err.message);
    }
  }

  // Resilient note-grounded question synthesis
  return generateGroundedQuestionsFromNotes(validNotes, difficulty, count);
}
