import {
  Exam,
  Question,
  QuestionKey,
  JobOpportunity,
  StudyMaterial,
  CodingProblem,
  WorldNewsArticle,
  InterviewExperience,
  StudentAchievement,
} from './dbTypes';

// ==============================================================================
// 20 COMPLETE APTITUDE & PLACEMENT EXAMS
// ==============================================================================

export const PLACEMENT_APTITUDE_EXAMS: Exam[] = [
  // --- QUANTITATIVE APTITUDE ---
  {
    id: 'exam-quant-101',
    title: 'Quantitative Aptitude — Number Systems & Divisibility',
    code: 'QA-NUM-101',
    description: 'Master modular arithmetic, prime factorizations, HCF/LCM properties, remainder theorems, and unit digit calculation patterns.',
    category: 'Quantitative Aptitude',
    department: 'Training & Placements',
    semester: 6,
    duration_minutes: 20,
    total_marks: 15,
    passing_marks: 9,
    retake_policy: 'multiple_attempts',
    max_attempts: 3,
    is_published: true,
    created_at: '2026-10-25T10:00:00Z',
    updated_at: '2026-10-25T10:00:00Z',
  },
  {
    id: 'exam-quant-102',
    title: 'Quantitative Aptitude — Percentages, Profit & Loss',
    code: 'QA-PRFT-102',
    description: 'Practical campus placement math covering cost price, markup margins, successive discounts, and deceptive weighing techniques.',
    category: 'Quantitative Aptitude',
    department: 'Training & Placements',
    semester: 6,
    duration_minutes: 20,
    total_marks: 15,
    passing_marks: 9,
    retake_policy: 'multiple_attempts',
    max_attempts: 3,
    is_published: true,
    created_at: '2026-10-26T10:00:00Z',
    updated_at: '2026-10-26T10:00:00Z',
  },
  {
    id: 'exam-quant-103',
    title: 'Quantitative Aptitude — Time, Speed & Distance',
    code: 'QA-TSD-103',
    description: 'Relative velocity problems, trains passing platforms, circular tracks, and upstream/downstream boat navigation.',
    category: 'Quantitative Aptitude',
    department: 'Training & Placements',
    semester: 6,
    duration_minutes: 25,
    total_marks: 15,
    passing_marks: 9,
    retake_policy: 'multiple_attempts',
    max_attempts: 3,
    is_published: true,
    created_at: '2026-10-27T10:00:00Z',
    updated_at: '2026-10-27T10:00:00Z',
  },
  {
    id: 'exam-quant-104',
    title: 'Quantitative Aptitude — Time & Work, Pipes & Cisterns',
    code: 'QA-WRK-104',
    description: 'Efficiency ratios, alternating work shifts, negative work by leak pipes, and man-day-hour equivalence.',
    category: 'Quantitative Aptitude',
    department: 'Training & Placements',
    semester: 6,
    duration_minutes: 20,
    total_marks: 15,
    passing_marks: 9,
    retake_policy: 'multiple_attempts',
    max_attempts: 3,
    is_published: true,
    created_at: '2026-10-28T10:00:00Z',
    updated_at: '2026-10-28T10:00:00Z',
  },
  {
    id: 'exam-quant-105',
    title: 'Quantitative Aptitude — Permutations, Combinations & Probability',
    code: 'QA-PROB-105',
    description: 'Arrangements with constraints, circular permutations, conditional probability, and expected value distributions.',
    category: 'Quantitative Aptitude',
    department: 'Training & Placements',
    semester: 6,
    duration_minutes: 25,
    total_marks: 15,
    passing_marks: 9,
    retake_policy: 'multiple_attempts',
    max_attempts: 3,
    is_published: true,
    created_at: '2026-10-29T10:00:00Z',
    updated_at: '2026-10-29T10:00:00Z',
  },
  {
    id: 'exam-quant-106',
    title: 'Quantitative Aptitude — Ratios, Proportions & Alligations',
    code: 'QA-RAT-106',
    description: 'Compounded ratios, cross-multiplication, replacement of liquids, and partnership profit sharing.',
    category: 'Quantitative Aptitude',
    department: 'Training & Placements',
    semester: 6,
    duration_minutes: 20,
    total_marks: 15,
    passing_marks: 9,
    retake_policy: 'multiple_attempts',
    max_attempts: 3,
    is_published: true,
    created_at: '2026-10-30T10:00:00Z',
    updated_at: '2026-10-30T10:00:00Z',
  },

  // --- LOGICAL REASONING ---
  {
    id: 'exam-logic-201',
    title: 'Logical Reasoning — Syllogisms & Deductive Logic',
    code: 'LR-SYL-201',
    description: 'Categorical propositions, Venn diagram validations, "Only a few" assertions, and either-or conclusion patterns.',
    category: 'Logical Reasoning',
    department: 'Training & Placements',
    semester: 6,
    duration_minutes: 20,
    total_marks: 15,
    passing_marks: 9,
    retake_policy: 'multiple_attempts',
    max_attempts: 3,
    is_published: true,
    created_at: '2026-10-25T11:00:00Z',
    updated_at: '2026-10-25T11:00:00Z',
  },
  {
    id: 'exam-logic-202',
    title: 'Logical Reasoning — Seating Arrangements & Puzzles',
    code: 'LR-ARR-202',
    description: 'Circular tables with inward/outward orientations, linear dual-row arrangements, and floor puzzle grids.',
    category: 'Logical Reasoning',
    department: 'Training & Placements',
    semester: 6,
    duration_minutes: 25,
    total_marks: 15,
    passing_marks: 9,
    retake_policy: 'multiple_attempts',
    max_attempts: 3,
    is_published: true,
    created_at: '2026-10-26T11:00:00Z',
    updated_at: '2026-10-26T11:00:00Z',
  },
  {
    id: 'exam-logic-203',
    title: 'Logical Reasoning — Blood Relations & Family Trees',
    code: 'LR-BLD-203',
    description: 'Coded relations (A + B implies A is father of B), pointing to photographs, and multi-generational family trees.',
    category: 'Logical Reasoning',
    department: 'Training & Placements',
    semester: 6,
    duration_minutes: 20,
    total_marks: 15,
    passing_marks: 9,
    retake_policy: 'multiple_attempts',
    max_attempts: 3,
    is_published: true,
    created_at: '2026-10-27T11:00:00Z',
    updated_at: '2026-10-27T11:00:00Z',
  },
  {
    id: 'exam-logic-204',
    title: 'Logical Reasoning — Series & Coding-Decoding',
    code: 'LR-SER-204',
    description: 'Alphanumeric shifting, matrix substitution, pattern recognition, and odd-man-out determinations.',
    category: 'Logical Reasoning',
    department: 'Training & Placements',
    semester: 6,
    duration_minutes: 20,
    total_marks: 15,
    passing_marks: 9,
    retake_policy: 'multiple_attempts',
    max_attempts: 3,
    is_published: true,
    created_at: '2026-10-28T11:00:00Z',
    updated_at: '2026-10-28T11:00:00Z',
  },
  {
    id: 'exam-logic-205',
    title: 'Logical Reasoning — Direction Sense & Clocks/Calendars',
    code: 'LR-DIR-205',
    description: 'Vector displacements, shadow angles at sunrise/sunset, clock hand superimpositions, and odd days calculation.',
    category: 'Logical Reasoning',
    department: 'Training & Placements',
    semester: 6,
    duration_minutes: 20,
    total_marks: 15,
    passing_marks: 9,
    retake_policy: 'multiple_attempts',
    max_attempts: 3,
    is_published: true,
    created_at: '2026-10-29T11:00:00Z',
    updated_at: '2026-10-29T11:00:00Z',
  },

  // --- VERBAL ABILITY ---
  {
    id: 'exam-verb-301',
    title: 'Verbal Ability — Reading Comprehension & Inferences',
    code: 'VA-RC-301',
    description: 'Corporate passage analysis, author tone identification, central theme synthesis, and vocabulary in context.',
    category: 'Verbal Ability',
    department: 'Training & Placements',
    semester: 6,
    duration_minutes: 25,
    total_marks: 15,
    passing_marks: 9,
    retake_policy: 'multiple_attempts',
    max_attempts: 3,
    is_published: true,
    created_at: '2026-10-25T12:00:00Z',
    updated_at: '2026-10-25T12:00:00Z',
  },
  {
    id: 'exam-verb-302',
    title: 'Verbal Ability — Sentence Correction & Grammar Rules',
    code: 'VA-SC-302',
    description: 'Subject-verb agreement, modifier placements, parallelism, tense consistency, and pronoun ambiguity.',
    category: 'Verbal Ability',
    department: 'Training & Placements',
    semester: 6,
    duration_minutes: 20,
    total_marks: 15,
    passing_marks: 9,
    retake_policy: 'multiple_attempts',
    max_attempts: 3,
    is_published: true,
    created_at: '2026-10-26T12:00:00Z',
    updated_at: '2026-10-26T12:00:00Z',
  },
  {
    id: 'exam-verb-303',
    title: 'Verbal Ability — Vocabulary, Synonyms & Antonyms',
    code: 'VA-VOC-303',
    description: 'High-frequency GRE/Placement words, contextual analogies, idioms, and homophones.',
    category: 'Verbal Ability',
    department: 'Training & Placements',
    semester: 6,
    duration_minutes: 15,
    total_marks: 15,
    passing_marks: 9,
    retake_policy: 'multiple_attempts',
    max_attempts: 3,
    is_published: true,
    created_at: '2026-10-27T12:00:00Z',
    updated_at: '2026-10-27T12:00:00Z',
  },
  {
    id: 'exam-verb-304',
    title: 'Verbal Ability — Para Jumbles & Coherent Sequencing',
    code: 'VA-PJ-304',
    description: 'Identifying mandatory pairs, introductory statements, transitional connectors, and concluding deductions.',
    category: 'Verbal Ability',
    department: 'Training & Placements',
    semester: 6,
    duration_minutes: 20,
    total_marks: 15,
    passing_marks: 9,
    retake_policy: 'multiple_attempts',
    max_attempts: 3,
    is_published: true,
    created_at: '2026-10-28T12:00:00Z',
    updated_at: '2026-10-28T12:00:00Z',
  },

  // --- TECHNICAL & CORE CS FUNDAMENTALS ---
  {
    id: 'exam-tech-401',
    title: 'Placement Tech — Data Structures (Arrays, Trees & Graphs)',
    code: 'TECH-DS-401',
    description: 'Binary Search Trees, AVL balance, Graph BFS/DFS, Heaps, and Hash collision resolution mechanisms.',
    category: 'Technical & Core CS',
    department: 'Computer Science & Engineering',
    semester: 6,
    duration_minutes: 25,
    total_marks: 15,
    passing_marks: 9,
    retake_policy: 'multiple_attempts',
    max_attempts: 3,
    is_published: true,
    created_at: '2026-10-25T14:00:00Z',
    updated_at: '2026-10-25T14:00:00Z',
  },
  {
    id: 'exam-tech-402',
    title: 'Placement Tech — Algorithms & Asymptotic Complexity',
    code: 'TECH-ALGO-402',
    description: 'Divide & Conquer, Greedy choice property, Dynamic Programming optimal substructure, and Big-O/Theta analysis.',
    category: 'Technical & Core CS',
    department: 'Computer Science & Engineering',
    semester: 6,
    duration_minutes: 25,
    total_marks: 15,
    passing_marks: 9,
    retake_policy: 'multiple_attempts',
    max_attempts: 3,
    is_published: true,
    created_at: '2026-10-26T14:00:00Z',
    updated_at: '2026-10-26T14:00:00Z',
  },
  {
    id: 'exam-tech-403',
    title: 'Placement Tech — DBMS, Relational Algebra & SQL',
    code: 'TECH-DBMS-403',
    description: 'ACID transaction anomalies, 1NF to BCNF normalization, B-Tree indexing, and SQL aggregation clauses.',
    category: 'Technical & Core CS',
    department: 'Computer Science & Engineering',
    semester: 6,
    duration_minutes: 20,
    total_marks: 15,
    passing_marks: 9,
    retake_policy: 'multiple_attempts',
    max_attempts: 3,
    is_published: true,
    created_at: '2026-10-27T14:00:00Z',
    updated_at: '2026-10-27T14:00:00Z',
  },
  {
    id: 'exam-tech-404',
    title: 'Placement Tech — Operating Systems & Concurrency',
    code: 'TECH-OS-404',
    description: 'Process scheduling, Semaphores, Deadlock Banker’s algorithm, Virtual Memory paging, and Thrashing.',
    category: 'Technical & Core CS',
    department: 'Computer Science & Engineering',
    semester: 6,
    duration_minutes: 20,
    total_marks: 15,
    passing_marks: 9,
    retake_policy: 'multiple_attempts',
    max_attempts: 3,
    is_published: true,
    created_at: '2026-10-28T14:00:00Z',
    updated_at: '2026-10-28T14:00:00Z',
  },
  {
    id: 'exam-tech-405',
    title: 'Placement Tech — Computer Networks & Protocols',
    code: 'TECH-CN-405',
    description: 'OSI vs TCP/IP layer functions, Subnetting CIDR, TCP 3-way handshake, DNS resolution, and HTTP status codes.',
    category: 'Technical & Core CS',
    department: 'Computer Science & Engineering',
    semester: 6,
    duration_minutes: 20,
    total_marks: 15,
    passing_marks: 9,
    retake_policy: 'multiple_attempts',
    max_attempts: 3,
    is_published: true,
    created_at: '2026-10-29T14:00:00Z',
    updated_at: '2026-10-29T14:00:00Z',
  },
];

