import { User, UserStatus, Job, JobStatus } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'u_1',
    name: 'Sarah Connor',
    email: 'sarah@example.com',
    mobile: '+1 555-0101',
    jobPosition: 'Frontend Engineer',
    signupDate: '2023-10-24T10:00:00Z',
    status: UserStatus.PENDING,
    password: 'password123',
    isPremium: false
  },
  /* {
    id: 'u_2',
    name: 'John Doe',
    email: 'john.doe@example.com',
    mobile: '+1 555-0102',
    jobPosition: 'Backend Developer',
    signupDate: '2023-10-23T14:30:00Z',
    status: UserStatus.APPROVED,
    password: 'securePass!',
    isPremium: true
  },
  {
    id: 'u_3',
    name: 'Emily Chen',
    email: 'emily.c@example.com',
    mobile: '+1 555-0103',
    jobPosition: 'Product Manager',
    signupDate: '2023-10-22T09:15:00Z',
    status: UserStatus.REJECTED,
    rejectionReason: 'Incomplete portfolio',
    password: 'productRocks',
    isPremium: false
  },
  {
    id: 'u_4',
    name: 'Michael Smith',
    email: 'mike.smith@example.com',
    mobile: '+1 555-0104',
    jobPosition: 'DevOps Engineer',
    signupDate: '2023-10-25T11:20:00Z',
    status: UserStatus.PENDING,
    password: 'devopsIsLife',
    isPremium: false
  },
  {
    id: 'u_5',
    name: 'Alice Johnson',
    email: 'alice.j@example.com',
    mobile: '+1 555-0105',
    jobPosition: 'UI/UX Designer',
    signupDate: '2023-10-20T16:45:00Z',
    status: UserStatus.DEACTIVATED,
    password: 'design123',
    isPremium: true
  } */
];

export const INITIAL_JOBS: Job[] = [
  {
    id: 'j_1',
    title: 'Senior Software Engineer',
    company: 'Google',
    location: 'Mountain View, CA',
    jobType: 'Full-time',
    salary: '$180,000',
    experience: '5+ years',
    skills: ['React', 'TypeScript', 'Node.js'],
    website: 'https://careers.google.com',
    status: JobStatus.APPLIED,
    insights: 'Strong focus on scalability and system design.',
    proofs: ['applied_screenshot.png'],
    resume: 'resume_v2.pdf',
    connections: [
      { name: 'David Miller', title: 'Eng Manager', contact: 'david@google.com' }
    ],
    remarks: 'Application submitted on portal. Waiting for recruiter response.',
    createdAt: '2023-11-01T09:00:00Z'
  },
  /* {
    id: 'j_2',
    title: 'Frontend Developer',
    company: 'Meta',
    location: 'Remote',
    jobType: 'Full-time',
    salary: '$165,000',
    experience: '3-5 years',
    skills: ['React', 'GraphQL', 'Relay'],
    website: 'https://metacareers.com',
    status: JobStatus.SAVED,
    insights: 'Working on internal tools for ads manager.',
    proofs: [],
    resume: 'resume_v2.pdf',
    connections: [],
    remarks: 'Found via LinkedIn. Seems like a good fit.',
    createdAt: '2023-11-05T14:30:00Z'
  },
  {
    id: 'j_3',
    title: 'Product Designer',
    company: 'Airbnb',
    location: 'San Francisco, CA',
    jobType: 'Contract',
    salary: '$120/hr',
    experience: '4+ years',
    skills: ['Figma', 'Prototyping', 'User Research'],
    website: 'https://airbnb.com/careers',
    status: JobStatus.INTERVIEW,
    insights: 'User-centric culture. High design bar.',
    proofs: ['interview_invite.png'],
    resume: 'portfolio_link.txt',
    connections: [
      { name: 'Sarah Wilson', title: 'Design Lead', contact: 'linkedin.com/in/swilson' }
    ],
    remarks: 'Initial screening done. Technical interview scheduled for Friday.',
    createdAt: '2023-11-10T11:00:00Z'
  } */
];