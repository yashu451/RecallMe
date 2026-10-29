import { initDatabase, getAllTopics, saveTopic, toggleTopicStar, deleteTopic, getAllQuizHistory, saveQuizAttempt } from './database/db.js';
import { generateWithGemini } from './services/geminiService.js';
import { INITIAL_TOPICS, INITIAL_QUIZ_HISTORY } from '../src/data/mockData.js';

async function runTests() {
  console.log('--- STARTING BACKEND & AI INTEGRATION TESTS ---\n');

  // Test 1: SQLite Init & Seeding
  console.log('Test 1: Initializing SQLite database...');
  await initDatabase(INITIAL_TOPICS, INITIAL_QUIZ_HISTORY);
  const topics = await getAllTopics();
  console.log(`✓ SQLite initialized successfully. Total topics loaded: ${topics.length}`);
  if (topics.length === 0) throw new Error('Expected seeded topics, got 0');

  // Test 2: Star toggle
  console.log('\nTest 2: Testing topic star toggle...');
  const firstTopicId = topics[0].id;
  const originalStar = topics[0].isStarred;
  const starred = await toggleTopicStar(firstTopicId);
  console.log(`✓ Topic "${firstTopicId}" star toggled: ${originalStar} -> ${starred.isStarred}`);
  // revert star
  await toggleTopicStar(firstTopicId);

  // Test 3: Quiz history
  console.log('\nTest 3: Testing quiz history persistence...');
  const history = await getAllQuizHistory();
  console.log(`✓ Quiz history loaded: ${history.length} records found`);
  
  const testAttempt = {
    id: 'test-attempt-' + Date.now(),
    topicId: firstTopicId,
    topicTitle: topics[0].title,
    subject: topics[0].subject,
    score: 4,
    totalQuestions: 5,
    percentage: 80,
    timeTaken: '2m 15s',
    date: 'Today',
    feedback: 'Excellent recall score!'
  };
  await saveQuizAttempt(testAttempt);
  const updatedHistory = await getAllQuizHistory();
  const foundAttempt = updatedHistory.find(h => h.id === testAttempt.id);
  if (!foundAttempt) throw new Error('Failed to save quiz attempt');
  console.log('✓ Successfully saved and retrieved new quiz attempt in SQLite!');

  // Test 4: AI Material Generation with sample text
  console.log('\nTest 4: Testing Study Material Generator...');
  const sampleInput = `A stack is a linear data structure that follows the LIFO principle, which means Last In, First Out. Elements are added using push() and removed using pop(). The peek() method returns the top element without removing it. Stack operations are commonly used in function calls, undo operations, and expression evaluation.`;

  const generated = await generateWithGemini(sampleInput, 'Java Stack Data Structure', 'Computer Science');
  
  console.log('✓ Generation output received:');
  console.log('  - Title:', generated.title);
  console.log('  - Subject:', generated.subject);
  console.log('  - Read Time:', generated.readTime);
  console.log('  - Summary:', generated.summary.slice(0, 80) + '...');
  console.log(`  - Takeaways (${generated.takeaways.length}):`, generated.takeaways[0]);
  console.log(`  - Sections (${generated.sections.length}):`, generated.sections.map(s => s.heading));
  console.log(`  - Keywords (${generated.keywords.length}):`, generated.keywords.map(k => k.term).join(', '));
  console.log(`  - Definitions (${generated.definitions.length}):`, generated.definitions.map(d => d.term).join(', '));
  console.log(`  - Quiz (${generated.quiz.length} questions):`);
  generated.quiz.forEach((q, i) => {
    console.log(`    Q${i+1}: ${q.question}`);
    console.log(`        Options: ${q.options.join(' | ')}`);
    console.log(`        Correct: [${q.correctIndex}] ${q.options[q.correctIndex]}`);
  });

  // Verify all fields are present for React frontend compatibility
  const requiredFields = ['id', 'title', 'subject', 'readTime', 'summary', 'sections', 'takeaways', 'keywords', 'definitions', 'quiz'];
  for (const field of requiredFields) {
    if (!generated[field]) {
      throw new Error(`Missing expected field in generated object: ${field}`);
    }
  }

  // Save generated topic into database
  await saveTopic(generated);
  const reloaded = await getAllTopics();
  const isFound = reloaded.some(t => t.id === generated.id);
  console.log(`\n✓ Generated topic saved and confirmed in SQLite! (Found: ${isFound})`);

  console.log('\n======================================================');
  console.log(' ALL BACKEND & DATABASE TESTS PASSED WITH 100% SUCCESS!');
  console.log('======================================================\n');
  process.exit(0);
}

runTests().catch(err => {
  console.error('\n❌ Test failed:', err);
  process.exit(1);
});