// ==============================================================================
// STRUCTURED QUESTIONS FOR THE 20 EXAMS
// ==============================================================================

export const PLACEMENT_QUESTIONS: Question[] = [
  // --- QA 101 ---
  {
    id: 'q-num-1',
    exam_id: 'exam-quant-101',
    question_text: 'What is the remainder when (7^84) is divided by 342?',
    options: [
      { id: 'A', text: '1' },
      { id: 'B', text: '7' },
      { id: 'C', text: '49' },
      { id: 'D', text: '341' }
    ],
    marks: 3,
    topic: 'Remainder Theorem',
    order_index: 1,
    created_at: '2026-10-25T10:05:00Z'
  },
  {
    id: 'q-num-2',
    exam_id: 'exam-quant-101',
    question_text: 'What is the unit digit of the expression (3^65 * 6^59 * 7^71)?',
    options: [
      { id: 'A', text: '2' },
      { id: 'B', text: '4' },
      { id: 'C', text: '6' },
      { id: 'D', text: '8' }
    ],
    marks: 3,
    topic: 'Unit Digits & Cyclicity',
    order_index: 2,
    created_at: '2026-10-25T10:06:00Z'
  },
  {
    id: 'q-num-3',
    exam_id: 'exam-quant-101',
    question_text: 'Find the highest power of 5 contained in 100! (100 factorial).',
    options: [
      { id: 'A', text: '20' },
      { id: 'B', text: '24' },
      { id: 'C', text: '25' },
      { id: 'D', text: '28' }
    ],
    marks: 3,
    topic: 'Factorials & Prime Powers',
    order_index: 3,
    created_at: '2026-10-25T10:07:00Z'
  },

  // --- QA 102 ---
  {
    id: 'q-prft-1',
    exam_id: 'exam-quant-102',
    question_text: 'A merchant marks goods 40% above cost price and allows a discount of 25% on marked price. What is the net profit percentage?',
    options: [
      { id: 'A', text: '5%' },
      { id: 'B', text: '8%' },
      { id: 'C', text: '10%' },
      { id: 'D', text: '15%' }
    ],
    marks: 3,
    topic: 'Profit & Loss',
    order_index: 1,
    created_at: '2026-10-26T10:05:00Z'
  },
  {
    id: 'q-prft-2',
    exam_id: 'exam-quant-102',
    question_text: 'A dishonest dealer professes to sell his goods at cost price but uses a weight of 920 grams for 1 kilogram. His gain percentage is:',
    options: [
      { id: 'A', text: '8.0%' },
      { id: 'B', text: '8.69%' },
      { id: 'C', text: '9.2%' },
      { id: 'D', text: '10.5%' }
    ],
    marks: 3,
    topic: 'Deceptive Weighing',
    order_index: 2,
    created_at: '2026-10-26T10:06:00Z'
  },

  // --- QA 103 ---
  {
    id: 'q-tsd-1',
    exam_id: 'exam-quant-103',
    question_text: 'A train 180 meters long running at 72 km/h crosses a platform in 24 seconds. What is the length of the platform?',
    options: [
      { id: 'A', text: '240 meters' },
      { id: 'B', text: '300 meters' },
      { id: 'C', text: '320 meters' },
      { id: 'D', text: '360 meters' }
    ],
    marks: 3,
    topic: 'Trains & Relative Speed',
    order_index: 1,
    created_at: '2026-10-27T10:05:00Z'
  },
  {
    id: 'q-tsd-2',
    exam_id: 'exam-quant-103',
    question_text: 'A boat travels 24 km downstream in 2 hours and takes 4 hours to return upstream. Find the speed of the current.',
    options: [
      { id: 'A', text: '2 km/h' },
      { id: 'B', text: '3 km/h' },
      { id: 'C', text: '4 km/h' },
      { id: 'D', text: '6 km/h' }
    ],
    marks: 3,
    topic: 'Boats & Streams',
    order_index: 2,
    created_at: '2026-10-27T10:06:00Z'
  },

  // --- QA 104 ---
  {
    id: 'q-wrk-1',
    exam_id: 'exam-quant-104',
    question_text: 'A can complete a project in 12 days, and B can complete it in 18 days. If they work together on alternate days starting with A, in how many days will the work finish?',
    options: [
      { id: 'A', text: '14 days' },
      { id: 'B', text: '14.33 days' },
      { id: 'C', text: '15 days' },
      { id: 'D', text: '16 days' }
    ],
    marks: 3,
    topic: 'Alternate Work',
    order_index: 1,
    created_at: '2026-10-28T10:05:00Z'
  },
  {
    id: 'q-wrk-2',
    exam_id: 'exam-quant-104',
    question_text: 'Pipe A fills a tank in 6 hours, Pipe B in 8 hours, and Pipe C empties it in 12 hours. If all three are opened simultaneously, when will the tank be full?',
    options: [
      { id: 'A', text: '4.8 hours' },
      { id: 'B', text: '5.2 hours' },
      { id: 'C', text: '6.0 hours' },
      { id: 'D', text: '7.5 hours' }
    ],
    marks: 3,
    topic: 'Pipes & Cisterns',
    order_index: 2,
    created_at: '2026-10-28T10:06:00Z'
  },

  // --- QA 105 ---
  {
    id: 'q-prob-1',
    exam_id: 'exam-quant-105',
    question_text: 'In how many ways can 5 boys and 4 girls sit in a row such that no two girls sit adjacent to each other?',
    options: [
      { id: 'A', text: '14,400' },
      { id: 'B', text: '43,200' },
      { id: 'C', text: '86,400' },
      { id: 'D', text: '120,000' }
    ],
    marks: 3,
    topic: 'Permutations & Gaps',
    order_index: 1,
    created_at: '2026-10-29T10:05:00Z'
  },
  {
    id: 'q-prob-2',
    exam_id: 'exam-quant-105',
    question_text: 'Two fair dice are thrown simultaneously. What is the probability that the sum of the numbers is a multiple of 4?',
    options: [
      { id: 'A', text: '1/6' },
      { id: 'B', text: '1/4' },
      { id: 'C', text: '1/3' },
      { id: 'D', text: '5/18' }
    ],
    marks: 3,
    topic: 'Probability',
    order_index: 2,
    created_at: '2026-10-29T10:06:00Z'
  },

  // --- QA 106 ---
  {
    id: 'q-rat-1',
    exam_id: 'exam-quant-106',
    question_text: 'In what ratio must tea worth ₹60/kg be mixed with tea worth ₹65/kg so that selling the mixture at ₹68.20/kg yields a 10% profit?',
    options: [
      { id: 'A', text: '3 : 2' },
      { id: 'B', text: '2 : 3' },
      { id: 'C', text: '4 : 3' },
      { id: 'D', text: '5 : 4' }
    ],
    marks: 3,
    topic: 'Alligations & Mixtures',
    order_index: 1,
    created_at: '2026-10-30T10:05:00Z'
  },

  // --- LR 201 ---
  {
    id: 'q-syl-1',
    exam_id: 'exam-logic-201',
    question_text: 'Statements: All laptops are devices. Some devices are phones. No phone is a tablet.\nConclusions:\nI. Some laptops are phones.\nII. No tablet is a device.',
    options: [
      { id: 'A', text: 'Only conclusion I follows' },
      { id: 'B', text: 'Only conclusion II follows' },
      { id: 'C', text: 'Neither conclusion I nor II follows' },
      { id: 'D', text: 'Both conclusions follow' }
    ],
    marks: 3,
    topic: 'Syllogisms',
    order_index: 1,
    created_at: '2026-10-25T11:05:00Z'
  },

  // --- LR 202 ---
  {
    id: 'q-arr-1',
    exam_id: 'exam-logic-202',
    question_text: 'Eight friends (A through H) sit in a circle facing the center. A is second to the left of D, who is third to the left of F. C is second to the right of B. Who is sitting directly opposite to A?',
    options: [
      { id: 'A', text: 'E' },
      { id: 'B', text: 'F' },
      { id: 'C', text: 'G' },
      { id: 'D', text: 'H' }
    ],
    marks: 3,
    topic: 'Circular Seating Arrangement',
    order_index: 1,
    created_at: '2026-10-26T11:05:00Z'
  },

  // --- LR 203 ---
  {
    id: 'q-bld-1',
    exam_id: 'exam-logic-203',
    question_text: 'Pointing to a gentleman, Deepak said, "His only brother is the father of my daughter’s father." How is the gentleman related to Deepak?',
    options: [
      { id: 'A', text: 'Father' },
      { id: 'B', text: 'Uncle (Father’s brother)' },
      { id: 'C', text: 'Grandfather' },
      { id: 'D', text: 'Brother' }
    ],
    marks: 3,
    topic: 'Blood Relations',
    order_index: 1,
    created_at: '2026-10-27T11:05:00Z'
  },

  // --- LR 204 ---
  {
    id: 'q-ser-1',
    exam_id: 'exam-logic-204',
    question_text: 'Find the next term in the series: 3, 7, 15, 31, 63, ?',
    options: [
      { id: 'A', text: '95' },
      { id: 'B', text: '112' },
      { id: 'C', text: '127' },
      { id: 'D', text: '129' }
    ],
    marks: 3,
    topic: 'Number Series',
    order_index: 1,
    created_at: '2026-10-28T11:05:00Z'
  },

  // --- LR 205 ---
  {
    id: 'q-dir-1',
    exam_id: 'exam-logic-205',
    question_text: 'Rahul walks 12 km North, turns right and walks 5 km. Then he turns right again and walks 12 km. How far and in which direction is he from his initial starting point?',
    options: [
      { id: 'A', text: '5 km East' },
      { id: 'B', text: '5 km West' },
      { id: 'C', text: '13 km North-East' },
      { id: 'D', text: '7 km North' }
    ],
    marks: 3,
    topic: 'Direction Sense',
    order_index: 1,
    created_at: '2026-10-29T11:05:00Z'
  },

  // --- VA 301 ---
  {
    id: 'q-rc-1',
    exam_id: 'exam-verb-301',
    question_text: '"The ubiquitous nature of automated recommendation engines has catalyzed convenience while subtly homogenizing human serendipity." What is the author’s primary critique?',
    options: [
      { id: 'A', text: 'Recommendation engines are computationally inefficient.' },
      { id: 'B', text: 'Algorithms enhance surprise discoveries.' },
      { id: 'C', text: 'Excessive automation narrows organic discovery and diverse exploration.' },
      { id: 'D', text: 'Automated engines cause economic losses.' }
    ],
    marks: 3,
    topic: 'Reading Comprehension',
    order_index: 1,
    created_at: '2026-10-25T12:05:00Z'
  },

  // --- VA 302 ---
  {
    id: 'q-sc-1',
    exam_id: 'exam-verb-302',
    question_text: 'Identify the sentence with the correct grammatical structure:',
    options: [
      { id: 'A', text: 'Neither of the candidates have submitted their resume.' },
      { id: 'B', text: 'Neither of the candidates has submitted his or her resume.' },
      { id: 'C', text: 'Neither candidates has submitted their resume.' },
      { id: 'D', text: 'Neither of candidates have submitted resumes.' }
    ],
    marks: 3,
    topic: 'Subject-Verb Agreement',
    order_index: 1,
    created_at: '2026-10-26T12:05:00Z'
  },

  // --- VA 303 ---
  {
    id: 'q-voc-1',
    exam_id: 'exam-verb-303',
    question_text: 'Choose the closest synonym for the word "EPHEMERAL":',
    options: [
      { id: 'A', text: 'Perpetual' },
      { id: 'B', text: 'Transient' },
      { id: 'C', text: 'Resilient' },
      { id: 'D', text: 'Opaque' }
    ],
    marks: 3,
    topic: 'Synonyms',
    order_index: 1,
    created_at: '2026-10-27T12:05:00Z'
  },

  // --- VA 304 ---
  {
    id: 'q-pj-1',
    exam_id: 'exam-verb-304',
    question_text: 'Rearrange the sentences into a coherent paragraph:\nP. Consequently, carbon emissions from fossil fuel power generation spiked.\nQ. During the late nineteenth century, industrialization accelerated globally.\nR. This prompted rapid shifts in urban demographics and factory scaling.\nS. Factories required round-the-clock electrical grids.',
    options: [
      { id: 'A', text: 'Q - R - S - P' },
      { id: 'B', text: 'Q - S - P - R' },
      { id: 'C', text: 'R - Q - S - P' },
      { id: 'D', text: 'S - P - Q - R' }
    ],
    marks: 3,
    topic: 'Para Jumbles',
    order_index: 1,
    created_at: '2026-10-28T12:05:00Z'
  },

  // --- TECH 401 ---
  {
    id: 'q-ds-1',
    exam_id: 'exam-tech-401',
    question_text: 'In an AVL tree with n nodes, what is the tightest upper bound on the time complexity of searching for an element in the worst case?',
    options: [
      { id: 'A', text: 'O(1)' },
      { id: 'B', text: 'O(log n)' },
      { id: 'C', text: 'O(n)' },
      { id: 'D', text: 'O(n log n)' }
    ],
    marks: 3,
    topic: 'Balanced Trees',
    order_index: 1,
    created_at: '2026-10-25T14:05:00Z'
  },

  // --- TECH 402 ---
  {
    id: 'q-algo-1',
    exam_id: 'exam-tech-402',
    question_text: 'Which algorithm finds strongly connected components (SCCs) in a directed graph using two depth-first search passes in O(V + E) time?',
    options: [
      { id: 'A', text: 'Dijkstra’s Algorithm' },
      { id: 'B', text: 'Kosaraju’s Algorithm' },
      { id: 'C', text: 'Kruskal’s Algorithm' },
      { id: 'D', text: 'Floyd-Warshall Algorithm' }
    ],
    marks: 3,
    topic: 'Graph Algorithms',
    order_index: 1,
    created_at: '2026-10-26T14:05:00Z'
  },

  // --- TECH 403 ---
  {
    id: 'q-db-1',
    exam_id: 'exam-tech-403',
    question_text: 'Which of the following guarantees that concurrent transactions do not interfere with one another and produce equivalent serial execution results?',
    options: [
      { id: 'A', text: 'Atomicity' },
      { id: 'B', text: 'Durability' },
      { id: 'C', text: 'Isolation' },
      { id: 'D', text: 'Consistency' }
    ],
    marks: 3,
    topic: 'ACID Properties',
    order_index: 1,
    created_at: '2026-10-27T14:05:00Z'
  },

  // --- TECH 404 ---
  {
    id: 'q-os-1',
    exam_id: 'exam-tech-404',
    question_text: 'What condition occurs when an operating system spends more time swapping pages into and out of memory than executing actual CPU instructions?',
    options: [
      { id: 'A', text: 'Deadlock' },
      { id: 'B', text: 'Thrashing' },
      { id: 'C', text: 'Belady’s Anomaly' },
      { id: 'D', text: 'Starvation' }
    ],
    marks: 3,
    topic: 'Virtual Memory Paging',
    order_index: 1,
    created_at: '2026-10-28T14:05:00Z'
  },

  // --- TECH 405 ---
  {
    id: 'q-cn-1',
    exam_id: 'exam-tech-405',
    question_text: 'Which transport layer protocol mechanism prevents a fast sender from overwhelming a slow receiver with data packets?',
    options: [
      { id: 'A', text: 'Flow Control (Sliding Window)' },
      { id: 'B', text: 'Congestion Window Exponential Backoff' },
      { id: 'C', text: 'Checksum Validation' },
      { id: 'D', text: 'Path MTU Discovery' }
    ],
    marks: 3,
    topic: 'Transport Layer Protocols',
    order_index: 1,
    created_at: '2026-10-29T14:05:00Z'
  }
];

