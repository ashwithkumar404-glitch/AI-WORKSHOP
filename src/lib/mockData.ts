import { 
  UserProfile, 
  Exam, 
  Question, 
  QuestionKey, 
  ExamAttempt, 
  ExamResponse, 
  Newsletter, 
  KnowledgeDocument 
} from './dbTypes';
import {
  PLACEMENT_APTITUDE_EXAMS,
  PLACEMENT_QUESTIONS,
  PLACEMENT_QUESTION_KEYS,
  VERIFIED_JOB_OPPORTUNITIES,
  VERIFIED_STUDY_MATERIALS,
  CODING_LAB_PROBLEMS,
  WORLD_TECH_NEWS,
  VERIFIED_INTERVIEW_EXPERIENCES,
  VERIFIED_STUDENT_ACHIEVEMENTS,
} from './placementMockData';

export {
  VERIFIED_JOB_OPPORTUNITIES,
  VERIFIED_STUDY_MATERIALS,
  CODING_LAB_PROBLEMS,
  WORLD_TECH_NEWS,
  VERIFIED_INTERVIEW_EXPERIENCES,
  VERIFIED_STUDENT_ACHIEVEMENTS,
};

export const INITIAL_STUDENT_USER: UserProfile = {
  id: 'd9b2e88a-7c34-4b52-9d3e-9087c53e1a01',
  email: 'student@sahyadri.edu.in',
  full_name: 'Aditi Rao',
  usn: '4SF22CS014',
  department: 'Computer Science & Engineering',
  semester: 4,
  role: 'student',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
  created_at: '2026-01-15T09:00:00Z',
  updated_at: '2026-03-01T10:30:00Z',
};

export const INITIAL_ADMIN_USER: UserProfile = {
  id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  email: 'admin@sahyadri.edu.in',
  full_name: 'Dr. Rajesh Kamath',
  usn: 'SCEM-FAC-042',
  department: 'Dean Academics & Examinations',
  semester: 0,
  role: 'admin',
  avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
  created_at: '2025-11-01T08:00:00Z',
  updated_at: '2026-02-10T11:00:00Z',
};

export const INITIAL_EXAMS: Exam[] = [
  {
    id: 'exam-daa-401',
    title: 'Design & Analysis of Algorithms — Mid-Semester MCQ',
    code: '22CS41',
    description: 'Covers Asymptotic Notations, Divide & Conquer, Greedy Strategies, Dynamic Programming, and Graph Algorithms.',
    department: 'Computer Science & Engineering',
    semester: 4,
    duration_minutes: 25,
    total_marks: 15,
    passing_marks: 8,
    retake_policy: 'single_attempt',
    max_attempts: 1,
    is_published: true,
    created_by: INITIAL_ADMIN_USER.id,
    created_at: '2026-10-25T10:00:00Z',
    updated_at: '2026-10-25T10:00:00Z',
  },
  {
    id: 'exam-dbms-402',
    title: 'Database Management Systems & Relational Algebra',
    code: '22CS42',
    description: 'Evaluation on E-R Modeling, Relational Calculus, 1NF to BCNF Normalization, and ACID Transaction properties.',
    department: 'Computer Science & Engineering',
    semester: 4,
    duration_minutes: 20,
    total_marks: 12,
    passing_marks: 6,
    retake_policy: 'multiple_attempts',
    max_attempts: 2,
    is_published: true,
    created_by: INITIAL_ADMIN_USER.id,
    created_at: '2026-10-28T09:00:00Z',
    updated_at: '2026-10-28T09:00:00Z',
  },
  {
    id: 'exam-ml-601',
    title: 'Machine Learning & Neural Architectures',
    code: '22AIML61',
    description: 'Foundations of Supervised Learning, Backpropagation gradient updates, Cross-entropy loss, and Regularization.',
    department: 'Computer Science & Engineering',
    semester: 6,
    duration_minutes: 30,
    total_marks: 16,
    passing_marks: 8,
    retake_policy: 'single_attempt',
    max_attempts: 1,
    is_published: true,
    created_by: INITIAL_ADMIN_USER.id,
    created_at: '2026-10-29T11:00:00Z',
    updated_at: '2026-10-29T11:00:00Z',
  },
  {
    id: 'exam-ethics-201',
    title: 'Constitution of India & Professional Ethics',
    code: '22CIP21',
    description: 'Fundamental Rights, Directive Principles, Parliamentary structure, and IEEE/ACM code of conduct for engineers.',
    department: 'Humanities & Social Sciences',
    semester: 2,
    duration_minutes: 15,
    total_marks: 10,
    passing_marks: 5,
    retake_policy: 'single_attempt',
    max_attempts: 1,
    is_published: false, // Draft for admin studio testing
    created_by: INITIAL_ADMIN_USER.id,
    created_at: '2026-11-01T08:00:00Z',
    updated_at: '2026-11-01T08:00:00Z',
  },
  ...PLACEMENT_APTITUDE_EXAMS
];

