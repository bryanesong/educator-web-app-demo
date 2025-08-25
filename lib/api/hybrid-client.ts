/**
 * Hybrid API Client
 * 
 * This client automatically switches between mock data (for demo accounts)
 * and real Django API data (for actual accounts) based on user type.
 */

import { User } from '@supabase/supabase-js';
import { getUserType, UserType } from '@/lib/auth';
import { djangoApi, ConversationWithDetails, CharacterStats, ApiResponse, Child } from './django-client';
import { MockDataService, MockConversationWithDetails, MockCharacterStats } from './mock-data';

export class HybridApiClient {
  private user: User | null = null;
  private userType: UserType = 'demo';

  constructor(user: User | null = null) {
    this.user = user;
  }

  async setUser(user: User | null) {
    this.user = user;
    this.userType = await getUserType(user);
  }

  async getConversationsWithAnalytics(params?: {
    page?: number;
    page_size?: number;
    ordering?: string;
  }): Promise<ApiResponse<{
    conversations: ConversationWithDetails[] | MockConversationWithDetails[];
    pagination: {
      count: number;
      next?: string;
      previous?: string;
      page: number;
      page_size: number;
      total_pages: number;
    };
  }>> {
    if (this.userType === 'demo') {
      // Demo users: Always return mock data
      try {
        const mockData = await MockDataService.getConversationsWithAnalytics(params);
        return {
          data: mockData,
          status: 200
        };
      } catch {
        return {
          error: 'Failed to fetch demo conversations',
          status: 500
        };
      }
    } else {
      // Educator and Admin users: Return real data from Django API
      return djangoApi.getConversationsWithAnalytics(params);
    }
  }

  async getCharacterStats(): Promise<ApiResponse<CharacterStats[] | MockCharacterStats[]>> {
    if (this.userType === 'demo') {
      // Demo users: Always return mock data
      try {
        const mockData = await MockDataService.getCharacterStats();
        return {
          data: mockData,
          status: 200
        };
      } catch {
        return {
          error: 'Failed to fetch demo character stats',
          status: 500
        };
      }
    } else {
      // Educator and Admin users: Return real data from Django API
      return djangoApi.getCharacterStats();
    }
  }

  async getDashboardStats(): Promise<ApiResponse<{
    totalConversations: number;
    avgDuration: number;
    avgMoodScore: number;
    activeStudents: number;
    totalChildren?: number;
  }>> {
    if (this.userType === 'demo') {
      // Demo users: Always return mock data
      try {
        const mockData = await MockDataService.getDashboardStats();
        return {
          data: mockData,
          status: 200
        };
      } catch {
        return {
          error: 'Failed to fetch demo dashboard stats',
          status: 500
        };
      }
    } else {
      // Educator and Admin users: Return real data from Django API
      return djangoApi.getDashboardStats();
    }
  }

  async getChildren(parentId?: number): Promise<ApiResponse<{ children: Child[]; count: number }>> {
    if (this.userType === 'demo') {
      // Demo users: Always return mock data
      try {
        const mockData = await MockDataService.getChildren();
        return {
          data: mockData,
          status: 200
        };
      } catch {
        return {
          error: 'Failed to fetch demo children',
          status: 500
        };
      }
    } else {
      // Educator and Admin users: Return real data (parentId required for real API)
      if (!parentId) {
        return {
          error: 'Parent ID required for real data',
          status: 400
        };
      }
      return djangoApi.getChildren(parentId);
    }
  }

  // Health check always uses real API
  async healthCheck(): Promise<ApiResponse> {
    return djangoApi.healthCheck();
  }

  // Pass-through methods for real API functionality (educator and admin users only)
  async getConversations(params?: {
    page?: number;
    page_size?: number;
    ordering?: string;
  }) {
    if (this.userType === 'demo') {
      return {
        error: 'Not available in demo mode',
        status: 403
      };
    }
    return djangoApi.getConversations(params);
  }

  async getConversationDetails(conversationId: number) {
    if (this.userType === 'demo') {
      return {
        error: 'Not available in demo mode',
        status: 403
      };
    }
    return djangoApi.getConversationDetails(conversationId);
  }

  async getMoodMeterCoordinates(childId: number) {
    if (this.userType === 'demo') {
      return {
        error: 'Not available in demo mode',
        status: 403
      };
    }
    return djangoApi.getMoodMeterCoordinates(childId);
  }

  async getTodaysChatHistory(childId: number) {
    if (this.userType === 'demo') {
      return {
        error: 'Not available in demo mode',
        status: 403
      };
    }
    return djangoApi.getTodaysChatHistory(childId);
  }

  async getTodaysEmotions(childId: number) {
    if (this.userType === 'demo') {
      return {
        error: 'Not available in demo mode',
        status: 403
      };
    }
    return djangoApi.getTodaysEmotions(childId);
  }

  async getUsageStatistics(childId: number) {
    if (this.userType === 'demo') {
      return {
        error: 'Not available in demo mode',
        status: 403
      };
    }
    return djangoApi.getUsageStatistics(childId);
  }

  // Helper method to get current user type
  getUserType(): UserType {
    return this.userType;
  }
}

// Export singleton instance
export const hybridApi = new HybridApiClient();
export default hybridApi;