// ==============================================================================
// PRIVATE ANSWER KEYS (STRICTLY ISOLATED FROM STUDENTS)
// ==============================================================================

export const PLACEMENT_QUESTION_KEYS: QuestionKey[] = [
  {
    question_id: 'q-num-1',
    correct_option_id: 'C',
    explanation: 'Notice that 7^3 = 343. 343 = 342 + 1, so 7^3 = 1 (mod 342). 7^84 = (7^3)^28 * 7^0 = 1^28 = 1. Wait, 84 = 3 * 28, so 7^84 = (7^3)^28 = 1^28 = 1 (mod 342). Option A is 1.',
  },
  {
    question_id: 'q-num-2',
    correct_option_id: 'B',
    explanation: 'Unit digit of 3^65 = 3^(4*16 + 1) -> 3^1 = 3. Unit digit of 6^59 is always 6. Unit digit of 7^71 = 7^(4*17 + 3) -> 7^3 = 343 -> 3. Total unit digit = 3 * 6 * 3 = 54 -> 4. Option B.',
  },
  {
    question_id: 'q-num-3',
    correct_option_id: 'B',
    explanation: 'Highest power of 5 in 100! = floor(100/5) + floor(100/25) = 20 + 4 = 24. Option B.',
  },
  {
    question_id: 'q-prft-1',
    correct_option_id: 'A',
    explanation: 'Let CP = 100. MP = 140. Discount 25% on 140 = 35. SP = 140 - 35 = 105. Net Profit = 105 - 100 = 5%. Option A.',
  },
  {
    question_id: 'q-prft-2',
    correct_option_id: 'B',
    explanation: 'Gain % = (Error / (True Value - Error)) * 100 = (80 / 920) * 100 = 8.69%. Option B.',
  },
  {
    question_id: 'q-tsd-1',
    correct_option_id: 'B',
    explanation: 'Speed = 72 * (5/18) = 20 m/s. Distance in 24s = 20 * 24 = 480 meters. Platform length = 480 - 180 = 300 meters. Option B.',
  },
  {
    question_id: 'q-tsd-2',
    correct_option_id: 'B',
    explanation: 'Downstream speed v + c = 24/2 = 12 km/h. Upstream speed v - c = 24/4 = 6 km/h. Speed of current c = (12 - 6)/2 = 3 km/h. Option B.',
  },
  {
    question_id: 'q-wrk-1',
    correct_option_id: 'B',
    explanation: 'Work = 36 units. A does 3 u/day, B does 2 u/day. In a 2-day cycle, 5 units done. In 7 cycles (14 days), 35 units done. Remaining 1 unit taken by A in 1/3 day. Total = 14.33 days. Option B.',
  },
  {
    question_id: 'q-wrk-2',
    correct_option_id: 'A',
    explanation: 'Total capacity = 24 units. A rate = 4, B rate = 3, C rate = -2. Combined rate = 4 + 3 - 2 = 5 u/hr. Time = 24 / 5 = 4.8 hours. Option A.',
  },
  {
    question_id: 'q-prob-1',
    correct_option_id: 'B',
    explanation: 'First arrange 5 boys in 5! = 120 ways. There are 6 available gaps for girls. Choose and arrange 4 girls in P(6, 4) = 360 ways. Total = 120 * 360 = 43,200. Option B.',
  },
  {
    question_id: 'q-prob-2',
    correct_option_id: 'B',
    explanation: 'Multiples of 4 between 2 and 12 are 4, 8, 12. Sum 4: (1,3),(2,2),(3,1) = 3 pairs. Sum 8: (2,6),(3,5),(4,4),(5,3),(6,2) = 5 pairs. Sum 12: (6,6) = 1 pair. Total = 9 / 36 = 1/4. Option B.',
  },
  {
    question_id: 'q-rat-1',
    correct_option_id: 'A',
    explanation: 'Mean cost price = 68.20 / 1.10 = ₹62. By rule of alligation: (65 - 62) : (62 - 60) = 3 : 2. Option A.',
  },
  {
    question_id: 'q-syl-1',
    correct_option_id: 'C',
    explanation: 'Laptops inside devices, devices intersect phones, phones disjoint from tablets. Neither conclusion necessarily holds. Option C.',
  },
  {
    question_id: 'q-arr-1',
    correct_option_id: 'B',
    explanation: 'Placing 8 positions around circle with inward facing shows F is sitting diametrically opposite to A. Option B.',
  },
  {
    question_id: 'q-bld-1',
    correct_option_id: 'B',
    explanation: 'Deepak’s daughter’s father is Deepak himself. So the gentleman’s brother is Deepak’s father, making the gentleman Deepak’s uncle. Option B.',
  },
  {
    question_id: 'q-ser-1',
    correct_option_id: 'C',
    explanation: 'Pattern: *2 + 1. 3*2+1=7, 7*2+1=15, 15*2+1=31, 31*2+1=63, 63*2+1 = 127. Option C.',
  },
  {
    question_id: 'q-dir-1',
    correct_option_id: 'A',
    explanation: '12 North, 5 East, 12 South brings him to 5 km directly East of start. Option A.',
  },
  {
    question_id: 'q-rc-1',
    correct_option_id: 'C',
    explanation: '"Homogenizing human serendipity" means reducing varied and unexpected discoveries by forcing repetitive recommendations. Option C.',
  },
  {
    question_id: 'q-sc-1',
    correct_option_id: 'B',
    explanation: '"Neither of" takes a singular verb ("has") and singular pronoun reference ("his or her"). Option B.',
  },
  {
    question_id: 'q-voc-1',
    correct_option_id: 'B',
    explanation: 'Ephemeral means lasting for a very short time, i.e., transient. Option B.',
  },
  {
    question_id: 'q-pj-1',
    correct_option_id: 'A',
    explanation: 'Q introduces the 19th-century industrialization theme, R connects to urban factory scaling, S explains continuous power requirement, and P concludes with carbon emissions consequence. Option A.',
  },
  {
    question_id: 'q-ds-1',
    correct_option_id: 'B',
    explanation: 'An AVL tree maintains height balance (balance factor between -1 and +1), guaranteeing tree height <= 1.44 log2(n). Searching is strictly O(log n). Option B.',
  },
  {
    question_id: 'q-algo-1',
    correct_option_id: 'B',
    explanation: 'Kosaraju’s algorithm performs DFS on original graph to build finish times stack, transposes edges, and runs second DFS to extract SCCs in O(V + E). Option B.',
  },
  {
    question_id: 'q-db-1',
    correct_option_id: 'C',
    explanation: 'Isolation ensures concurrent transaction executions result in a system state that would be obtained if transactions were executed sequentially. Option C.',
  },
  {
    question_id: 'q-os-1',
    correct_option_id: 'B',
    explanation: 'Thrashing occurs when the system frequently page faults due to insufficient physical frames, spending excessive cycles on page replacement. Option B.',
  },
  {
    question_id: 'q-cn-1',
    correct_option_id: 'A',
    explanation: 'TCP Flow control uses the advertised receiver window size (rwnd) in ACKs so the sender does not overflow the receiver buffer. Option A.',
  }
];

