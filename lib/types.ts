export interface User {
  id: string;
  email: string;
  name: string;
  role: 'teacher' | 'admin' | 'district_admin';
  school?: string;
  district?: string;
}

export interface Student {
  id: string;
  name: string;
  age: number;
  grade: string;
  profileIcon?: string;
  parentEmail: string;
  lastActive?: Date;
  moodScore?: number;
  engagementLevel?: number;
}

export interface Conversation {
  id: string;
  studentId: string;
  characterName: string;
  timestamp: Date;
  duration: number;
  moodScore?: number;
  summary?: string;
  messages: Message[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Attendance {
  id: string;
  studentId: string;
  date: Date;
  checkIn?: Date;
  checkOut?: Date;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  assignedTo: string[]; // student IDs
  completedBy: string[]; // student IDs
  type: 'reading' | 'social_scenario' | 'conversation' | 'custom';
}

export interface Analytics {
  totalStudents: number;
  activeToday: number;
  averageMoodScore: number;
  averageEngagement: number;
  attendanceRate: number;
  assignmentCompletionRate: number;
}

export interface MoodTrend {
  date: string;
  averageMood: number;
  studentCount: number;
}

export interface SchoolSettings {
  id: string;
  schoolName: string;
  district: string;
  timezone: string;
  academicYear: string;
  features: {
    attendance: boolean;
    assignments: boolean;
    parentCommunication: boolean;
    analytics: boolean;
  };
}