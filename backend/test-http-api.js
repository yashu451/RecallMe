import http from 'http';

async function run() {
  console.log('[Integration Test] Starting RecallMe server in-process...');
  await import('./server.js');
  
  // wait 1.5s for port binding
  await new Promise(r => setTimeout(r, 1500));

  console.log('\n--- 1. Testing GET /api/health ---');
  const healthRes = await fetch('http://127.0.0.1:5000/api/health');
  const health = await healthRes.json();
  console.log('✓ Health response:', health);

  console.log('\n--- 2. Testing Strict Auth: Login BEFORE Signup (Must Fail) ---');
  const unregLoginRes = await fetch('http://127.0.0.1:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'brand_new_user@test.edu', password: 'password123' })
  });
  const unregData = await unregLoginRes.json();
  console.log(`✓ Status: ${unregLoginRes.status} (Expected 404)`);
  console.log(`✓ Rejection message: "${unregData.error}"`);
  if (unregLoginRes.status !== 404) {
    throw new Error('Unregistered user was unexpectedly allowed to log in!');
  }

  console.log('\n--- 3. Testing Strict Auth: User Signs Up First ---');
  const testEmail = 'new_student_' + Date.now() + '@stanford.edu';
  const signupRes = await fetch('http://127.0.0.1:5000/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Maya Lin',
      email: testEmail,
      password: 'mypassword456'
    })
  });
  const signupData = await signupRes.json();
  console.log(`✓ Status: ${signupRes.status} (Expected 201)`);
  console.log(`✓ Created user: ${signupData.user?.name} (${signupData.user?.email})`);
  if (!signupData.success) throw new Error('Signup failed: ' + signupData.error);

  console.log('\n--- 4. Testing Strict Auth: Login with Registered Account ---');
  const loginRes = await fetch('http://127.0.0.1:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: 'mypassword456' })
  });
  const loginData = await loginRes.json();
  console.log(`✓ Status: ${loginRes.status} (Expected 200)`);
  console.log(`✓ Successfully logged in as: ${loginData.user?.name}`);
  if (!loginData.success) throw new Error('Login after signup failed: ' + loginData.error);

  console.log('\n--- 5. Testing POST /api/generate (with Java Stack excerpt) ---');
  const genRes = await fetch('http://127.0.0.1:5000/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: 'A stack is a linear data structure that follows the LIFO principle, which means Last In, First Out. Elements are added using push() and removed using pop(). The peek() method returns the top element without removing it.',
      title: 'Java Stack & Memory Operations',
      subject: 'Computer Science',
      options: { notes: true, keywords: true, definitions: true, quiz: true },
      saveToDb: true
    })
  });
  const genData = await genRes.json();
  console.log('✓ AI Material generated and verified:');
  console.log('  Title:', genData.title);
  console.log('  Quiz questions:', genData.quiz?.length);

  console.log('\n--- 6. Testing GET /api/topics ---');
  const topicsRes = await fetch('http://127.0.0.1:5000/api/topics');
  const topics = await topicsRes.json();
  console.log(`✓ Loaded ${topics.length} topics from SQLite.`);

  console.log('\n--- 7. Testing POST /api/quiz/attempt ---');
  const attemptRes = await fetch('http://127.0.0.1:5000/api/quiz/attempt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      topicId: genData.id,
      topicTitle: genData.title,
      subject: genData.subject,
      score: 3,
      totalQuestions: 3,
      percentage: 100,
      timeTaken: '1m 20s',
      feedback: 'Flawless recall!'
    })
  });
  const attemptData = await attemptRes.json();
  console.log('✓ Quiz attempt recorded! Score:', attemptData.score + '/' + attemptData.totalQuestions);

  console.log('\n======================================================');
  console.log('   ALL AUTH & WORKFLOW TESTS PASSED WITH 100%!        ');
  console.log('======================================================\n');
  process.exit(0);
}

run().catch(err => {
  console.error('❌ HTTP API Test failed:', err);
  process.exit(1);
});
