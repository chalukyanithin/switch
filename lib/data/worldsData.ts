export interface PostAuthor {
  _id: string;
  username: string;
  photo: string;
  bio?: string;
  verified?: boolean;
}

export interface PostComment {
  _id?: string;
  text: string;
  author: PostAuthor;
  createdAt: string;
}

export interface CookingMetadata {
  prepTime: string;
  cookTime: string;
  difficulty: "Easy" | "Intermediate" | "Advanced";
  servings: string;
  ingredients: string[];
  instructions: string[];
}

export interface ArtMetadata {
  medium: string;
  style: string;
  dimensions?: string;
  year?: string;
  palette?: string[];
  processSteps?: string[];
}

export interface TechMetadata {
  techStack: string[];
  githubUrl?: string;
  demoUrl?: string;
  codeSnippet?: string;
}

export interface MusicMetadata {
  trackTitle: string;
  duration: string;
  genre: string;
  bpm: number;
  key: string;
  instruments?: string[];
}

export interface FitnessExercise {
  name: string;
  sets: string;
  reps: string;
  rest: string;
}

export interface FitnessMetadata {
  routineType: string;
  duration: string;
  intensity: "Low" | "Moderate" | "High" | "Extreme";
  targetMuscles: string[];
  caloriesBurned: string;
  exercises: FitnessExercise[];
}

export interface SwitchPost {
  _id: string;
  content: string;
  world: "Cooking" | "Art" | "Technology" | "Music" | "Fitness" | "Thoughts" | string;
  image?: string;
  author: PostAuthor;
  createdAt: string;
  likes: string[];
  comments: PostComment[];
  sharesCount?: number;
  saved?: boolean;
  // World-specific specialized data
  cooking?: CookingMetadata;
  art?: ArtMetadata;
  tech?: TechMetadata;
  music?: MusicMetadata;
  fitness?: FitnessMetadata;
}

