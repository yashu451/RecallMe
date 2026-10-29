export const INITIAL_TOPICS = [
  {
    id: "transformer-architecture",
    title: "Transformer Architecture & Self-Attention",
    subject: "Machine Learning",
    subjectCode: "CS 224N",
    readTime: "7 min read",
    createdAt: "2026-10-24",
    lastStudied: "Today, 10:45 AM",
    masteryScore: 88,
    isStarred: true,
    tags: ["Deep Learning", "Attention Mechanisms", "NLP", "Neural Networks"],
    summary: "A rigorous breakdown of the Transformer model architecture, focusing on Scaled Dot-Product Attention, Query-Key-Value projections, multi-head parallel representations, and the mathematical justification for dimensional scaling.",
    sourceExcerpt: "The Transformer, proposed by Vaswani et al. in 'Attention Is All You Need' (2017), replaces recurrent and convolutional layers entirely with self-attention mechanisms. In self-attention, each input token computes three vectors: Query (Q), Key (K), and Value (V). The core operation is Scaled Dot-Product Attention, computed as Attention(Q, K, V) = softmax(Q K^T / sqrt(d_k)) V. The factor sqrt(d_k) counteracts the problem of dot products growing large in magnitude for high dimensions, which would push softmax into regions with vanishingly small gradients.",
    sections: [
      {
        heading: "1. The Query-Key-Value Paradigm",
        content: `In standard sequence modeling, recurrent networks maintain an internal hidden state updated step-by-step, creating an $O(N)$ sequential bottleneck that inhibits parallelization. The Transformer solves this by casting sequence transduction as a soft retrieval problem inspired by database indexing.

For an input sequence embedded as matrix $X \\in \\mathbb{R}^{n \\times d_{model}}$, linear projections create three distinct representations:
• **Queries ($Q = XW_Q$):** The criteria each token searches for in the rest of the sequence.
• **Keys ($K = XW_K$):** The descriptive attributes each token offers for matching.
• **Values ($V = XW_V$):** The actual informational content extracted once a query-key match is established.`,
      },
      {
        heading: "2. Scaled Dot-Product Attention & Mathematical Invariant",
        content: `The compatibility score between query token $i$ and key token $j$ is calculated via their inner product: $q_i \\cdot k_j^T$.

$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$

**Why divide by $\\sqrt{d_k}$?**
Assume components of $q$ and $k$ are independent random variables with mean 0 and variance 1. Their dot product $\\sum_{i=1}^{d_k} q_i k_i$ has mean 0 and variance $d_k$. For large values of $d_k$ (e.g., 64 or 128), dot products grow large, pushing the softmax function into regions with extremely flat gradients (saturation). Dividing by $\\sqrt{d_k}$ stabilizes the variance to 1.0, ensuring healthy gradient flow during backpropagation.`,
      },
      {
        heading: "3. Multi-Head Attention: Subspace Diversity",
        content: `Instead of performing a single attention calculation with full dimension $d_{model}$, multi-head attention projects queries, keys, and values $h$ times with different learned linear projections:

$$\\text{MultiHead}(Q, K, V) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h)W^O$$

Where $\\text{head}_i = \\text{Attention}(QW_i^Q, KW_i^K, VW_i^V)$.

Multi-head attention allows the model to jointly attend to information from different representation subspaces at different positions. For example, in syntactic parsing, one head can track verb-object dependencies while another head tracks pronoun-antecedent references.`,
      },
      {
        heading: "4. Positional Encoding & Residual Connections",
        content: `Because self-attention is permutation-equivariant (it has no inherent notion of sequence order), explicit positional information must be injected. Sinusoidal functions of different frequencies are added directly to the input embeddings:

$$PE_{(pos, 2i)} = \\sin(pos / 10000^{2i/d_{model}})$$
$$PE_{(pos, 2i+1)} = \\cos(pos / 10000^{2i/d_{model}})$$

Each sub-layer (attention and feed-forward) employs a residual connection followed by Layer Normalization: $\\text{LayerNorm}(x + \\text{Sublayer}(x))$, which alleviates vanishing gradients across deep stacks.`,
      }
    ],
    takeaways: [
      "Scaled Dot-Product attention counteracts gradient vanishing in high-dimensional softmax by normalizing variance to 1.0 using the 1/sqrt(d_k) factor.",
      "Multi-Head Attention projects representations into h distinct subspaces, enabling concurrent tracking of syntactic, semantic, and positional relationships.",
      "Positional encodings break permutation invariance without sacrificing constant O(1) path length between arbitrary distant tokens."
    ],
    keywords: [
      {
        term: "Scaled Dot-Product",
        category: "Mechanism",
        shortDef: "An attention calculation scaled by 1/sqrt(d_k) to prevent gradient saturation.",
        fullDef: "The fundamental scoring mechanism in Transformers that computes matrix product QK^T, divides by the square root of key dimensionality to stabilize softmax variance, and weights the value matrix V."
      },
      {
        term: "Multi-Head Attention",
        category: "Architecture",
        shortDef: "Parallel attention mechanisms operating across distinct linear projection subspaces.",
        fullDef: "Splits model dimensionality d_model across h independent attention heads, allowing the network to simultaneously focus on various linguistic and structural relationships."
      },
      {
        term: "Permutation Equivariance",
        category: "Property",
        shortDef: "A mathematical property where shuffling inputs results in identically shuffled outputs.",
        fullDef: "Because attention operates across sets rather than ordered sequences, without positional encodings the output for any token would be identical regardless of its sentence position."
      },
      {
        term: "Layer Normalization",
        category: "Optimization",
        shortDef: "Normalizes feature activations across channels for each individual sample.",
        fullDef: "Stabilizes deep network training by computing mean and standard deviation across the feature dimension for each training example independently of batch size."
      }
    ],
    definitions: [
      {
        term: "Query (Q)",
        phonetic: "/ˈkwɪə.ri/",
        partOfSpeech: "noun (linear algebra)",
        definition: "The vector representing the current token's search intent when scanning the context.",
        example: "The query vector for 'bank' asks whether neighboring keys describe a river or a financial institution."
      },
      {
        term: "Key (K)",
        phonetic: "/kiː/",
        partOfSpeech: "noun (linear algebra)",
        definition: "The vector acting as an address or tag against which queries compute inner-product similarity.",
        example: "Keys with high cosine similarity to the current query receive larger softmax weights."
      },
      {
        term: "Value (V)",
        phonetic: "/ˈvæl.juː/",
        partOfSpeech: "noun (linear algebra)",
        definition: "The vector holding the actual contextual information transmitted to the output representation.",
        example: "The final attention output is a weighted linear combination of all value vectors in the sequence."
      },
      {
        term: "Vanishing Gradient",
        phonetic: "/ˈvæn.ɪ.ʃɪŋ ˈɡreɪ.di.ənt/",
        partOfSpeech: "noun (optimization)",
        definition: "A failure mode during backpropagation where derivatives approach zero, halting weight updates.",
        example: "Unscaled dot products in high dimensions push softmax into flat saturation zones, causing vanishing gradients."
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "Why is the inner product of queries and keys divided by √d_k in Scaled Dot-Product Attention?",
        options: [
          "To reduce the matrix multiplication computational complexity from O(N²) to O(N)",
          "To prevent the variance of the dot product from growing with d_k, which pushes softmax into saturated regions with vanishing gradients",
          "To enforce unitary orthogonal properties on the weight matrices W_Q and W_K",
          "To compress the sequence length and remove redundant whitespace tokens"
        ],
        correctIndex: 1,
        explanation: "If query and key components are independent random variables with zero mean and unit variance, their dot product has variance equal to d_k. For large d_k, dot products become large, driving softmax into regions with near-zero gradients. Dividing by √d_k normalizes the variance back to 1."
      },
      {
        id: "q2",
        question: "What primary architectural advantage does Multi-Head Attention provide over a single attention head with dimension d_model?",
        options: [
          "It eliminates the need for residual connections and layer normalization",
          "It reduces total parameter count by a factor of 10",
          "It enables the model to simultaneously attend to information from different representation subspaces at different positions",
          "It ensures the model operates in strictly linear O(N) runtime"
        ],
        correctIndex: 2,
        explanation: "A single head tends to average information across all positions into one general distribution. Multi-head attention allows different heads to specialize concurrently—e.g., one head for syntax, one for semantics, and one for coreference."
      },
      {
        id: "q3",
        question: "Without Positional Encodings, how does standard self-attention treat reordered words in a sentence?",
        options: [
          "It fails to compute due to dimension mismatch",
          "It exhibits permutation equivariance: word outputs change position but retain identical internal representations",
          "It automatically defaults to reverse alphabetical order",
          "It converts all tokens into universal padding tokens"
        ],
        correctIndex: 1,
        explanation: "Self-attention operations are permutation equivariant. Without positional vectors added to input embeddings, the attention mechanism has no information about which token preceded or succeeded another."
      },
      {
        id: "q4",
        question: "What is the theoretical maximum path length between any two arbitrary tokens in a self-attention layer?",
        options: [
          "O(1)",
          "O(log N)",
          "O(N)",
          "O(N²)"
        ],
        correctIndex: 0,
        explanation: "Unlike RNNs where signals must traverse O(N) sequential steps from token 1 to token N, self-attention directly connects every token to every other token in a single matrix multiplication, yielding an O(1) path length."
      },
      {
        id: "q5",
        question: "In the Transformer architecture, what operation is applied immediately after each sub-layer (Self-Attention and Feed-Forward)?",
        options: [
          "Max pooling across all attention heads",
          "A residual connection followed by Layer Normalization: LayerNorm(x + Sublayer(x))",
          "Softmax normalization across the batch dimension",
          "Stochastic gradient clipping"
        ],
        correctIndex: 1,
        explanation: "Each sub-layer is wrapped in a residual connection (x + Sublayer(x)) followed by layer normalization. This prevents signal degradation and enables reliable gradient flow through very deep networks."
      }
    ]
  },
  {
    id: "synaptic-plasticity",
    title: "Synaptic Plasticity & Spaced Repetition",
    subject: "Cognitive Science",
    subjectCode: "COG 110",
    readTime: "6 min read",
    createdAt: "2026-10-22",
    lastStudied: "Yesterday, 4:20 PM",
    masteryScore: 92,
    isStarred: true,
    tags: ["Neuroscience", "Memory", "LTP", "Learning Science"],
    summary: "The biological foundations of memory consolidation, explaining Long-Term Potentiation (LTP), glutamate receptor trafficking (AMPA and NMDA), and how spaced retrieval exploits the Ebbinghaus forgetting curve.",
    sourceExcerpt: "Synaptic plasticity is the biological mechanism by which neural connections strengthen or weaken over time in response to increases or decreases in their activity. Long-Term Potentiation (LTP) in the hippocampus serves as the primary cellular model for learning and memory. When high-frequency stimulation occurs, NMDA receptors expel their magnesium block, allowing calcium influx that triggers the insertion of additional AMPA receptors into the postsynaptic membrane.",
    sections: [
      {
        heading: "1. The Molecular Basis of Long-Term Potentiation (LTP)",
        content: `Long-Term Potentiation (LTP) is a persistent increase in synaptic strength following high-frequency chemical stimulation of a synapse. It primarily takes place at excitatory glutamatergic synapses in the CA1 and CA3 regions of the hippocampus.

Two ionotropic glutamate receptors govern early-phase LTP:
• **AMPA Receptors:** Ligand-gated sodium ($Na^+$) channels that mediate fast baseline excitatory postsynaptic potentials (EPSPs).
• **NMDA Receptors:** Dual-gated channels permeable to calcium ($Ca^{2+}$). At resting membrane potentials ($\\sim -70\\text{ mV}$), their pore is physically occluded by a hydrated magnesium ion ($Mg^{2+}$).`,
      },
      {
        heading: "2. The Coincidence Detector: Magnesium Unblocking",
        content: `NMDA receptors function as cellular coincidence detectors because their activation requires two simultaneous events:
1. **Presynaptic glutamate release:** Glutamate binds to the receptor's extracellular ligand-binding domain.
2. **Postsynaptic depolarization:** Sustained AMPA receptor activation depolarizes the postsynaptic membrane to roughly $-30\\text{ mV}$, electrostatically repelling the positively charged $Mg^{2+}$ ion from the channel pore.

Once unblocked, $Ca^{2+}$ floods into the postsynaptic dendritic spine, activating protein kinases such as **CaMKII** (Calcium/Calmodulin-Dependent Protein Kinase II). CaMKII phosphorylates existing AMPA receptors (increasing their single-channel conductance) and drives the exocytosis and insertion of reserve AMPA receptors from intracellular endosomes into the postsynaptic density.`,
      },
      {
        heading: "3. The Spacing Effect & Synaptic Consolidation",
        content: `Hermann Ebbinghaus demonstrated in 1885 that memory retention decays exponentially over time according to $R = e^{-t/S}$, where $R$ is memory retention, $t$ is time elapsed, and $S$ is relative memory strength.

Massed practice ('cramming') produces rapid early-phase LTP that degrades within hours because protein synthesis is not triggered. In contrast, spaced retrieval leverages the biological delay required for **gene transcription** and **de novo protein synthesis** (Late-phase LTP). Repeated activation at expanding intervals signals the transcription factor CREB (cAMP response element-binding protein), structurally remodeling synaptic boutons with enduring dendritic spines.`,
      }
    ],
    takeaways: [
      "NMDA receptors act as biological coincidence detectors requiring both glutamate binding and postsynaptic depolarization to dislodge the Mg2+ plug.",
      "CaMKII activation by calcium influx promotes insertion of additional AMPA receptors, directly increasing synaptic sensitivity to future transmitter release.",
      "Spaced retrieval transforms fragile early-phase LTP into resilient late-phase LTP via CREB-mediated gene transcription and structural dendritic remodeling."
    ],
    keywords: [
      {
        term: "Long-Term Potentiation (LTP)",
        category: "Mechanism",
        shortDef: "A long-lasting enhancement in signal transmission between two neurons.",
        fullDef: "The primary cellular mechanism underlying learning and memory formation, characterized by increased postsynaptic responsiveness to glutamate."
      },
      {
        term: "NMDA Receptor",
        category: "Receptor",
        shortDef: "A glutamate receptor that acts as a voltage-dependent coincidence detector.",
        fullDef: "An ionotropic receptor blocked by magnesium at rest that allows calcium influx only when presynaptic release coincides with postsynaptic depolarization."
      },
      {
        term: "CaMKII",
        category: "Enzyme",
        shortDef: "A key kinase activated by calcium that directs AMPA receptor trafficking.",
        fullDef: "Calcium/calmodulin-dependent protein kinase II, which phosphorylates AMPA channels and anchors new receptors to the postsynaptic membrane."
      },
      {
        term: "The Testing Effect",
        category: "Cognitive Psychology",
        shortDef: "The phenomenon where actively retrieving knowledge enhances long-term memory far more than passive review.",
        fullDef: "Active recall forces the neural network to reconstruct memory traces, inducing targeted structural consolidation."
      }
    ],
    definitions: [
      {
        term: "Coincidence Detection",
        phonetic: "/koʊˈɪn.sɪ.dəns dɪˈtɛk.ʃən/",
        partOfSpeech: "noun (neurobiology)",
        definition: "The ability of a receptor or neuron to respond specifically when two independent biological inputs occur synchronously.",
        example: "The NMDA receptor performs coincidence detection by requiring both neurotransmitter binding and membrane depolarization."
      },
      {
        term: "AMPA Receptor",
        phonetic: "/ˈæm.pə rɪˈsɛp.tər/",
        partOfSpeech: "noun (neurochemistry)",
        definition: "An ionotropic glutamate channel responsible for the rapid, initial depolarization of the postsynaptic neuron.",
        example: "The insertion of more AMPA receptors into the synapse makes the neuron more sensitive to future glutamate release."
      },
      {
        term: "Late-Phase LTP",
        phonetic: "/leɪt feɪz ɛl-tiː-piː/",
        partOfSpeech: "noun (neurophysiology)",
        definition: "The persistent phase of potentiation lasting days to months that relies on gene transcription and protein synthesis.",
        example: "Spaced repetition ensures transitions from transient early-phase LTP to structural late-phase LTP."
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "Under resting membrane potentials (~ -70 mV), why is calcium unable to flow through NMDA receptor channels even if glutamate is bound?",
        options: [
          "The channel pore is physically blocked by an extracellular magnesium (Mg2+) ion",
          "Glutamate acts as an antagonist at resting potentials",
          "Intracellular potassium blocks the inner vestibule",
          "The calcium equilibrium potential is precisely zero at resting potential"
        ],
        correctIndex: 0,
        explanation: "At hyperpolarized and resting membrane potentials, positively charged Mg2+ ions are drawn into the outer mouth of the NMDA channel by the negative interior potential, physically blocking ion permeation until the membrane depolarizes."
      },
      {
        id: "q2",
        question: "What direct action does active CaMKII take upon phosphorylation during early-phase LTP?",
        options: [
          "It permanently disables all presynaptic vesicle exocytosis",
          "It increases AMPA receptor conductance and mobilizes additional AMPA receptors into the postsynaptic membrane",
          "It destroys NMDA receptors to terminate calcium toxicity",
          "It degrades the myelin sheath around the axon initial segment"
        ],
        correctIndex: 1,
        explanation: "CaMKII phosphorylates AMPA receptors to boost their single-channel conductance and triggers the insertion of reserve intracellular AMPA receptors into the postsynaptic density, augmenting synaptic strength."
      },
      {
        id: "q3",
        question: "Why does spaced repetition produce superior retention compared to massed practice ('cramming') from a neurobiological perspective?",
        options: [
          "Massed practice irreversibly depletes the brain's total glutamate reserves",
          "Spaced intervals allow the necessary time window for CREB-dependent gene transcription and new protein synthesis required for late-phase LTP",
          "Spaced practice skips the hippocampus and writes directly to long-term cortical storage",
          "Massed practice reduces oxygen delivery to the cerebral cortex"
        ],
        correctIndex: 1,
        explanation: "Massed practice creates transient early-phase LTP that decays within hours. Spaced intervals trigger intracellular signaling cascades (cAMP/PKA/CREB) that stimulate nuclear transcription and structural protein synthesis needed for enduring memory traces."
      },
      {
        id: "q4",
        question: "According to Ebbinghaus's forgetting curve formula R = e^(-t/S), what does the variable 'S' represent?",
        options: [
          "Subject difficulty level on an arbitrary scale of 1 to 10",
          "Memory strength (stability of the memory trace), which increases with spaced retrieval",
          "The number of syllables or words memorized",
          "The sleep duration required to restore cognitive stamina"
        ],
        correctIndex: 1,
        explanation: "S represents the relative strength or stability of the memory trace. Each successful spaced retrieval session increases S, flattening the rate of future exponential decay."
      }
    ]
  },
  {
    id: "distributed-consensus",
    title: "Distributed Consensus: Raft vs. Paxos Protocols",
    subject: "Distributed Systems",
    subjectCode: "CS 244B",
    readTime: "8 min read",
    createdAt: "2026-10-19",
    lastStudied: "3 days ago",
    masteryScore: 75,
    isStarred: false,
    tags: ["Systems", "Fault Tolerance", "Consensus", "Networking"],
    summary: "An architectural comparison of consensus protocols for replicated state machines, decomposing Paxos into Synod rounds and Raft into leader election, log replication, and commitment safety.",
    sourceExcerpt: "Distributed consensus allows a cluster of computing nodes to agree on a sequence of state transitions even in the presence of unreliable networks and arbitrary node crashes. Paxos, introduced by Leslie Lamport, establishes consensus using a two-phase commit protocol across majorities. Raft, designed by Ongaro and Ousterhout at Stanford, achieves equivalent safety guarantees while decomposing consensus into explicit subproblems: Leader Election, Log Replication, and Safety.",
    sections: [
      {
        heading: "1. The Fundamental Consensus Problem",
        content: `A replicated state machine consists of identical deterministic state machines running on separate physical machines. To ensure consistency across node crashes, network partitions, and packet reordering:
• **Safety (Nothing bad happens):** All non-faulty nodes decide on the exact same sequence of log entries. A committed entry is never overwritten.
• **Liveness (Something good eventually happens):** As long as a majority of nodes ($\\lfloor N/2 \\rfloor + 1$) are operational and can communicate, client requests can be committed.

The FLP Impossibility Theorem (Fischer, Lynch, Paterson, 1985) establishes that no deterministic asynchronous algorithm can guarantee consensus in the presence of even a single unannounced crash failure. Practical protocols circumvent this by relying on partial synchrony and randomized timeouts.`,
      },
      {
        heading: "2. The Raft Decomposition: Leaders, Terms, and Quorums",
        content: `Raft divides time into arbitrary terms numbered with monotonically increasing integers. Each term begins with an election:
1. **Leader Election:** If a follower receives no heartbeat within a randomized timeout (e.g., 150ms-300ms), it transitions to **Candidate**, increments its term, votes for itself, and broadcasts ` + '`RequestVote`' + ` RPCs.
2. **Log Replication:** The elected leader accepts client commands, appends them to its log as uncommitted entries, and issues ` + '`AppendEntries`' + ` RPCs. Once a majority of nodes acknowledge the entry, the leader commits it and applies it to its local state machine.
3. **Commit Safety Rule:** A Raft leader never commits an entry from a previous term simply by counting replicas; it must commit at least one entry from its current term by storing it on a majority of nodes.`,
      },
      {
        heading: "3. Raft vs. Paxos: Core Structural Differences",
        content: `While both algorithms guarantee linearizability across network partitions:
• **Leader Centricity:** Raft relies on a strong leader. Log entries only flow strictly from leader to followers. In Multi-Paxos, nodes can propose values concurrently, requiring complex conflict resolution phases.
• **Log Invariants:** Raft enforces the **Log Matching Property**: if two logs contain an entry with the same index and term, they are identical up to that index. Follower logs that conflict with the leader are forcefully overwritten.
• **Understandability:** Raft was designed specifically to be pedagogical and implementable, whereas classical Paxos requires substantial undocumented heuristics to achieve practical multi-decree log replication.`,
      }
    ],
    takeaways: [
      "Quorum intersection guarantees safety: any two majorities of size floor(N/2)+1 must share at least one node in common.",
      "Randomized election timeouts break symmetric split-votes during leader elections without complex coordination protocols.",
      "Raft enforces uni-directional log replication from leader to follower, drastically simplifying invariant verification."
    ],
    keywords: [
      {
        term: "Quorum",
        category: "Consensus",
        shortDef: "A strict majority of nodes (N/2 + 1) required to validate any cluster decision.",
        fullDef: "Because any two majority subsets in a cluster share at least one overlapping member, quorum intersection prevents split-brain state divergence."
      },
      {
        term: "Heartbeat",
        category: "Networking",
        shortDef: "Periodic empty RPC sent by the leader to suppress new election cycles.",
        fullDef: "Followers reset their internal randomized election timer upon receiving a valid heartbeat from the current term's leader."
      },
      {
        term: "Split-Brain",
        category: "Failure Mode",
        shortDef: "A fatal condition where network partition isolates two groups that both elect leaders.",
        fullDef: "Prevented by quorum rules: an isolated partition with fewer than (N/2 + 1) nodes cannot achieve a majority and therefore cannot commit state changes."
      }
    ],
    definitions: [
      {
        term: "State Machine Replication",
        phonetic: "/steɪt məˈʃiːn ˌrɛplɪˈkeɪʃən/",
        partOfSpeech: "noun (distributed computing)",
        definition: "A technique for building fault-tolerant services by running identical deterministic programs across multiple nodes fed the same sequence of inputs.",
        example: "Etcd and Consul use state machine replication via Raft to maintain reliable configuration data."
      },
      {
        term: "Monotonic Term",
        phonetic: "/ˌmɒn.əˈtɒn.ɪk tɜːrm/",
        partOfSpeech: "noun (protocol logic)",
        definition: "A logical counter that increases incrementally, acting as a logical clock to detect obsolete leaders and stale RPCs.",
        example: "If a Raft server receives an RPC with a term lower than its current term, it immediately rejects the request."
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "In a 5-node Raft cluster, what is the minimum number of operational nodes required to safely commit a new log entry?",
        options: [
          "2 nodes",
          "3 nodes",
          "4 nodes",
          "All 5 nodes"
        ],
        correctIndex: 1,
        explanation: "A quorum requires a strict majority: floor(5/2) + 1 = 3 nodes. If 2 nodes fail, the remaining 3 can still form a majority and commit entries safely."
      },
      {
        id: "q2",
        question: "How does Raft prevent continuous split-vote deadlocks during leader elections?",
        options: [
          "By choosing the leader alphabetically by server hostname",
          "By assigning each server a randomized election timeout within a specified interval (e.g. 150ms-300ms)",
          "By requiring human operator intervention via CLI",
          "By executing an asynchronous Paxos synod specifically for elections"
        ],
        correctIndex: 1,
        explanation: "Randomized election timeouts ensure that one server will almost always time out before its peers, increment its term, and collect majority votes before any competing server starts an election."
      },
      {
        id: "q3",
        question: "According to the Raft Leader Completeness property, if a log entry is committed in a given term:",
        options: [
          "That entry will be present in the logs of the leaders for all higher-numbered terms",
          "The entry must be immediately deleted from follower caches to save memory",
          "All subsequent leaders must downgrade to follower status within 5 seconds",
          "Followers are allowed to independently re-order uncommitted entries"
        ],
        correctIndex: 0,
        explanation: "Leader Completeness guarantees that any entry committed in a term will be present in the logs of all subsequent leaders. This is enforced during election by rejecting candidates whose logs are less up-to-date than the voter's log."
      }
    ]
  },
  {
    id: "prospect-theory",
    title: "Prospect Theory & Asymmetric Loss Aversion",
    subject: "Behavioral Economics",
    subjectCode: "ECON 204",
    readTime: "5 min read",
    createdAt: "2026-10-15",
    lastStudied: "5 days ago",
    masteryScore: 95,
    isStarred: false,
    tags: ["Economics", "Psychology", "Decision Theory", "Heuristics"],
    summary: "The empirical refutation of Expected Utility Theory developed by Daniel Kahneman and Amos Tversky, focusing on the S-shaped value function, framing effects, and probability weighting.",
    sourceExcerpt: "Expected Utility Theory (von Neumann & Morgenstern) posited that rational agents evaluate financial outcomes according to absolute terminal wealth states. In 1979, Kahneman and Tversky introduced Prospect Theory, demonstrating that human decision-making evaluates outcomes as changes relative to a neutral reference point. Furthermore, people exhibit loss aversion: the psychological pain of losing an amount is approximately twice as intense as the pleasure of gaining that same amount.",
    sections: [
      {
        heading: "1. The S-Shaped Value Function",
        content: `Prospect Theory replaces the classical concave utility function with an S-shaped value function $v(x)$ defined over deviations from a subjective reference point:
• **Concave in the domain of gains:** Agents display risk-averse behavior when choosing between sure gains and gambles ($v''(x) < 0$ for $x > 0$).
• **Convex in the domain of losses:** Agents display risk-seeking behavior when attempting to avoid sure losses ($v''(x) > 0$ for $x < 0$).
• **Steeper for losses than for gains:** The slope of the curve is significantly steeper in the negative quadrant. The empirical coefficient of loss aversion $\\lambda \\approx 2.0$ to $2.5$.`,
      },
      {
        heading: "2. The Fourfold Pattern of Risk Preferences",
        content: `Combining the S-shaped value function with non-linear probability weighting produces four distinct risk attitudes:
1. **High probability gain (95% to win $10,000):** Fear of disappointment $\\rightarrow$ **Risk Averse** (prefers sure cash discount).
2. **High probability loss (95% to lose $10,000):** Hope to avoid loss $\\rightarrow$ **Risk Seeking** (gambles to break even).
3. **Low probability gain (1% lottery for $10,000):** Hope of large gain $\\rightarrow$ **Risk Seeking** (overweights longshots).
4. **Low probability loss (1% catastrophe of $10,000):** Fear of ruin $\\rightarrow$ **Risk Averse** (buys expensive insurance).`,
      }
    ],
    takeaways: [
      "Decisions are evaluated as gains or losses relative to an internal reference point, not absolute net worth.",
      "Loss aversion causes the psychological pain of a loss to feel roughly 2x to 2.5x more severe than an identical financial gain.",
      "Probability weighting leads people to systematically overweight unlikely tail events (lottery tickets, insurance)."
    ],
    keywords: [
      {
        term: "Reference Point",
        category: "Psychology",
        shortDef: "The neutral baseline against which potential outcomes are categorized as gains or losses.",
        fullDef: "A cognitive anchor determined by expectations, past status, or framing that dictates whether an outcome feels positive or negative."
      },
      {
        term: "Loss Aversion",
        category: "Cognitive Bias",
        shortDef: "The asymmetric preference to avoid losses over acquiring equivalent gains.",
        fullDef: "Expressed mathematically as v(-x) = -lambda * v(x), where lambda is typically estimated between 1.8 and 2.5."
      }
    ],
    definitions: [
      {
        term: "Framing Effect",
        phonetic: "/ˈfreɪ.mɪŋ ɪˈfɛkt/",
        partOfSpeech: "noun (behavioral science)",
        definition: "A cognitive bias wherein people decide on options based on whether they are presented with positive or negative connotations.",
        example: "Describing medical treatment as having a '90% survival rate' yields higher approval than a '10% mortality rate'."
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "When facing a choice between a guaranteed loss of $500 vs. an 50% chance of losing $1,000 (and 50% of losing $0), how do most people behave according to Prospect Theory?",
        options: [
          "They choose the guaranteed loss to eliminate uncertainty (risk averse)",
          "They gamble and choose the 50% chance of losing $1,000 (risk seeking in losses)",
          "They show complete indifference because both options have identical expected value (-$500)",
          "They refuse to answer due to cognitive dissonance"
        ],
        correctIndex: 1,
        explanation: "In the domain of losses, the S-shaped value function is convex, reflecting diminishing sensitivity to larger losses. People gamble to avoid a guaranteed loss, behaving in a risk-seeking manner."
      },
      {
        id: "q2",
        question: "What is the typical empirical estimate for the loss aversion coefficient (λ) in behavioral decision research?",
        options: [
          "λ ≈ 0.5 (losses hurt half as much as gains)",
          "λ ≈ 1.0 (losses and gains are valued symmetrically)",
          "λ ≈ 2.0 to 2.5 (losses hurt roughly twice as much as equivalent gains)",
          "λ ≈ 10.0 (losses cause complete decision paralysis)"
        ],
        correctIndex: 2,
        explanation: "Decades of empirical studies pioneered by Kahneman and Tversky confirm that λ generally ranges from 1.8 to 2.5, indicating losses weigh approximately twice as heavily as corresponding gains."
      }
    ]
  }
];