export const INITIAL_QUESTIONS: Question[] = [
  // Exam DAA 401 Questions
  {
    id: 'q-daa-1',
    exam_id: 'exam-daa-401',
    question_text: 'What is the tightest worst-case time complexity of Merge Sort on an array of n elements?',
    options: [
      { id: 'A', text: 'O(n)' },
      { id: 'B', text: 'O(n log n)' },
      { id: 'C', text: 'O(n^2)' },
      { id: 'D', text: 'O(log n)' }
    ],
    marks: 3,
    topic: 'Divide & Conquer',
    order_index: 1,
    created_at: '2026-10-25T10:05:00Z',
  },
  {
    id: 'q-daa-2',
    exam_id: 'exam-daa-401',
    question_text: 'Which algorithmic paradigm does Dijkstra’s single-source shortest path algorithm primarily employ?',
    options: [
      { id: 'A', text: 'Greedy Technique' },
      { id: 'B', text: 'Dynamic Programming' },
      { id: 'C', text: 'Branch and Bound' },
      { id: 'D', text: 'Backtracking' }
    ],
    marks: 3,
    topic: 'Graph Algorithms',
    order_index: 2,
    created_at: '2026-10-25T10:06:00Z',
  },
  {
    id: 'q-daa-3',
    exam_id: 'exam-daa-401',
    question_text: 'In 0/1 Knapsack problem, why does the Greedy method fail to provide an optimal solution?',
    options: [
      { id: 'A', text: 'Because items have negative values' },
      { id: 'B', text: 'Because items cannot be subdivided, requiring exploration of all sub-capacity states' },
      { id: 'C', text: 'Because weight capacity is unbounded' },
      { id: 'D', text: 'Because greedy choice property is always satisfied' }
    ],
    marks: 3,
    topic: 'Dynamic Programming',
    order_index: 3,
    created_at: '2026-10-25T10:07:00Z',
  },
  {
    id: 'q-daa-4',
    exam_id: 'exam-daa-401',
    question_text: 'What is the recurrence relation for the Master Theorem case when T(n) = 2T(n/2) + O(n)?',
    options: [
      { id: 'A', text: 'T(n) = Theta(n log n)' },
      { id: 'B', text: 'T(n) = Theta(n)' },
      { id: 'C', text: 'T(n) = Theta(n^2)' },
      { id: 'D', text: 'T(n) = Theta(log n)' }
    ],
    marks: 3,
    topic: 'Asymptotic Analysis',
    order_index: 4,
    created_at: '2026-10-25T10:08:00Z',
  },
  {
    id: 'q-daa-5',
    exam_id: 'exam-daa-401',
    question_text: 'Which data structure allows Prim’s algorithm to achieve O(E log V) running time for a connected graph G=(V,E)?',
    options: [
      { id: 'A', text: 'Simple Array' },
      { id: 'B', text: 'Binary Min-Heap / Priority Queue' },
      { id: 'C', text: 'Stack' },
      { id: 'D', text: 'Hash Table' }
    ],
    marks: 3,
    topic: 'Graph Algorithms',
    order_index: 5,
    created_at: '2026-10-25T10:09:00Z',
  },

  // Exam DBMS 402 Questions
  {
    id: 'q-dbms-1',
    exam_id: 'exam-dbms-402',
    question_text: 'A relation R is in Boyce-Codd Normal Form (BCNF) if and only if for every functional dependency X -> Y:',
    options: [
      { id: 'A', text: 'Y is a prime attribute' },
      { id: 'B', text: 'X is a superkey of relation R' },
      { id: 'C', text: 'X is a subset of Y' },
      { id: 'D', text: 'R has no composite primary key' }
    ],
    marks: 3,
    topic: 'Normalization',
    order_index: 1,
    created_at: '2026-10-28T09:05:00Z',
  },
  {
    id: 'q-dbms-2',
    exam_id: 'exam-dbms-402',
    question_text: 'Which ACID property guarantees that all database updates in a transaction become permanent even after system crashes?',
    options: [
      { id: 'A', text: 'Atomicity' },
      { id: 'B', text: 'Consistency' },
      { id: 'C', text: 'Isolation' },
      { id: 'D', text: 'Durability' }
    ],
    marks: 3,
    topic: 'Transactions',
    order_index: 2,
    created_at: '2026-10-28T09:06:00Z',
  },
  {
    id: 'q-dbms-3',
    exam_id: 'exam-dbms-402',
    question_text: 'What type of index is created automatically on the Primary Key column in PostgreSQL and MySQL InnoDB?',
    options: [
      { id: 'A', text: 'B-tree Clustered / Unique Index' },
      { id: 'B', text: 'Hash Index' },
      { id: 'C', text: 'Bitmap Index' },
      { id: 'D', text: 'GiST Index' }
    ],
    marks: 3,
    topic: 'Storage & Indexing',
    order_index: 3,
    created_at: '2026-10-28T09:07:00Z',
  },
  {
    id: 'q-dbms-4',
    exam_id: 'exam-dbms-402',
    question_text: 'Which relational algebra operator filters rows based on a given predicate condition?',
    options: [
      { id: 'A', text: 'Project (pi)' },
      { id: 'B', text: 'Select (sigma)' },
      { id: 'C', text: 'Cartesian Product (x)' },
      { id: 'D', text: 'Join (bowtie)' }
    ],
    marks: 3,
    topic: 'Relational Algebra',
    order_index: 4,
    created_at: '2026-10-28T09:08:00Z',
  },
  ...PLACEMENT_QUESTIONS
];

