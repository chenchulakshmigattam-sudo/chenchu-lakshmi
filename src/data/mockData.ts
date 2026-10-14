import {
  User,
  SubjectAttendance,
  InternalMark,
  SemesterResult,
  TimetableSlot,
  ExamScheduleItem,
  Assignment,
  Notice,
  LeaveApplication,
  FeeRecord,
  CampusRoom,
  DayStudyPlan
} from '../types';

export const DEMO_USERS: Record<string, User> = {
  student: {
    id: 'usr_stu_1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@campus.edu',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rollNumber: 'CS2023041',
    department: 'Computer Science & Engineering',
    semester: 5,
    section: 'A',
    phone: '+91 98765 12345',
    joinedYear: '2023'
  },
  faculty: {
    id: 'usr_fac_1',
    name: 'Prof. Sunita Rao',
    email: 'sunita.rao@campus.edu',
    role: 'faculty',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science & Engineering',
    designation: 'Senior Associate Professor & HOD-Elect',
    phone: '+91 98765 67890',
    joinedYear: '2016'
  },
  parent: {
    id: 'usr_par_1',
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@gmail.com',
    role: 'parent',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98765 43210',
    linkedStudentId: 'usr_stu_1',
    linkedStudentName: 'Aarav Sharma'
  },
  admin: {
    id: 'usr_adm_1',
    name: 'Dr. K. Raman',
    email: 'dean.academic@campus.edu',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    department: 'Office of Academic Affairs & Administration',
    designation: 'Dean of Academic Administration & Registrar',
    phone: '+91 98765 99999',
    joinedYear: '2012'
  }
};

export const INITIAL_ATTENDANCE: SubjectAttendance[] = [
  {
    subjectCode: 'CS501',
    subjectName: 'Design & Analysis of Algorithms',
    credits: 4,
    attendedClasses: 38,
    totalClasses: 42,
    percentage: 90.5,
    facultyName: 'Prof. Sunita Rao',
    room: 'AB-302',
    history: [
      { date: '2026-10-12', status: 'present', topicCovered: 'Dynamic Programming - Bellman Ford' },
      { date: '2026-10-10', status: 'present', topicCovered: 'Greedy Choice Property & Matroids' },
      { date: '2026-10-08', status: 'present', topicCovered: 'Divide and Conquer Master Theorem' },
      { date: '2026-10-06', status: 'absent', topicCovered: 'Amortized Analysis with Potential Method' },
      { date: '2026-10-03', status: 'present', topicCovered: 'NP-Completeness Reductions' },
      { date: '2026-10-01', status: 'present', topicCovered: 'Graph Flow Networks' }
    ]
  },
  {
    subjectCode: 'CS502',
    subjectName: 'Database Management Systems',
    credits: 4,
    attendedClasses: 33,
    totalClasses: 40,
    percentage: 82.5,
    facultyName: 'Dr. Arvind Verma',
    room: 'AB-204',
    history: [
      { date: '2026-10-13', status: 'present', topicCovered: 'ACID Properties & Serializability' },
      { date: '2026-10-11', status: 'present', topicCovered: '2-Phase Locking Protocol' },
      { date: '2026-10-09', status: 'absent', topicCovered: 'B+ Tree Indexing in PostgreSQL' },
      { date: '2026-10-07', status: 'present', topicCovered: 'Query Optimization Plans' },
      { date: '2026-10-04', status: 'present', topicCovered: 'Relational Algebra Operations' }
    ]
  },
  {
    subjectCode: 'CS503',
    subjectName: 'Machine Learning & Deep Learning',
    credits: 4,
    attendedClasses: 26,
    totalClasses: 38,
    percentage: 68.4, // Warning threshold (< 75%)
    facultyName: 'Dr. Neha Mukherjee',
    room: 'Turing Lab-3',
    history: [
      { date: '2026-10-13', status: 'absent', topicCovered: 'Backpropagation & Loss Gradients' },
      { date: '2026-10-11', status: 'leave', topicCovered: 'Convolutional Feature Maps' },
      { date: '2026-10-08', status: 'present', topicCovered: 'Support Vector Machines Kernels' },
      { date: '2026-10-05', status: 'absent', topicCovered: 'Logistic Regression Regularization' },
      { date: '2026-10-02', status: 'present', topicCovered: 'Principal Component Analysis' }
    ]
  },
  {
    subjectCode: 'CS504',
    subjectName: 'Operating Systems & Kernels',
    credits: 3,
    attendedClasses: 32,
    totalClasses: 35,
    percentage: 91.4,
    facultyName: 'Prof. Rajesh Kulkarni',
    room: 'AB-105',
    history: [
      { date: '2026-10-12', status: 'present', topicCovered: 'Virtual Memory & Page Replacement' },
      { date: '2026-10-09', status: 'present', topicCovered: 'Process Synchronization Semaphores' },
      { date: '2026-10-06', status: 'present', topicCovered: 'Deadlock Detection Banker Algorithm' },
      { date: '2026-10-02', status: 'present', topicCovered: 'CPU Scheduling Algorithms' }
    ]
  },
  {
    subjectCode: 'CS505',
    subjectName: 'Full-Stack Web Engineering',
    credits: 3,
    attendedClasses: 27,
    totalClasses: 34,
    percentage: 79.4,
    facultyName: 'Er. Meenakshi S.',
    room: 'Turing-201',
    history: [
      { date: '2026-10-13', status: 'present', topicCovered: 'React Server Components & SSR' },
      { date: '2026-10-10', status: 'present', topicCovered: 'REST vs GraphQL API Architectures' },
      { date: '2026-10-07', status: 'absent', topicCovered: 'JWT Authentication & Refresh Tokens' },
      { date: '2026-10-04', status: 'present', topicCovered: 'Tailwind CSS Utility Design Systems' }
    ]
  },
  {
    subjectCode: 'CS506P',
    subjectName: 'Cloud & AI Systems Lab',
    credits: 2,
    attendedClasses: 17,
    totalClasses: 18,
    percentage: 94.4,
    facultyName: 'Prof. Sunita Rao',
    room: 'Turing Lab-1',
    history: [
      { date: '2026-10-12', status: 'present', topicCovered: 'Dockerization & Kubernetes Deployment' },
      { date: '2026-10-05', status: 'present', topicCovered: 'Cloud Run & Serverless Microservices' },
      { date: '2026-09-28', status: 'present', topicCovered: 'CI/CD Pipeline Setup with GitHub Actions' }
    ]
  }
];