export const INITIAL_QUIZ_HISTORY = [
  {
    id: "hist-1",
    topicId: "synaptic-plasticity",
    topicTitle: "Synaptic Plasticity & Spaced Repetition",
    subject: "Cognitive Science",
    score: 4,
    totalQuestions: 4,
    percentage: 100,
    timeTaken: "1m 42s",
    date: "2026-10-28 16:22",
    feedback: "Mastery demonstrated. Excellent command of receptor trafficking and coincidence detection."
  },
  {
    id: "hist-2",
    topicId: "transformer-architecture",
    topicTitle: "Transformer Architecture & Self-Attention",
    subject: "Machine Learning",
    score: 4,
    totalQuestions: 5,
    percentage: 80,
    timeTaken: "2m 15s",
    date: "2026-10-27 11:10",
    feedback: "Strong grasp of dimensional scaling and multi-head attention. Minor review suggested for positional encoding properties."
  },
  {
    id: "hist-3",
    topicId: "distributed-consensus",
    topicTitle: "Distributed Consensus: Raft vs. Paxos Protocols",
    subject: "Distributed Systems",
    score: 2,
    totalQuestions: 3,
    percentage: 67,
    timeTaken: "1m 18s",
    date: "2026-10-25 14:05",
    feedback: "Satisfactory quorum understanding. Re-study split-vote mechanics and term advancement."
  }
];

