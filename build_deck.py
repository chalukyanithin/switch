import os
import shutil
import zipfile
import html

TEMPLATE_PPTX = r'C:\Users\LENOVO\.gemini\antigravity\brain\7b2a6bcd-4845-4149-8781-e9769747bb81\.user_uploaded\media_1794498954163_c7cd2aea.pptx'
WORK_DIR = r'd:\switch-frontend\ppt_build'
OUTPUT_PPTX = r'd:\switch-frontend\OpenMP_Parallel_Programming_Chapter7.10.pptx'

if os.path.exists(WORK_DIR):
    shutil.rmtree(WORK_DIR)
os.makedirs(WORK_DIR, exist_ok=True)

with zipfile.ZipFile(TEMPLATE_PPTX, 'r') as z:
    z.extractall(WORK_DIR)

# Define all slides
slides_data = [
    # Slide 1 is BLANK per user prompt! Handled specially.
    {
        "is_blank": True
    },
    # Slide 2: Presentation Overview / Agenda
    {
        "category": "CHAPTER 7.10: OPENMP PARALLEL PROGRAMMING",
        "title": "Presentation Overview & Agenda",
        "items": [
            ("bullet", "Core Focus Areas:", "Exhaustive exploration of directive-based parallel computing in OpenMP from Section 7.10 of the textbook."),
            ("subbullet", "1. OpenMP Programming Model (7.10.1):", "Shared address space, thread teams, fork-join model, structured blocks, and parallel pragmas."),
            ("subbullet", "2. Work-Sharing Constructs (7.10.2):", "Partitioning computation using for and sections directives, scheduling strategies, and loop restrictions."),
            ("subbullet", "3. Synchronization Constructs (7.10.3):", "Thread coordination with barrier, single, master, critical, atomic, ordered, and flush directives."),
            ("subbullet", "4. OpenMP Runtime Library Routines (7.10.5):", "Runtime functions for concurrency query, dynamic/nested thread control, and explicit lock primitives."),
            ("subbullet", "5. Environment Variables & Synthesis (7.10.6 - 7.10.7):", "Global execution controls (OMP_*) and comparison between OpenMP directives and native POSIX threads."),
        ]
    },
    # Slide 3: 7.10.1 Programming Model Context
    {
        "category": "SECTION 7.10.1: THE OPENMP PROGRAMMING MODEL",
        "title": "OpenMP Execution Model & Directive Foundations",
        "items": [
            ("bullet", "Directive-Based Parallelism:", "OpenMP provides standardized compiler pragmas (#pragma omp ...) layered over native shared-memory threads."),
            ("bullet", "Fork-Join Threading Paradigm:", "Program begins execution as a single master thread; upon encountering a parallel construct, the master thread forks a team of concurrent worker threads."),
            ("bullet", "Basic Parallel Directive Syntax:", "Spawns a team of threads to execute the enclosed structured block concurrently:"),
            ("code", "#pragma omp parallel [clause list]\n    /* structured block executed by all team threads */"),
            ("bullet", "Incremental Parallelization:", "Serial programs can be parallelized progressively by inserting pragmas; compilers ignoring OpenMP process the code as standard serial programs."),
            ("bullet", "Data Scoping Mechanisms:", "Clauses specify thread data environments: private (uninitialized local copy), shared (common memory), and reduction (local accumulation combined globally)."),
        ]
    },
    # Slide 4: 7.10.2 Work-Sharing Constructs: for Directive
    {
        "category": "SECTION 7.10.2: SPECIFYING CONCURRENT TASKS",
        "title": "Work-Sharing Constructs: The for Directive",
        "items": [
            ("bullet", "Concept of Work-Sharing:", "Farms out iterations or independent tasks among already existing threads of a team rather than spawning new threads."),
            ("bullet", "Syntax of the for Directive:", "Used to partition a parallel loop iteration space across team threads:"),
            ("code", "#pragma omp for [clause list]\n    for (i = 0; i < n; i++) { /* loop body */ }"),
            ("bullet", "Automatic Loop Index Privacy:", "The loop control variable (e.g., i) is implicitly private to each thread to prevent data races across iterations."),
            ("bullet", "Supported Clause List:", "private, firstprivate, lastprivate, reduction, schedule, nowait, and ordered."),
            ("subbullet", "lastprivate clause:", "Copies the variable value from the sequentially last iteration back to the enclosing scope variable upon loop exit."),
            ("bullet", "Serial Fallback:", "If a for directive appears outside an enclosing parallel region, it executes serially on the master thread alone."),
        ]
    },
    # Slide 5: 7.10.2 Loop Scheduling: static and dynamic
    {
        "category": "SECTION 7.10.2: SPECIFYING CONCURRENT TASKS",
        "title": "Loop Scheduling Strategies: static & dynamic",
        "items": [
            ("bullet", "General Schedule Syntax:", "schedule(scheduling_class[, chunk-size]) dictates how iterations are assigned to team threads."),
            ("bullet", "Static Scheduling — schedule(static[, chunk-size]):", "Pre-computes iteration distribution at loop entry; deterministic and minimal runtime overhead."),
            ("subbullet", "Default (No chunk specified):", "Iteration space n is split into p equal contiguous blocks of size n/p, assigned one per thread."),
            ("subbullet", "Specified chunk-size:", "Divides iterations into blocks of chunk-size and assigns them in round-robin sequence to threads."),
            ("bullet", "Dynamic Scheduling — schedule(dynamic[, chunk-size]):", "Allocates iterations dynamically at runtime to address temporal workload variations."),
            ("subbullet", "Task Pool Allocation:", "Iteration space is partitioned into chunks; idle threads dynamically request the next available chunk."),
            ("subbullet", "Mitigating Workload Imbalance:", "Ideal for heterogeneous hardware, non-uniform iterations, or varying system loads (default chunk size = 1)."),
        ]
    },
    # Slide 6: 7.10.2 Loop Scheduling: guided and runtime
    {
        "category": "SECTION 7.10.2: SPECIFYING CONCURRENT TASKS",
        "title": "Loop Scheduling Strategies: guided & runtime",
        "items": [
            ("bullet", "Guided Scheduling — schedule(guided[, chunk-size]):", "Dynamic scheduling with exponentially decreasing chunk sizes to resolve the 'edge effect'."),
            ("subbullet", "The Edge Effect Problem:", "Fixed large chunks can leave trailing processors idle near loop completion while other threads finish their last chunk."),
            ("subbullet", "Exponential Reduction:", "Chunk size is proportional to unassigned iterations divided by thread count; decreases smoothly toward chunk-size."),
            ("subbullet", "Chunk-Size Semantics:", "chunk-size specifies the minimum block dispatched; remaining iterations < chunk-size are dispatched as one final chunk (default = 1)."),
            ("bullet", "Runtime Scheduling — schedule(runtime):", "Defers the scheduling decision entirely to execution time."),
            ("subbullet", "OMP_SCHEDULE Environment Variable:", "Dictates both scheduling class and chunk size at launch without recompiling (e.g. setenv OMP_SCHEDULE \"static,4\")."),
            ("bullet", "Default Behavior:", "When no schedule clause is provided, the scheduling technique is implementation-dependent."),
        ]
    },
    # Slide 7: 7.10.2 Loop Restrictions & nowait Clause
    {
        "category": "SECTION 7.10.2: SPECIFYING CONCURRENT TASKS",
        "title": "Loop Restrictions & The nowait Clause",
        "items": [
            ("bullet", "Structural Restrictions on Parallel for Loops:", "OpenMP requires canonical loop forms so iteration count can be pre-computed before loop execution begins:"),
            ("subbullet", "Loop Index:", "Control variable must be a signed integer; initialization must be an assignment (i = expr)."),
            ("subbullet", "Relational Test:", "Loop condition expression must be strictly one of: <, <=, >, or >=."),
            ("subbullet", "Increment Expression:", "Must involve integer addition or subtraction only (e.g., i++, ++i, i--, --i, i += inc, i -= inc)."),
            ("subbullet", "No Early Exits:", "Break statements or goto jumps out of the loop body are strictly forbidden."),
            ("bullet", "Eliminating Synchronization: The nowait Clause:", "Normally, an implicit barrier occurs at the end of a for directive."),
            ("subbullet", "Syntax & Role:", "Adding nowait tells threads to proceed directly to the next statement without waiting for peer threads."),
            ("code", "#pragma omp for nowait\n    for (i = 0; i < nmax; i++) { if (match(i)) process(i); }"),
        ]
    },
    # Slide 8: 7.10.2 Non-Iterative Work-Sharing: sections Directive
    {
        "category": "SECTION 7.10.2: SPECIFYING CONCURRENT TASKS",
        "title": "Non-Iterative Work-Sharing: The sections Directive",
        "items": [
            ("bullet", "Functional Task Parallelism:", "While for partitions identical loop iterations, sections assigns independent, distinct tasks (e.g. taskA, taskB, taskC) to threads."),
            ("bullet", "Syntax of sections and section:", "Encloses multiple structured section blocks inside a parent sections construct:"),
            ("code", "#pragma omp sections [clause list]\n{\n    #pragma omp section\n        taskA();\n    #pragma omp section\n        taskB();\n}"),
            ("bullet", "Task Assignment Semantics:", "Each section is farmed to an available thread in the team; multiple sections may be executed sequentially by a single thread if thread count < section count."),
            ("bullet", "Supported Clauses:", "private, firstprivate, lastprivate (lexically last section updates the variable), reduction, and nowait."),
            ("bullet", "Branching Constraints:", "It is illegal to branch into or jump out of any section block."),
        ]
    },
    # Slide 9: 7.10.2 Merged Directives & Nested Parallelism
    {
        "category": "SECTION 7.10.2: SPECIFYING CONCURRENT TASKS",
        "title": "Merged Directives & Nested Parallel Regions",
        "items": [
            ("bullet", "Merged Shorthand Directives:", "Eliminates syntactic overhead by merging team creation and task farming into a single compound directive."),
            ("subbullet", "#pragma omp parallel for:", "Spawns a team of threads and immediately partitions the loop iterations among them:"),
            ("code", "#pragma omp parallel for default(private) shared(a, b, c, dim)\n    for (i = 0; i < dim; i++) { /* body */ }"),
            ("subbullet", "#pragma omp parallel sections:", "Spawns a team of threads and immediately executes independent section blocks concurrently."),
            ("subbullet", "Merged Clause List:", "Accepts valid clauses from both parallel and for/sections directives."),
            ("bullet", "Nesting Parallel Constructs:", "OpenMP allows parallel directives to be nested hierarchically inside other parallel regions (e.g., nested multi-dimensional loops)."),
            ("subbullet", "Serialization when Disabled:", "If nested parallelism is disabled, encountering an inner parallel construct results in serial execution by a single thread."),
        ]
    },
    # Slide 10: 7.10.3 Synchronization: barrier Directive
    {
        "category": "SECTION 7.10.3: SYNCHRONIZATION CONSTRUCTS",
        "title": "Synchronization Points: The barrier Directive",
        "items": [
            ("bullet", "Need for Synchronization in Shared Memory:", "Required to enforce execution ordering, preserve operation atomicity, and protect shared data structures."),
            ("bullet", "The barrier Directive Syntax:", "Explicit barrier synchronization primitive across team threads:"),
            ("code", "#pragma omp barrier"),
            ("bullet", "Operational Semantics:", "Each thread halts at the barrier and waits until all other threads in the team reach the barrier; all are then released concurrently."),
            ("bullet", "Team Binding Rules:", "When nested parallel regions exist, a barrier binds to the closest enclosing parallel directive."),
            ("bullet", "Conditional Execution Restriction:", "Pragmas are compiler directives, not native language statements; conditional barriers must be enclosed in compound braces: if (condition) { #pragma omp barrier }."),
            ("bullet", "Efficiency Over Region Restarts:", "Eliminates the heavy overhead of repeatedly terminating and re-forking parallel regions."),
        ]
    },
    # Slide 11: 7.10.3 Single-Thread Execution: single vs master
    {
        "category": "SECTION 7.10.3: SYNCHRONIZATION CONSTRUCTS",
        "title": "Single-Thread Execution: single vs. master",
        "items": [
            ("bullet", "Requirement for Single-Thread Work:", "Certain steps in a parallel region must run only once (e.g., file I/O, memory allocations, computing mean from global sum)."),
            ("bullet", "The single Directive — #pragma omp single [clause list]:", "Specifies a block executed by any one arbitrary available thread."),
            ("subbullet", "Execution Flow:", "The first thread to arrive executes the block; peer threads skip the block and wait at an implicit exit barrier."),
            ("subbullet", "Clauses:", "Supports private, firstprivate, and nowait (nowait removes the exit barrier)."),
            ("bullet", "The master Directive — #pragma omp master:", "A specialization where only the master thread (thread ID 0) executes the structured block."),
            ("subbullet", "CRITICAL DISTINCTION:", "The master directive has NO implicit barrier at its exit. Peer threads do not wait; they bypass the block and continue execution immediately!"),
            ("code", "#pragma omp master\n    display_intermediate_results(); /* other threads continue past! */"),
        ]
    },
    # Slide 12: 7.10.3 Critical Sections: critical Directive
    {
        "category": "SECTION 7.10.3: SYNCHRONIZATION CONSTRUCTS",
        "title": "Mutual Exclusion: The critical Directive",
        "items": [
            ("bullet", "Protecting Critical Regions:", "Guarantees serial execution of code blocks that access shared resources (e.g., shared queues, heaps)."),
            ("bullet", "Syntax of critical Directive:", "Enforces mutual exclusion with an optional identifier:"),
            ("code", "#pragma omp critical [(name)]\n    /* structured block */"),
            ("bullet", "Named Critical Sections:", "name specifies an identifier with global scope across the entire program."),
            ("subbullet", "Independent Serialization:", "Two critical blocks with different names (e.g. queue_A and queue_B) can execute simultaneously on different threads."),
            ("subbullet", "Matching Names:", "Threads attempting to enter a critical block with the same name are blocked until the current thread exits."),
            ("bullet", "Unnamed Critical Sections:", "All unnamed critical sections share a single default global name; entering any unnamed block blocks entry into all unnamed blocks."),
            ("bullet", "Performance Guideline:", "Critical sections serialize execution; keep code inside critical sections as small as possible to preserve parallel speedup."),
        ]
    },
    # Slide 13: 7.10.3 Atomic Operations: atomic Directive
    {
        "category": "SECTION 7.10.3: SYNCHRONIZATION CONSTRUCTS",
        "title": "Hardware Atomic Updates: The atomic Directive",
        "items": [
            ("bullet", "Purpose of atomic:", "Provides highly optimized atomic updates to scalar memory locations using underlying CPU hardware atomic instructions."),
            ("bullet", "Permitted Update Statement Forms:", "Followed immediately by a single scalar update statement:"),
            ("code", "#pragma omp atomic\n    x binary_operation = expr; /* or: x++, ++x, x--, --x */"),
            ("subbullet", "Supported Binary Operators:", "+, *, -, /, &, ^, |, <<, >>"),
            ("bullet", "Exact Atomicity Semantics:", "OpenMP guarantees that ONLY the load and store of variable x are atomic; evaluation of expr is NOT atomic!"),
            ("subbullet", "Target Restriction:", "expr must be a scalar expression and cannot contain the updated variable x itself."),
            ("bullet", "Advantage Over critical Directives:", "Replaces heavy software mutex lock/unlock routines with fast single-instruction hardware atomics (e.g., fetch-and-add)."),
        ]
    },
    # Slide 14: 7.10.3 In-Order Execution: ordered Directive
    {
        "category": "SECTION 7.10.3: SYNCHRONIZATION CONSTRUCTS",
        "title": "In-Order Loop Execution: The ordered Directive",
        "items": [
            ("bullet", "Enforcing Serial Iteration Order:", "Executes a section of a parallel loop in the exact sequential order dictated by loop index sequence."),
            ("bullet", "Textbook Example — Cumulative Sum Calculation:", "cumul_sum[i] = cumul_sum[i-1] + list[i] requires iteration i-1 to complete before iteration i begins:"),
            ("code", "#pragma omp parallel for private(i) shared(cumul_sum, list, n) ordered\nfor (i = 1; i < n; i++) {\n    /* concurrent pre-processing of list[i] */\n    #pragma omp ordered\n        cumul_sum[i] = cumul_sum[i-1] + list[i];\n}"),
            ("bullet", "Prerequisites & Constraints:", "Must reside within a for/parallel for directive that explicitly includes the ordered clause; at most ONE ordered block per loop."),
            ("bullet", "Ordered Serialization Bottleneck:", "A thread cannot enter until all preceding iterations have finished; parallel speedup is only gained if substantial work exists outside the ordered block."),
        ]
    },
    # Slide 15: 7.10.3 Memory Consistency: flush Directive
    {
        "category": "SECTION 7.10.3: SYNCHRONIZATION CONSTRUCTS",
        "title": "Memory Consistency: The flush Directive",
        "items": [
            ("bullet", "Memory Consistency in Shared Address Spaces:", "Compilers frequently optimize variables into CPU registers; register-allocated values can become out-of-sync with main memory."),
            ("bullet", "Memory Fence Semantics:", "The flush directive creates a memory fence forcing variables to be synchronized between CPU registers and shared memory."),
            ("subbullet", "Writes:", "All write operations to shared variables before the fence must be committed to main memory."),
            ("subbullet", "Reads:", "All subsequent accesses to shared variables after the fence must be re-read directly from memory."),
            ("code", "#pragma omp flush [(variable_list)] /* applies strictly to shared variables */"),
            ("bullet", "Implicit Flush Rules:", "Implied at: barrier, entry/exit of critical, ordered, parallel, parallel for/sections, and exit of for, sections, single."),
            ("bullet", "Exceptions (NO Implicit Flush):", "No flush with nowait clause, NO flush at entry of for/sections/single, and NO flush at entry or exit of master!"),
        ]
    },
    # Slide 16: 7.10.5 Runtime Library: Concurrency & Thread Queries
    {
        "category": "SECTION 7.10.5: OPENMP LIBRARY FUNCTIONS",
        "title": "Runtime Library: Concurrency & Thread Control",
        "items": [
            ("bullet", "Standard OpenMP Header:", "All runtime routines require including the OpenMP API header: #include <omp.h>"),
            ("bullet", "Execution Control & Concurrency Routines:", "Provides dynamic programmatic control over thread count and processor resources:"),
            ("code", "void omp_set_num_threads (int num_threads);\nint  omp_get_num_threads ();\nint  omp_get_max_threads ();\nint  omp_get_thread_num ();\nint  omp_get_num_procs ();\nint  omp_in_parallel ();"),
            ("subbullet", "omp_set_num_threads(n):", "Sets default thread team size for upcoming parallel region; must be called outside parallel regions with dynamic threads enabled."),
            ("subbullet", "omp_get_num_threads():", "Returns number of threads currently participating in the team (binds to closest parallel region; returns 1 if outside)."),
            ("subbullet", "omp_get_thread_num():", "Returns thread ID within the team (integer from 0 for master up to num_threads - 1)."),
            ("subbullet", "omp_get_num_procs() & omp_in_parallel():", "Returns available physical processor count and whether calling thread is inside an active parallel construct."),
        ]
    },
    # Slide 17: 7.10.5 Runtime Library: Dynamic & Nested Creation
    {
        "category": "SECTION 7.10.5: OPENMP LIBRARY FUNCTIONS",
        "title": "Runtime Library: Dynamic & Nested Thread Creation",
        "items": [
            ("bullet", "Controlling & Monitoring Thread Creation:", "OpenMP functions to configure dynamic thread pool adjustments and hierarchical nesting:"),
            ("code", "void omp_set_dynamic (int dynamic_threads);\nint  omp_get_dynamic ();\nvoid omp_set_nested (int nested);\nint  omp_get_nested ();"),
            ("bullet", "Dynamic Adjustment (omp_set_dynamic):", "Non-zero enables runtime dynamic adjustment of thread team sizes according to system load; zero disables dynamic adjustment."),
            ("subbullet", "Querying State:", "omp_get_dynamic() returns non-zero if dynamic adjustment is enabled, and zero otherwise."),
            ("bullet", "Nested Parallelism (omp_set_nested):", "Non-zero enables nested parallel regions (allowing teams to spawn sub-teams); zero disables nested thread creation."),
            ("subbullet", "Serialization Semantics:", "When nested parallelism is disabled, any inner parallel regions encountered execute serially with a single thread."),
            ("subbullet", "Querying Nested State:", "omp_get_nested() returns non-zero if enabled, and zero otherwise."),
        ]
    },
    # Slide 18: 7.10.5 Runtime Library: Explicit Lock Management
    {
        "category": "SECTION 7.10.5: OPENMP LIBRARY FUNCTIONS",
        "title": "Runtime Library: Explicit Lock Management",
        "items": [
            ("bullet", "Explicit Mutex Primitives:", "For scenarios where directive-based critical sections are insufficient, OpenMP provides explicit low-level lock routines."),
            ("bullet", "Simple Locks — Data Type: omp_lock_t:", "Standard mutually exclusive lock primitives:"),
            ("code", "void omp_init_lock (omp_lock_t *lock);      /* initialize lock */\nvoid omp_destroy_lock (omp_lock_t *lock);   /* discard lock */\nvoid omp_set_lock (omp_lock_t *lock);       /* blocking lock */\nvoid omp_unset_lock (omp_lock_t *lock);     /* unlock */\nint  omp_test_lock (omp_lock_t *lock);      /* non-blocking attempt */"),
            ("bullet", "Nestable Locks — Data Type: omp_nest_lock_t:", "Recursive locks that can be acquired multiple times by the same owning thread:"),
            ("code", "omp_init_nest_lock, omp_destroy_nest_lock, omp_set_nest_lock,\nomp_unset_nest_lock, omp_test_nest_lock"),
            ("bullet", "Strict Usage Invariants:", "Illegal to re-initialize an active lock or destroy an uninitialized lock; attempting to unlock a lock owned by another thread produces UNDEFINED behavior."),
        ]
    },
    # Slide 19: 7.10.6 Environment Variables & 7.10.7 Summary
    {
        "category": "SECTIONS 7.10.6 & 7.10.7: ENVIRONMENT VARIABLES & SYNTHESIS",
        "title": "OpenMP Environment Variables & Architecture Summary",
        "items": [
            ("bullet", "Global Environment Variables (7.10.6):", "Control execution parameters from the host shell without program modifications:"),
            ("subbullet", "OMP_NUM_THREADS:", "Sets default team size upon entering parallel regions (e.g., setenv OMP_NUM_THREADS 8)."),
            ("subbullet", "OMP_DYNAMIC:", "When set to TRUE, allows runtime adjustment of thread count via omp_set_num_threads."),
            ("subbullet", "OMP_NESTED:", "When set to TRUE, enables nested parallel execution regions."),
            ("subbullet", "OMP_SCHEDULE:", "Specifies scheduling class and chunk size for runtime schedules (e.g., setenv OMP_SCHEDULE \"static,4\")."),
            ("bullet", "OpenMP vs. Explicit POSIX Threads (7.10.7):", "OpenMP directives map directly onto native thread abstractions:"),
            ("subbullet", "critical directive:", "Directly implements POSIX pthread_mutex_lock/unlock."),
            ("subbullet", "barrier directive:", "Replaces manual condition variable broadcast logic with a single compiler pragma."),
            ("subbullet", "Higher Abstraction:", "OpenMP drastically reduces boilerplate code, eliminates manual thread management, and simplifies parallel application development."),
        ]
    }
]