export const INITIAL_MARKS: InternalMark[] = [
  {
    subjectCode: 'CS501',
    subjectName: 'Design & Analysis of Algorithms',
    credits: 4,
    test1: 18.5,
    test2: 19.0,
    assignment: 9.5,
    lab: 9.0,
    totalInternal: 56.0,
    expectedEndSem: 36,
    estimatedGrade: 'A+',
    gradePoint: 10
  },
  {
    subjectCode: 'CS502',
    subjectName: 'Database Management Systems',
    credits: 4,
    test1: 16.0,
    test2: 17.5,
    assignment: 9.0,
    lab: 8.5,
    totalInternal: 51.0,
    expectedEndSem: 32,
    estimatedGrade: 'A',
    gradePoint: 9
  },
  {
    subjectCode: 'CS503',
    subjectName: 'Machine Learning & Deep Learning',
    credits: 4,
    test1: 14.0,
    test2: 15.0,
    assignment: 8.0,
    lab: 7.5,
    totalInternal: 44.5,
    expectedEndSem: 28,
    estimatedGrade: 'B+',
    gradePoint: 8
  },
  {
    subjectCode: 'CS504',
    subjectName: 'Operating Systems & Kernels',
    credits: 3,
    test1: 17.5,
    test2: 18.0,
    assignment: 9.0,
    lab: 9.0,
    totalInternal: 53.5,
    expectedEndSem: 34,
    estimatedGrade: 'A',
    gradePoint: 9
  },
  {
    subjectCode: 'CS505',
    subjectName: 'Full-Stack Web Engineering',
    credits: 3,
    test1: 19.0,
    test2: 18.5,
    assignment: 10.0,
    lab: 9.5,
    totalInternal: 57.0,
    expectedEndSem: 37,
    estimatedGrade: 'A+',
    gradePoint: 10
  },
  {
    subjectCode: 'CS506P',
    subjectName: 'Cloud & AI Systems Lab',
    credits: 2,
    test1: 18.0,
    test2: 19.0,
    assignment: 10.0,
    lab: 10.0,
    totalInternal: 57.0,
    expectedEndSem: 38,
    estimatedGrade: 'O',
    gradePoint: 10
  }
];