export const SAMPLE_TEXTS_FOR_CREATOR = [
  {
    label: "Cellular Respiration & Chemiosmosis",
    category: "Biochemistry",
    title: "Cellular Respiration & Chemiosmosis",
    text: `Cellular respiration is the biochemical pathway by which eukaryotic cells break down glucose to generate adenosine triphosphate (ATP). The overall chemical equation is: C6H12O6 + 6 O2 -> 6 CO2 + 6 H2O + ~30-32 ATP.

The process comprises four tightly coupled stages:
1. Glycolysis: Occurring in the cytosol, a single 6-carbon glucose molecule is cleaved into two 3-carbon pyruvate molecules, producing a net yield of 2 ATP (via substrate-level phosphorylation) and 2 NADH. Glycolysis requires no oxygen and is universally conserved across all known domains of life.

2. Pyruvate Oxidation: Pyruvate translocates across the mitochondrial outer and inner membranes into the matrix via pyruvate translocase. The pyruvate dehydrogenase complex decarboxylates pyruvate, releasing one CO2, reducing NAD+ to NADH, and attaching coenzyme A to produce Acetyl-CoA.

3. The Citric Acid (Krebs) Cycle: Acetyl-CoA (2 carbons) condenses with oxaloacetate (4 carbons) to form citrate (6 carbons). Through a complete cycle of eight enzymatic reactions, the two carbons are oxidized to CO2, regenerating oxaloacetate. Each turn yields 3 NADH, 1 FADH2, 1 GTP (convertible to ATP), and 2 CO2. Because one glucose produces two pyruvates, the cycle turns twice per glucose.

4. Oxidative Phosphorylation & Chemiosmosis: The electron transport chain (ETC) consists of four multi-protein complexes (Complexes I-IV) embedded in the inner mitochondrial cristae. High-energy electrons donated by NADH and FADH2 pass through redox centers (FMN, Fe-S clusters, ubiquinone, cytochromes). This exergonic electron flow powers active proton (H+) pumping from the matrix into the intermembrane space, creating a steep electrochemical gradient (proton motive force). 

Finally, Peter Mitchell's Chemiosmosis theory explains how ATP Synthase utilizes this proton motive force: protons flow down their concentration gradient back into the matrix through the F0 rotor subunit, driving conformational rotations in the F1 catalytic head that synthesize ATP from ADP and inorganic phosphate. Molecular oxygen (O2) acts as the terminal electron acceptor, binding protons and spent electrons to form metabolic water (H2O). Without oxygen, the chain backs up, stopping ATP synthesis.`
  },
  {
    label: "Quantum Computing: Superposition & Entanglement",
    category: "Quantum Physics",
    title: "Quantum Computing: Superposition & Entanglement",
    text: `Quantum computing replaces classical binary digits (bits) with quantum bits (qubits). While a classical bit exists strictly in state 0 or 1, a qubit exists in a linear superposition of states: |psi> = alpha|0> + beta|1>, where alpha and beta are complex probability amplitudes satisfying |alpha|^2 + |beta|^2 = 1.

Key principles governing quantum computation:
1. Superposition: A system of n qubits can simultaneously represent a linear combination of 2^n orthogonal basis states. When a measurement is performed in the computational basis, the superposition collapses probabilistically to a single eigenstate with probability equal to the squared modulus of its amplitude.

2. Quantum Entanglement: Multi-qubit states can be correlated such that the quantum state of each particle cannot be described independently of the state of the others, even when separated by arbitrary spatial distances. The canonical Bell state |Phi+> = (1/sqrt(2))(|00> + |11>) demonstrates maximal entanglement: measuring the first qubit instantly determines the outcome of measuring the second qubit.

3. No-Cloning Theorem: It is mathematically impossible to create an identical copy of an arbitrary unknown quantum state. This theorem prevents classical error-correction techniques (which rely on duplicating bits) and necessitates quantum error-correction codes using entangled auxiliary qubits to detect phase and bit-flip errors without measuring the logical state itself.

4. Quantum Gates: Operations are implemented via unitary matrices that preserve the norm of quantum state vectors. Elementary gates include the Hadamard gate (which creates equal superpositions from basis states), Pauli gates (X, Y, Z), and the two-qubit CNOT (Controlled-NOT) gate that generates entanglement.`
  },
  {
    label: "Monetary Policy & The Taylor Rule",
    category: "Macroeconomics",
    title: "Monetary Policy & The Taylor Rule",
    text: `Central banks manage macroeconomic stability primarily through interest rate policy, adjusting the price of short-term liquidity to balance price stability (inflation target) with full employment (output gap).

The Taylor Rule, formulated by John B. Taylor in 1993, provides a systematic prescriptive benchmark for setting the nominal policy interest rate:
i_t = r* + pi_t + 0.5(pi_t - pi*) + 0.5(y_t - y*)

Where:
• i_t is the target nominal federal funds rate.
• r* is the equilibrium real interest rate (historically estimated around 2%).
• pi_t is the current rate of inflation.
• pi* is the central bank's desired target inflation rate (typically 2.0%).
• (pi_t - pi*) is the inflation gap.
• (y_t - y*) is the output gap: the percentage deviation of real GDP from potential GDP.

The Taylor Principle:
A fundamental insight of the rule is that the coefficient on inflation exceeds 1.0 (since 1 + 0.5 = 1.5). When inflation rises by 1 percentage point, the central bank must raise the nominal interest rate by more than 1 percentage point (specifically 1.5 percentage points). This ensures that the REAL interest rate (r = i - pi) rises, tightening financial conditions, reducing aggregate demand, and cooling inflationary pressures. If the central bank raises rates by less than the increase in inflation, real interest rates fall, inadvertently stimulating the economy and triggering an inflationary spiral.`
  }
];