export const INITIAL_QUESTION_KEYS: QuestionKey[] = [
  {
    question_id: 'q-daa-1',
    correct_option_id: 'B',
    explanation: 'Merge sort splits the array in halves (log n levels) and performs O(n) linear merge at each level, guaranteeing O(n log n) in all cases.'
  },
  {
    question_id: 'q-daa-2',
    correct_option_id: 'A',
    explanation: 'Dijkstra chooses the unvisited vertex with minimum tentative distance greedily at each step.'
  },
  {
    question_id: 'q-daa-3',
    correct_option_id: 'B',
    explanation: 'In 0/1 knapsack items cannot be fractured. A greedy value-to-weight ratio can leave wasted capacity, so dynamic programming is needed.'
  },
  {
    question_id: 'q-daa-4',
    correct_option_id: 'A',
    explanation: 'Here a=2, b=2, log_b(a) = 1. Since f(n) = O(n^1), this is Case 2 of Master Theorem, giving Theta(n log n).'
  },
  {
    question_id: 'q-daa-5',
    correct_option_id: 'B',
    explanation: 'A binary min-heap allows extract-min in O(log V) and decrease-key in O(log V) for each edge, yielding O(E log V).'
  },
  {
    question_id: 'q-dbms-1',
    correct_option_id: 'B',
    explanation: 'BCNF requires every non-trivial functional dependency X -> Y to have X as a superkey.'
  },
  {
    question_id: 'q-dbms-2',
    correct_option_id: 'D',
    explanation: 'Durability ensures that once a transaction commits, its modifications are permanently recorded via write-ahead logging (WAL).'
  },
  {
    question_id: 'q-dbms-3',
    correct_option_id: 'A',
    explanation: 'Relational engines automatically create a unique B-tree index on primary key constraints.'
  },
  {
    question_id: 'q-dbms-4',
    correct_option_id: 'B',
    explanation: 'The Select operator (sigma) performs horizontal partitioning based on row conditions.'
  },
  ...PLACEMENT_QUESTION_KEYS
];

