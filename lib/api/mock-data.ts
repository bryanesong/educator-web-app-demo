/**
 * Mock Data Service for Demo Accounts
 * 
 * This service provides realistic mock data for demo teacher accounts
 * to showcase the platform without exposing real student data.
 */

export interface MockChild {
  id: number;
  name: string;
  age: number;
  profile_icon: number;
  parent: number;
  language_preference?: string;
  created_at?: string;
}

export interface MockConversation {
  id: number;
  child: number;
  context: string;
  length: number;
  script_mode: boolean;
  video_discussion: boolean;
  video_id?: string | null;
  video_title?: string | null;
  start_date_time: string;
  last_date_time: string;
  total_user_tokens: number;
  total_ai_tokens: number;
}

export interface MockConversationWithDetails extends MockConversation {
  child_name: string;
  character_name: string;
  character: string;
  duration_minutes?: number;
  mood_score?: number;
  topics_discussed?: string[];
}

export interface MockCharacterStats {
  character: string;
  character_id: string;
  conversations: number;
  avgMood: number;
  favoriteTopic: string;
}

// Mock children data
export const mockChildren: MockChild[] = [
  {
    id: 1,
    name: 'Emma Wilson',
    age: 7,
    profile_icon: 1,
    parent: 1,
    language_preference: 'en',
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    name: 'Liam Johnson',
    age: 8,
    profile_icon: 2,
    parent: 1,
    language_preference: 'en',
    created_at: '2024-02-20T14:30:00Z'
  },
  {
    id: 3,
    name: 'Sofia Garcia',
    age: 6,
    profile_icon: 3,
    parent: 2,
    language_preference: 'es',
    created_at: '2024-03-10T09:15:00Z'
  },
  {
    id: 4,
    name: 'Noah Brown',
    age: 9,
    profile_icon: 4,
    parent: 2,
    language_preference: 'en',
    created_at: '2024-04-05T16:45:00Z'
  },
  {
    id: 5,
    name: 'Ava Martinez',
    age: 7,
    profile_icon: 5,
    parent: 3,
    language_preference: 'es',
    created_at: '2024-05-12T11:20:00Z'
  }
];

// Mock conversations with realistic recent dates
export const mockConversations: MockConversationWithDetails[] = [
  {
    id: 1,
    child: 1,
    child_name: 'Emma Wilson',
    character: 'koko-panda',
    character_name: 'Koko the Panda',
    context: 'koko-panda friendship emotional support',
    length: 15,
    script_mode: false,
    video_discussion: false,
    start_date_time: '2025-08-15T10:30:00Z',
    last_date_time: '2025-08-15T10:45:00Z',
    total_user_tokens: 150,
    total_ai_tokens: 200,
    duration_minutes: 15,
    mood_score: 8.5,
    topics_discussed: ['friendship', 'sharing', 'emotions']
  },
  {
    id: 2,
    child: 2,
    child_name: 'Liam Johnson',
    character: 'mochi-cat',
    character_name: 'Mochi the Cat',
    context: 'mochi-cat adventure curiosity exploration',
    length: 12,
    script_mode: false,
    video_discussion: false,
    start_date_time: '2025-08-15T09:15:00Z',
    last_date_time: '2025-08-15T09:27:00Z',
    total_user_tokens: 120,
    total_ai_tokens: 180,
    duration_minutes: 12,
    mood_score: 7.8,
    topics_discussed: ['adventure', 'curiosity', 'exploration']
  },
  {
    id: 3,
    child: 3,
    child_name: 'Sofia Garcia',
    character: 'charlie-dog',
    character_name: 'Charlie the Dog',
    context: 'charlie-dog friendship loyalty playing',
    length: 18,
    script_mode: false,
    video_discussion: false,
    start_date_time: '2025-08-15T11:45:00Z',
    last_date_time: '2025-08-15T12:03:00Z',
    total_user_tokens: 180,
    total_ai_tokens: 220,
    duration_minutes: 18,
    mood_score: 9.1,
    topics_discussed: ['friendship', 'loyalty', 'playing']
  },
  {
    id: 4,
    child: 4,
    child_name: 'Noah Brown',
    character: 'ravi-fox',
    character_name: 'Ravi the Fox',
    context: 'ravi-fox critical thinking problem solving',
    length: 8,
    script_mode: false,
    video_discussion: false,
    start_date_time: '2025-08-15T14:20:00Z',
    last_date_time: '2025-08-15T14:28:00Z',
    total_user_tokens: 90,
    total_ai_tokens: 140,
    duration_minutes: 8,
    mood_score: 7.2,
    topics_discussed: ['critical thinking', 'problem solving', 'different perspectives']
  },
  {
    id: 5,
    child: 5,
    child_name: 'Ava Martinez',
    character: 'nova-owl',
    character_name: 'Nova the Owl',
    context: 'nova-owl academic learning science',
    length: 14,
    script_mode: false,
    video_discussion: false,
    start_date_time: '2025-08-15T13:15:00Z',
    last_date_time: '2025-08-15T13:29:00Z',
    total_user_tokens: 140,
    total_ai_tokens: 190,
    duration_minutes: 14,
    mood_score: 8.7,
    topics_discussed: ['academic learning', 'science', 'discovery']
  },
  {
    id: 6,
    child: 1,
    child_name: 'Emma Wilson',
    character: 'dr-clover-goat',
    character_name: 'Dr. Clover the Goat',
    context: 'dr-clover-goat emotional guidance validation',
    length: 16,
    script_mode: false,
    video_discussion: false,
    start_date_time: '2025-08-14T15:30:00Z',
    last_date_time: '2025-08-14T15:46:00Z',
    total_user_tokens: 160,
    total_ai_tokens: 210,
    duration_minutes: 16,
    mood_score: 8.9,
    topics_discussed: ['emotional guidance', 'validation', 'feelings']
  },
  {
    id: 7,
    child: 2,
    child_name: 'Liam Johnson',
    character: 'zenzo-sloth',
    character_name: 'Zenzo the Sloth',
    context: 'zenzo-sloth mindfulness patience breathing',
    length: 10,
    script_mode: false,
    video_discussion: false,
    start_date_time: '2025-08-14T16:45:00Z',
    last_date_time: '2025-08-14T16:55:00Z',
    total_user_tokens: 100,
    total_ai_tokens: 150,
    duration_minutes: 10,
    mood_score: 9.2,
    topics_discussed: ['mindfulness', 'patience', 'breathing']
  },
  {
    id: 8,
    child: 3,
    child_name: 'Sofia Garcia',
    character: 'koko-panda',
    character_name: 'Koko the Panda',
    context: 'koko-panda emotional support feelings',
    length: 13,
    script_mode: false,
    video_discussion: false,
    start_date_time: '2025-08-14T08:20:00Z',
    last_date_time: '2025-08-14T08:33:00Z',
    total_user_tokens: 130,
    total_ai_tokens: 170,
    duration_minutes: 13,
    mood_score: 8.3,
    topics_discussed: ['emotional support', 'feelings', 'comfort']
  }
];