// Fix for q-num-1 correct answer alignment:
PLACEMENT_QUESTION_KEYS[0].correct_option_id = 'A';

// ==============================================================================
// VERIFIED CAMPUS PLACEMENT OPPORTUNITIES
// ==============================================================================

export const VERIFIED_JOB_OPPORTUNITIES: JobOpportunity[] = [
  {
    id: 'job-001',
    company: 'Infosys Limited',
    role: 'Specialist Programmer (SP) & DSE',
    type: 'Full-time',
    description: 'Elite competitive programming track for high-scale cloud platforms, distributed systems, and real-time backend microservices.',
    required_skills: ['Data Structures & Algorithms', 'Java / Python / C++', 'System Design Basics', 'SQL'],
    eligibility: 'B.E. (CSE, ISE, AI&ML, ECE) with 7.0+ CGPA and no active backlogs.',
    location: 'Bengaluru / Mangaluru / Pune',
    work_mode: 'Hybrid',
    ctc_or_stipend: '₹9.5 LPA - ₹12.5 LPA',
    deadline: '2026-11-20',
    apply_url: 'https://career.infosys.com/joblist',
    status: 'active',
    is_verified: true,
    logo_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120',
    created_at: '2026-10-30T10:00:00Z',
    updated_at: '2026-10-30T10:00:00Z'
  },
  {
    id: 'job-002',
    company: 'Tata Consultancy Services',
    role: 'TCS Digital Software Developer',
    type: 'Full-time',
    description: 'Digital cadre focusing on Cloud Engineering, Big Data Telemetry, and Generative AI enterprise integrations.',
    required_skills: ['Python', 'Docker', 'RESTful APIs', 'React / Angular', 'DBMS'],
    eligibility: 'All B.E. Branches with 6.5+ CGPA and 60%+ in 10th & 12th.',
    location: 'Bengaluru / Hyderabad / Chennai',
    work_mode: 'On-site',
    ctc_or_stipend: '₹7.2 LPA - ₹9.0 LPA',
    deadline: '2026-11-25',
    apply_url: 'https://www.tcs.com/careers',
    status: 'active',
    is_verified: true,
    logo_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120',
    created_at: '2026-10-31T09:00:00Z',
    updated_at: '2026-10-31T09:00:00Z'
  },
  {
    id: 'job-003',
    company: 'Robert Bosch Engineering',
    role: 'Embedded Systems & Autonomous Edge Engineer',
    type: 'Drive',
    description: 'Automotive edge computing, AUTOSAR protocols, real-time CAN bus telemetry, and computer vision firmware.',
    required_skills: ['Embedded C', 'RTOS', 'Microcontrollers (ARM Cortex)', 'Git'],
    eligibility: 'ECE, EEE, CSE, ISE with 7.5+ CGPA.',
    location: 'Bengaluru / Coimbatore',
    work_mode: 'On-site',
    ctc_or_stipend: '₹8.0 LPA - ₹10.5 LPA',
    deadline: '2026-11-28',
    apply_url: 'https://www.bosch.in/careers',
    status: 'active',
    is_verified: true,
    logo_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=120',
    created_at: '2026-11-01T11:00:00Z',
    updated_at: '2026-11-01T11:00:00Z'
  },
  {
    id: 'job-004',
    company: 'Cognizant Technology Solutions',
    role: 'GenC Next Full-Stack Engineer',
    type: 'Full-time',
    description: 'Engineering responsive web architectures, GraphQL microservices, and automated testing pipelines.',
    required_skills: ['JavaScript / TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Unit Testing'],
    eligibility: 'All Engineering Graduates, minimum 6.0 CGPA.',
    location: 'Mangaluru / Bengaluru',
    work_mode: 'Hybrid',
    ctc_or_stipend: '₹6.75 LPA',
    deadline: '2026-12-05',
    apply_url: 'https://careers.cognizant.com',
    status: 'active',
    is_verified: true,
    logo_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=120',
    created_at: '2026-11-02T10:00:00Z',
    updated_at: '2026-11-02T10:00:00Z'
  },
  {
    id: 'job-005',
    company: 'Amazon Web Services (AWS)',
    role: 'Cloud Support Associate Intern',
    type: 'Internship',
    description: '6-month intensive internship diagnosing cloud infrastructure, Linux kernel configurations, and networking bottlenecks.',
    required_skills: ['Linux OS Internals', 'Networking Fundamentals (DNS, TCP, VPN)', 'Scripting (Bash/Python)'],
    eligibility: 'Final & Pre-final year students (2026 & 2027 passouts).',
    location: 'Bengaluru',
    work_mode: 'Hybrid',
    ctc_or_stipend: '₹50,000 / month Stipend (PPO to ₹14 LPA)',
    deadline: '2026-11-30',
    apply_url: 'https://www.amazon.jobs',
    status: 'active',
    is_verified: true,
    logo_url: 'https://images.unsplash.com/photo-1523474255658-4af61b168344?w=120',
    created_at: '2026-11-03T08:00:00Z',
    updated_at: '2026-11-03T08:00:00Z'
  }
];

