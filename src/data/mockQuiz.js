/**
 * Mock Quiz Data Module
 * Follows the backend API contract:
 * GET /api/quiz/:noteId
 * {
 *   "noteId": "123",
 *   "topic": "Java Stack",
 *   "questions": [
 *     {
 *       "id": "q1",
 *       "question": "Which principle does a stack follow?",
 *       "options": ["FIFO", "LIFO", "LILO", "FILO"],
 *       "correctAnswer": "LIFO",
 *       "explanation": "A stack follows Last In, First Out."
 *     }
 *   ]
 * }
 */

export const AVAILABLE_QUIZ_SECTIONS = [
  { id: "123", title: "Java Stack (DSA)", category: "Data Structures & Algorithms" },
  { id: "dbms", title: "DBMS & ACID Transactions", category: "Database Management" },
  { id: "transformer-architecture", title: "Transformer & Attention", category: "Machine Learning / AI" },
  { id: "synaptic-plasticity", title: "Synaptic Plasticity & Memory", category: "Cognitive Science" },
  { id: "distributed-consensus", title: "Distributed Consensus (Raft/Paxos)", category: "Distributed Systems" },
  { id: "os-scheduling", title: "Operating Systems & Scheduling", category: "Systems & Architecture" },
];

export const MOCK_QUIZZES = {
  // 1. Java Stack (DSA) - NoteId "123"
  "123": {
    noteId: "123",
    topic: "Java Stack (Data Structures & Algorithms)",
    category: "DSA",
    questions: [
      {
        id: "q1",
        question: "Which principle does a stack follow?",
        options: ["FIFO", "LIFO", "LILO", "FILO"],
        correctAnswer: "LIFO",
        explanation: "A stack is a linear data structure that operates under Last In, First Out (LIFO), meaning the most recently added item is the first one removed."
      },
      {
        id: "q2",
        question: "Which method in Java's Stack class retrieves and removes the element at the top?",
        options: ["peek()", "pop()", "push()", "poll()"],
        correctAnswer: "pop()",
        explanation: "The pop() method removes and returns the top element of the stack. In contrast, peek() retrieves the top element without removing it."
      },
      {
        id: "q3",
        question: "What exception is thrown when pop() or peek() is invoked on an empty java.util.Stack?",
        options: ["NullPointerException", "EmptyStackException", "NoSuchElementException", "IllegalStateException"],
        correctAnswer: "EmptyStackException",
        explanation: "Java's legacy java.util.Stack throws an EmptyStackException (a subclass of RuntimeException) when attempting to access an empty stack."
      },
      {
        id: "q4",
        question: "What is the asymptotic time complexity of standard push() and pop() operations on a stack?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswer: "O(1)",
        explanation: "Push and pop operations only interact with the top pointer, requiring constant O(1) time regardless of the total number of elements."
      }
    ]
  },

  // 2. DBMS — Transaction Management & ACID Properties
  "dbms": {
    noteId: "dbms",
    topic: "DBMS — Transaction Management & ACID Properties",
    category: "Database",
    questions: [
      {
        id: "dbms-1",
        question: "Which ACID property guarantees that all operations in a database transaction succeed or all fail?",
        options: ["Atomicity", "Consistency", "Isolation", "Durability"],
        correctAnswer: "Atomicity",
        explanation: "Atomicity ensures the 'all-or-nothing' invariant of transactions: if any statement fails, the entire transaction is rolled back."
      },
      {
        id: "dbms-2",
        question: "What concurrency phenomenon occurs when a transaction reads uncommitted changes made by another transaction?",
        options: ["Dirty Read", "Non-repeatable Read", "Phantom Read", "Lost Update"],
        correctAnswer: "Dirty Read",
        explanation: "A Dirty Read happens when Transaction A reads data modified by Transaction B before Transaction B commits; if Transaction B aborts, Transaction A's read was invalid."
      },
      {
        id: "dbms-3",
        question: "Which mechanism guarantees Durability in a relational database management system across hardware crashes?",
        options: ["Buffer Pool LRU Cache", "Write-Ahead Logging (WAL)", "Query Optimizer Cost Estimator", "Hash Joins"],
        correctAnswer: "Write-Ahead Logging (WAL)",
        explanation: "Write-Ahead Logging ensures that log records are flushed to stable non-volatile storage before corresponding dirty database pages are written to disk."
      },
      {
        id: "dbms-4",
        question: "A relation is in Second Normal Form (2NF) if and only if it is in 1NF and what condition holds?",
        options: [
          "Every non-prime attribute is fully functionally dependent on the primary key",
          "There are no transitive functional dependencies",
          "Every determinant is a candidate key",
          "All multivalued dependencies are decomposed"
        ],
        correctAnswer: "Every non-prime attribute is fully functionally dependent on the primary key",
        explanation: "2NF eliminates partial dependencies, meaning no non-prime attribute may depend on only a subset of any candidate key."
      }
    ]
  },

  // 3. Transformer Architecture & Self-Attention
  "transformer-architecture": {
    noteId: "transformer-architecture",
    topic: "Transformer Architecture & Self-Attention",
    category: "Machine Learning",
    questions: [
      {
        id: "tf-1",
        question: "Why is the inner product of queries and keys scaled by 1/√d_k in Scaled Dot-Product Attention?",
        options: [
          "To reduce computational complexity from O(N²) to O(N)",
          "To prevent variance from growing large and pushing softmax into flat saturation zones",
          "To enforce unitary orthogonal properties on weight projections",
          "To compress input sequence length"
        ],
        correctAnswer: "To prevent variance from growing large and pushing softmax into flat saturation zones",
        explanation: "When dimension d_k is large, inner products grow large in magnitude, driving the softmax function into regions with vanishingly small gradients. Dividing by √d_k normalizes variance to 1."
      },
      {
        id: "tf-2",
        question: "What primary advantage does Multi-Head Attention provide over a single attention head?",
        options: [
          "It eliminates the need for residual connections",
          "It allows the model to jointly attend to information from different representation subspaces",
          "It guarantees strictly linear O(N) inference time",
          "It removes the need for Layer Normalization"
        ],
        correctAnswer: "It allows the model to jointly attend to information from different representation subspaces",
        explanation: "Multi-head attention projects queries, keys, and values into multiple lower-dimensional subspaces, allowing heads to independently track syntactic, semantic, and positional relationships."
      },
      {
        id: "tf-3",
        question: "What is the maximum path length between any two arbitrary tokens in a self-attention layer?",
        options: ["O(1)", "O(log N)", "O(N)", "O(N² log N)"],
        correctAnswer: "O(1)",
        explanation: "Unlike recurrent architectures that require O(N) sequential transitions, self-attention connects any pair of tokens directly via matrix multiplication in a constant O(1) path length."
      },
      {
        id: "tf-4",
        question: "Why are Positional Encodings required in the standard Transformer architecture?",
        options: [
          "Because attention matrices are not symmetric",
          "Because self-attention is permutation-equivariant and lacks an inherent sense of word order",
          "To convert token vectors into floating point values",
          "To speed up GPU tensor cores"
        ],
        correctAnswer: "Because self-attention is permutation-equivariant and lacks an inherent sense of word order",
        explanation: "Without positional encodings added to the input embeddings, the attention mechanism treats tokens as an unordered bag of words."
      }
    ]
  },

  // 4. Synaptic Plasticity & Spaced Repetition
  "synaptic-plasticity": {
    noteId: "synaptic-plasticity",
    topic: "Synaptic Plasticity & Spaced Repetition",
    category: "Cognitive Science",
    questions: [
      {
        id: "sp-1",
        question: "Under resting membrane potentials (~ -70 mV), why is Ca²⁺ blocked from flowing through NMDA channels?",
        options: [
          "An extracellular magnesium (Mg²⁺) ion physically obstructs the channel pore",
          "Glutamate acts as an antagonist at hyperpolarized voltages",
          "Potassium efflux creates an opposing electrostatic barrier",
          "Calcium channels are denatured at resting temperature"
        ],
        correctAnswer: "An extracellular magnesium (Mg²⁺) ion physically obstructs the channel pore",
        explanation: "At negative resting potentials, positively charged Mg²⁺ ions are electrostatically pulled into the NMDA receptor pore, preventing ion flow until postsynaptic depolarization expels the ion."
      },
      {
        id: "sp-2",
        question: "What direct action does activated CaMKII trigger during early-phase Long-Term Potentiation (LTP)?",
        options: [
          "It permanently blocks presynaptic vesicles",
          "It phosphorylates AMPA receptors and recruits reserve AMPA receptors into the postsynaptic density",
          "It degrades the myelin sheath to accelerate action potentials",
          "It downregulates all glutamate production in astrocytes"
        ],
        correctAnswer: "It phosphorylates AMPA receptors and recruits reserve AMPA receptors into the postsynaptic density",
        explanation: "Calcium-activated CaMKII enhances single-channel conductance of existing AMPA receptors and directs exocytosis of reserve AMPA receptors to the synaptic membrane."
      },
      {
        id: "sp-3",
        question: "Why does spaced repetition produce higher long-term retention than massed practice (cramming)?",
        options: [
          "Massed practice depletes the brain's total neurotransmitters permanently",
          "Spaced practice provides the necessary temporal delay for CREB-mediated gene transcription and structural protein synthesis",
          "Spaced practice bypasses the hippocampus completely",
          "Massed practice prevents glucose absorption"
        ],
        correctAnswer: "Spaced practice provides the necessary temporal delay for CREB-mediated gene transcription and structural protein synthesis",
        explanation: "Late-phase LTP requires nuclear signaling and de novo protein synthesis. Spaced intervals allow time for cellular consolidation into enduring dendritic spine structures."
      },
      {
        id: "sp-4",
        question: "In the Ebbinghaus forgetting curve R = e^(-t/S), what does the variable 'S' represent?",
        options: [
          "The subjective difficulty rating of the text",
          "Memory strength (stability of the memory trace), which increases with spaced retrieval",
          "The number of syllables memorized",
          "The sleep duration between study intervals"
        ],
        correctAnswer: "Memory strength (stability of the memory trace), which increases with spaced retrieval",
        explanation: "S denotes the stability or strength of the memory trace. Every active retrieval session increases S, flattening the future decay curve."
      }
    ]
  },

  // 5. Distributed Consensus: Raft vs. Paxos
  "distributed-consensus": {
    noteId: "distributed-consensus",
    topic: "Distributed Consensus: Raft vs. Paxos",
    category: "Distributed Systems",
    questions: [
      {
        id: "dc-1",
        question: "In the Raft consensus algorithm, what role does a randomized election timeout play?",
        options: [
          "It prevents split votes by staggering candidate campaign starts across followers",
          "It encrypts RPC network communications",
          "It forces the leader to commit entries to disk faster",
          "It compresses the write-ahead log during snapshotting"
        ],
        correctAnswer: "It prevents split votes by staggering candidate campaign starts across followers",
        explanation: "Randomizing timeouts between 150ms and 300ms ensures that usually only a single follower times out and becomes a Candidate at any moment, avoiding split-vote ties."
      },
      {
        id: "dc-2",
        question: "What minimum quorum size is required in a cluster of N nodes to guarantee safety in Raft or Paxos?",
        options: [
          "⌊N / 2⌋ + 1 nodes (simple majority)",
          "All N nodes must agree unconditionally",
          "Exactly 2 nodes regardless of cluster size",
          "1 node if it is marked as the leader"
        ],
        correctAnswer: "⌊N / 2⌋ + 1 nodes (simple majority)",
        explanation: "A majority quorum of ⌊N / 2⌋ + 1 ensures that any two quorums must overlap on at least one node, preventing split-brain states."
      },
      {
        id: "dc-3",
        question: "According to the Raft commit safety rule, how does a leader commit an entry from a prior term?",
        options: [
          "By committing at least one entry from its current term by storing it on a majority of nodes",
          "By immediately incrementing its term counter to infinity",
          "By asking all followers to run Paxos round 1",
          "Prior entries are permanently locked and cannot be committed"
        ],
        correctAnswer: "By committing at least one entry from its current term by storing it on a majority of nodes",
        explanation: "A Raft leader cannot commit an older term entry by counting replicas alone. It must commit an entry from its own current term, which indirectly commits earlier entries."
      },
      {
        id: "dc-4",
        question: "What fundamental property does the FLP Impossibility Theorem prove?",
        options: [
          "No deterministic consensus algorithm can guarantee liveness in an asynchronous network with even one crash failure",
          "Networks cannot transfer more than 100MB per second",
          "Byzantine faults can never be detected",
          "Linearizability requires synchronous clocks"
        ],
        correctAnswer: "No deterministic consensus algorithm can guarantee liveness in an asynchronous network with even one crash failure",
        explanation: "Fischer, Lynch, and Paterson proved that in a purely asynchronous network, no deterministic protocol can guarantee both safety and termination if a node can crash silently."
      }
    ]
  },

  // 6. Operating Systems & Scheduling
  "os-scheduling": {
    noteId: "os-scheduling",
    topic: "Operating Systems & CPU Scheduling",
    category: "Systems",
    questions: [
      {
        id: "os-1",
        question: "Which CPU scheduling algorithm gives the minimum average waiting time for a given set of processes?",
        options: [
          "Shortest Job First (SJF)",
          "First-Come, First-Served (FCFS)",
          "Round Robin (RR)",
          "Priority Scheduling without aging"
        ],
        correctAnswer: "Shortest Job First (SJF)",
        explanation: "SJF is provably optimal in terms of minimizing average waiting time because scheduling shorter jobs ahead moves them through the system quickly."
      },
      {
        id: "os-2",
        question: "What issue can occur in Priority Scheduling when low-priority processes never execute?",
        options: ["Starvation (Indefinite Blocking)", "Thrashing", "Deadlock", "Convoy Effect"],
        correctAnswer: "Starvation (Indefinite Blocking)",
        explanation: "Starvation occurs when a stream of higher-priority processes keeps the CPU busy indefinitely. It is solved via aging (gradually increasing process priority)."
      },
      {
        id: "os-3",
        question: "What are the four necessary conditions for a Deadlock to occur (Coffman conditions)?",
        options: [
          "Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait",
          "Paging, Segmentation, Swapping, Thrashing",
          "Atomicity, Consistency, Isolation, Durability",
          "Read, Write, Execute, Append"
        ],
        correctAnswer: "Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait",
        explanation: "Deadlock can arise if and only if all four conditions hold simultaneously: Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait."
      },
      {
        id: "os-4",
        question: "In virtual memory systems, what is 'Thrashing'?",
        options: [
          "When the OS spends more time paging pages in and out than executing instructions",
          "A CPU hardware overheat failure",
          "When processes exceed their allocated memory limit and crash",
          "A disk fragmentation issue"
        ],
        correctAnswer: "When the OS spends more time paging pages in and out than executing instructions",
        explanation: "Thrashing occurs when total working set sizes exceed physical memory, causing continuous page faults and near-zero CPU execution throughput."
      }
    ]
  }
};