// Mock character statistics
export const mockCharacterStats: MockCharacterStats[] = [
  {
    character: 'Koko the Panda',
    character_id: 'koko-panda',
    conversations: 145,
    avgMood: 8.2,
    favoriteTopic: 'Emotional Support'
  },
  {
    character: 'Mochi the Cat',
    character_id: 'mochi-cat',
    conversations: 98,
    avgMood: 7.8,
    favoriteTopic: 'Adventure Learning'
  },
  {
    character: 'Charlie the Dog',
    character_id: 'charlie-dog',
    conversations: 132,
    avgMood: 8.5,
    favoriteTopic: 'Social Skills'
  },
  {
    character: 'Ravi the Fox',
    character_id: 'ravi-fox',
    conversations: 89,
    avgMood: 8.0,
    favoriteTopic: 'Critical Thinking'
  },
  {
    character: 'Nova the Owl',
    character_id: 'nova-owl',
    conversations: 76,
    avgMood: 8.3,
    favoriteTopic: 'Academic Learning'
  },
  {
    character: 'Dr. Clover the Goat',
    character_id: 'dr-clover-goat',
    conversations: 67,
    avgMood: 8.6,
    favoriteTopic: 'Emotional Counseling'
  },
  {
    character: 'Zenzo the Sloth',
    character_id: 'zenzo-sloth',
    conversations: 43,
    avgMood: 9.1,
    favoriteTopic: 'Mindfulness'
  }
];

// Mock dashboard statistics
export const mockDashboardStats = {
  totalConversations: 650,
  avgDuration: 12.4,
  avgMoodScore: 8.3,
  activeStudents: 18,
  totalChildren: 28
};

// Mock data API functions
export class MockDataService {
  static async getChildren(): Promise<{ children: MockChild[]; count: number }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      children: mockChildren,
      count: mockChildren.length
    };
  }

  static async getConversationsWithAnalytics(params?: {
    page?: number;
    page_size?: number;
    ordering?: string;
  }): Promise<{
    conversations: MockConversationWithDetails[];
    pagination: {
      count: number;
      next?: string;
      previous?: string;
      page: number;
      page_size: number;
      total_pages: number;
    };
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const pageSize = params?.page_size || 20;
    const page = params?.page || 1;
    
    // Sort conversations (most recent first by default)
    let sortedConversations = [...mockConversations];
    if (params?.ordering?.includes('-start_date_time') || !params?.ordering) {
      sortedConversations.sort((a, b) => 
        new Date(b.start_date_time).getTime() - new Date(a.start_date_time).getTime()
      );
    }
    
    // Pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedConversations = sortedConversations.slice(startIndex, endIndex);
    
    const totalPages = Math.ceil(sortedConversations.length / pageSize);
    
    return {
      conversations: paginatedConversations,
      pagination: {
        count: sortedConversations.length,
        next: page < totalPages ? `page=${page + 1}` : undefined,
        previous: page > 1 ? `page=${page - 1}` : undefined,
        page,
        page_size: pageSize,
        total_pages: totalPages
      }
    };
  }

  static async getCharacterStats(): Promise<MockCharacterStats[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return mockCharacterStats;
  }

  static async getDashboardStats(): Promise<typeof mockDashboardStats> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockDashboardStats;
  }
}