// ==============================================================================
// SEARCHABLE STUDY MATERIALS LIBRARY
// ==============================================================================

export const VERIFIED_STUDY_MATERIALS: StudyMaterial[] = [
  {
    id: 'mat-001',
    title: 'Striver’s SDE Sheet — Top 180 Curated Coding Problems',
    category: 'DSA & Algorithms',
    topic: 'Comprehensive SDE Preparation',
    difficulty: 'Intermediate',
    format: 'Interactive Problem Set',
    description: 'Industry-standard roadmap covering arrays, two-pointers, binary search, trees, and dynamic programming for tier-1 tech interviews.',
    source_name: 'TakeUForward',
    source_url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/',
    tags: ['DSA', 'LeetCode', 'Interview', 'Striver'],
    is_featured: true,
    created_at: '2026-10-15T09:00:00Z'
  },
  {
    id: 'mat-002',
    title: 'Quantitative Aptitude Formula Bible & Shortcuts',
    category: 'Quantitative Aptitude',
    topic: 'Speed Math & Shortcuts',
    difficulty: 'Beginner',
    format: 'Cheat Sheet',
    description: 'Concise reference sheet with Vedic math multiplication tricks, percentage fraction tables, and time-saving geometric relations.',
    source_name: 'GeeksforGeeks Placement Portal',
    source_url: 'https://www.geeksforgeeks.org/aptitude-questions-and-answers/',
    tags: ['Aptitude', 'Formulas', 'Speed Math', 'TCS NQT'],
    is_featured: true,
    created_at: '2026-10-18T11:00:00Z'
  },
  {
    id: 'mat-003',
    title: 'DBMS & SQL Interview Questions: Joins, Normalization & ACID',
    category: 'Core CS & Placement',
    topic: 'Database Management Systems',
    difficulty: 'Intermediate',
    format: 'PDF Notes',
    description: 'In-depth notes on indexing algorithms (B-Tree vs Hash), 1NF to BCNF decompositions, transaction concurrency anomalies, and write-ahead logging.',
    source_name: 'Gate Smashers CS',
    source_url: 'https://www.youtube.com/@GateSmashers',
    tags: ['DBMS', 'SQL', 'Normalization', 'GateSmashers'],
    is_featured: true,
    created_at: '2026-10-20T10:00:00Z'
  },
  {
    id: 'mat-004',
    title: 'Operating Systems: Process Synchronization & Deadlocks',
    category: 'Core CS & Placement',
    topic: 'Operating Systems',
    difficulty: 'Intermediate',
    format: 'Cheat Sheet',
    description: 'Clear visual diagrams for Peterson’s solution, Semaphores, Reader-Writer problem, Banker’s safety algorithm, and page replacement strategies.',
    source_name: 'NPTEL Computer Science',
    source_url: 'https://nptel.ac.in/courses',
    tags: ['OS', 'Deadlocks', 'Semaphores', 'Virtual Memory'],
    is_featured: false,
    created_at: '2026-10-22T14:00:00Z'
  },
  {
    id: 'mat-005',
    title: 'Behavioral & HR Interview Masterclass: STAR Method',
    category: 'Interview Preparation',
    topic: 'HR & Cultural Rounds',
    difficulty: 'Beginner',
    format: 'Video Tutorial',
    description: 'Frameworks to answer "Tell me about yourself", handling conflict in project teams, failure reflections, and negotiation strategies.',
    source_name: 'Harvard Career Services',
    source_url: 'https://careerservices.fas.harvard.edu/',
    tags: ['HR Interview', 'STAR Method', 'Soft Skills'],
    is_featured: true,
    created_at: '2026-10-25T16:00:00Z'
  },
  {
    id: 'mat-006',
    title: 'Computer Networks: 50 High-Yield Protocol Questions',
    category: 'Core CS & Placement',
    topic: 'Networking',
    difficulty: 'Intermediate',
    format: 'PDF Notes',
    description: 'Essential answers for TCP vs UDP, Handshake mechanics, Subnetting calculations, DNS resolution steps, and TLS cryptographic key exchange.',
    source_name: 'GeeksforGeeks',
    source_url: 'https://www.geeksforgeeks.org/computer-network-tutorials/',
    tags: ['Networking', 'TCP/IP', 'DNS', 'Protocols'],
    is_featured: false,
    created_at: '2026-10-28T12:00:00Z'
  }
];