print(f"Total slides to generate: {len(slides_data)}")

# XML namespaces
NS = {
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
}

# Template XML for content slides (slide 2..N)
def create_content_slide_xml(category, title, items, slide_num):
    # Build paragraphs
    paragraphs_xml = []
    
    for item in items:
        if len(item) == 2:
            item_type, part1 = item
            part2 = ""
        else:
            item_type, part1, part2 = item
            
        part1_esc = html.escape(part1)
        part2_esc = html.escape(part2)
        
        if item_type == "bullet":
            # Main bullet (Level 0)
            p = f'''<a:p>
              <a:pPr lvl="0" marL="285750" indent="-200000" algn="l">
                <a:lnSpc><a:spcPct val="114000"/></a:lnSpc>
                <a:spcBef><a:spcPts val="500"/></a:spcBef>
                <a:spcAft><a:spcPts val="250"/></a:spcAft>
                <a:buFont typeface="Arial"/>
                <a:buChar char="■"/>
              </a:pPr>
              <a:r>
                <a:rPr b="1" sz="1400">
                  <a:solidFill><a:srgbClr val="0B2F64"/></a:solidFill>
                  <a:latin typeface="Arial"/>
                </a:rPr>
                <a:t>{part1_esc} </a:t>
              </a:r>
              <a:r>
                <a:rPr b="0" sz="1400">
                  <a:solidFill><a:srgbClr val="222222"/></a:solidFill>
                  <a:latin typeface="Arial"/>
                </a:rPr>
                <a:t>{part2_esc}</a:t>
              </a:r>
            </a:p>'''
            paragraphs_xml.append(p)
            
        elif item_type == "subbullet":
            # Sub bullet (Level 1)
            p = f'''<a:p>
              <a:pPr lvl="1" marL="580000" indent="-180000" algn="l">
                <a:lnSpc><a:spcPct val="112000"/></a:lnSpc>
                <a:spcBef><a:spcPts val="200"/></a:spcBef>
                <a:spcAft><a:spcPts val="200"/></a:spcAft>
                <a:buFont typeface="Arial"/>
                <a:buChar char="•"/>
              </a:pPr>
              <a:r>
                <a:rPr b="1" sz="1250">
                  <a:solidFill><a:srgbClr val="1A365D"/></a:solidFill>
                  <a:latin typeface="Arial"/>
                </a:rPr>
                <a:t>{part1_esc} </a:t>
              </a:r>
              <a:r>
                <a:rPr b="0" sz="1250">
                  <a:solidFill><a:srgbClr val="3A3A3A"/></a:solidFill>
                  <a:latin typeface="Arial"/>
                </a:rPr>
                <a:t>{part2_esc}</a:t>
              </a:r>
            </a:p>'''
            paragraphs_xml.append(p)
            
        elif item_type == "code":
            # Code snippet box
            code_text = html.escape(part1)
            # Lines of code
            for line in code_text.split('\n'):
                p = f'''<a:p>
                  <a:pPr lvl="1" marL="600000" indent="0" algn="l">
                    <a:lnSpc><a:spcPct val="108000"/></a:lnSpc>
                    <a:spcBef><a:spcPts val="150"/></a:spcBef>
                    <a:spcAft><a:spcPts val="150"/></a:spcAft>
                    <a:buNone/>
                  </a:pPr>
                  <a:r>
                    <a:rPr b="1" sz="1150">
                      <a:solidFill><a:srgbClr val="7A1C1C"/></a:solidFill>
                      <a:latin typeface="Consolas"/>
                    </a:rPr>
                    <a:t>{line}</a:t>
                  </a:r>
                </a:p>'''
                paragraphs_xml.append(p)

    body_paras_joined = "\n".join(paragraphs_xml)
    cat_esc = html.escape(category)
    title_esc = html.escape(title)

    slide_xml = f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" 
       xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" 
       xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:bg>
      <p:bgPr>
        <a:blipFill>
          <a:blip r:embed="rId3">
            <a:alphaModFix/>
          </a:blip>
          <a:stretch>
            <a:fillRect/>
          </a:stretch>
        </a:blipFill>
      </p:bgPr>
    </p:bg>
    <p:spTree>
      <p:nvGrpSpPr>
        <p:cNvPr id="{100 + slide_num}" name="Shape Group {slide_num}"/>
        <p:cNvGrpSpPr/>
        <p:nvPr/>
      </p:nvGrpSpPr>
      <p:grpSpPr>
        <a:xfrm>
          <a:off x="0" y="0"/>
          <a:ext cx="0" cy="0"/>
          <a:chOff x="0" y="0"/>
          <a:chExt cx="0" cy="0"/>
        </a:xfrm>
      </p:grpSpPr>
      
      <!-- Slide Number Indicator -->
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="{400 + slide_num}" name="SlideNum {slide_num}"/>
          <p:cNvSpPr txBox="1"/>
          <p:nvPr/>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm><a:off x="8200000" y="4750000"/><a:ext cx="600000" cy="250000"/></a:xfrm>
          <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
          <a:noFill/><a:ln><a:noFill/></a:ln>
        </p:spPr>
        <p:txBody>
          <a:bodyPr anchor="b" bIns="0" lIns="0" rIns="0" tIns="0"><a:noAutofit/></a:bodyPr>
          <a:lstStyle/>
          <a:p>
            <a:pPr algn="r"><a:buNone/></a:pPr>
            <a:r>
              <a:rPr sz="900">
                <a:solidFill><a:srgbClr val="888888"/></a:solidFill>
                <a:latin typeface="Arial"/>
              </a:rPr>
              <a:t>{slide_num} / 19</a:t>
            </a:r>
          </a:p>
        </p:txBody>
      </p:sp>

      <!-- Title Shape -->
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="{200 + slide_num}" name="Title {slide_num}"/>
          <p:cNvSpPr txBox="1"/>
          <p:nvPr><p:ph type="title"/></p:nvPr>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm><a:off x="400000" y="240000"/><a:ext cx="8344000" cy="720000"/></a:xfrm>
          <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
          <a:noFill/><a:ln><a:noFill/></a:ln>
        </p:spPr>
        <p:txBody>
          <a:bodyPr anchorCtr="0" anchor="t" bIns="45712" lIns="45712" rIns="45712" tIns="45712" wrap="square"><a:normAutofit fontScale="92000"/></a:bodyPr>
          <a:lstStyle/>
          <a:p>
            <a:pPr algn="l"><a:buNone/><a:spcBef><a:spcPts val="0"/></a:spcBef><a:spcAft><a:spcPts val="100"/></a:spcAft></a:pPr>
            <a:r>
              <a:rPr b="1" sz="950">
                <a:solidFill><a:srgbClr val="4B6584"/></a:solidFill>
                <a:latin typeface="Arial"/>
              </a:rPr>
              <a:t>{cat_esc}</a:t>
            </a:r>
          </a:p>
          <a:p>
            <a:pPr algn="l"><a:buNone/><a:spcBef><a:spcPts val="0"/></a:spcBef><a:spcAft><a:spcPts val="0"/></a:spcAft></a:pPr>
            <a:r>
              <a:rPr b="1" sz="1950">
                <a:solidFill><a:srgbClr val="0B2240"/></a:solidFill>
                <a:latin typeface="Arial"/>
              </a:rPr>
              <a:t>{title_esc}</a:t>
            </a:r>
          </a:p>
        </p:txBody>
      </p:sp>

      <!-- Body Shape -->
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="{300 + slide_num}" name="Body {slide_num}"/>
          <p:cNvSpPr txBox="1"/>
          <p:nvPr><p:ph idx="1" type="body"/></p:nvPr>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm><a:off x="400000" y="1020000"/><a:ext cx="8344000" cy="3700000"/></a:xfrm>
          <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
          <a:noFill/><a:ln><a:noFill/></a:ln>
        </p:spPr>
        <p:txBody>
          <a:bodyPr anchorCtr="0" anchor="t" bIns="45712" lIns="45712" rIns="45712" tIns="45712" wrap="square"><a:normAutofit fontScale="90000"/></a:bodyPr>
          <a:lstStyle/>
{body_paras_joined}
        </p:txBody>
      </p:sp>

    </p:spTree>
  </p:cSld>
  <p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