export const PREVIOUS_SEMESTER_RESULTS: SemesterResult[] = [
  {
    semester: 4,
    sgpa: 8.82,
    cgpa: 8.74,
    totalCredits: 22,
    status: 'PASSED',
    subjects: [
      { code: 'CS401', name: 'Computer Architecture & Org', credits: 4, grade: 'A', gradePoint: 9 },
      { code: 'CS402', name: 'Theory of Computation', credits: 4, grade: 'A+', gradePoint: 10 },
      { code: 'CS403', name: 'Computer Networks', credits: 4, grade: 'B+', gradePoint: 8 },
      { code: 'CS404', name: 'Software Engineering & Agile', credits: 3, grade: 'A', gradePoint: 9 },
      { code: 'MA401', name: 'Probability & Statistics', credits: 4, grade: 'A', gradePoint: 9 },
      { code: 'CS405P', name: 'Networks & Linux Lab', credits: 3, grade: 'O', gradePoint: 10 }
    ]
  },
  {
    semester: 3,
    sgpa: 8.65,
    cgpa: 8.71,
    totalCredits: 23,
    status: 'PASSED',
    subjects: [
      { code: 'CS301', name: 'Data Structures with C++', credits: 4, grade: 'A+', gradePoint: 10 },
      { code: 'CS302', name: 'Discrete Mathematics', credits: 4, grade: 'A', gradePoint: 9 },
      { code: 'CS303', name: 'Digital Logic Design', credits: 4, grade: 'B+', gradePoint: 8 },
      { code: 'EC301', name: 'Signals & Microprocessors', credits: 4, grade: 'B', gradePoint: 7 },
      { code: 'CS304P', name: 'Data Structures Lab', credits: 3, grade: 'O', gradePoint: 10 },
      { code: 'HU301', name: 'Professional Ethics', credits: 4, grade: 'A+', gradePoint: 10 }
    ]
  },
  {
    semester: 2,
    sgpa: 8.85,
    cgpa: 8.78,
    totalCredits: 21,
    status: 'PASSED',
    subjects: [
      { code: 'MA201', name: 'Linear Algebra & Calculus', credits: 4, grade: 'A+', gradePoint: 10 },
      { code: 'PH201', name: 'Engineering Physics & Optics', credits: 4, grade: 'A', gradePoint: 9 },
      { code: 'CS201', name: 'Object Oriented Programming', credits: 4, grade: 'O', gradePoint: 10 },
      { code: 'EE201', name: 'Basic Electrical Engineering', credits: 3, grade: 'B+', gradePoint: 8 },
      { code: 'CS202P', name: 'OOP Java Lab', credits: 3, grade: 'A+', gradePoint: 10 },
      { code: 'EN201', name: 'Technical Communication', credits: 3, grade: 'A', gradePoint: 9 }
    ]
  },
  {
    semester: 1,
    sgpa: 8.70,
    cgpa: 8.70,
    totalCredits: 20,
    status: 'PASSED',
    subjects: [
      { code: 'MA101', name: 'Engineering Mathematics I', credits: 4, grade: 'A', gradePoint: 9 },
      { code: 'CH101', name: 'Engineering Chemistry', credits: 4, grade: 'A', gradePoint: 9 },
      { code: 'CS101', name: 'Problem Solving using C', credits: 4, grade: 'A+', gradePoint: 10 },
      { code: 'ME101', name: 'Engineering Graphics & CAD', credits: 3, grade: 'B+', gradePoint: 8 },
      { code: 'CS102P', name: 'Computer Programming Lab', credits: 3, grade: 'O', gradePoint: 10 },
      { code: 'HU101', name: 'Environmental Science', credits: 2, grade: 'A', gradePoint: 9 }
    ]
  }
];