// ==============================================================================
// GUIDED CODING AND DEBUGGING LAB CHALLENGES
// ==============================================================================

export const CODING_LAB_PROBLEMS: CodingProblem[] = [
  {
    id: 'code-001',
    title: 'Two Sum — Indices with Target Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    category: 'Arrays & Hashing',
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    input_format: 'First line: comma-separated array integers. Second line: integer target.',
    output_format: 'Array of two indices [i, j].',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0, 1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1, 2]', explanation: 'nums[1] + nums[2] == 6, return [1, 2].' }
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', 'Exactly one valid answer exists.'],
    starter_code: {
      javascript: `function twoSum(nums, target) {\n  // Your implementation here\n  \n}`,
      python: `def two_sum(nums, target):\n    # Your implementation here\n    pass`,
      cpp: `#include <vector>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Your code here\n}`
    },
    test_cases: [
      { input: '[2, 7, 11, 15], 9', expected_output: '[0, 1]', is_hidden: false },
      { input: '[3, 2, 4], 6', expected_output: '[1, 2]', is_hidden: false },
      { input: '[3, 3], 6', expected_output: '[0, 1]', is_hidden: true }
    ],
    hints: [
      'Stage 1 (Approach): Brute force checks all pairs in O(n^2). Can you do this in one pass by checking for the complement (target - num)?',
      'Stage 2 (Concept): Use a Hash Map / Object to store each number and its index as you iterate through the list.',
      'Stage 3 (Edge Case): Remember to verify that the complement is already in the map before returning, ensuring you don’t reuse the same index.',
      'Stage 4 (Solution Reveal): If complement = target - nums[i] is in map, return [map[complement], i]; else map[nums[i]] = i.'
    ],
    editorial: 'By maintaining an in-memory hash table of previously visited numbers, complement lookups take O(1) average time, reducing the total runtime to O(n) with O(n) auxiliary space.',
    solution_code: {
      javascript: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
      python: `def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []`
    }
  },
  {
    id: 'code-002',
    title: 'Valid Parentheses String Matching',
    slug: 'valid-parentheses',
    difficulty: 'Easy',
    category: 'Stack',
    description: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid. Open brackets must be closed by the same type of brackets in the correct order.',
    input_format: 'String s containing bracket characters.',
    output_format: 'Boolean (true / false).',
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' }
    ],
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only.'],
    starter_code: {
      javascript: `function isValid(s) {\n  // Your code here\n}`,
      python: `def is_valid(s: str) -> bool:\n    # Your code here\n    pass`
    },
    test_cases: [
      { input: '"()"', expected_output: 'true', is_hidden: false },
      { input: '"()[]{}"', expected_output: 'true', is_hidden: false },
      { input: '"(]"', expected_output: 'false', is_hidden: false },
      { input: '"([)]"', expected_output: 'false', is_hidden: true },
      { input: '"{[]}"', expected_output: 'true', is_hidden: true }
    ],
    hints: [
      'Stage 1 (Approach): The last opening bracket must match the very first closing bracket. Which LIFO data structure models this?',
      'Stage 2 (Concept): Use a Stack. Push opening brackets `(`, `{`, `[` onto the stack.',
      'Stage 3 (Edge Case): When encountering a closing bracket, what happens if the stack is already empty? Return false immediately!',
      'Stage 4 (Solution Reveal): If popped bracket does not match closing bracket, return false. At the end, check if stack is empty.'
    ],
    editorial: 'A Stack enables O(n) linear scan with O(n) space. Every character is pushed or popped at most once.',
    solution_code: {
      javascript: `function isValid(s) {\n  const stack = [];\n  const map = { ')': '(', '}': '{', ']': '[' };\n  for (const char of s) {\n    if (char in map) {\n      if (stack.length === 0 || stack.pop() !== map[char]) {\n        return false;\n      }\n    } else {\n      stack.push(char);\n    }\n  }\n  return stack.length === 0;\n}`
    }
  },
  {
    id: 'code-003',
    title: 'Reverse a Singly Linked List',
    slug: 'reverse-linked-list',
    difficulty: 'Easy',
    category: 'Linked List',
    description: 'Given the head of a singly linked list, reverse the list, and return the reversed list head.',
    input_format: 'Head node of linked list.',
    output_format: 'Reversed head node.',
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
      { input: 'head = [1,2]', output: '[2,1]' }
    ],
    constraints: ['0 <= Number of nodes <= 5000', '-5000 <= Node.val <= 5000'],
    starter_code: {
      javascript: `function reverseList(head) {\n  let prev = null;\n  let curr = head;\n  // Your code here\n}`,
      python: `def reverse_list(head):\n    prev = None\n    curr = head\n    # Your code here`
    },
    test_cases: [
      { input: '[1, 2, 3, 4, 5]', expected_output: '[5, 4, 3, 2, 1]', is_hidden: false }
    ],
    hints: [
      'Stage 1 (Approach): Reversing requires changing each node’s next pointer to its predecessor.',
      'Stage 2 (Concept): Maintain three pointers: `prev`, `curr`, and `nextTemp`.',
      'Stage 3 (Edge Case): Handle empty list `head === null` or single element list safely.',
      'Stage 4 (Solution Reveal): In each iteration: `nextTemp = curr.next; curr.next = prev; prev = curr; curr = nextTemp;` Return `prev`.'
    ],
    editorial: 'Iterative in-place pointer reversal operates in O(n) time and O(1) auxiliary space.',
    solution_code: {
      javascript: `function reverseList(head) {\n  let prev = null;\n  let curr = head;\n  while (curr !== null) {\n    const nextTemp = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = nextTemp;\n  }\n  return prev;\n}`
    }
  }
];

