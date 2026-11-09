export interface PostAuthor {
  _id: string;
  username: string;
  photo: string;
  bio?: string;
  verified?: boolean;
}

export interface AudioCommentData {
  mediaUrl: string;
  durationMs: number; // max 30000ms
  waveform: number[]; // normalized values 0.0 - 1.0
  mimeType?: string;
}

export interface PostComment {
  _id?: string;
  type?: 'text' | 'audio';
  text?: string;
  audio?: AudioCommentData;
  author: PostAuthor;
  createdAt: string;
}

export interface TechMetadata {
  techStack: string[];
  topics?: string[]; // e.g. ["Systems & OS", "Linux", "Kernel"]
  githubUrl?: string; // Optional attachment
  demoUrl?: string; // Optional attachment
  docUrl?: string; // Optional attachment
  docAttachment?: {
    category: string;
    title: string;
    url: string;
  };
  codeSnippet?: string;
  language?: string;
  isExecutable?: boolean;
  benchmarkOps?: string;
  postType?: "explanation" | "project" | "question" | "discussion";
}

export interface MemeLayer {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  rotation: number;
  isAllCaps: boolean;
}

export interface MemeMetadata {
  isTemplate: boolean;
  parentMemeId?: string;
  originalAuthor?: string;
  remixCount?: number;
  templateImageUrl: string;
  canvasWidth?: number;
  canvasHeight?: number;
  layers?: MemeLayer[];
}

export interface CricketMetadata {
  matchTitle?: string;
  teams?: { home: string; away: string };
  scoreSnippet?: string;
  matchFormat?: "Test" | "T20" | "ODI" | "General";
  venue?: string;
  currentOver?: string;
  target?: string;
}

export interface SwitchPost {
  _id: string;
  content: string;
  world: "Technology" | "Meme" | "Cricket" | "Thoughts" | string;
  image?: string;
  author: PostAuthor;
  createdAt: string;
  likes: string[];
  comments: PostComment[];
  sharesCount?: number;
  saved?: boolean;
  // World-specific specialized data
  tech?: TechMetadata;
  meme?: MemeMetadata;
  cricket?: CricketMetadata;
}

