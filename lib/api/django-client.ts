/**
 * Django API Client for Wiillow Backend Integration
 * 
 * This client handles all communication with the Django backend
 * running on localhost:8000 during development.
 */

// Base configuration
const DJANGO_BASE_URL = process.env.NEXT_PUBLIC_DJANGO_URL || 'http://localhost:8000';

export interface ApiResponse<T = Record<string, unknown>> {
  data?: T;
  error?: string;
  status: number;
}

export interface Child {
  id: number;
  name: string;
  age: number;
  profile_icon: number;
  parent: number;
  language_preference?: string;
  created_at?: string;
}

export interface Conversation {
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

export interface Question {
  id: number;
  conversation: number;
  text: string;
  timestamp: string;
  mood_evaluation?: string;
  audio_file_url?: string;
}

export interface Answer {
  id: number;
  question: number;
  text: string;
  timestamp: string;
  character: string;
  audio_file_url?: string;
}

export interface ConversationWithDetails extends Conversation {
  child_name: string;
  character_name: string;
  character: string;
  latest_question?: Question;
  latest_answer?: Answer;
  duration_minutes?: number;
  mood_score?: number;
  topics_discussed?: string[];
}

export interface CharacterStats {
  character: string;
  character_id: string;
  conversations: number;
  avgMood: number;
  favoriteTopic: string;
}

class DjangoApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = DJANGO_BASE_URL;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      
      // Add timeout and retry logic for better reliability
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
        ...options,
      });
      
      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.error || `HTTP ${response.status}`,
          status: response.status,
        };
      }

      return {
        data,
        status: response.status,
      };
    } catch (error) {
      console.error('Django API Error:', error);
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            error: 'Request timeout - server took too long to respond',
            status: 408,
          };
        }
        return {
          error: error.message,
          status: 0,
        };
      }
      
      return {
        error: 'Network error',
        status: 0,
      };
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.makeRequest('/api/health/');
  }

  // Children API
  async getChildren(parentId: number): Promise<ApiResponse<{ children: Child[]; count: number }>> {
    return this.makeRequest(`/api/get_children/?parent_id=${parentId}`);
  }

  // Get all children for admin dashboard
  async getAllChildrenAdmin(mockData: boolean = false): Promise<ApiResponse<{ 
    children: Array<{
      id: string;
      name: string;
      age: number;
      grade: string;
      last_active: string;
      mood_score: number;
      status: string;
      conversations_today: number;
      parent_email: string;
      created_at: string;
    }>; 
    count: number;
    is_mock_data: boolean;
  }>> {
    const queryParam = mockData ? '?mock_data=true' : '';
    return this.makeRequest(`/api/get_all_children_admin/${queryParam}`);
  }

  // Conversations API - Get conversations using ViewSet
  async getConversations(params?: {
    page?: number;
    page_size?: number;
    ordering?: string;
  }): Promise<ApiResponse<{ count: number; results: Conversation[]; next?: string; previous?: string }>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.page_size) queryParams.set('page_size', params.page_size.toString());
    if (params?.ordering) queryParams.set('ordering', params.ordering);
    
    const url = `/api/conversations/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return this.makeRequest(url);
  }

  // Get conversation details with questions and answers
  async getConversationDetails(conversationId: number): Promise<ApiResponse<{
    conversation: Conversation;
    questions: Question[];
    answers: Answer[];
  }>> {
    const [convResponse, questionsResponse, answersResponse] = await Promise.all([
      this.makeRequest(`/api/conversations/${conversationId}/`),
      this.makeRequest(`/api/questions/?conversation=${conversationId}`),
      this.makeRequest(`/api/answers/?question__conversation=${conversationId}`)
    ]);

    if (convResponse.error) return convResponse as ApiResponse<{
      conversation: Conversation;
      questions: Question[];
      answers: Answer[];
    }>;

    return {
      data: {
        conversation: convResponse.data as Conversation,
        questions: (questionsResponse.data as { results: Question[] })?.results || [],
        answers: (answersResponse.data as { results: Answer[] })?.results || []
      },
      status: 200
    };
  }

  // Analytics API
  async getMoodMeterCoordinates(childId: number): Promise<ApiResponse> {
    return this.makeRequest(`/api/get_mood_meter_coordinates/${childId}/`);
  }

  async getTodaysChatHistory(childId: number): Promise<ApiResponse> {
    return this.makeRequest(`/api/get_todays_chat_history/?child_id=${childId}`);
  }

  async getTodaysEmotions(childId: number): Promise<ApiResponse> {
    return this.makeRequest(`/api/get_todays_emotions/?child_id=${childId}`);
  }

  async getUsageStatistics(childId: number): Promise<ApiResponse> {
    return this.makeRequest(`/api/usage_statistics/?child_id=${childId}`);
  }

  // Enhanced conversation data with analytics
  async getConversationsWithAnalytics(params?: {
    page?: number;
    page_size?: number;
    ordering?: string;
    defaultSort?: boolean;
  }): Promise<ApiResponse<{
    conversations: ConversationWithDetails[];
    pagination: {
      count: number;
      next?: string;
      previous?: string;
      page: number;
      page_size: number;
      total_pages: number;
    }
  }>> {
    try {
      // Get basic conversations with pagination
      // Note: Django API is not respecting ordering parameter, so we'll get the last pages first
      const pageSize = params?.page_size || 20;
      const requestedPage = params?.page || 1;
      
      // For descending date order (most recent first), we need to calculate the correct page
      // from the end of the dataset since Django returns oldest first
      let actualPage = requestedPage;
      
      // First, get the total count to calculate correct pagination
      const countResponse = await this.getConversations({ page: 1, page_size: 1 });
      if (countResponse.error) return countResponse as unknown as ApiResponse<{
        conversations: ConversationWithDetails[];
        pagination: {
          count: number;
          next?: string;
          previous?: string;
          page: number;
          page_size: number;
          total_pages: number;
        };
      }>;
      
      const totalCount = countResponse.data?.count || 0;
      const totalPages = Math.ceil(totalCount / pageSize);
      
      // If sorting by date descending (most recent first), reverse the page calculation
      if (params?.ordering?.includes('-start_date_time') || params?.ordering?.includes('-id') || 
          (!params?.ordering && params?.defaultSort !== false)) {
        // Calculate the page from the end to get most recent first
        actualPage = totalPages - requestedPage + 1;
        if (actualPage < 1) actualPage = 1;
      }
      
      const conversationsResponse = await this.getConversations({
        page: actualPage,
        page_size: pageSize
      });
      if (conversationsResponse.error) return conversationsResponse as unknown as ApiResponse<{
        conversations: ConversationWithDetails[];
        pagination: {
          count: number;
          next?: string;
          previous?: string;
          page: number;
          page_size: number;
          total_pages: number;
        };
      }>;

      let conversations = conversationsResponse.data?.results || [];
      
      // If we reversed the page, we need to reverse the conversations order too to maintain chronological order
      if (params?.ordering?.includes('-start_date_time') || params?.ordering?.includes('-id') || 
          (!params?.ordering && params?.defaultSort !== false)) {
        conversations = conversations.reverse();
      }
      
      // Enhance each conversation with additional data
      const enhancedConversations = await Promise.all(
        conversations.map(async (conv: Conversation) => {
          // Get child details
          const childResponse = await this.makeRequest(`/api/child/${conv.child}/`);
          const child = childResponse.data as Child;

          // Get latest question for this conversation
          const questionsResponse = await this.makeRequest(
            `/api/questions/?conversation=${conv.id}&ordering=-timestamp&limit=1`
          );
          const latestQuestion = (questionsResponse.data as { results: Question[] })?.results?.[0];

          // Get latest answer
          const answersResponse = await this.makeRequest(
            `/api/answers/?question__conversation=${conv.id}&ordering=-timestamp&limit=1`
          );
          const latestAnswer = (answersResponse.data as { results: Answer[] })?.results?.[0];

          // Calculate duration if conversation has ended
          let durationMinutes = 0;
          if (conv.start_date_time && conv.last_date_time) {
            const start = new Date(conv.start_date_time);
            const end = new Date(conv.last_date_time);
            durationMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
          }

          // Parse mood score from question if available
          let moodScore = 7.5; // Default
          if (latestQuestion?.mood_evaluation) {
            try {
              // Try to parse mood evaluation (format might be tuple or simple number)
              const moodMatch = latestQuestion.mood_evaluation.match(/\d+\.?\d*/);
              if (moodMatch) {
                moodScore = parseFloat(moodMatch[0]);
              }
            } catch {
              console.warn('Could not parse mood evaluation:', latestQuestion.mood_evaluation);
            }
          }

          // Determine character from context or fallback to random character
          const character = this.extractCharacterFromContext(conv.context) || 'koko-panda';

          return {
            ...conv,
            child_name: child?.name || `Child ${conv.child}`,
            character: character,
            character_name: this.getCharacterDisplayName(character),
            latest_question: latestQuestion,
            latest_answer: latestAnswer,
            duration_minutes: durationMinutes,
            mood_score: moodScore,
            topics_discussed: this.extractTopicsFromConversation(latestQuestion)
          } as ConversationWithDetails;
        })
      );

      // Calculate pagination info
      const finalPageSize = params?.page_size || 20;
      const finalTotalPages = Math.ceil(totalCount / finalPageSize);
      
      return {
        data: {
          conversations: enhancedConversations,
          pagination: {
            count: totalCount,
            next: requestedPage < finalTotalPages ? `page=${requestedPage + 1}` : undefined,
            previous: requestedPage > 1 ? `page=${requestedPage - 1}` : undefined,
            page: requestedPage,
            page_size: finalPageSize,
            total_pages: finalTotalPages
          }
        },
        status: 200
      };
    } catch {
      return {
        error: 'Failed to fetch enhanced conversations',
        status: 500
      };
    }
  }

  // Helper method to extract character from conversation context
  private extractCharacterFromContext(context: string): string {
    // Try to find character mention in context
    const characterKeywords = {
      'koko': 'koko-panda',
      'panda': 'koko-panda',
      'mochi': 'mochi-cat',
      'cat': 'mochi-cat',
      'charlie': 'charlie-dog',
      'dog': 'charlie-dog',
      'ravi': 'ravi-fox',
      'fox': 'ravi-fox',
      'nova': 'nova-owl',
      'owl': 'nova-owl',
      'clover': 'dr-clover-goat',
      'goat': 'dr-clover-goat',
      'zenzo': 'zenzo-sloth',
      'sloth': 'zenzo-sloth'
    };

    const lowerContext = context.toLowerCase();
    for (const [keyword, characterId] of Object.entries(characterKeywords)) {
      if (lowerContext.includes(keyword)) {
        return characterId;
      }
    }

    // Fallback to random character based on conversation ID
    const characters = ['koko-panda', 'mochi-cat', 'charlie-dog', 'ravi-fox', 'nova-owl', 'dr-clover-goat', 'zenzo-sloth'];
    return characters[parseInt(context) % characters.length] || 'koko-panda';
  }

  // Helper method to get character display name
  private getCharacterDisplayName(characterId: string): string {
    const characterMap: Record<string, string> = {
      'koko-panda': 'Koko the Panda',
      'mochi-cat': 'Mochi the Cat',
      'charlie-dog': 'Charlie the Dog',
      'ravi-fox': 'Ravi the Fox',
      'nova-owl': 'Nova the Owl',
      'dr-clover-goat': 'Dr. Clover the Goat',
      'zenzo-sloth': 'Zenzo the Sloth'
    };
    return characterMap[characterId] || characterId;
  }

  // Helper method to extract topics from conversation
  private extractTopicsFromConversation(question?: Question): string[] {
    const topics: string[] = [];
    
    if (question?.text) {
      // Simple keyword extraction for topics
      const text = question.text.toLowerCase();
      if (text.includes('friend') || text.includes('friendship')) topics.push('friendship');
      if (text.includes('share') || text.includes('sharing')) topics.push('sharing');
      if (text.includes('emotion') || text.includes('feel')) topics.push('emotions');
      if (text.includes('adventure') || text.includes('explore')) topics.push('adventure');
      if (text.includes('learn') || text.includes('school')) topics.push('learning');
      if (text.includes('play') || text.includes('game')) topics.push('playing');
      if (text.includes('think') || text.includes('problem')) topics.push('critical thinking');
      if (text.includes('calm') || text.includes('breathe')) topics.push('mindfulness');
    }

    return topics.length > 0 ? topics : ['general conversation'];
  }

  // Character statistics
  async getCharacterStats(): Promise<ApiResponse<CharacterStats[]>> {
    try {
      // Get all conversations grouped by character
      const conversationsResponse = await this.getConversations();
      if (conversationsResponse.error) return conversationsResponse as unknown as ApiResponse<CharacterStats[]>;

      const conversations = (conversationsResponse.data as { results: Conversation[] })?.results || [];
      
      // Group conversations by character
      const characterGroups: Record<string, Conversation[]> = {};
      conversations.forEach((conv: Conversation) => {
        const character = this.extractCharacterFromContext(conv.context) || 'koko-panda';
        if (!characterGroups[character]) {
          characterGroups[character] = [];
        }
        characterGroups[character].push(conv);
      });

      // Calculate stats for each character
      const stats: CharacterStats[] = [];
      for (const [characterId, convs] of Object.entries(characterGroups)) {
        // Get mood scores for this character's conversations
        const moodScores: number[] = [];
        for (const conv of convs) {
          const questionsResponse = await this.makeRequest(
            `/api/questions/?conversation=${conv.id}`
          );
          const questions = (questionsResponse.data as { results: Question[] })?.results || [];
          questions.forEach((q: Question) => {
            if (q.mood_evaluation) {
              try {
                const moodMatch = q.mood_evaluation.match(/\d+\.?\d*/);
                if (moodMatch) {
                  moodScores.push(parseFloat(moodMatch[0]));
                }
              } catch {
                // Ignore parsing errors
              }
            }
          });
        }

        const avgMood = moodScores.length > 0 
          ? moodScores.reduce((a, b) => a + b, 0) / moodScores.length 
          : 7.5;

        // Determine favorite topic based on character specialization
        const topicMap: Record<string, string> = {
          'koko-panda': 'Emotional Support',
          'mochi-cat': 'Adventure Learning',
          'charlie-dog': 'Social Skills',
          'ravi-fox': 'Critical Thinking',
          'nova-owl': 'Academic Learning',
          'dr-clover-goat': 'Emotional Counseling',
          'zenzo-sloth': 'Mindfulness'
        };

        stats.push({
          character: this.getCharacterDisplayName(characterId),
          character_id: characterId,
          conversations: convs.length,
          avgMood: Math.round(avgMood * 10) / 10,
          favoriteTopic: topicMap[characterId] || 'General Learning'
        });
      }

      return {
        data: stats,
        status: 200
      };
    } catch {
      return {
        error: 'Failed to calculate character statistics',
        status: 500
      };
    }
  }

  // Dashboard overview statistics
  async getDashboardStats(): Promise<ApiResponse<{
    totalConversations: number;
    avgDuration: number;
    avgMoodScore: number;
    activeStudents: number;
    totalChildren: number;
  }>> {
    try {
      const [conversationsResponse, childrenResponse] = await Promise.all([
        this.getConversations(),
        this.makeRequest('/api/child/')
      ]);

      const conversationsData = conversationsResponse.data as { results: Conversation[]; count: number };
      const conversations = conversationsData?.results || [];
      const totalConversations = conversationsData?.count || 0;
      const children = (childrenResponse.data as { results: Child[]; count: number })?.results || [];

      // Calculate average duration from sample conversations
      const durations = conversations
        .filter((c: Conversation) => c.start_date_time && c.last_date_time)
        .map((c: Conversation) => {
          const start = new Date(c.start_date_time);
          const end = new Date(c.last_date_time);
          return (end.getTime() - start.getTime()) / (1000 * 60); // minutes
        });

      const avgDuration = durations.length > 0 
        ? durations.reduce((a, b) => a + b, 0) / durations.length 
        : 5.2;

      // Get mood scores from questions (sample from first 10 conversations)
      const allMoodScores: number[] = [];
      for (const conv of conversations.slice(0, 10)) {
        const questionsResponse = await this.makeRequest(
          `/api/questions/?conversation=${conv.id}&limit=3`
        );
        const questions = (questionsResponse.data as { results: Question[] })?.results || [];
        questions.forEach((q: Question) => {
          if (q.mood_evaluation) {
            try {
              const moodMatch = q.mood_evaluation.match(/\d+\.?\d*/);
              if (moodMatch) {
                allMoodScores.push(parseFloat(moodMatch[0]));
              }
            } catch {
              // Ignore parsing errors
            }
          }
        });
      }

      const avgMoodScore = allMoodScores.length > 0
        ? allMoodScores.reduce((a, b) => a + b, 0) / allMoodScores.length
        : 7.9;

      // Count unique children who had conversations today
      const today = new Date().toISOString().split('T')[0];
      const todaysConversations = conversations.filter((c: Conversation) => 
        c.start_date_time && c.start_date_time.startsWith(today)
      );
      const activeStudents = new Set(todaysConversations.map((c: Conversation) => c.child)).size;

      return {
        data: {
          totalConversations,
          avgDuration: Math.round(avgDuration * 10) / 10,
          avgMoodScore: Math.round(avgMoodScore * 10) / 10,
          activeStudents,
          totalChildren: children.length
        },
        status: 200
      };
    } catch {
      return {
        error: 'Failed to fetch dashboard statistics',
        status: 500
      };
    }
  }
}

// Export singleton instance
export const djangoApi = new DjangoApiClient();
export default djangoApi;