export const INITIAL_SWITCH_POSTS: SwitchPost[] = [
  // 1. Cooking World
  {
    _id: "cook-1",
    world: "Cooking",
    author: {
      _id: "user-elena",
      username: "Elena_Vance",
      photo: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&h=300&q=80",
      bio: "Pastry chef & artisanal bread baker. Milan & Tokyo.",
      verified: true
    },
    content: "Golden Rosemary & Sea Salt Focaccia. The hydration sits at 82% with a 36-hour cold ferment in the olive oil bath. Listen to that blistered crust crackle as it comes out of the hearth!",
    image: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=1200&q=80",
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    likes: ["user-elena", "user-maya", "user-sarah"],
    comments: [
      {
        _id: "c-c1",
        text: "The crumb structure on this is absolute perfection!",
        author: { _id: "user-marco", username: "Marco_Rossi", photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&h=300&q=80" },
        createdAt: "20m ago"
      },
      {
        _id: "c-c2",
        text: "Added to my Sunday baking schedule. What flour brand did you use?",
        author: { _id: "user-maya", username: "Maya_Lin", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80" },
        createdAt: "10m ago"
      }
    ],
    cooking: {
      prepTime: "25 mins",
      cookTime: "30 mins",
      difficulty: "Intermediate",
      servings: "6-8 portions",
      ingredients: [
        "500g Tipo 00 or Bread Flour (13% protein)",
        "410ml Lukewarm filtered water (82% hydration)",
        "7g Active dry yeast",
        "10g Fine Mediterranean sea salt",
        "60ml Extra virgin cold-pressed olive oil",
        "Fresh rosemary sprigs & flaky Maldon salt"
      ],
      instructions: [
        "Whisk flour, water, and bloomed yeast into a shaggy mass; autolyse for 30 minutes.",
        "Fold in fine sea salt and 20ml olive oil. Perform 4 coil-folds spaced 25 mins apart.",
        "Cover tightly and slow-ferment in refrigerator for 36 hours.",
        "Transfer onto an oiled baking sheet; let proof at room temp until bubbly (approx. 2 hours).",
        "Dimple deep pockets with olive-oiled fingertips, tuck fresh rosemary sprigs, shower with flaky salt.",
        "Bake in a preheated 225°C (435°F) oven for 26-28 minutes until blistered and golden."
      ]
    }
  },
  // 2. Art World
  {
    _id: "art-1",
    world: "Art",
    author: {
      _id: "user-maya",
      username: "Maya_Lin",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80",
      bio: "Visual artist exploring light scattering and mist in oil on linen.",
      verified: true
    },
    content: "Atmospheric Reverie #12 — 120 x 90 cm, Oil on Belgian Linen.\n\nExploring how warm light dissolves into dense maritime morning fog. Built over three months in 14 translucent glaze layers.",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80",
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    likes: ["user-elena", "user-kenji", "user-jordan", "user-alex"],
    comments: [
      {
        _id: "c-a1",
        text: "The depth in that upper right corner is breathtaking. Looks like Turner re-imagined.",
        author: { _id: "user-kenji", username: "Kenji_Sato", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80" },
        createdAt: "1h ago"
      }
    ],
    art: {
      medium: "Oil on Belgian Linen",
      style: "Atmospheric Impressionism",
      dimensions: "120 × 90 cm",
      year: "2026",
      palette: ["#1B263B", "#415A77", "#778DA9", "#E0E1DD", "#DDA15E"],
      processSteps: [
        "Toned linen ground with warm raw umber wash",
        "Broad value massing using heavy bristle filberts",
        "Layering 14 stand-oil glazes with 72h drying between each",
        "Dry-brush scumbling across horizon highlights"
      ]
    }
  },
  // 3. Technology World
  {
    _id: "tech-1",
    world: "Technology",
    author: {
      _id: "user-sarah",
      username: "Sarah_Chen",
      photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&h=300&q=80",
      bio: "Systems architect. Distributed consensus, Rust & real-time protocols.",
      verified: true
    },
    content: "Shipped SolarCache v0.8: an open-source, lock-free distributed cache written in Rust. Replaced synchronous mutex locks with sharded lock-free ring buffers, yielding 4.2x throughput under heavy concurrent write loads.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    likes: ["user-alex", "user-sarah", "user-elena"],
    comments: [
      {
        _id: "c-t1",
        text: "Benchmarked this on our cluster today. Latency p99 dropped from 14ms down to 1.8ms! Super clean code.",
        author: { _id: "user-alex", username: "Alex_Rivera", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&h=300&q=80" },
        createdAt: "2h ago"
      }
    ],
    tech: {
      techStack: ["Rust", "Tokio", "Lock-free Atomics", "Distributed Raft", "SIMD"],
      githubUrl: "https://github.com/switch-lab/solarcache",
      demoUrl: "https://solarcache.switch.dev",
      codeSnippet: `pub async fn handle_stream<T: AsyncRead + AsyncWrite + Unpin>(
    mut stream: T,
    cache: Arc<LockFreeRingBuffer>
) -> Result<(), NetworkError> {
    let (mut rx, mut tx) = stream.split();
    while let Some(cmd) = rx.decode_next().await? {
        let resp = match cmd {
            Command::Get(key) => cache.fast_read(&key),
            Command::Set(k, v, ttl) => cache.commit_epoch(k, v, ttl).await,
        };
        tx.send_fast(resp).await?;
    }
    Ok(())
}`
    }
  },
  // 4. Music World
  {
    _id: "music-1",
    world: "Music",
    author: {
      _id: "user-jordan",
      username: "Jordan_Vance",
      photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&h=300&q=80",
      bio: "Modular synthesist & film composer. Analog circuits + tape delay.",
      verified: true
    },
    content: "Midnight Echoes (Live Eurorack & Fender Rhodes Session). Captured straight to 1/2-inch reel tape at 15 IPS with zero computer plugins. Pure harmonics and organic tape flutter.",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
    createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    likes: ["user-jordan", "user-elena", "user-maya"],
    comments: [
      {
        _id: "c-m1",
        text: "That tape saturation warms up the Rhodes in a way no VST can touch.",
        author: { _id: "user-elena", username: "Elena_Vance", photo: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&h=300&q=80" },
        createdAt: "4h ago"
      }
    ],
    music: {
      trackTitle: "Midnight Echoes (Live Reel-to-Reel)",
      duration: "3:48",
      genre: "Neo-Classical Ambient",
      bpm: 76,
      key: "D Minor",
      instruments: ["1973 Fender Rhodes Mk1", "Make Noise Eurorack", "Roland Space Echo RE-201", "Revox B77 Tape"]
    }
  },
  // 5. Fitness World
  {
    _id: "fit-1",
    world: "Fitness",
    author: {
      _id: "user-marcus",
      username: "Coach_Marcus",
      photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&h=300&q=80",
      bio: "Olympic gymnastics strength coach & functional movement specialist.",
      verified: true
    },
    content: "High-Tension Calisthenics Routine for Upper Body Control. The goal here is strict time-under-tension: 3-second negatives on every pull and zero momentum. Quality of movement beats quantity every single time.",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80",
    createdAt: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
    likes: ["user-marcus", "user-sarah"],
    comments: [
      {
        _id: "c-f1",
        text: "Those hollow-body holds are brutal at the end of the circuit! Great programming.",
        author: { _id: "user-sarah", username: "Sarah_Chen", photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&h=300&q=80" },
        createdAt: "5h ago"
      }
    ],
    fitness: {
      routineType: "Gymnastic Strength & Core Control",
      duration: "45 minutes",
      intensity: "High",
      targetMuscles: ["Lats", "Rhomboids", "Anterior Core", "Triceps", "Scapular Stabilizers"],
      caloriesBurned: "~410 kcal",
      exercises: [
        { name: "Strict Bar Muscle-Up (or Chest-to-Bar Pull)", sets: "4 sets", reps: "5 reps", rest: "90 sec" },
        { name: "Ring Dips with 2-sec bottom pause", sets: "4 sets", reps: "10-12 reps", rest: "75 sec" },
        { name: "L-Sit to Tuck Planche Transition", sets: "3 sets", reps: "6 reps", rest: "60 sec" },
        { name: "Hollow-Body Rockers into 20s Hold", sets: "3 sets", reps: "45 sec", rest: "45 sec" }
      ]
    }
  },
  // 6. Cooking World #2
  {
    _id: "cook-2",
    world: "Cooking",
    author: {
      _id: "user-marco",
      username: "Marco_Rossi",
      photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&h=300&q=80",
      bio: "Roman culinary traditions. Pasta lover & olive grove custodian.",
      verified: false
    },
    content: "No cream. No garlic. No onions. Authentic Spaghetti alla Carbonara uses just four ingredients: Guanciale, Pecorino Romano, farm eggs, and coarse black pepper. Emulsify with starchy pasta water off the flame.",
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=1200&q=80",
    createdAt: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    likes: ["user-elena", "user-marco"],
    comments: [],
    cooking: {
      prepTime: "10 mins",
      cookTime: "15 mins",
      difficulty: "Easy",
      servings: "2 hearty plates",
      ingredients: [
        "220g Bronze-die extruded Spaghetti",
        "140g Guanciale (cured pork jowl), sliced into 1/2cm batons",
        "3 Large organic egg yolks + 1 whole egg",
        "60g Pecorino Romano DOP, finely grated",
        "Whole black peppercorns, coarsely crushed"
      ],
      instructions: [
        "Render guanciale batons gently over medium heat until crispy outside and tender within; turn off flame.",
        "Whisk yolks, whole egg, grated Pecorino, and heavy black pepper into a silky thick cream.",
        "Boil spaghetti in lightly salted water until very al dente (2 mins shy of package directions).",
        "Transfer pasta directly into the pan with warm rendered guanciale fat; toss to coat.",
        "Take pan completely off the heat, wait 20 seconds, then pour egg mixture while vigorously swirling pasta.",
        "Add splashes of starchy pasta water to emulsify into a glossy sauce. Serve with extra Pecorino."
      ]
    }
  }
];

export const WORLD_DEFINITIONS = [
  {
    id: "All",
    label: "All Worlds",
    tagline: "The collective stream across all specialized domains",
    color: "#506ffc",
    badgeBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
  },
  {
    id: "Cooking",
    label: "Cooking World",
    tagline: "Recipes, kitchen science, food photography & culinary craft",
    color: "#f97316",
    badgeBg: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20"
  },
  {
    id: "Art",
    label: "Art World",
    tagline: "Visual arts, gallery exhibitions, mediums & creative processes",
    color: "#a855f7",
    badgeBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
  },
  {
    id: "Technology",
    label: "Technology World",
    tagline: "Engineering architectures, open source repositories, code & tutorials",
    color: "#06b6d4",
    badgeBg: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20"
  },
  {
    id: "Music",
    label: "Music World",
    tagline: "Audio previews, production breakdowns, synthesizer jams & performances",
    color: "#ec4899",
    badgeBg: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20"
  },
  {
    id: "Fitness",
    label: "Fitness World",
    tagline: "Workout breakdowns, training logs, calisthenics & nutrition",
    color: "#10b981",
    badgeBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
  }
] as const;

