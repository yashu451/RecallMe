/**
 * Comprehensive Mock Quiz Data Module for RecallMe Practice Quiz Hub
 * Organized by Domain, Topic, and Difficulty (Easy, Medium, Hard).
 */

export const DOMAINS = [
  {
    id: "dsa",
    name: "Data Structures & Algorithms",
    topics: [
      "Arrays",
      "Linked Lists",
      "Stacks",
      "Queues",
      "Trees",
      "Graphs",
      "Sorting",
      "Searching",
      "Hashing"
    ]
  },
  {
    id: "programming-fundamentals",
    name: "Programming Fundamentals",
    topics: [
      "Variables",
      "Data Types",
      "Loops",
      "Functions",
      "OOP"
    ]
  },
  {
    id: "web-dev",
    name: "Web Development",
    topics: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Node.js",
      "REST APIs"
    ]
  },
  {
    id: "dbms",
    name: "Database Management Systems",
    topics: [
      "SQL",
      "Joins",
      "Normalization",
      "Keys",
      "Transactions"
    ]
  },
  {
    id: "os",
    name: "Operating Systems",
    topics: [
      "Processes",
      "Threads",
      "Scheduling",
      "Deadlocks",
      "Memory Management"
    ]
  },
  {
    id: "networks",
    name: "Computer Networks",
    topics: [
      "OSI Model",
      "TCP/IP",
      "IP Addressing",
      "DNS",
      "HTTP/HTTPS"
    ]
  },
  {
    id: "ai-ml",
    name: "Artificial Intelligence & Machine Learning",
    topics: [
      "Machine Learning Basics",
      "Supervised Learning",
      "Unsupervised Learning",
      "Neural Networks"
    ]
  }
];