// Seed initial attempt for student Aditi Rao
export const INITIAL_ATTEMPTS: ExamAttempt[] = [
  {
    id: 'att-daa-001',
    exam_id: 'exam-daa-401',
    student_id: INITIAL_STUDENT_USER.id,
    attempt_number: 1,
    status: 'submitted',
    started_at: '2026-10-26T14:00:00Z',
    submitted_at: '2026-10-26T14:21:40Z',
    time_spent_seconds: 1300,
    score: 12,
    max_score: 15,
    percentage: 80,
    passed: true,
    created_at: '2026-10-26T14:00:00Z',
    updated_at: '2026-10-26T14:21:40Z',
  }
];

export const INITIAL_RESPONSES: ExamResponse[] = [
  { id: 'res-1', attempt_id: 'att-daa-001', question_id: 'q-daa-1', selected_option_id: 'B', is_correct: true, marks_awarded: 3, saved_at: '2026-10-26T14:04:00Z' },
  { id: 'res-2', attempt_id: 'att-daa-001', question_id: 'q-daa-2', selected_option_id: 'A', is_correct: true, marks_awarded: 3, saved_at: '2026-10-26T14:08:00Z' },
  { id: 'res-3', attempt_id: 'att-daa-001', question_id: 'q-daa-3', selected_option_id: 'B', is_correct: true, marks_awarded: 3, saved_at: '2026-10-26T14:12:00Z' },
  { id: 'res-4', attempt_id: 'att-daa-001', question_id: 'q-daa-4', selected_option_id: 'C', is_correct: false, marks_awarded: 0, saved_at: '2026-10-26T14:16:00Z' },
  { id: 'res-5', attempt_id: 'att-daa-001', question_id: 'q-daa-5', selected_option_id: 'B', is_correct: true, marks_awarded: 3, saved_at: '2026-10-26T14:20:00Z' },
];

/**
 * Weekly Newsletters
 * Current date reference in workspace metadata: 2026-11-03
 * Rolling 10 calendar days window in IST covers: 2026-10-25 to 2026-11-03
 */