</p:sld>'''
    return slide_xml

# Write each slide file
slides_dir = os.path.join(WORK_DIR, 'ppt', 'slides')
rels_dir = os.path.join(slides_dir, '_rels')
os.makedirs(slides_dir, exist_ok=True)
os.makedirs(rels_dir, exist_ok=True)

# Slide 1 rels (already exists, but ensure it points to layout1 and image1.png)
slide1_rels = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/image1.png"/>
</Relationships>'''
with open(os.path.join(rels_dir, 'slide1.xml.rels'), 'w', encoding='utf-8') as f:
    f.write(slide1_rels)

# Slide 1 XML (completely blank title slide)
slide1_xml = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" 
       xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" 
       xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:bg>
      <p:bgPr>
        <a:blipFill>
          <a:blip r:embed="rId3"><a:alphaModFix/></a:blip>
          <a:stretch><a:fillRect/></a:stretch>
        </a:blipFill>
      </p:bgPr>
    </p:bg>
    <p:spTree>
      <p:nvGrpSpPr>
        <p:cNvPr id="53" name="Shape 53"/>
        <p:cNvGrpSpPr/>
        <p:nvPr/>
      </p:nvGrpSpPr>
      <p:grpSpPr>
        <a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm>
      </p:grpSpPr>
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
</p:sld>'''
with open(os.path.join(slides_dir, 'slide1.xml'), 'w', encoding='utf-8') as f:
    f.write(slide1_xml)

# Common slide rels for slides 2..19
common_slide_rels = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout3.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/image2.jpg"/>
</Relationships>'''