export const ALL_QUESTIONS = [
  // ==========================================
  // 1. DATA STRUCTURES & ALGORITHMS
  // ==========================================
  // Stacks
  {
    id: "dsa-stacks-1",
    domain: "Data Structures & Algorithms",
    topic: "Stacks",
    difficulty: "Easy",
    question: "Which principle does a standard Stack data structure follow?",
    options: ["FIFO (First In First Out)", "LIFO (Last In First Out)", "LILO (Last In Last Out)", "Random Access"],
    correctAnswer: "LIFO (Last In First Out)",
    explanation: "A stack operates on the Last In First Out (LIFO) principle, where the most recently added item is the first one removed."
  },
  {
    id: "dsa-stacks-2",
    domain: "Data Structures & Algorithms",
    topic: "Stacks",
    difficulty: "Easy",
    question: "What is the time complexity of the push and pop operations in an array-backed stack?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctAnswer: "O(1)",
    explanation: "Both push and pop only interact with the top pointer, making them constant O(1) operations."
  },
  {
    id: "dsa-stacks-3",
    domain: "Data Structures & Algorithms",
    topic: "Stacks",
    difficulty: "Medium",
    question: "Which classical problem is naturally solved using a stack?",
    options: ["Breadth-First Search", "Balanced Parentheses Matching", "Shortest Path in Weighted Graph", "Binary Search"],
    correctAnswer: "Balanced Parentheses Matching",
    explanation: "Balanced parentheses matching requires tracking opening brackets and matching the innermost opening bracket with the first encountered closing bracket, which aligns with LIFO."
  },
  {
    id: "dsa-stacks-4",
    domain: "Data Structures & Algorithms",
    topic: "Stacks",
    difficulty: "Medium",
    question: "How can a stack be used to evaluate an arithmetic postfix expression like '5 3 + 2 *'?",
    options: [
      "Push operators to stack and pop operands",
      "Push operands to stack; on operator, pop two operands, compute, and push result",
      "Sort operands in ascending order before evaluating",
      "Recursively invert the string into prefix format"
    ],
    correctAnswer: "Push operands to stack; on operator, pop two operands, compute, and push result",
    explanation: "Postfix evaluation pushes numbers to a stack, and whenever an operator is reached, it pops the two top values, performs the operation, and pushes the result back."
  },
  {
    id: "dsa-stacks-5",
    domain: "Data Structures & Algorithms",
    topic: "Stacks",
    difficulty: "Hard",
    question: "In monotonic stack problems (e.g. Next Greater Element), what is the amortized time complexity across an array of length N?",
    options: ["O(N)", "O(N log N)", "O(N²)", "O(2^N)"],
    correctAnswer: "O(N)",
    explanation: "Although each element may trigger inner loops, each element is pushed onto the stack once and popped at most once, giving an amortized runtime of O(N)."
  },

  // Arrays
  {
    id: "dsa-arrays-1",
    domain: "Data Structures & Algorithms",
    topic: "Arrays",
    difficulty: "Easy",
    question: "What is the time complexity to access an element in an array by its index?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
    correctAnswer: "O(1)",
    explanation: "Arrays reside in contiguous memory, allowing direct memory address calculation via base address + index * element size in constant O(1) time."
  },
  {
    id: "dsa-arrays-2",
    domain: "Data Structures & Algorithms",
    topic: "Arrays",
    difficulty: "Medium",
    question: "What algorithm finds the maximum contiguous subarray sum in O(n) time?",
    options: ["Dijkstra's Algorithm", "Kadane's Algorithm", "Floyd's Cycle Algorithm", "Quickselect"],
    correctAnswer: "Kadane's Algorithm",
    explanation: "Kadane's Algorithm computes maximum contiguous subarray sum in linear O(n) time by maintaining running maximums."
  },

  // Linked Lists
  {
    id: "dsa-ll-1",
    domain: "Data Structures & Algorithms",
    topic: "Linked Lists",
    difficulty: "Easy",
    question: "What is the time complexity to insert a new node at the head of a singly linked list?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
    correctAnswer: "O(1)",
    explanation: "Inserting at the head only requires updating the new node's next pointer to the current head and moving head, requiring O(1) operations."
  },
  {
    id: "dsa-ll-2",
    domain: "Data Structures & Algorithms",
    topic: "Linked Lists",
    difficulty: "Medium",
    question: "What technique detects a cycle in a linked list in O(n) time and O(1) space?",
    options: ["Floyd's Tortoise and Hare (Slow/Fast Pointers)", "Breadth-First Traversal", "Binary Search", "Hash Map memoization"],
    correctAnswer: "Floyd's Tortoise and Hare (Slow/Fast Pointers)",
    explanation: "Floyd's cycle-finding algorithm advances a slow pointer by 1 step and a fast pointer by 2 steps. If a loop exists, they will collide in O(1) extra space."
  },

  // Queues
  {
    id: "dsa-queues-1",
    domain: "Data Structures & Algorithms",
    topic: "Queues",
    difficulty: "Easy",
    question: "Which principle does a Queue data structure follow?",
    options: ["FIFO (First In First Out)", "LIFO (Last In First Out)", "Random Access", "Hierarchical"],
    correctAnswer: "FIFO (First In First Out)",
    explanation: "A queue operates on First In First Out (FIFO), where the element inserted first is the first to be removed."
  },

  // Trees
  {
    id: "dsa-trees-1",
    domain: "Data Structures & Algorithms",
    topic: "Trees",
    difficulty: "Easy",
    question: "In a Binary Search Tree (BST), what traversal visits nodes in strictly ascending sorted order?",
    options: ["Pre-order traversal", "In-order traversal", "Post-order traversal", "Level-order traversal"],
    correctAnswer: "In-order traversal",
    explanation: "In-order traversal (Left, Root, Right) on a valid BST visits keys in strictly increasing sorted order."
  },

  // Graphs
  {
    id: "dsa-graphs-1",
    domain: "Data Structures & Algorithms",
    topic: "Graphs",
    difficulty: "Medium",
    question: "Which data structure is typically used to implement Breadth-First Search (BFS) on a graph?",
    options: ["Queue", "Stack", "Priority Queue", "Disjoint Set Union"],
    correctAnswer: "Queue",
    explanation: "BFS explores neighbor vertices level by level, using a FIFO queue to store discovered vertices awaiting traversal."
  },

  // Sorting
  {
    id: "dsa-sort-1",
    domain: "Data Structures & Algorithms",
    topic: "Sorting",
    difficulty: "Medium",
    question: "What is the worst-case time complexity of standard QuickSort with poor pivot selection?",
    options: ["O(n²)", "O(n log n)", "O(n)", "O(log n)"],
    correctAnswer: "O(n²)",
    explanation: "If the chosen pivot is repeatedly the smallest or largest element (such as already sorted array with first element as pivot), QuickSort degrades to O(n²)."
  },

  // Searching
  {
    id: "dsa-search-1",
    domain: "Data Structures & Algorithms",
    topic: "Searching",
    difficulty: "Easy",
    question: "What is a prerequisite condition for performing Binary Search on an array?",
    options: ["The array must be sorted", "The array must contain only positive integers", "The array size must be a power of 2", "The array must be doubly linked"],
    correctAnswer: "The array must be sorted",
    explanation: "Binary search repeatedly halves the search space based on ordering, requiring elements to be sorted."
  },

  // Hashing
  {
    id: "dsa-hash-1",
    domain: "Data Structures & Algorithms",
    topic: "Hashing",
    difficulty: "Easy",
    question: "What is the average-case time complexity of key lookup in a well-distributed Hash Table?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: "O(1)",
    explanation: "With a uniform hash function and low load factor, hash table lookups take constant O(1) time."
  },

  // ==========================================
  // 2. PROGRAMMING FUNDAMENTALS
  // ==========================================
  {
    id: "prog-var-1",
    domain: "Programming Fundamentals",
    topic: "Variables",
    difficulty: "Easy",
    question: "What is the primary difference between a statically-typed and dynamically-typed programming language?",
    options: [
      "In statically-typed languages, types are checked at compile time; in dynamic languages, at runtime",
      "Statically-typed languages cannot run on 64-bit systems",
      "Dynamically-typed languages do not support functions",
      "Statically-typed languages have no variable memory allocation"
    ],
    correctAnswer: "In statically-typed languages, types are checked at compile time; in dynamic languages, at runtime",
    explanation: "Static typing verifies variable types prior to execution during compilation (e.g. Java, C++), whereas dynamic typing binds types during execution (e.g. Python, JS)."
  },
  {
    id: "prog-dt-1",
    domain: "Programming Fundamentals",
    topic: "Data Types",
    difficulty: "Easy",
    question: "Which of the following is typically a primitive data type in most high-level languages?",
    options: ["Boolean", "Hash Map", "Linked List", "Tree Node"],
    correctAnswer: "Boolean",
    explanation: "Primitive data types are basic building blocks provided by the language (such as boolean, int, float, char), unlike composite/reference types."
  },
  {
    id: "prog-loops-1",
    domain: "Programming Fundamentals",
    topic: "Loops",
    difficulty: "Easy",
    question: "What distinguishes a do-while loop from a while loop?",
    options: [
      "A do-while loop is guaranteed to execute its body at least once",
      "A do-while loop runs infinitely by definition",
      "A while loop cannot take conditional boolean expressions",
      "A do-while loop executes faster on multi-core processors"
    ],
    correctAnswer: "A do-while loop is guaranteed to execute its body at least once",
    explanation: "A do-while evaluates its exit condition after executing the body, ensuring the loop body executes at least one time."
  },
  {
    id: "prog-fn-1",
    domain: "Programming Fundamentals",
    topic: "Functions",
    difficulty: "Medium",
    question: "What is a 'pure function' in functional programming?",
    options: [
      "A function that returns the same output for the same inputs and produces no side effects",
      "A function written strictly in assembly language",
      "A function that takes zero arguments",
      "A function that modifies global variables directly"
    ],
    correctAnswer: "A function that returns the same output for the same inputs and produces no side effects",
    explanation: "Pure functions are deterministic (given the same parameters, always return the same result) and produce no observable side effects (no network calls, mutation of outside state)."
  },
  {
    id: "prog-oop-1",
    domain: "Programming Fundamentals",
    topic: "OOP",
    difficulty: "Easy",
    question: "What OOP pillar describes bundling data and methods that operate on that data inside a single unit?",
    options: ["Inheritance", "Encapsulation", "Polymorphism", "Abstraction"],
    correctAnswer: "Encapsulation",
    explanation: "Encapsulation restricts direct access to some of an object's components, bundling states and methods while preventing unauthorized modifications."
  },
  {
    id: "prog-oop-2",
    domain: "Programming Fundamentals",
    topic: "OOP",
    difficulty: "Medium",
    question: "What is polymorphism in object-oriented programming?",
    options: [
      "The ability of different objects to respond to the same message/method call in their own specific way",
      "Storing multiple classes inside a single binary file",
      "Automatically translating code into binary bytecode",
      "The process of creating multiple copies of an object in memory"
    ],
    correctAnswer: "The ability of different objects to respond to the same message/method call in their own specific way",
    explanation: "Polymorphism allows objects of different classes related by inheritance to be treated as instances of their common superclass, invoking the appropriate overridden method."
  },

  // ==========================================
  // 3. WEB DEVELOPMENT
  // ==========================================
  {
    id: "web-html-1",
    domain: "Web Development",
    topic: "HTML",
    difficulty: "Easy",
    question: "Which HTML5 element represents self-contained content that could be distributed independently (e.g. blog post)?",
    options: ["<article>", "<section>", "<div>", "<aside>"],
    correctAnswer: "<article>",
    explanation: "The <article> semantic element represents an independent, self-contained piece of content intended to be reusable and distributable."
  },
  {
    id: "web-css-1",
    domain: "Web Development",
    topic: "CSS",
    difficulty: "Easy",
    question: "In the CSS Box Model, what layer surrounds the content and is immediately inside the border?",
    options: ["Padding", "Margin", "Outline", "Box-shadow"],
    correctAnswer: "Padding",
    explanation: "From inside out, the box model consists of Content -> Padding -> Border -> Margin."
  },
  {
    id: "web-js-1",
    domain: "Web Development",
    topic: "JavaScript",
    difficulty: "Easy",
    question: "What is the difference between '==' and '===' in JavaScript?",
    options: [
      "'===' checks both value and type without coercion; '==' performs type coercion",
      "'==' is for strings and '===' is for numbers",
      "'===' is asynchronous while '==' is synchronous",
      "They are completely identical in modern ECMAScript"
    ],
    correctAnswer: "'===' checks both value and type without coercion; '==' performs type coercion",
    explanation: "The strict equality operator (===) checks value and data type without type coercion, preventing subtle unexpected type conversion bugs."
  },
  {
    id: "web-react-1",
    domain: "Web Development",
    topic: "React",
    difficulty: "Easy",
    question: "In React, what hook is used to perform side effects such as data fetching or subscriptions?",
    options: ["useState", "useEffect", "useMemo", "useContext"],
    correctAnswer: "useEffect",
    explanation: "The useEffect hook instructs React that a component needs to execute a side effect after rendering."
  },
  {
    id: "web-react-2",
    domain: "Web Development",
    topic: "React",
    difficulty: "Medium",
    question: "Why should you avoid using array index as the 'key' prop when rendering dynamic lists in React?",
    options: [
      "It causes component state bugs and inefficient re-renders when list items are reordered, inserted, or removed",
      "It throws a compile-time JSX syntax error",
      "It disables CSS styles on children",
      "React will refuse to mount the component"
    ],
    correctAnswer: "It causes component state bugs and inefficient re-renders when list items are reordered, inserted, or removed",
    explanation: "Keys help React identify which items have changed, been added, or removed. Using indices breaks identity reconciliation when items shift positions."
  },
  {
    id: "web-node-1",
    domain: "Web Development",
    topic: "Node.js",
    difficulty: "Medium",
    question: "What architecture allows Node.js to handle thousands of concurrent connections on a single thread?",
    options: [
      "Non-blocking asynchronous I/O with an Event Loop (libuv)",
      "Spinning a new OS thread for every inbound TCP socket",
      "Compiling JavaScript into C++ on every HTTP request",
      "Hard disk striping across RAID partitions"
    ],
    correctAnswer: "Non-blocking asynchronous I/O with an Event Loop (libuv)",
    explanation: "Node.js delegates I/O tasks to the operating system or worker pool via libuv and processes completed callbacks on a single-threaded event loop."
  },
  {
    id: "web-rest-1",
    domain: "Web Development",
    topic: "REST APIs",
    difficulty: "Easy",
    question: "Which HTTP status code indicates that a resource was successfully created on the server?",
    options: ["200 OK", "201 Created", "204 No Content", "301 Moved Permanently"],
    correctAnswer: "201 Created",
    explanation: "HTTP 201 Created indicates that the request succeeded and led to the creation of a new resource (common after POST)."
  },

  // ==========================================
  // 4. DATABASE MANAGEMENT SYSTEMS (DBMS)
  // ==========================================
  {
    id: "dbms-sql-1",
    domain: "Database Management Systems",
    topic: "SQL",
    difficulty: "Easy",
    question: "Which SQL clause is used to filter records resulting from a GROUP BY aggregation?",
    options: ["WHERE", "HAVING", "ORDER BY", "FILTER BY"],
    correctAnswer: "HAVING",
    explanation: "WHERE filters rows before grouping, whereas HAVING filters aggregate groups after GROUP BY."
  },
  {
    id: "dbms-joins-1",
    domain: "Database Management Systems",
    topic: "Joins",
    difficulty: "Easy",
    question: "What type of join returns ONLY the rows where there is a match in both tables?",
    options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"],
    correctAnswer: "INNER JOIN",
    explanation: "An INNER JOIN matches records having matching values in both tables, omitting unmatched rows from both sides."
  },
  {
    id: "dbms-norm-1",
    domain: "Database Management Systems",
    topic: "Normalization",
    difficulty: "Medium",
    question: "A relation is in Second Normal Form (2NF) if and only if it is in 1NF and what condition holds?",
    options: [
      "Every non-prime attribute is fully functionally dependent on the primary key (no partial dependencies)",
      "There are no foreign keys",
      "Every determinant is a superkey",
      "No numeric fields are NULL"
    ],
    correctAnswer: "Every non-prime attribute is fully functionally dependent on the primary key (no partial dependencies)",
    explanation: "2NF eliminates partial dependencies where a non-key attribute depends on only a subset of a composite primary key."
  },
  {
    id: "dbms-keys-1",
    domain: "Database Management Systems",
    topic: "Keys",
    difficulty: "Easy",
    question: "What is a Foreign Key in a relational database?",
    options: [
      "A column or set of columns in one table that references the primary key of another table",
      "A key generated from a foreign language script",
      "An encrypted password key",
      "A key that can only be accessed by admin users"
    ],
    correctAnswer: "A column or set of columns in one table that references the primary key of another table",
    explanation: "A Foreign Key establishes a referential constraint between two tables, ensuring valid relation links."
  },
  {
    id: "dbms-trans-1",
    domain: "Database Management Systems",
    topic: "Transactions",
    difficulty: "Easy",
    question: "Which ACID property guarantees that all operations in a database transaction succeed or all fail?",
    options: ["Atomicity", "Consistency", "Isolation", "Durability"],
    correctAnswer: "Atomicity",
    explanation: "Atomicity ensures the 'all-or-nothing' invariant of transactions: if any part fails, the entire transaction is rolled back."
  },
  {
    id: "dbms-trans-2",
    domain: "Database Management Systems",
    topic: "Transactions",
    difficulty: "Medium",
    question: "What concurrency phenomenon occurs when a transaction reads uncommitted changes made by another transaction?",
    options: ["Dirty Read", "Non-repeatable Read", "Phantom Read", "Lost Update"],
    correctAnswer: "Dirty Read",
    explanation: "A Dirty Read happens when Transaction A reads data modified by Transaction B before Transaction B commits; if Transaction B aborts, Transaction A's read was invalid."
  },

  // ==========================================
  // 5. OPERATING SYSTEMS
  // ==========================================
  {
    id: "os-proc-1",
    domain: "Operating Systems",
    topic: "Processes",
    difficulty: "Easy",
    question: "What is the primary difference between a process and a thread?",
    options: [
      "A process has its own independent address space; threads share the memory space of their parent process",
      "Processes can run on multiple CPUs, but threads can only run on a single core",
      "Threads have separate file descriptors while processes do not",
      "Processes do not use stack frames"
    ],
    correctAnswer: "A process has its own independent address space; threads share the memory space of their parent process",
    explanation: "Processes are isolated with independent memory maps. Threads are lightweight execution units within a process sharing code, data, and heap."
  },
  {
    id: "os-threads-1",
    domain: "Operating Systems",
    topic: "Threads",
    difficulty: "Medium",
    question: "What is a Race Condition in multithreaded programming?",
    options: [
      "When the output of concurrent threads depends on the uncontrollable order of their execution timing",
      "When two threads race to finish downloading a file first",
      "A clock speed benchmark between two CPUs",
      "When a thread exceeds its maximum allocated memory quota"
    ],
    correctAnswer: "When the output of concurrent threads depends on the uncontrollable order of their execution timing",
    explanation: "A race condition occurs when concurrent threads access shared state without proper synchronization, causing non-deterministic corrupted results."
  },
  {
    id: "os-sched-1",
    domain: "Operating Systems",
    topic: "Scheduling",
    difficulty: "Easy",
    question: "Which CPU scheduling algorithm gives each process a fixed slice of CPU time (time quantum) in a circular order?",
    options: ["Round Robin (RR)", "First-Come First-Served (FCFS)", "Shortest Job First (SJF)", "Priority Scheduling"],
    correctAnswer: "Round Robin (RR)",
    explanation: "Round Robin allocates a small time slice (quantum) to each ready process in cyclic order, providing fairness for time-sharing systems."
  },
  {
    id: "os-dead-1",
    domain: "Operating Systems",
    topic: "Deadlocks",
    difficulty: "Medium",
    question: "Which algorithm is used in operating systems for Deadlock Avoidance by checking safe states?",
    options: ["Banker's Algorithm", "Dijkstra's Algorithm", "Kruskal's Algorithm", "A* Search Algorithm"],
    correctAnswer: "Banker's Algorithm",
    explanation: "Dijkstra's Banker's Algorithm simulates resource allocation for maximum possible claims to ensure the system never enters an unsafe deadlock-prone state."
  },
  {
    id: "os-mem-1",
    domain: "Operating Systems",
    topic: "Memory Management",
    difficulty: "Medium",
    question: "What hardware unit is responsible for translating Virtual Memory Addresses into Physical RAM Addresses?",
    options: ["MMU (Memory Management Unit)", "ALU (Arithmetic Logic Unit)", "GPU", "PCIe Controller"],
    correctAnswer: "MMU (Memory Management Unit)",
    explanation: "The Memory Management Unit (MMU) uses page tables and the Translation Lookaside Buffer (TLB) to map virtual addresses to physical frames."
  },

  // ==========================================
  // 6. COMPUTER NETWORKS
  // ==========================================
  {
    id: "net-osi-1",
    domain: "Computer Networks",
    topic: "OSI Model",
    difficulty: "Easy",
    question: "Which layer of the 7-layer OSI Model is responsible for end-to-end packet routing across networks?",
    options: ["Network Layer (Layer 3)", "Data Link Layer (Layer 2)", "Transport Layer (Layer 4)", "Session Layer (Layer 5)"],
    correctAnswer: "Network Layer (Layer 3)",
    explanation: "Layer 3 (Network Layer) handles logical addressing (IP) and routing packets across intermediate network nodes."
  },
  {
    id: "net-tcp-1",
    domain: "Computer Networks",
    topic: "TCP/IP",
    difficulty: "Easy",
    question: "What is the primary difference between TCP and UDP?",
    options: [
      "TCP is connection-oriented and guarantees reliable ordered delivery; UDP is connectionless and faster",
      "UDP encrypts all data while TCP sends plaintext",
      "TCP only works on local WiFi networks",
      "UDP is used exclusively for bank transactions"
    ],
    correctAnswer: "TCP is connection-oriented and guarantees reliable ordered delivery; UDP is connectionless and faster",
    explanation: "TCP performs handshaking, acknowledgments, and retransmissions for reliability. UDP transmits datagrams without connection setup or delivery guarantees."
  },
  {
    id: "net-ip-1",
    domain: "Computer Networks",
    topic: "IP Addressing",
    difficulty: "Easy",
    question: "How many bits are used in an IPv4 address compared to an IPv6 address?",
    options: ["32 bits in IPv4, 128 bits in IPv6", "16 bits in IPv4, 64 bits in IPv6", "64 bits in IPv4, 256 bits in IPv6", "128 bits in IPv4, 512 bits in IPv6"],
    correctAnswer: "32 bits in IPv4, 128 bits in IPv6",
    explanation: "IPv4 uses 32-bit addresses (~4.3 billion addresses). IPv6 expands the address space to 128 bits (3.4 × 10³⁸ addresses)."
  },
  {
    id: "net-dns-1",
    domain: "Computer Networks",
    topic: "DNS",
    difficulty: "Easy",
    question: "What is the primary role of the Domain Name System (DNS)?",
    options: [
      "To translate human-readable domain names (like recallme.app) into IP addresses",
      "To encrypt browser web traffic",
      "To compress multimedia packets",
      "To manage browser cookie storage"
    ],
    correctAnswer: "To translate human-readable domain names (like recallme.app) into IP addresses",
    explanation: "DNS acts as the internet's phonebook, mapping hostnames to numerical IP addresses required for routing."
  },
  {
    id: "net-http-1",
    domain: "Computer Networks",
    topic: "HTTP/HTTPS",
    difficulty: "Easy",
    question: "What cryptographic protocol secures HTTPS communications between client and server?",
    options: ["TLS (Transport Layer Security)", "FTP", "SSH", "Telnet"],
    correctAnswer: "TLS (Transport Layer Security)",
    explanation: "HTTPS encrypts normal HTTP communication using TLS (formerly SSL) to ensure confidentiality, integrity, and server authentication."
  },

  // ==========================================
  // 7. ARTIFICIAL INTELLIGENCE & MACHINE LEARNING
  // ==========================================
  {
    id: "ai-basics-1",
    domain: "Artificial Intelligence & Machine Learning",
    topic: "Machine Learning Basics",
    difficulty: "Easy",
    question: "What is the key difference between Supervised and Unsupervised Learning?",
    options: [
      "Supervised learning trains on labeled data; unsupervised learning discovers patterns in unlabeled data",
      "Supervised learning requires human code reviews for every prediction",
      "Unsupervised learning never uses loss functions",
      "Supervised learning only runs on CPUs"
    ],
    correctAnswer: "Supervised learning trains on labeled data; unsupervised learning discovers patterns in unlabeled data",
    explanation: "Supervised learning maps inputs to target labels. Unsupervised learning groups or discovers latent structures without predefined target labels."
  },
  {
    id: "ai-sup-1",
    domain: "Artificial Intelligence & Machine Learning",
    topic: "Supervised Learning",
    difficulty: "Easy",
    question: "Which of the following is a classic Supervised Learning problem?",
    options: [
      "Classifying emails as Spam or Not Spam based on past labeled emails",
      "Clustering customer shopping baskets without category labels",
      "Dimensionality reduction using PCA",
      "Generating random numbers"
    ],
    correctAnswer: "Classifying emails as Spam or Not Spam based on past labeled emails",
    explanation: "Spam classification trains on historical emails with known spam/ham labels, which is a classic binary supervised classification task."
  },
  {
    id: "ai-unsup-1",
    domain: "Artificial Intelligence & Machine Learning",
    topic: "Unsupervised Learning",
    difficulty: "Medium",
    question: "Which algorithm is commonly used for Unsupervised clustering of data points into K groups?",
    options: ["K-Means Clustering", "Logistic Regression", "Random Forest Classifier", "Linear Regression"],
    correctAnswer: "K-Means Clustering",
    explanation: "K-Means iteratively assigns points to the nearest cluster centroid and recalculates centroids to cluster unlabeled data."
  },
  {
    id: "ai-nn-1",
    domain: "Artificial Intelligence & Machine Learning",
    topic: "Neural Networks",
    difficulty: "Easy",
    question: "What algorithm is used to compute the gradients of the loss function with respect to weights in a neural network?",
    options: ["Backpropagation (Reverse-Mode Automatic Differentiation)", "Forward Selection", "Dijkstra's Algorithm", "PageRank"],
    correctAnswer: "Backpropagation (Reverse-Mode Automatic Differentiation)",
    explanation: "Backpropagation applies the calculus chain rule backward from the loss output through hidden layers to compute weight gradients."
  },
  {
    id: "ai-nn-2",
    domain: "Artificial Intelligence & Machine Learning",
    topic: "Neural Networks",
    difficulty: "Medium",
    question: "What problem occurs when gradients shrink exponentially as they propagate backward through deep neural network layers?",
    options: ["Vanishing Gradient Problem", "Overfitting", "Data Leakage", "Deadlock"],
    correctAnswer: "Vanishing Gradient Problem",
    explanation: "When activation functions (like sigmoid) saturate, derivatives are small, causing earlier layer weight gradients to approach zero and halting learning."
  }
];