export const WEEKLY_TIMETABLE: TimetableSlot[] = [
  // Monday
  { id: 'tt_1', day: 'Monday', period: 1, time: '09:00 - 10:00', subjectCode: 'CS501', subjectName: 'Design & Analysis of Algorithms', room: 'AB-302', faculty: 'Prof. Sunita Rao', type: 'lecture' },
  { id: 'tt_2', day: 'Monday', period: 2, time: '10:05 - 11:05', subjectCode: 'CS502', subjectName: 'Database Management Systems', room: 'AB-204', faculty: 'Dr. Arvind Verma', type: 'lecture' },
  { id: 'tt_3', day: 'Monday', period: 3, time: '11:15 - 12:15', subjectCode: 'CS504', subjectName: 'Operating Systems & Kernels', room: 'AB-105', faculty: 'Prof. Rajesh Kulkarni', type: 'lecture' },
  { id: 'tt_4', day: 'Monday', period: 4, time: '01:15 - 03:15', subjectCode: 'CS506P', subjectName: 'Cloud & AI Systems Lab', room: 'Turing Lab-1', faculty: 'Prof. Sunita Rao', type: 'lab' },
  { id: 'tt_5', day: 'Monday', period: 5, time: '03:25 - 04:25', subjectCode: 'CS505', subjectName: 'Full-Stack Web Engineering', room: 'Turing-201', faculty: 'Er. Meenakshi S.', type: 'lecture' },

  // Tuesday
  { id: 'tt_6', day: 'Tuesday', period: 1, time: '09:00 - 10:00', subjectCode: 'CS503', subjectName: 'Machine Learning & Deep Learning', room: 'Turing Lab-3', faculty: 'Dr. Neha Mukherjee', type: 'lecture' },
  { id: 'tt_7', day: 'Tuesday', period: 2, time: '10:05 - 11:05', subjectCode: 'CS501', subjectName: 'Design & Analysis of Algorithms', room: 'AB-302', faculty: 'Prof. Sunita Rao', type: 'lecture' },
  { id: 'tt_8', day: 'Tuesday', period: 3, time: '11:15 - 12:15', subjectCode: 'CS505', subjectName: 'Full-Stack Web Engineering', room: 'Turing-201', faculty: 'Er. Meenakshi S.', type: 'lecture' },
  { id: 'tt_9', day: 'Tuesday', period: 4, time: '01:15 - 02:15', subjectCode: 'CS502', subjectName: 'Database Management Systems', room: 'AB-204', faculty: 'Dr. Arvind Verma', type: 'lecture' },
  { id: 'tt_10', day: 'Tuesday', period: 5, time: '02:20 - 03:20', subjectCode: 'CS504', subjectName: 'Operating Systems (Tutorial)', room: 'AB-105', faculty: 'Prof. Rajesh Kulkarni', type: 'tutorial' },

  // Wednesday
  { id: 'tt_11', day: 'Wednesday', period: 1, time: '09:00 - 10:00', subjectCode: 'CS504', subjectName: 'Operating Systems & Kernels', room: 'AB-105', faculty: 'Prof. Rajesh Kulkarni', type: 'lecture' },
  { id: 'tt_12', day: 'Wednesday', period: 2, time: '10:05 - 11:05', subjectCode: 'CS503', subjectName: 'Machine Learning & Deep Learning', room: 'Turing Lab-3', faculty: 'Dr. Neha Mukherjee', type: 'lecture' },
  { id: 'tt_13', day: 'Wednesday', period: 3, time: '11:15 - 12:15', subjectCode: 'CS501', subjectName: 'Design & Analysis of Algorithms', room: 'AB-302', faculty: 'Prof. Sunita Rao', type: 'tutorial' },
  { id: 'tt_14', day: 'Wednesday', period: 4, time: '01:15 - 03:15', subjectCode: 'CS503P', subjectName: 'Machine Learning Lab', room: 'Turing Lab-2', faculty: 'Dr. Neha Mukherjee', type: 'lab' },

  // Thursday
  { id: 'tt_15', day: 'Thursday', period: 1, time: '09:00 - 10:00', subjectCode: 'CS502', subjectName: 'Database Management Systems', room: 'AB-204', faculty: 'Dr. Arvind Verma', type: 'lecture' },
  { id: 'tt_16', day: 'Thursday', period: 2, time: '10:05 - 11:05', subjectCode: 'CS505', subjectName: 'Full-Stack Web Engineering', room: 'Turing-201', faculty: 'Er. Meenakshi S.', type: 'lecture' },
  { id: 'tt_17', day: 'Thursday', period: 3, time: '11:15 - 12:15', subjectCode: 'CS501', subjectName: 'Design & Analysis of Algorithms', room: 'AB-302', faculty: 'Prof. Sunita Rao', type: 'lecture' },
  { id: 'tt_18', day: 'Thursday', period: 4, time: '01:15 - 02:15', subjectCode: 'CS503', subjectName: 'Machine Learning & Deep Learning', room: 'Turing Lab-3', faculty: 'Dr. Neha Mukherjee', type: 'lecture' },
  { id: 'tt_19', day: 'Thursday', period: 5, time: '02:20 - 04:20', subjectCode: 'LIB', subjectName: 'Library & Research Hour', room: 'Central Library', faculty: 'Dr. K. Raman', type: 'tutorial' },

  // Friday
  { id: 'tt_20', day: 'Friday', period: 1, time: '09:00 - 10:00', subjectCode: 'CS503', subjectName: 'Machine Learning & Deep Learning', room: 'Turing Lab-3', faculty: 'Dr. Neha Mukherjee', type: 'lecture' },
  { id: 'tt_21', day: 'Friday', period: 2, time: '10:05 - 11:05', subjectCode: 'CS504', subjectName: 'Operating Systems & Kernels', room: 'AB-105', faculty: 'Prof. Rajesh Kulkarni', type: 'lecture' },
  { id: 'tt_22', day: 'Friday', period: 3, time: '11:15 - 12:15', subjectCode: 'CS502', subjectName: 'Database Systems (SQL Practice)', room: 'AB-204', faculty: 'Dr. Arvind Verma', type: 'tutorial' },
  { id: 'tt_23', day: 'Friday', period: 4, time: '01:15 - 03:15', subjectCode: 'PROJ', subjectName: 'Hackathon & Capstone Studio', room: 'Turing AI Hub', faculty: 'Prof. Sunita Rao', type: 'lab' },
  { id: 'tt_24', day: 'Friday', period: 5, time: '03:25 - 04:30', subjectCode: 'COUN', subjectName: 'Mentorship & Academic Counseling', room: 'AB-302', faculty: 'Faculty Advisors', type: 'tutorial' }
];