for idx, data in enumerate(slides_data[1:], start=2):
    s_xml = create_content_slide_xml(data["category"], data["title"], data["items"], idx)
    with open(os.path.join(slides_dir, f'slide{idx}.xml'), 'w', encoding='utf-8') as f:
        f.write(s_xml)
    with open(os.path.join(rels_dir, f'slide{idx}.xml.rels'), 'w', encoding='utf-8') as f:
        f.write(common_slide_rels)

print("Generated slide XML files.")

# Now update ppt/presentation.xml
# <p:sldIdLst><p:sldId id="256" r:id="rId6"/>...</p:sldIdLst>
sld_id_items = []
pres_rels_items = [
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme/theme2.xml"/>',
    '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/viewProps" Target="viewProps.xml"/>',
    '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/presProps" Target="presProps.xml"/>',
    '<Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>',
    '<Relationship Id="rId5" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/notesMaster" Target="notesMasters/notesMaster1.xml"/>',
]

content_type_overrides = []

for idx in range(1, len(slides_data) + 1):
    r_id = f"rId{5 + idx}"
    s_id = 255 + idx
    sld_id_items.append(f'<p:sldId id="{s_id}" r:id="{r_id}"/>')
    pres_rels_items.append(f'<Relationship Id="{r_id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide{idx}.xml"/>')
    content_type_overrides.append(f'<Override ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml" PartName="/ppt/slides/slide{idx}.xml"/>')

