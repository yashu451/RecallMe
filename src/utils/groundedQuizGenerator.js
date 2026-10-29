/**
 * Grounded Question Generator for RecallMe
 * Generates quiz questions strictly extracted from user-provided study notes.
 * Extracts from:
 * 1. Pre-generated note.quiz items
 * 2. Note definitions / glossary terms
 * 3. Note keywords
 * 4. Key takeaways & core principles
 * 5. Section headings & content excerpts
 * 
 * Never generates generic topics (no arrays, react, SQL) unless explicitly present in the note.
 */

export function generateGroundedQuestionsFromNotes(notes = [], difficulty = 'Medium', count = 5) {
  if (!notes || notes.length === 0) {
    throw new Error('Please select at least one study note from your library to generate a practice quiz.');
  }

  const validNotes = notes.filter(n => n && (n.title || n.summary || n.sections?.length || n.definitions?.length || n.takeaways?.length || n.sourceExcerpt));
  if (validNotes.length === 0) {
    throw new Error('The selected study notes do not contain sufficient content or definitions to generate practice questions.');
  }

  const perNoteQuestions = validNotes.map(note => {
    const list = [];
    const noteTitle = note.title || 'Study Note';

    // 1. Existing quiz items on the note
    if (Array.isArray(note.quiz) && note.quiz.length > 0) {
      note.quiz.forEach((q, qIdx) => {
        if (q && q.question && Array.isArray(q.options) && q.options.length >= 2) {
          const expected = q.correctAnswer !== undefined 
            ? q.correctAnswer 
            : (q.correctIndex !== undefined ? q.options[q.correctIndex] : q.options[0]);

          list.push({
            id: q.id || `nq-${note.id || 'note'}-${qIdx}`,
            question: q.question,
            options: [...q.options],
            correctAnswer: expected,
            correctIndex: q.correctIndex !== undefined ? q.correctIndex : q.options.indexOf(expected),
            explanation: q.explanation || `Derived directly from "${noteTitle}".`,
            sourceNoteTitle: noteTitle,
            difficulty: q.difficulty || 'Medium'
          });
        }
      });
    }

    // 2. Definitions / Glossary terms
    if (Array.isArray(note.definitions) && note.definitions.length > 0) {
      note.definitions.forEach((def, dIdx) => {
        if (def && def.term && def.definition) {
          // Distractors from other definitions in this or other notes
          const otherDefs = validNotes
            .flatMap(n => n.definitions || [])
            .filter(d => d.term !== def.term && d.definition)
            .map(d => d.definition);

          const distractors = otherDefs.slice(0, 3);
          while (distractors.length < 3) {
            distractors.push(
              distractors.length === 0 
                ? `An auxiliary helper function with no state effect on ${def.term}`
                : (distractors.length === 1 
                  ? `A deprecated convention replaced by modern asynchronous workflows`
                  : `A temporary configuration flag utilized strictly in testing`)
            );
          }

          list.push({
            id: `def-q-${note.id || 'n'}-${dIdx}`,
            question: `In "${noteTitle}", what is the accurate definition of "${def.term}"?`,
            options: [def.definition, ...distractors.slice(0, 3)],
            correctAnswer: def.definition,
            explanation: `According to the glossary in "${noteTitle}": ${def.term} is defined as "${def.definition}".`,
            sourceNoteTitle: noteTitle,
            difficulty: 'Easy'
          });

          // Inverse question: which term matches this definition?
          const otherTerms = validNotes
            .flatMap(n => n.definitions || [])
            .filter(d => d.term !== def.term)
            .map(d => d.term);
          const termDistractors = otherTerms.slice(0, 3);
          while (termDistractors.length < 3) {
            termDistractors.push(
              termDistractors.length === 0 ? `Sub-invariant Protocol` : (termDistractors.length === 1 ? `Sequential Buffer` : `Auxiliary Node`)
            );
          }

          list.push({
            id: `def-inv-q-${note.id || 'n'}-${dIdx}`,
            question: `Which concept from "${noteTitle}" is defined as: "${def.definition.slice(0, 110)}${def.definition.length > 110 ? '...' : ''}"?`,
            options: [def.term, ...termDistractors.slice(0, 3)],
            correctAnswer: def.term,
            explanation: `In "${noteTitle}", "${def.term}" is defined by this exact specification.`,
            sourceNoteTitle: noteTitle,
            difficulty: 'Medium'
          });
        }
      });
    }

    // 3. Keywords
    if (Array.isArray(note.keywords) && note.keywords.length > 0) {
      note.keywords.forEach((kw, kIdx) => {
        if (kw && kw.term && (kw.shortDef || kw.fullDef)) {
          const meaning = kw.shortDef || kw.fullDef;
          list.push({
            id: `kw-q-${note.id || 'n'}-${kIdx}`,
            question: `What role or meaning does the key concept "${kw.term}" carry in "${noteTitle}"?`,
            options: [
              meaning,
              `A secondary formatting detail not critical to system operation`,
              `An arbitrary identifier used solely for legacy backward compatibility`,
              `A variable strictly constrained to local compilation phases`
            ],
            correctAnswer: meaning,
            explanation: `In the study notes for "${noteTitle}", ${kw.term} signifies: ${meaning}`,
            sourceNoteTitle: noteTitle,
            difficulty: 'Medium'
          });
        }
      });
    }

    // 4. Key Takeaways
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

    // 5. Sections
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

    // 6. Summary fallback if needed
    if (list.length === 0 && note.summary) {
      list.push({
        id: `sum-q-${note.id || 'n'}`,
        question: `What is the primary core subject explored in "${noteTitle}"?`,
        options: [
          note.summary.slice(0, 120) + (note.summary.length > 120 ? '...' : ''),
          "A speculative overview of unrelated computational mathematics",
          "An outdated framework deprecated in early software architectures",
          "A non-reproducible hypothesis without experimental validation"
        ],
        correctAnswer: note.summary.slice(0, 120) + (note.summary.length > 120 ? '...' : ''),
        explanation: `Summarized in the overview for "${noteTitle}".`,
        sourceNoteTitle: noteTitle,
        difficulty: 'Easy'
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
    throw new Error('Unable to extract sufficient quiz questions from the provided notes. Please ensure notes contain text, definitions, or summaries.');
  }

  return result.slice(0, targetCount);
}