export const EXAM_SCHEDULE: ExamScheduleItem[] = [
  {
    id: 'ex_1',
    subjectCode: 'CS501',
    subjectName: 'Design & Analysis of Algorithms',
    date: '2026-11-04',
    time: '10:00 AM - 01:00 PM',
    duration: '3 Hours',
    room: 'Examination Hall A (AB-401)',
    hallTicketRequired: true,
    syllabus: 'Modules 1-5: Asymptotic Analysis, Recurrences, Greedy, Dynamic Programming, NP-Completeness',
    seatNumber: 'A-42'
  },
  {
    id: 'ex_2',
    subjectCode: 'CS502',
    subjectName: 'Database Management Systems',
    date: '2026-11-07',
    time: '10:00 AM - 01:00 PM',
    duration: '3 Hours',
    room: 'Examination Hall B (AB-402)',
    hallTicketRequired: true,
    syllabus: 'Modules 1-5: ER Modeling, Relational Algebra, SQL, Normalization (1NF to BCNF), Concurrency',
    seatNumber: 'B-19'
  },
  {
    id: 'ex_3',
    subjectCode: 'CS503',
    subjectName: 'Machine Learning & Deep Learning',
    date: '2026-11-10',
    time: '10:00 AM - 01:00 PM',
    duration: '3 Hours',
    room: 'Auditorium Block - West Wing',
    hallTicketRequired: true,
    syllabus: 'Modules 1-5: Regression, SVM, Decision Trees, Ensembles, Neural Networks & CNNs',
    seatNumber: 'AUD-88'
  },
  {
    id: 'ex_4',
    subjectCode: 'CS504',
    subjectName: 'Operating Systems & Kernels',
    date: '2026-11-13',
    time: '10:00 AM - 01:00 PM',
    duration: '3 Hours',
    room: 'Examination Hall A (AB-401)',
    hallTicketRequired: true,
    syllabus: 'Modules 1-5: Processes, Threads, CPU Scheduling, Synchronization, Memory Management, File Systems',
    seatNumber: 'A-42'
  },
  {
    id: 'ex_5',
    subjectCode: 'CS505',
    subjectName: 'Full-Stack Web Engineering',
    date: '2026-11-16',
    time: '10:00 AM - 01:00 PM',
    duration: '3 Hours',
    room: 'Turing Computer Center - Lab 1',
    hallTicketRequired: true,
    syllabus: 'Modules 1-4: Modern Frontend Frameworks, Node/Express, REST/GraphQL APIs, Security & Cloud Deploy',
    seatNumber: 'TC-14'
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg_1',
    subjectCode: 'CS503',
    subjectName: 'Machine Learning & Deep Learning',
    title: 'Assignment 3: Neural Network Backprop & CNN Classifier',
    description: 'Implement a 3-layer neural network from scratch using NumPy and evaluate accuracy on CIFAR-10 subset with confusion matrix.',
    assignedDate: '2026-10-08',
    dueDate: '2026-10-18',
    maxMarks: 10,
    status: 'pending'
  },
  {
    id: 'asg_2',
    subjectCode: 'CS501',
    subjectName: 'Design & Analysis of Algorithms',
    title: 'Problem Set 4: Bellman-Ford & Maximum Bipartite Matching',
    description: 'Solve the network routing optimization problem using Ford-Fulkerson algorithm and compare time complexities with Edmond-Karp.',
    assignedDate: '2026-10-05',
    dueDate: '2026-10-15',
    maxMarks: 10,
    status: 'pending'
  },
  {
    id: 'asg_3',
    subjectCode: 'CS502',
    subjectName: 'Database Management Systems',
    title: 'Lab Mini Project: Schema Design & 3NF Normalization',
    description: 'Hospital patient records system schema with SQL queries handling concurrency transactions with ACID isolation levels.',
    assignedDate: '2026-09-24',
    dueDate: '2026-10-06',
    maxMarks: 10,
    status: 'graded',
    submittedText: 'Complete SQL scripts with PostgreSQL transaction logs and ER diagrams submitted via GitHub repository.',
    submittedAt: '2026-10-05 18:30',
    obtainedMarks: 9.5,
    feedback: 'Excellent normalization proofs. Clean indexing strategies used for foreign keys.'
  },
  {
    id: 'asg_4',
    subjectCode: 'CS505',
    subjectName: 'Full-Stack Web Engineering',
    title: 'Sprint 2: Authentication & Role-Based Middleware',
    description: 'Build a secure Node/Express backend with JWT token refresh cookies and role authorization gates for students and faculty.',
    assignedDate: '2026-09-28',
    dueDate: '2026-10-10',
    maxMarks: 10,
    status: 'submitted',
    submittedText: 'Repository linked: https://github.com/aarav-sharma/campus-auth-microservice with Swagger docs.',
    submittedAt: '2026-10-09 21:15'
  }
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'not_1',
    title: 'Mandatory 75% Attendance Requirement for Semester End Exams',
    content: 'Students with attendance below 75% in any subject will be placed in the condonation list and must submit formal medical justification by Oct 25, 2026.',
    category: 'Attendance',
    postedBy: 'Dean of Academic Affairs',
    date: '2026-10-13',
    priority: 'urgent',
    targetRoles: ['student', 'faculty', 'parent'],
    read: false
  },
  {
    id: 'not_2',
    title: 'Mid-Semester Examination II Timetable Published',
    content: 'Mid-term examinations commence from November 4, 2026. Hall tickets can be verified directly on your student portal.',
    category: 'Exam',
    postedBy: 'Controller of Examinations',
    date: '2026-10-12',
    priority: 'high',
    targetRoles: ['student', 'faculty', 'parent'],
    read: false
  },
  {
    id: 'not_3',
    title: 'Hackathon 2026: Campus AI Innovation Challenge',
    content: 'Registration is live for Hackathon 2026! Teams of 2-4 can register until October 22. Total prize pool ₹1,50,000 sponsored by premier tech partners.',
    category: 'Event',
    postedBy: 'AI & Innovation Cell',
    date: '2026-10-10',
    priority: 'normal',
    targetRoles: ['student', 'faculty'],
    read: true
  },
  {
    id: 'not_4',
    title: 'Odd Semester Tuition Fee Installment 2 Reminder',
    content: 'Final date for payment of balance tuition and laboratory fees without late fine is October 31, 2026. Online receipt generation is instant.',
    category: 'Fees',
    postedBy: 'Accounts Section',
    date: '2026-10-08',
    priority: 'high',
    targetRoles: ['parent', 'student'],
    read: true
  },
  {
    id: 'not_5',
    title: 'Library Extended Hours During Examination Month',
    content: 'Central Library will remain open 24/7 starting October 25 through November 20. Study rooms in Turing Wing are also available for group discussion.',
    category: 'Academic',
    postedBy: 'Chief Librarian',
    date: '2026-10-05',
    priority: 'normal',
    targetRoles: ['student', 'faculty'],
    read: true
  }
];