/**
 * Helper to retrieve mock quiz by note ID or topic name with dynamic fallback.
 *
 * @param {string} noteId
 * @returns {object} Quiz object matching API response contract
 */
export function getMockQuiz(noteId) {
  if (!noteId) return MOCK_QUIZZES["123"];

  const normalized = String(noteId).toLowerCase().trim();

  // Direct ID check
  if (MOCK_QUIZZES[normalized]) {
    return MOCK_QUIZZES[normalized];
  }

  // Alias checks
  if (normalized.includes("stack") || normalized.includes("java") || normalized.includes("dsa")) {
    return MOCK_QUIZZES["123"];
  }
  if (normalized.includes("dbms") || normalized.includes("sql") || normalized.includes("database")) {
    return MOCK_QUIZZES["dbms"];
  }
  if (normalized.includes("transform") || normalized.includes("attention")) {
    return MOCK_QUIZZES["transformer-architecture"];
  }
  if (normalized.includes("plasticity") || normalized.includes("memory") || normalized.includes("synapt")) {
    return MOCK_QUIZZES["synaptic-plasticity"];
  }
  if (normalized.includes("consensus") || normalized.includes("raft") || normalized.includes("paxos")) {
    return MOCK_QUIZZES["distributed-consensus"];
  }
  if (normalized.includes("os") || normalized.includes("schedul") || normalized.includes("cpu")) {
    return MOCK_QUIZZES["os-scheduling"];
  }

  // Dynamic fallback for custom user topics
  return {
    noteId: String(noteId),
    topic: `Custom Study Deck (${noteId})`,
    category: "General Study",
    questions: [
      {
        id: `${noteId}-q1`,
        question: "What is the primary cognitive benefit of Active Recall over passive rereading?",
        options: [
          "It takes less time and eliminates the need to review again",
          "It stimulates neural memory retrieval pathways, producing stronger synaptic consolidation",
          "It converts short-term memories directly into motor skills",
          "It prevents all future forgetting indefinitely"
        ],
        correctAnswer: "It stimulates neural memory retrieval pathways, producing stronger synaptic consolidation",
        explanation: "Retrieval practice forces the brain to reconstruct knowledge, activating deeper memory traces than passive visual scanning."
      },
      {
        id: `${noteId}-q2`,
        question: "Which spaced repetition practice interval is recommended after initial learning?",
        options: [
          "Review once after 1 year",
          "Expanding intervals (e.g., 24 hours, 3 days, 1 week, 1 month)",
          "Reviewing continuously every 5 minutes for 12 hours",
          "Never review until right before an exam"
        ],
        correctAnswer: "Expanding intervals (e.g., 24 hours, 3 days, 1 week, 1 month)",
        explanation: "Expanding intervals optimize recall by testing memory right when it is about to fade, producing maximum consolidation efficiency."
      },
      {
        id: `${noteId}-q3`,
        question: "What is the testing effect in cognitive psychology?",
        options: [
          "The anxiety caused by standardized testing",
          "The finding that actively answering test questions enhances learning more than equal time spent restudying",
          "The decline in test scores due to fatigue",
          "The psychological preference for multiple-choice questions"
        ],
        correctAnswer: "The finding that actively answering test questions enhances learning more than equal time spent restudying",
        explanation: "The testing effect demonstrates that the act of retrieval itself directly alters and strengthens cognitive memory representations."
      },
      {
        id: `${noteId}-q4`,
        question: "How should incorrect quiz responses be handled to maximize learning?",
        options: [
          "Ignore them and focus only on what was answered correctly",
          "Immediately review the explanation, identify conceptual gaps, and schedule an early retest",
          "Discard the entire study deck",
          "Memorize the option letter without reading the rationale"
        ],
        correctAnswer: "Immediately review the explanation, identify conceptual gaps, and schedule an early retest",
        explanation: "Feedback on incorrect responses provides corrective signals (prediction errors) that calibrate conceptual models for durable learning."
      }
    ]
  };
}