# Read current presentation.xml and replace sldIdLst
pres_xml_path = os.path.join(WORK_DIR, 'ppt', 'presentation.xml')
with open(pres_xml_path, 'r', encoding='utf-8') as f:
    pres_xml = f.read()

import re
pres_xml = re.sub(r'<p:sldIdLst>.*?</p:sldIdLst>', f'<p:sldIdLst>{"".join(sld_id_items)}</p:sldIdLst>', pres_xml, flags=re.DOTALL)
with open(pres_xml_path, 'w', encoding='utf-8') as f:
    f.write(pres_xml)

# Write ppt/_rels/presentation.xml.rels
pres_rels_path = os.path.join(WORK_DIR, 'ppt', '_rels', 'presentation.xml.rels')
pres_rels_xml = f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
{"".join(pres_rels_items)}
</Relationships>'''
with open(pres_rels_path, 'w', encoding='utf-8') as f:
    f.write(pres_rels_xml)

# Update [Content_Types].xml
ct_path = os.path.join(WORK_DIR, '[Content_Types].xml')
with open(ct_path, 'r', encoding='utf-8') as f:
    ct_xml = f.read()

# Remove existing slide overrides
ct_xml = re.sub(r'<Override[^>]*PartName="/ppt/slides/slide\d+\.xml"[^>]*/>', '', ct_xml)
# Insert new overrides before </Types>
ct_xml = ct_xml.replace('</Types>', f'{"".join(content_type_overrides)}</Types>')
with open(ct_path, 'w', encoding='utf-8') as f:
    f.write(ct_xml)

# Clean up unwanted slides if any existed
for f in os.listdir(slides_dir):
    if f.startswith('slide') and f.endswith('.xml'):
        num = int(f.replace('slide', '').replace('.xml', ''))
        if num > len(slides_data):
            os.remove(os.path.join(slides_dir, f))
for f in os.listdir(rels_dir):
    if f.startswith('slide') and f.endswith('.xml.rels'):
        num = int(f.replace('slide', '').replace('.xml.rels', ''))
        if num > len(slides_data):
            os.remove(os.path.join(rels_dir, f))

# Repack into OUTPUT_PPTX
if os.path.exists(OUTPUT_PPTX):
    os.remove(OUTPUT_PPTX)

with zipfile.ZipFile(OUTPUT_PPTX, 'w', zipfile.ZIP_DEFLATED) as z_out:
    for root_dir, dirs, files in os.walk(WORK_DIR):
        for file in files:
            full_p = os.path.join(root_dir, file)
            arc_p = os.path.relpath(full_p, WORK_DIR)
            z_out.write(full_p, arc_p)

print(f"Successfully generated: {OUTPUT_PPTX} (Size: {os.path.getsize(OUTPUT_PPTX)} bytes)")

# Also copy to artifacts directory
artifact_dest = r'C:\Users\LENOVO\.gemini\antigravity\brain\7b2a6bcd-4845-4149-8781-e9769747bb81\OpenMP_Parallel_Programming_Chapter7.10.pptx'
shutil.copy2(OUTPUT_PPTX, artifact_dest)
print(f"Copied to artifacts directory: {artifact_dest}")