export const INITIAL_LEAVES: LeaveApplication[] = [
  {
    id: 'lv_1',
    studentId: 'usr_stu_1',
    studentName: 'Aarav Sharma',
    rollNumber: 'CS2023041',
    department: 'Computer Science & Engineering',
    startDate: '2026-10-11',
    endDate: '2026-10-11',
    totalDays: 1,
    type: 'Medical',
    reason: 'Severe viral fever and clinical consultation at City Hospital.',
    status: 'approved',
    appliedAt: '2026-10-10 19:40',
    reviewedBy: 'Prof. Sunita Rao',
    reviewNotes: 'Medical certificate verified. 1 day medical leave granted.',
    reviewedAt: '2026-10-11 09:15'
  },
  {
    id: 'lv_2',
    studentId: 'usr_stu_1',
    studentName: 'Aarav Sharma',
    rollNumber: 'CS2023041',
    department: 'Computer Science & Engineering',
    startDate: '2026-10-23',
    endDate: '2026-10-24',
    totalDays: 2,
    type: 'Academic',
    reason: 'Representing college at Inter-University ACM-ICPC Regional Invitational Hackathon.',
    status: 'pending',
    appliedAt: '2026-10-13 14:20'
  }
];

export const INITIAL_FEES: FeeRecord = {
  studentId: 'usr_stu_1',
  studentName: 'Aarav Sharma',
  rollNumber: 'CS2023041',
  semester: 5,
  academicYear: '2026-2027',
  tuitionFee: 65000,
  labFee: 12000,
  libraryFee: 4000,
  examFee: 3500,
  totalFee: 84500,
  paidAmount: 60000,
  dueAmount: 24500,
  dueDate: '2026-10-31',
  status: 'Partial',
  transactions: [
    {
      id: 'tx_101',
      amount: 40000,
      date: '2026-07-28',
      method: 'Net Banking (HDFC Bank)',
      receiptNumber: 'REC-2026-8819',
      status: 'Success'
    },
    {
      id: 'tx_102',
      amount: 20000,
      date: '2026-09-02',
      method: 'UPI (Google Pay)',
      receiptNumber: 'REC-2026-9430',
      status: 'Success'
    }
  ]
};