export const INITIAL_NEWSLETTERS: Newsletter[] = [
  {
    id: 'nl-001',
    title: 'SCEM Students Clinch 1st Place at VTU State Hackathon 2026',
    slug: 'scem-students-clinch-1st-place-vtu-hackathon-2026',
    summary: 'Team "AeroInnovators" from Sahyadri Department of CSE & AI secured first prize with a 1 Lakh INR cash award for their Edge AI Drone disaster response system.',
    content: `Sahyadri College of Engineering & Management, Mangaluru, celebrated a landmark victory at the Karnataka State-Level VTU Hackathon 2026 held at VTU Belagavi.

The team comprising Aditi Rao (4th Sem CSE), Rohan Shetty (6th Sem AI&ML), and Pratheeksha K (6th Sem ISE) developed an autonomous swarm UAV platform capable of real-time flood rescue survivor detection using onboard low-power neural acceleration.

Principal Dr. S. S. Balakrishna commended the team and faculty mentors from the Sahyadri Centre for Advanced Innovation & Research (SCAIR). The prototype was developed within the campus incubation center and tested at the campus ground along the Netravathi River basin.`,
    category: 'Research & Innovation',
    cover_image_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800',
    status: 'published',
    published_at: '2026-11-02T10:30:00+05:30', // 1 day ago (In rolling window)
    author_id: INITIAL_ADMIN_USER.id,
    author_name: 'Dr. Rajesh Kamath',
    tags: ['Hackathon', 'VTU', 'Innovation', 'AI', 'Drones'],
    created_at: '2026-11-02T09:00:00+05:30',
    updated_at: '2026-11-02T10:30:00+05:30',
  },
  {
    id: 'nl-002',
    title: 'Department of CSE Hosts National Workshop on Cloud Architecture & Kubernetes',
    slug: 'cse-national-workshop-cloud-kubernetes-2026',
    summary: 'A 3-day hands-on workshop in association with industry partners from AWS and Red Hat Bangalore concluded at Sahyadri campus.',
    content: `The Department of Computer Science & Engineering organized a comprehensive 3-day technical bootcamp on Cloud-Native Software Architecture, Microservices, and Kubernetes orchestration from October 30 to November 1, 2026.

Over 180 registered undergraduate students and faculty participants gained practical experience configuring high-availability clusters, CI/CD automated deployment pipelines, and observability monitoring stacks.

Keynote speaker Mr. Arvind Hegde (Principal Architect, Red Hat) emphasized the rising industry demand for engineers proficient in declarative infrastructure and automated testing. Certificates of excellence were awarded to the top 10 workshop performers.`,
    category: 'Academics',
    cover_image_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
    status: 'published',
    published_at: '2026-10-31T15:00:00+05:30', // 3 days ago (In rolling window)
    author_id: INITIAL_ADMIN_USER.id,
    author_name: 'SCEM Editorial Board',
    tags: ['Cloud', 'Kubernetes', 'CSE', 'Industry Workshop'],
    created_at: '2026-10-31T14:00:00+05:30',
    updated_at: '2026-10-31T15:00:00+05:30',
  },
  {
    id: 'nl-003',
    title: 'Campus Placement Update: 460+ Offers Released in Phase 1 Drives',
    slug: 'placement-update-phase-1-2026',
    summary: 'Tier-1 tech companies and multinational core firms extend recruitment offers to the graduating batch with top CTC touching 28 LPA.',
    content: `The Department of Placement & Career Guidance at Sahyadri College of Engineering & Management reported outstanding placements for Phase 1 of the 2025-26 academic recruitment cycle.

Leading recruiting firms including SAP Labs, Infosys, Cognizant, Cisco, SLK Software, and Bosch participated in rigorous on-campus and hybrid interview rounds. 

Special training programs conducted by Sahyadri Aptitude & Soft Skills Cell (SASC) throughout semesters 5 and 6 played a pivotal role in enabling student success. Shortlisted students for upcoming multinational product firms will attend orientation sessions this Friday.`,
    category: 'Placements',
    cover_image_url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800',
    status: 'published',
    published_at: '2026-10-27T11:00:00+05:30', // 7 days ago (In rolling window)
    author_id: INITIAL_ADMIN_USER.id,
    author_name: 'Prof. Rashmi Hegde, Placement Officer',
    tags: ['Placements', 'Careers', 'SAP', 'Cisco'],
    created_at: '2026-10-27T10:00:00+05:30',
    updated_at: '2026-10-27T11:00:00+05:30',
  },
  {
    id: 'nl-004',
    title: 'Sahyadri NAIN Incubation Cell Announces Cohort 7 Seed Funding Grants',
    slug: 'nain-incubation-cohort-7-grants',
    summary: 'Karnataka Innovation & Technology Society (KITS) approves INR 25 Lakhs for five student-led tech ventures incubated at Sahyadri.',
    content: `Five student startup initiatives mentored at the New Age Incubation Network (NAIN) center at Sahyadri College of Engineering & Management have been selected for official seed grant allocation.

The approved ventures span agricultural automation, smart EV battery telemetry, healthcare image analysis, and sustainable aquaculture sensors. Each project team receives prototype funding up to INR 5 Lakhs along with dedicated lab facilities, patent filing support, and legal mentorship from industry experts.`,
    category: 'Campus Life',
    cover_image_url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=800',
    status: 'published',
    published_at: '2026-10-25T16:30:00+05:30', // 9 days ago (In rolling window threshold)
    author_id: INITIAL_ADMIN_USER.id,
    author_name: 'SCEM Editorial Board',
    tags: ['Incubation', 'Startups', 'NAIN', 'KITS'],
    created_at: '2026-10-25T15:00:00+05:30',
    updated_at: '2026-10-25T16:30:00+05:30',
  },
  // ARCHIVED ARTICLES (Published > 10 calendar days ago)
  {
    id: 'nl-005',
    title: 'Autonomous Academic Council Approves Curriculum Revisions for 2026-27 Scheme',
    slug: 'academic-council-approves-2026-curriculum',
    summary: 'Autonomous Academic Council of SCEM integrates industry micro-credentials, experiential project credits, and AI ethics into undergraduate curricula.',
    content: `At the 12th Academic Council meeting of Sahyadri College of Engineering and Management, chaired by the Principal and attended by VTU nominees, revised syllabus frameworks for all engineering streams were formally approved.

Key additions include mandatory hands-on project semesters, elective tracks in Quantum Computing, Cyber Defense, and Green Energy Systems, aligning with NEP 2020 directives.`,
    category: 'Academics',
    cover_image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
    status: 'published',
    published_at: '2026-10-12T09:00:00+05:30', // 22 days ago (ARCHIVED)
    author_id: INITIAL_ADMIN_USER.id,
    author_name: 'Dean Academics Office',
    tags: ['Curriculum', 'Autonomous', 'VTU', 'NEP'],
    created_at: '2026-10-12T08:00:00+05:30',
    updated_at: '2026-10-12T09:00:00+05:30',
  },
  {
    id: 'nl-006',
    title: 'Annual Aerophilia 2026 National Aeromodelling Fest Dates Finalized',
    slug: 'aerophilia-2026-dates-announced',
    summary: 'The flagship national tech fest Aerophilia is scheduled to take place across the 30-acre riverside campus in December.',
    content: `The Student Activity Council and Team Challengers at SCEM announced the launch of Aerophilia 2026. Attracting over 2,000 engineering aspirants nationwide, the 2-day extravaganza includes RC Plane dogfights, drone racing circuits, water rocket challenges, and robotic combat arenas.`,
    category: 'Events',
    cover_image_url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800',
    status: 'published',
    published_at: '2026-10-01T14:00:00+05:30', // 33 days ago (ARCHIVED)
    author_id: INITIAL_ADMIN_USER.id,
    author_name: 'Team Challengers & SCEM Media',
    tags: ['Aerophilia', 'Fest', 'Robotics', 'Campus'],
    created_at: '2026-10-01T12:00:00+05:30',
    updated_at: '2026-10-01T14:00:00+05:30',
  },
  // DRAFT ARTICLE (For Admin Studio testing)
  {
    id: 'nl-draft-001',
    title: 'Notice: Semester End Examination (SEE) Lab Schedule & Hall Ticket Issuance',
    slug: 'draft-see-lab-schedule-hall-tickets',
    summary: 'Draft notice regarding laboratory practical exams and eligibility criteria for hall ticket downloads.',
    content: `Students with required minimum 85% attendance in laboratory practical courses can download their digitized hall tickets via CampusPilot AI starting next Monday. Verification by Proctor/Faculty Mentor is compulsory.`,
    category: 'Notices',
    status: 'draft',
    author_id: INITIAL_ADMIN_USER.id,
    author_name: 'Controller of Examinations (COE)',
    tags: ['Exams', 'SEE', 'Lab Schedule'],
    created_at: '2026-11-03T08:00:00+05:30',
    updated_at: '2026-11-03T08:00:00+05:30',
  }
];

