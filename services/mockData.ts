import { User, UserStatus } from '../types';

export const INITIAL_USERS: User[] = [
  {
    user_id: '1',
    name: 'Sarah Jenks',
    email: 'sarah.j@example.com',
    contact_number: '+1 (555) 0123-4567',
    job_title: 'Senior UX Designer',
    experience: '5 years',
    status: UserStatus.PENDING,
    is_premium: false
  },
  {
    user_id: '2',
    name: 'Michael Chen',
    email: 'm.chen@techflow.io',
    contact_number: '+1 (555) 9876-5432',
    job_title: 'Full Stack Developer',
    experience: '3 years',
    status: UserStatus.APPROVED,
    is_premium: true
  },
  {
    user_id: '3',
    name: 'Priya Patel',
    email: 'priya.workspace@gmail.com',
    contact_number: '+1 (555) 4567-8901',
    job_title: 'Product Manager',
    experience: '7 years',
    status: UserStatus.APPROVED,
    is_premium: false
  },
  {
    user_id: '4',
    name: 'James Wilson',
    email: 'j.wilson@creative.net',
    contact_number: '+1 (555) 2345-6789',
    job_title: 'Marketing Director',
    experience: '10 years',
    status: UserStatus.REJECTED,
    rejection_reason: 'Incomplete portfolio documentation',
    is_premium: false,
  },
  {
    user_id: '5',
    name: 'David Kim',
    email: 'kim.david@proton.me',
    contact_number: '+1 (555) 7890-1234',
    job_title: 'Data Scientist',
    experience: '2 years',
    status: UserStatus.PENDING,
    is_premium: false
  }
];