/**
 * Filter questions based on configuration parameters:
 * domain, topic, difficulty, count
 *
 * Algorithm prioritizes exact topic matches, then same-domain matches,
 * before expanding to general questions so the user always receives their
 * requested count of high-quality questions!
 */
export function getFilteredQuestions({ domain, topic, difficulty, count = 5 }) {
  const reqCount = parseInt(count, 10) || 5;

  // 1. Exact match on domain and topic
  let exactMatches = ALL_QUESTIONS.filter(q => {
    const domainMatch = !domain || q.domain.toLowerCase() === domain.toLowerCase();
    const topicMatch = !topic || q.topic.toLowerCase() === topic.toLowerCase();
    return domainMatch && topicMatch;
  });

  // Prioritize matching difficulty if available
  if (difficulty && exactMatches.length > 0) {
    const withDiff = exactMatches.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
    if (withDiff.length >= reqCount) {
      exactMatches = withDiff;
    }
  }

  // If exact topic has enough questions, shuffle and return
  if (exactMatches.length >= reqCount) {
    return [...exactMatches].sort(() => 0.5 - Math.random()).slice(0, reqCount);
  }

  // 2. Expand with other questions from the SAME domain
  let sameDomainMatches = [];
  if (domain) {
    sameDomainMatches = ALL_QUESTIONS.filter(q => 
      q.domain.toLowerCase() === domain.toLowerCase() && !exactMatches.some(e => e.id === q.id)
    );
    sameDomainMatches = sameDomainMatches.sort(() => 0.5 - Math.random());
  }

  // Combine exact matches first, then supplement with same-domain matches
  let pool = [...exactMatches, ...sameDomainMatches];

  // 3. If still under requested count, supplement with general questions
  if (pool.length < reqCount) {
    const remaining = ALL_QUESTIONS.filter(q => !pool.some(p => p.id === q.id)).sort(() => 0.5 - Math.random());
    pool = [...pool, ...remaining];
  }

  return pool.slice(0, reqCount);
}