export const INITIAL_KNOWLEDGE_DOCS: KnowledgeDocument[] = [
  {
    id: 'kd-001',
    title: 'SCEM Autonomous Status, Accreditation and Affiliation',
    category: 'Academics & Regulations',
    content: `Sahyadri College of Engineering & Management (SCEM), Mangaluru, established in 2007, is an Autonomous Institute approved by AICTE, New Delhi, and permanently affiliated to Visvesvaraya Technological University (VTU), Belagavi.
SCEM is accredited with Grade 'A' by the National Assessment and Accreditation Council (NAAC) and its engineering undergraduate programs are accredited by the National Board of Accreditation (NBA).
Autonomous status grants SCEM academic freedom to design industry-aligned curricula, conduct its own continuous internal evaluations, and schedule semester end examinations under VTU guidelines. Degrees are conferred by VTU, Belagavi.`,
    source_url: 'https://sahyadri.edu.in/about-us',
    status: 'approved',
    metadata: { author: 'Dean Academics', verified: true },
    approved_by: INITIAL_ADMIN_USER.id,
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 'kd-002',
    title: 'Attendance Policy & 85% VTU Requirement',
    category: 'Academics & Regulations',
    content: `At Sahyadri College of Engineering & Management, student attendance is strictly monitored through ERP biometric/faculty logs.
1. Each student must maintain a minimum of 85% attendance in every registered course (Theory and Practical) to be eligible to appear for the Semester End Examination (SEE).
2. A condonation of attendance up to 10% (i.e. between 75% and 84%) may be granted on genuine medical grounds or sanctioned institutional representation (sports, technical competitions) by the Principal upon submitting authorized medical certificates or sports approvals within 3 working days of absence.
3. Students possessing less than 75% attendance are detained in that subject (NSAR status) and must re-register when the course is offered in subsequent semesters.`,
    source_url: 'https://sahyadri.edu.in/academics/regulations',
    status: 'approved',
    metadata: { author: 'Dean Student Affairs', verified: true },
    approved_by: INITIAL_ADMIN_USER.id,
    created_at: '2026-01-15T11:00:00Z',
    updated_at: '2026-01-15T11:00:00Z',
  },
  {
    id: 'kd-003',
    title: 'Grading System, SGPA/CGPA Calculation, and Passing Criteria',
    category: 'Examinations & Grading',
    content: `The autonomous academic evaluation consists of Continuous Internal Evaluation (CIE - 50%) and Semester End Examination (SEE - 50%).
Grading Scale (10-point VTU grading system):
- O (Outstanding): Marks >= 90%, Grade Point 10
- A+ (Excellent): Marks 80 - 89%, Grade Point 9
- A (Very Good): Marks 70 - 79%, Grade Point 8
- B+ (Good): Marks 60 - 69%, Grade Point 7
- B (Above Average): Marks 55 - 59%, Grade Point 6
- C (Average): Marks 50 - 54%, Grade Point 5
- P (Pass): Marks 40 - 49%, Grade Point 4
- F (Fail): Marks < 40%, Grade Point 0

Passing Minimum:
A student must secure a minimum of 35% in SEE and an aggregate of 40% (CIE + SEE) to clear any course.
SGPA = Sum(Course Credits * Grade Points) / Total Semester Credits.
CGPA = Cumulative performance across all registered semesters.`,
    source_url: 'https://sahyadri.edu.in/examinations/grading',
    status: 'approved',
    metadata: { author: 'Controller of Examinations', verified: true },
    approved_by: INITIAL_ADMIN_USER.id,
    created_at: '2026-02-01T09:00:00Z',
    updated_at: '2026-02-01T09:00:00Z',
  },
  {
    id: 'kd-004',
    title: 'Campus Amenities, Hostel Rules & Facilities',
    category: 'Campus & Hostels',
    content: `Sahyadri campus is situated on a picturesque 30-acre campus along the Netravathi River on Mangaluru-Bengaluru National Highway 75.
Amenities include:
1. Central Library: Open 8:00 AM to 8:00 PM on working days, with 40,000+ volumes, IEEE/ScienceDirect digital access, and dedicated quiet study halls.
2. In-Campus Hostels: Separate hostels for boys and girls with 24/7 security, high-speed Wi-Fi, laundry, and hygienic multi-cuisine mess food (South & North Indian options).
3. Hostel Timings: Entry gate closes strictly at 9:00 PM for all hostel residents. Late entry requires prior written approval from Chief Warden.
4. Healthcare: On-campus health center with full-time resident nursing staff and doctor visits. Emergency ambulance available 24/7.
5. Sports & Gymnasium: Multi-purpose indoor sports complex, cricket/football grounds, gymnasium, and basketball courts.`,
    source_url: 'https://sahyadri.edu.in/campus-life',
    status: 'approved',
    metadata: { author: 'Chief Warden & Estate Office', verified: true },
    approved_by: INITIAL_ADMIN_USER.id,
    created_at: '2026-02-10T14:00:00Z',
    updated_at: '2026-02-10T14:00:00Z',
  },
  {
    id: 'kd-005',
    title: 'Placement & Career Guidance Cell Eligibility Guidelines',
    category: 'Placements & Training',
    content: `The Department of Placement & Career Guidance at SCEM operates on transparent eligibility metrics:
1. Dream Tier (CTC >= 10 LPA): Open to all eligible students meeting company-specific CGPA cutoffs (typically 7.0+ CGPA with no active backlogs).
2. Standard Core & IT Tiers (CTC 4 LPA to 9.9 LPA): Students securing a placement in this bracket can attempt up to two 'Dream' company drives.
3. Strict One-Student-One-Offer Rule applies unless elevated to a Dream/Super-Dream slot.
4. Mandatory 90% attendance in placement training bootcamps (DSA, soft skills, aptitude) is required for campus drive registration.`,
    source_url: 'https://sahyadri.edu.in/placements',
    status: 'approved',
    metadata: { author: 'Head of Placements', verified: true },
    approved_by: INITIAL_ADMIN_USER.id,
    created_at: '2026-02-15T10:00:00Z',
    updated_at: '2026-02-15T10:00:00Z',
  },
  {
    id: 'kd-006',
    title: 'Student Innovation Cells & Technical Clubs',
    category: 'Student Clubs',
    content: `Sahyadri fosters a vibrant technical and innovation culture through specialized student bodies:
- Team Challengers: Renowned aeromodelling and autonomous robotics club, frequent winners in NASA and SAE competitions.
- SCAIR (Sahyadri Centre for Advanced Innovation & Research): Artificial Intelligence, Drone telemetry, and Computer Vision research lab.
- NAIN (New Age Incubation Network): Startup incubator backed by Government of Karnataka offering grants up to INR 3 Lakhs per prototype.
- Mozilla Campus Club & GDG on Campus: Developer communities organizing regular hackathons, open-source workshops, and code sprints.
- D-Link Academy & Intel Intelligent Systems Lab: Specialized industry certification labs located inside the academic block.`,
    source_url: 'https://sahyadri.edu.in/innovation-cells',
    status: 'approved',
    metadata: { author: 'Innovation Dean', verified: true },
    approved_by: INITIAL_ADMIN_USER.id,
    created_at: '2026-02-20T11:00:00Z',
    updated_at: '2026-02-20T11:00:00Z',
  }
];

