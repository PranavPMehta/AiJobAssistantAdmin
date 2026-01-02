import { User, UserStatus } from '../types';

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
  {
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
  }
];