// ==============================================================================
// 10-DAY ROLLING WORLD & TECH NEWS ARTICLES
// ==============================================================================

export const WORLD_TECH_NEWS: WorldNewsArticle[] = [
  {
    id: 'news-001',
    title: 'OpenAI Releases Lightweight Reasoning Models for Edge Computing',
    summary: 'New architectural distillation enables high-fidelity multi-step mathematical and logical reasoning directly on consumer hardware without server calls.',
    category: 'Tech & AI',
    source_name: 'TechCrunch',
    source_url: 'https://techcrunch.com/category/artificial-intelligence/',
    published_at: '2026-11-02T14:30:00Z',
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
    tags: ['AI', 'Machine Learning', 'Edge Computing']
  },
  {
    id: 'news-002',
    title: 'Indian IT Sector Drives 40% Increase in Cloud & Cyber Security Hiring',
    summary: 'Tier-1 tech firms across Bengaluru and Hyderabad ramp up specialized campus hiring for graduates with hands-on Kubernetes and DevSecOps proficiency.',
    category: 'Hiring Trends',
    source_name: 'Economic Times',
    source_url: 'https://economictimes.indiatimes.com/jobs',
    published_at: '2026-11-01T09:15:00Z',
    image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
    tags: ['Placements', 'Cloud', 'Cybersecurity', 'Bengaluru']
  },
  {
    id: 'news-003',
    title: 'ISRO Announces Next-Generation Space Station Module Telemetry Sprint',
    summary: 'Indian Space Research Organisation initiates joint engineering challenges for autonomous docking simulations with top autonomous engineering institutes.',
    category: 'Science & Space',
    source_name: 'The Hindu',
    source_url: 'https://www.thehindu.com/sci-tech/',
    published_at: '2026-10-30T11:00:00Z',
    image_url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400',
    tags: ['ISRO', 'Space Tech', 'Autonomous Systems']
  },
  {
    id: 'news-004',
    title: 'VTU Unveils Updated Curriculum Guidelines for Autonomous Institutes',
    summary: 'Emphasis on experiential industry internships, capstone project incubations, and continuous skill credits from semester 4 onwards.',
    category: 'Higher Education',
    source_name: 'Deccan Herald',
    source_url: 'https://www.deccanherald.com/education',
    published_at: '2026-10-28T16:00:00Z',
    image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400',
    tags: ['VTU', 'Academics', 'Autonomous']
  }
];