export const INITIAL_CAMPUS_ROOMS: CampusRoom[] = [
  {
    id: 'rm_1',
    roomNumber: 'AB-302',
    name: 'Lecture Hall 302',
    building: 'Main Academic Block',
    floor: 3,
    type: 'Classroom',
    capacity: 70,
    isOccupied: true,
    currentActivity: 'CS501: Design & Analysis of Algorithms',
    currentFaculty: 'Prof. Sunita Rao',
    nextFreeTime: '11:05 AM',
    features: ['Smart Interactive Display', 'Air Conditioned', 'Audio System', 'High-Speed Wi-Fi']
  },
  {
    id: 'rm_2',
    roomNumber: 'AB-204',
    name: 'Smart Seminar Room 204',
    building: 'Main Academic Block',
    floor: 2,
    type: 'Classroom',
    capacity: 65,
    isOccupied: false,
    nextFreeTime: 'Available all day until 2:00 PM',
    features: ['Dual Laser Projectors', 'Recording Camera', 'Ergonomic Tiered Seating']
  },
  {
    id: 'rm_3',
    roomNumber: 'AB-105',
    name: 'Systems Classroom 105',
    building: 'Main Academic Block',
    floor: 1,
    type: 'Classroom',
    capacity: 60,
    isOccupied: true,
    currentActivity: 'CS504: Operating Systems',
    currentFaculty: 'Prof. Rajesh Kulkarni',
    nextFreeTime: '12:15 PM',
    features: ['Whiteboard & Digital Podium', 'LAN ports for every desk']
  },
  {
    id: 'rm_4',
    roomNumber: 'Turing Lab-1',
    name: 'Cloud Computing & GPU Cluster Lab',
    building: 'Turing AI & Computing Hub',
    floor: 1,
    type: 'Lab',
    capacity: 45,
    isOccupied: true,
    currentActivity: 'CS506P: Cloud & AI Systems Lab',
    currentFaculty: 'Prof. Sunita Rao',
    nextFreeTime: '03:15 PM',
    features: ['40x NVIDIA RTX Workstations', 'Gigabit Fiber', 'Linux OS & CUDA 12']
  },
  {
    id: 'rm_5',
    roomNumber: 'Turing Lab-2',
    name: 'Advanced Data Science Studio',
    building: 'Turing AI & Computing Hub',
    floor: 2,
    type: 'Lab',
    capacity: 40,
    isOccupied: false,
    nextFreeTime: 'Open for student project work',
    features: ['High-Performance Xeon Nodes', 'Dual Monitors', 'GitLab Server Access']
  },
  {
    id: 'rm_6',
    roomNumber: 'Turing Lab-3',
    name: 'Machine Learning & Robotics Lab',
    building: 'Turing AI & Computing Hub',
    floor: 3,
    type: 'Lab',
    capacity: 35,
    isOccupied: false,
    nextFreeTime: 'Free until 01:15 PM',
    features: ['Robotics Test Track', 'Raspberry Pi 5 kits', 'IoT Sensor racks']
  },
  {
    id: 'rm_7',
    roomNumber: 'LIB-G01',
    name: 'Central Silent Study Hall',
    building: 'Central Library',
    floor: 0,
    type: 'Classroom',
    capacity: 180,
    isOccupied: false,
    nextFreeTime: '24/7 Open',
    features: ['Individual Study Pods', 'Power Outlets', 'Noise-Dampening Acoustic Ceiling']
  },
  {
    id: 'rm_8',
    roomNumber: 'LIB-102',
    name: 'Digital Periodicals & Discussion Pod',
    building: 'Central Library',
    floor: 1,
    type: 'Conference Room',
    capacity: 25,
    isOccupied: true,
    currentActivity: 'IEEE Student Chapter Meeting',
    nextFreeTime: '12:30 PM',
    features: ['Conference TV', 'Whiteboard Wall', 'Digital Catalog Terminals']
  },
  {
    id: 'rm_9',
    roomNumber: 'AUD-Main',
    name: 'Grand Auditorium',
    building: 'Auditorium',
    floor: 1,
    type: 'Auditorium',
    capacity: 850,
    isOccupied: false,
    nextFreeTime: 'Available for booked college events',
    features: ['Bose Line-Array Audio', 'Automated Stage Lighting', 'Green Rooms']
  },
  {
    id: 'rm_10',
    roomNumber: 'ADM-101',
    name: 'Dean & Academic Council Chamber',
    building: 'Administrative Wing',
    floor: 1,
    type: 'Conference Room',
    capacity: 30,
    isOccupied: true,
    currentActivity: 'Examination Board Meeting',
    currentFaculty: 'Dr. K. Raman',
    nextFreeTime: '02:00 PM',
    features: ['Video Conferencing System', 'Encrypted Document Display']
  }
];