export const INITIAL_SWITCH_POSTS: SwitchPost[] = [
  // 0. Technology World - Copy-on-Write during fork() (Screenshot Feature Post)
  {
    _id: "tech-cow-fork",
    world: "Technology",
    author: {
      _id: "user-systems-eng",
      username: "Systems Engineer",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80",
      bio: "Operating Systems",
      verified: true,
    },
    content: "Why does Linux use copy-on-write during fork()?\n\nI was exploring how process creation works internally. The interesting part is that memory isn't immediately duplicated, which saves a lot of resources. Instead, both parent and child processes share the same physical pages marked as read-only. Only when either process attempts to write to a page does the MMU trigger a page fault, prompting the kernel to allocate a fresh copy for that process.",
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    likes: Array(124).fill("like-user"),
    sharesCount: 18,
    comments: Array(32).fill({
      _id: "c-cow",
      author: {
        _id: "user-alex",
        username: "alex_dev",
        photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&h=300&q=80",
      },
      text: "Brilliant explanation of MMU page fault trapping during COW!",
      createdAt: "1 hour ago",
    }),
    tech: {
      techStack: ["Linux", "Operating Systems", "Memory Management", "C"],
      topics: ["Systems & OS", "Software"],
      docAttachment: {
        category: "LINUX • MEMORY MANAGEMENT",
        title: "Copy-on-write explained",
        url: "https://www.kernel.org/doc/html/latest/admin-guide/mm/concepts.html",
      },
      postType: "explanation",
    },
  },

  // 0b. Technology World - What are you building this weekend?
  {
    _id: "tech-weekend-build",
    world: "Technology",
    author: {
      _id: "user-dev-general",
      username: "Developer",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80",
      bio: "Full Stack & Distributed",
      verified: false,
    },
    content: "What are you building this weekend?\n\nShare your side projects, experiments and open-source contributions with the Tech World community.",
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    likes: Array(45).fill("like-user"),
    sharesCount: 9,
    comments: [
      {
        _id: "c-build-1",
        author: {
          _id: "user-sarah",
          username: "sarah_chen",
          photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&h=300&q=80",
        },
        text: "Building an audio packet parser in Rust with zero heap allocations!",
        createdAt: "2 hours ago",
      },
    ],
    tech: {
      techStack: ["Open Source", "Side Projects", "Community"],
      topics: ["Software", "Systems & OS"],
      postType: "discussion",
    },
  },

  // 1. Technology World - Lock-Free Buffer
  {
    _id: "tech-1",
    world: "Technology",
    author: {
      _id: "user-alex",
      username: "alex_dev",
      photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&h=300&q=80",
      bio: "Systems architect building resilient micro-runtimes.",
      verified: true
    },
    content: "Designed a lock-free ring buffer algorithm for low-latency audio packet processing. Benchmarking results show 1.4M ops/sec with zero memory allocations in the hot loop. Click 'Run Code' below to test the execution sandbox live!",
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    likes: ["user-dan", "user-sarah"],
    comments: [
      {
        _id: "c-tech-audio",
        type: "audio",
        audio: {
          mediaUrl: "https://actions.google.com/sounds/v1/crowds/battle_crowd_celebrate_staged.ogg",
          durationMs: 12500,
          waveform: [0.1, 0.4, 0.8, 0.9, 0.7, 0.5, 0.8, 0.95, 0.6, 0.3, 0.5],
          mimeType: "audio/ogg",
        },
        author: {
          _id: "user-sarah",
          username: "sarah_chen",
          photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&h=300&q=80"
        },
        createdAt: "15 mins ago"
      }
    ],
    tech: {
      techStack: ["TypeScript", "Algorithms", "Concurrency", "WebAudio"],
      topics: ["Systems & OS", "Software", "Networking"],
      githubUrl: "https://github.com/switch-social/audio-ring-buffer",
      demoUrl: "https://demo.switch.social/ring-buffer",
      language: "javascript",
      isExecutable: true,
      postType: "project",
      benchmarkOps: "1.4M ops/sec",
      codeSnippet: `// Lock-Free Ring Buffer Benchmark Simulator
function simulateBufferOperations(capacity, iterations) {
  const buffer = new Float32Array(capacity);
  let head = 0, tail = 0;
  const start = performance.now();
  
  for (let i = 0; i < iterations; i++) {
    // Write sample
    buffer[head % capacity] = Math.sin(i * 0.05);
    head++;
    // Read sample
    const sample = buffer[tail % capacity];
    tail++;
  }
  
  const elapsed = (performance.now() - start).toFixed(2);
  console.log("Processed " + iterations.toLocaleString() + " audio samples in " + elapsed + "ms");
  console.log("Throughput: " + Math.round((iterations / (elapsed / 1000))).toLocaleString() + " ops/sec");
  return { elapsedMs: elapsed, status: "Optimal" };
}

simulateBufferOperations(1024, 500000);`
    }
  },

  // 2. Technology World - Distributed Consensus
  {
    _id: "tech-2",
    world: "Technology",
    author: {
      _id: "user-sarah",
      username: "sarah_chen",
      photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&h=300&q=80",
      bio: "Distributed Systems • Rust & Tokio",
      verified: true
    },
    content: "Published v0.8 of our Raft consensus heartbeat library. Tested under simulated 35% network packet loss across 5 cluster nodes. Heartbeat election stabilizes in under 45ms.",
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    likes: ["user-alex", "user-dan"],
    comments: [
      {
        _id: "c-tech-2-1",
        type: "text",
        text: "How do you handle split-brain scenarios when 2 nodes rejoin simultaneously?",
        author: {
          _id: "user-alex",
          username: "alex_dev",
          photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&h=300&q=80"
        },
        createdAt: "40 mins ago"
      }
    ],
    tech: {
      techStack: ["Rust", "Tokio", "Raft", "Distributed"],
      topics: ["Networking", "Systems & OS", "Software"],
      githubUrl: "https://github.com/switch-social/raft-cluster-heartbeat",
      demoUrl: "https://demo.switch.social/raft-visualizer",
      language: "javascript",
      isExecutable: true,
      postType: "project",
      benchmarkOps: "45ms Election Window",
      codeSnippet: `// Raft Term Election Simulator
class RaftNode {
  constructor(id, totalNodes) {
    this.id = id;
    this.term = 1;
    this.state = 'FOLLOWER';
    this.votes = 0;
    this.quorum = Math.floor(totalNodes / 2) + 1;
  }
  requestVote() {
    this.state = 'CANDIDATE';
    this.term += 1;
    this.votes = 1; // vote for self
    return this.votes >= this.quorum;
  }
}
const node = new RaftNode(1, 5);
console.log("Candidate Node " + node.id + " initiated Term " + node.term + " election.");
console.log("Required Quorum: " + node.quorum + " votes.");`
    }
  },

  // 3. Technology World - OS Architecture / Virtual Memory (Technical Deep Dive)
  {
    _id: "tech-3",
    world: "Technology",
    author: {
      _id: "user-marcus-os",
      username: "marcus_kernel",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80",
      bio: "Low-level kernels, memory hierarchy & hardware interfaces.",
      verified: true
    },
    content: "Why does Linux use virtual memory instead of directly accessing physical RAM?\n\nDirect physical addressing would mean any errant process pointer can corrupt kernel memory or another program's address space. Virtual memory provides hardware-enforced isolation via the MMU (Memory Management Unit). When a process executes a context switch, the OS swaps the root page table pointer (CR3 register on x86-64), creating a private, contiguous 48-bit address space.",
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    likes: ["user-alex", "user-sarah", "user-marcus-os"],
    comments: [
      {
        _id: "c-tech-3-1",
        type: "text",
        text: "Great breakdown! Also worth highlighting TLB (Translation Lookaside Buffer) shootdowns during context switches on multi-core SMP systems.",
        author: {
          _id: "user-sarah",
          username: "sarah_chen",
          photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&h=300&q=80"
        },
        createdAt: "2 hours ago"
      }
    ],
    tech: {
      techStack: ["Linux", "Kernel", "Memory Management", "C++", "x86-64"],
      topics: ["Systems & OS", "Hardware", "Software"],
      docUrl: "https://www.kernel.org/doc/html/latest/admin-guide/mm/index.html",
      language: "cpp",
      isExecutable: false,
      postType: "explanation",
      codeSnippet: `// Linux kernel context switch routine (simplified assembly/C)
void switch_mm_irqs_off(struct mm_struct *prev, struct mm_struct *next,
                        struct task_struct *tsk) {
    // Check if the address space is actually changing
    if (likely(prev != next)) {
        // Load CR3 register with the physical address of the next PGD
        native_write_cr3(virt_to_phys(next->pgd));
        trace_tlb_flush(TLB_FLUSH_ON_TASK_SWITCH, TLB_FLUSH_ALL);
    }
}`
    }
  },

  // 4. Technology World - AI / Machine Learning (Algorithm Breakdown)
  {
    _id: "tech-4",
    world: "Technology",
    author: {
      _id: "user-priya-ai",
      username: "priya_ml",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80",
      bio: "Machine Learning research & optimized tensor kernels.",
      verified: true
    },
    content: "Implemented scaled dot-product attention in pure NumPy without framework dependencies. Notice how dividing by sqrt(d_k) prevents the softmax gradients from vanishing into regions with extremely small gradients when vector dimensionality is high.",
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    likes: ["user-alex", "user-priya-ai"],
    comments: [],
    tech: {
      techStack: ["Python", "NumPy", "Transformers", "Linear Algebra"],
      topics: ["AI / ML", "Software", "Data"],
      githubUrl: "https://github.com/switch-social/micro-attention-kernel",
      language: "python",
      isExecutable: false,
      postType: "explanation",
      codeSnippet: `import numpy as np

def scaled_dot_product_attention(Q, K, V, mask=None):
    """
    Q, K, V matrices with shape (batch_size, seq_len, d_k)
    """
    d_k = Q.shape[-1]
    scores = np.matmul(Q, K.swapaxes(-2, -1)) / np.sqrt(d_k)
    
    if mask is not None:
        scores = np.where(mask == 0, -1e9, scores)
        
    weights = np.exp(scores - np.max(scores, axis=-1, keepdims=True))
    weights /= np.sum(weights, axis=-1, keepdims=True)
    return np.matmul(weights, V)`
    }
  },

  // 3. Meme World - Production Friday Meme
  {
    _id: "meme-1",
    world: "Meme",
    author: {
      _id: "user-devmemes",
      username: "DevHumor",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80",
      bio: "Turning production bugs into cultural artifacts.",
      verified: true,
    },
    content: "When you push straight to production on a Friday afternoon thinking 'what could possibly go wrong?' 💀 Click 'Remix Template' to customize your own variant in the Mini Editor!",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    likes: ["user-alex", "user-dan", "user-sarah"],
    sharesCount: 142,
    meme: {
      isTemplate: true,
      remixCount: 89,
      templateImageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
      canvasWidth: 600,
      canvasHeight: 400,
      layers: [
        {
          id: "t1",
          text: "DEPLOYING ON FRIDAY 5PM",
          x: 300,
          y: 45,
          fontSize: 28,
          fontFamily: "Impact",
          fillColor: "#ffffff",
          strokeColor: "#000000",
          strokeWidth: 3,
          rotation: 0,
          isAllCaps: true,
        },
        {
          id: "t2",
          text: "ON-CALL ENGINEER'S WEEKEND",
          x: 300,
          y: 360,
          fontSize: 28,
          fontFamily: "Impact",
          fillColor: "#ffffff",
          strokeColor: "#000000",
          strokeWidth: 3,
          rotation: 0,
          isAllCaps: true,
        }
      ]
    },
    comments: [
      {
        _id: "cmeme-1",
        type: "audio",
        audio: {
          mediaUrl: "https://actions.google.com/sounds/v1/crowds/battle_crowd_celebrate_staged.ogg",
          durationMs: 8200,
          waveform: [0.15, 0.35, 0.75, 0.9, 0.6, 0.8, 0.45, 0.3, 0.65, 0.85, 0.5, 0.2, 0.7, 0.95, 0.4, 0.1],
          mimeType: "audio/ogg",
        },
        author: {
          _id: "user-alex",
          username: "alex_dev",
          photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&h=300&q=80",
        },
        createdAt: "10 mins ago"
      },
      {
        _id: "cmeme-2",
        type: "text",
        text: "The sheer accuracy of this hurts my soul 😂",
        author: {
          _id: "user-dan",
          username: "Dan_A",
          photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&h=300&q=80",
        },
        createdAt: "5 mins ago"
      }
    ]
  },

  // 4. Meme World - Code Review Template
  {
    _id: "meme-2",
    world: "Meme",
    author: {
      _id: "user-dan",
      username: "Dan_A",
      photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&h=300&q=80",
      bio: "Meme aficionado & full-stack builder.",
      verified: true
    },
    content: "When senior dev approves your 1-line PR in 12 seconds vs when you change 400 lines of CSS formatting. Remix this template with your team's code review drama!",
    image: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=1200&q=80",
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    likes: ["user-alex", "user-devmemes"],
    sharesCount: 65,
    meme: {
      isTemplate: true,
      remixCount: 42,
      templateImageUrl: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=1200&q=80",
      canvasWidth: 600,
      canvasHeight: 400,
      layers: [
        {
          id: "m2-1",
          text: "1 LINE TYPO FIX: APPROVED",
          x: 300,
          y: 45,
          fontSize: 26,
          fontFamily: "Impact",
          fillColor: "#ffffff",
          strokeColor: "#000000",
          strokeWidth: 3,
          rotation: 0,
          isAllCaps: true,
        },
        {
          id: "m2-2",
          text: "400 LINES CSS: 89 COMMENTS",
          x: 300,
          y: 360,
          fontSize: 26,
          fontFamily: "Impact",
          fillColor: "#ffffff",
          strokeColor: "#000000",
          strokeWidth: 3,
          rotation: 0,
          isAllCaps: true,
        }
      ]
    },
    comments: []
  },

  // 5. Cricket World - Match Highlight & Voice Reaction
  {
    _id: "cricket-1",
    world: "Cricket",
    author: {
      _id: "user-cricketinsider",
      username: "CricketPundit",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80",
      bio: "Covering Test cricket, franchise leagues & tactical match analysis.",
      verified: true,
    },
    content: "Unbelievable spell in the final session! 4 wickets for 18 runs under lights. The seam movement off the deck was impossible to play. Listen to the 20-second audio reaction breakdown attached below 🎙️🏏",
    image: "https://images.unsplash.com/photo-1531415074868-036b1c57e329?auto=format&fit=crop&w=1200&q=80",
    createdAt: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
    likes: ["user-alex", "user-dan", "user-sarah"],
    sharesCount: 78,
    cricket: {
      matchTitle: "India vs Australia — Border-Gavaskar Trophy",
      teams: { home: "IND", away: "AUS" },
      scoreSnippet: "AUS 184 & 92/4 (31.4 ov) • Target 240",
      matchFormat: "Test",
      venue: "Perth Stadium, Australia",
      currentOver: "31.4 ov",
      target: "240 runs"
    },
    comments: [
      {
        _id: "ccrick-1",
        type: "audio",
        audio: {
          mediaUrl: "https://actions.google.com/sounds/v1/sports/football_match_crowd_cheer.ogg",
          durationMs: 14500,
          waveform: [0.2, 0.4, 0.6, 0.85, 0.95, 0.9, 0.7, 0.8, 0.88, 0.92, 0.78, 0.65, 0.45, 0.3, 0.15],
          mimeType: "audio/ogg",
        },
        author: {
          _id: "user-crickfan",
          username: "Ravi_Commentary",
          photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&h=300&q=80",
        },
        createdAt: "18 mins ago"
      },
      {
        _id: "ccrick-2",
        type: "text",
        text: "That outswinger to dismiss the captain was absolute poetry. Ball of the century contender!",
        author: {
          _id: "user-dan",
          username: "Dan_A",
          photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&h=300&q=80",
        },
        createdAt: "12 mins ago"
      }
    ]
  },

  // 6. Cricket World - T20 Super Over Thriller
  {
    _id: "cricket-2",
    world: "Cricket",
    author: {
      _id: "user-ravicomms",
      username: "Ravi_Commentary",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&h=300&q=80",
      bio: "Pitch Reports & 30s Voice Reaction Highlights",
      verified: true
    },
    content: "SUPER OVER THRILLER! 18 needed off 6 balls and it went down to the final delivery. Yorkers executed with laser precision. Listen to my immediate audio pitch reaction from the commentary box!",
    image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80",
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    likes: ["user-cricketinsider", "user-alex"],
    sharesCount: 112,
    cricket: {
      matchTitle: "T20 Championship — Super Over Eliminator",
      teams: { home: "ENG", away: "SA" },
      scoreSnippet: "Match Tied (198/6) • Super Over Live",
      matchFormat: "T20",
      venue: "Lord's Cricket Ground, London",
      currentOver: "Super Over",
      target: "19 runs"
    },
    comments: [
      {
        _id: "ccrick-2-audio",
        type: "audio",
        audio: {
          mediaUrl: "https://actions.google.com/sounds/v1/sports/football_match_crowd_cheer.ogg",
          durationMs: 16200,
          waveform: [0.3, 0.6, 0.9, 0.95, 0.8, 0.85, 0.7, 0.9, 0.8, 0.4, 0.2],
          mimeType: "audio/ogg",
        },
        author: {
          _id: "user-cricketinsider",
          username: "CricketPundit",
          photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80"
        },
        createdAt: "2 hours ago"
      }
    ]
  }
];

// EXACTLY 3 specialized worlds + All
export const WORLD_DEFINITIONS = [
  {
    id: "All",
    label: "All Worlds",
    tagline: "The collective stream across Technology, Meme, and Cricket worlds",
    color: "#506ffc",
    badgeBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    slug: "/"
  },
  {
    id: "Technology",
    label: "Technology World",
    tagline: "Engineering architectures, open source repositories, code execution & tutorials",
    color: "#06b6d4",
    badgeBg: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    slug: "/world/tech"
  },
  {
    id: "Meme",
    label: "Meme World",
    tagline: "Interactive meme templates, caption remixes & cultural banter",
    color: "#eab308",
    badgeBg: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    slug: "/world/meme"
  },
  {
    id: "Cricket",
    label: "Cricket World",
    tagline: "Live scoreboards, match discussions, 30s voice reaction notes & pitch analysis",
    color: "#10b981",
    badgeBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    slug: "/world/cricket"
  }
] as const;