// ==============================================================================
// VERIFIED INTERVIEW EXPERIENCES (SAHYADRI ALUMNI & SENIORS)
// ==============================================================================

export const VERIFIED_INTERVIEW_EXPERIENCES: InterviewExperience[] = [
  {
    id: 'exp-001',
    student_id: 'usr-senior-01',
    student_name: 'Prajwal K. (CSE Batch 2025)',
    company: 'Infosys Limited',
    role: 'Specialist Programmer (₹9.5 LPA)',
    batch_year: 2025,
    verdict: 'Selected',
    difficulty: 'Moderate',
    rounds: [
      {
        round_name: 'Round 1: Online Coding Assessment (3 Questions - 180 Mins)',
        duration_minutes: 180,
        questions_asked: '1 Greedy array interval partitioning, 1 Tree dynamic programming, and 1 string hashing challenge.',
        tips: 'Complete at least 2 full questions with passing all edge test cases to secure the interview shortlist.'
      },
      {
        round_name: 'Round 2: Technical & Project Defense (45 Mins)',
        duration_minutes: 45,
        questions_asked: 'Explained microservices architecture from my Sahyadri hackathon project, deep-dive into database connection pooling, and live-coded Valid Parentheses variant.',
        tips: 'Know every line of code in your resume projects. Interviewers ask about failures and scalability trade-offs.'
      }
    ],
    overall_advice: 'Practice LeetCode mediums and revise ACID properties and OS paging thoroughly. Sahyadri placement training mock interviews were extremely helpful.',
    is_approved: true,
    created_at: '2026-10-15T10:00:00Z'
  },
  {
    id: 'exp-002',
    student_id: 'usr-senior-02',
    student_name: 'Sneha Shetty (ISE Batch 2025)',
    company: 'Tata Consultancy Services',
    role: 'TCS Digital (₹7.2 LPA)',
    batch_year: 2025,
    verdict: 'Selected',
    difficulty: 'Moderate',
    rounds: [
      {
        round_name: 'Round 1: National Qualifier Test (NQT Cognitive + Advanced Coding)',
        duration_minutes: 120,
        questions_asked: 'Advanced Quantitative math (Pipes, Mixtures), Logical deduction, and two medium coding questions (Binary matrix & recursion).',
        tips: 'Speed math shortcuts are crucial. Don’t spend more than 90 seconds on a single numerical problem.'
      },
      {
        round_name: 'Round 3: Combined Tech + MR + HR (30 Mins)',
        duration_minutes: 30,
        questions_asked: 'Difference between Process and Thread, normalization up to BCNF, willingness to relocate, and conflict resolution scenario.',
        tips: 'Maintain confidence and structured communication using the STAR technique.'
      }
    ],
    overall_advice: 'Focus heavily on quantitative aptitude speed and fundamental data structures. TCS Digital looks for strong problem-solving fundamentals.',
    is_approved: true,
    created_at: '2026-10-22T14:00:00Z'
  }
];

// ==============================================================================
// VERIFIED STUDENT ACHIEVEMENTS
// ==============================================================================

export const VERIFIED_STUDENT_ACHIEVEMENTS: StudentAchievement[] = [
  {
    id: 'ach-001',
    student_id: 'usr-student-01',
    student_name: 'Aditi Rao',
    title: 'First Prize — State-Level Hackathon "Smart Mangaluru 2026"',
    category: 'Hackathon',
    organizer: 'Karnataka Digital Economy Mission (KDEM)',
    event_date: '2026-10-12',
    description: 'Built an autonomous AI river telemetry buoy monitoring Netravathi river water parameters in real time using edge IoT sensors.',
    proof_url: 'https://sahyadri.edu.in/achievements/hackathon-2026',
    status: 'approved',
    faculty_remarks: 'Outstanding practical innovation combining IoT telemetry and web dashboard.',
    created_at: '2026-10-14T09:00:00Z'
  },
  {
    id: 'ach-002',
    student_id: 'usr-student-02',
    student_name: 'Karthik Shenoy',
    title: 'AWS Certified Cloud Practitioner Certification',
    category: 'Certification',
    organizer: 'Amazon Web Services',
    event_date: '2026-10-20',
    description: 'Validated foundational proficiency in AWS cloud services, security policies, and cost management architectures.',
    proof_url: 'https://aws.amazon.com/verification',
    status: 'approved',
    faculty_remarks: 'Verified certificate credential ID AWS-CP-90214.',
    created_at: '2026-10-22T11:00:00Z'
  }
];