export const INITIAL_STUDY_PLAN: DayStudyPlan[] = [
  {
    dayName: 'Day 1 (Today)',
    date: '2026-10-14',
    focusGoal: 'Conquer Machine Learning backpropagation & complete Algorithms Problem Set',
    slots: [
      {
        time: '05:30 PM - 06:30 PM',
        subject: 'Machine Learning',
        topic: 'Loss Gradients & Weight Updates in 3-layer MLP',
        activity: 'Solve derivative equations & verify gradient descent formulas',
        durationMins: 60,
        difficulty: 'Challenging',
        completed: false
      },
      {
        time: '06:45 PM - 07:45 PM',
        subject: 'Machine Learning Lab',
        topic: 'PyTorch/NumPy CIFAR-10 data loader implementation',
        activity: 'Code assignment 3 script and log initial training epochs',
        durationMins: 60,
        difficulty: 'Medium',
        completed: false
      },
      {
        time: '08:30 PM - 09:30 PM',
        subject: 'Algorithms (CS501)',
        topic: 'Bellman-Ford Algorithm with negative cycles',
        activity: 'Dry run 2 textbook graphs and compute relaxation steps',
        durationMins: 60,
        difficulty: 'Medium',
        completed: true
      }
    ]
  },
  {
    dayName: 'Day 2 (Tomorrow)',
    date: '2026-10-15',
    focusGoal: 'Deep-dive Database concurrency & SQL Isolation levels',
    slots: [
      {
        time: '05:00 PM - 06:15 PM',
        subject: 'DBMS (CS502)',
        topic: '2-Phase Locking & Serializability precedence graphs',
        activity: 'Solve 4 previous year university examination questions',
        durationMins: 75,
        difficulty: 'Medium',
        completed: false
      },
      {
        time: '06:30 PM - 07:30 PM',
        subject: 'Operating Systems (CS504)',
        topic: 'Page replacement algorithms (LRU, Optimal, FIFO)',
        activity: 'Calculate page fault ratios on given reference strings',
        durationMins: 60,
        difficulty: 'Easy',
        completed: false
      },
      {
        time: '08:15 PM - 09:30 PM',
        subject: 'Full-Stack Web (CS505)',
        topic: 'JWT Refresh Token rotation & CSRF protection',
        activity: 'Review code middleware & test with Postman collections',
        durationMins: 75,
        difficulty: 'Medium',
        completed: false
      }
    ]
  },
  {
    dayName: 'Day 3',
    date: '2026-10-16',
    focusGoal: 'Attendance review & comprehensive revision test',
    slots: [
      {
        time: '05:30 PM - 07:00 PM',
        subject: 'Machine Learning',
        topic: 'Convolutional feature maps, pooling & stride math',
        activity: 'Create flashcards & summarize lecture notes to recover low attendance gap',
        durationMins: 90,
        difficulty: 'Challenging',
        completed: false
      },
      {
        time: '07:30 PM - 09:00 PM',
        subject: 'Algorithms',
        topic: 'Dynamic Programming on Trees & Strings (Edit Distance)',
        activity: 'Practice LeetCode / Codeforces dynamic programming problems',
        durationMins: 90,
        difficulty: 'Challenging',
        completed: false
      }
    ]
  }
];

export const CAMPUS_BUILDINGS = [
  {
    id: 'mab',
    name: 'Main Academic Block',
    code: 'AB',
    floors: 4,
    x: 200,
    y: 140,
    width: 220,
    height: 140,
    color: '#2563eb',
    desc: 'Departments of Computer Science, IT, Electronics, Dean Office & Lecture Theatres'
  },
  {
    id: 'tur',
    name: 'Turing AI & Computing Hub',
    code: 'TH',
    floors: 3,
    x: 480,
    y: 120,
    width: 200,
    height: 150,
    color: '#0284c7',
    desc: 'High-performance AI Clusters, Cloud Computing Labs, Hackathon Studio & VR Lab'
  },
  {
    id: 'lib',
    name: 'Central Library',
    code: 'LIB',
    floors: 3,
    x: 200,
    y: 330,
    width: 170,
    height: 130,
    color: '#0d9488',
    desc: 'Over 120,000 volumes, 24/7 Digital Research Commons, Periodicals & Quiet Study Pods'
  },
  {
    id: 'ram',
    name: 'Raman Science Complex',
    code: 'SC',
    floors: 4,
    x: 430,
    y: 330,
    width: 190,
    height: 130,
    color: '#4f46e5',
    desc: 'Advanced Physics, Chemistry, Nanotech Labs and Mechanical Prototyping Workshop'
  },
  {
    id: 'aud',
    name: 'Grand Auditorium',
    code: 'AUD',
    floors: 2,
    x: 680,
    y: 320,
    width: 170,
    height: 140,
    color: '#d97706',
    desc: '850-seater acoustic auditorium for convocations, tech symposiums and cultural fests'
  },
  {
    id: 'adm',
    name: 'Administrative Wing',
    code: 'ADM',
    floors: 2,
    x: 60,
    y: 220,
    width: 100,
    height: 180,
    color: '#475569',
    desc: 'Registrar, Examination Controller, Student Welfare, Accounts & Fee Cashier'
  },
  {
    id: 'spo',
    name: 'Sports Complex & Arena',
    code: 'SPT',
    floors: 1,
    x: 60,
    y: 450,
    width: 260,
    height: 120,
    color: '#16a34a',
    desc: 'Indoor Badminton, Olympic Swimming Pool, Gymnasium and Outdoor Athletic Track'
  },
  {
    id: 'caf',
    name: 'Campus Food Court & Hub',
    code: 'CAF',
    floors: 2,
    x: 370,
    y: 500,
    width: 210,
    height: 100,
    color: '#ea580c',
    desc: 'Multi-cuisine student cafeteria, CCD kiosk, juice bar and student union lounge'
  }
];
