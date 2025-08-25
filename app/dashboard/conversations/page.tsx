'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MessageCircle, Heart, Brain, Play, Loader2, ChevronUp, ChevronDown, Filter, ArrowUpDown } from 'lucide-react';
import { getCharacterByLegacyName, getAllCharacters } from '@/lib/characters';
import { ConversationWithDetails, CharacterStats } from '@/lib/api/django-client';
import { hybridApi } from '@/lib/api/hybrid-client';
import { useAuth } from '@/hooks/use-auth';
import Image from 'next/image';

const mockConversations = [
  {
    id: '1',
    studentName: 'Emma Wilson',
    characterName: 'Koko the Panda',
    characterId: 'koko-panda',
    timestamp: new Date('2024-08-14T10:30:00'),
    duration: '12 minutes',
    moodScore: 8.5,
    topicsDiscussed: ['friendship', 'sharing', 'emotions'],
    summary: 'Emma talked about making new friends at school and learned about sharing toys with Koko.',
  },
  {
    id: '2',
    studentName: 'Liam Johnson',
    characterName: 'Mochi the Cat',
    characterId: 'mochi-cat',
    timestamp: new Date('2024-08-14T09:15:00'),
    duration: '8 minutes',
    moodScore: 7.2,
    topicsDiscussed: ['adventure', 'curiosity', 'exploration'],
    summary: 'Liam went on playful adventures and explored cozy learning spaces with Mochi.',
  },
  {
    id: '3',
    studentName: 'Sofia Garcia',
    characterName: 'Charlie the Dog',
    characterId: 'charlie-dog',
    timestamp: new Date('2024-08-14T11:45:00'),
    duration: '15 minutes',
    moodScore: 9.1,
    topicsDiscussed: ['friendship', 'loyalty', 'playing'],
    summary: 'Sofia learned about making friends and being loyal through energetic games with Charlie.',
  },
  {
    id: '4',
    studentName: 'Noah Brown',
    characterName: 'Ravi the Fox',
    characterId: 'ravi-fox',
    timestamp: new Date('2024-08-14T14:20:00'),
    duration: '6 minutes',
    moodScore: 6.8,
    topicsDiscussed: ['critical thinking', 'problem solving', 'different perspectives'],
    summary: 'Noah explored different ways of thinking and had a friendly debate about perspectives with Ravi.',
  },
  {
    id: '5',
    studentName: 'Ava Martinez',
    characterName: 'Nova the Owl',
    characterId: 'nova-owl',
    timestamp: new Date('2024-08-14T13:15:00'),
    duration: '10 minutes',
    moodScore: 8.7,
    topicsDiscussed: ['academic learning', 'science', 'discovery'],
    summary: 'Ava discovered fascinating science concepts and had emotional check-ins with Nova.',
  },
  {
    id: '6',
    studentName: 'Ethan Davis',
    characterName: 'Dr. Clover the Goat',
    characterId: 'dr-clover-goat',
    timestamp: new Date('2024-08-14T15:30:00'),
    duration: '14 minutes',
    moodScore: 8.9,
    topicsDiscussed: ['emotional guidance', 'validation', 'feelings'],
    summary: 'Ethan received compassionate emotional support and validation for his feelings with Dr. Clover.',
  },
  {
    id: '7',
    studentName: 'Maya Kim',
    characterName: 'Zenzo the Sloth',
    characterId: 'zenzo-sloth',
    timestamp: new Date('2024-08-14T16:45:00'),
    duration: '7 minutes',
    moodScore: 9.2,
    topicsDiscussed: ['mindfulness', 'patience', 'breathing'],
    summary: 'Maya learned mindfulness techniques and practiced slow, thoughtful breathing with Zenzo.',
  },
];

const mockCharacterStats = [
  { characterId: 'koko-panda', character: 'Koko the Panda', conversations: 145, avgMood: 8.2, favoriteTopic: 'Emotional Support' },
  { characterId: 'mochi-cat', character: 'Mochi the Cat', conversations: 98, avgMood: 7.8, favoriteTopic: 'Adventure Learning' },
  { characterId: 'charlie-dog', character: 'Charlie the Dog', conversations: 132, avgMood: 8.5, favoriteTopic: 'Social Skills' },
  { characterId: 'ravi-fox', character: 'Ravi the Fox', conversations: 89, avgMood: 8.0, favoriteTopic: 'Critical Thinking' },
  { characterId: 'nova-owl', character: 'Nova the Owl', conversations: 76, avgMood: 8.3, favoriteTopic: 'Academic Learning' },
  { characterId: 'dr-clover-goat', character: 'Dr. Clover the Goat', conversations: 67, avgMood: 8.6, favoriteTopic: 'Emotional Counseling' },
  { characterId: 'zenzo-sloth', character: 'Zenzo the Sloth', conversations: 43, avgMood: 9.1, favoriteTopic: 'Mindfulness' },
];

type SortField = 'student' | 'character' | 'date' | 'time' | 'duration' | 'mood';
type SortDirection = 'asc' | 'desc';

export default function ConversationsPage() {
  const { user } = useAuth();
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState('all');
  const [moodFilter, setMoodFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  
  // Sorting states
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  // Data states
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [characterStats, setCharacterStats] = useState<CharacterStats[]>([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalConversations: 0,
    avgDuration: 0,
    avgMoodScore: 0,
    activeStudents: 0
  });
  const [pagination, setPagination] = useState({
    count: 0,
    page: 1,
    page_size: 20,
    total_pages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert sort fields to Django ordering format
  const getSortingParam = (field: SortField, direction: SortDirection): string => {
    const fieldMap: Record<SortField, string> = {
      'student': 'child',
      'character': 'context', // We'll sort by context as proxy for character
      'date': 'start_date_time',
      'time': 'start_date_time',
      'duration': 'last_date_time', // Approximate duration by end time
      'mood': 'start_date_time' // Default to time for mood since it's calculated
    };
    
    const dbField = fieldMap[field];
    return direction === 'desc' ? `-${dbField}` : dbField;
  };

  // Fetch data using hybrid API (switches between mock and real data)
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Set user context for hybrid API
      await hybridApi.setUser(user);
      
      const [conversationsResponse, statsResponse, dashResponse] = await Promise.all([
        hybridApi.getConversationsWithAnalytics({
          page: currentPage,
          page_size: pageSize,
          ordering: getSortingParam(sortField, sortDirection)
        }),
        hybridApi.getCharacterStats(),
        hybridApi.getDashboardStats()
      ]);

      if (conversationsResponse.error) {
        throw new Error(conversationsResponse.error);
      }
      if (statsResponse.error) {
        console.warn('Character stats error:', statsResponse.error);
      }
      if (dashResponse.error) {
        console.warn('Dashboard stats error:', dashResponse.error);
      }

      setConversations(conversationsResponse.data?.conversations || []);
      setPagination(conversationsResponse.data?.pagination || {
        count: 0,
        page: 1,
        page_size: 20,
        total_pages: 0
      });
      setCharacterStats(statsResponse.data || []);
      setDashboardStats(dashResponse.data || {
        totalConversations: 0,
        avgDuration: 0,
        avgMoodScore: 0,
        activeStudents: 0
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [currentPage, pageSize, sortField, sortDirection, user]);

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc'); // Default to descending for new fields
    }
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  // Client-side filtering for search and character (since API doesn't support all filters)
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.child_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCharacter = selectedCharacter === 'all' || conv.character === selectedCharacter;
    const matchesMood = moodFilter === 'all' || 
      (moodFilter === 'high' && (conv.mood_score || 0) >= 8) ||
      (moodFilter === 'medium' && (conv.mood_score || 0) >= 6 && (conv.mood_score || 0) < 8) ||
      (moodFilter === 'low' && (conv.mood_score || 0) < 6);
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const convDate = new Date(conv.start_date_time);
      const now = new Date();
      
      if (dateFilter === 'today') {
        matchesDate = convDate.toDateString() === now.toDateString();
      } else if (dateFilter === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesDate = convDate >= weekAgo;
      } else if (dateFilter === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        matchesDate = convDate >= monthAgo;
      }
    }
    
    return matchesSearch && matchesCharacter && matchesMood && matchesDate;
  });

  const getMoodColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCharacterImage = (characterId: string) => {
    const character = getAllCharacters().find(c => c.id === characterId);
    return character?.image || '/assets/characters/koko-panda.gif';
  };

  const getCharacterName = (characterId: string) => {
    const character = getAllCharacters().find(c => c.id === characterId);
    return character?.name || 'Unknown';
  };

  const getCharacterImageClasses = (characterId: string) => {
    // Legacy characters (panda, cat, dog) are naturally larger and need scaling down and repositioning
    const legacyCharacters = ['koko-panda', 'mochi-cat', 'charlie-dog'];
    const isLegacy = legacyCharacters.includes(characterId);
    
    return isLegacy 
      ? 'object-cover scale-75 object-center' // Scale down and center legacy characters
      : 'object-cover object-center'; // Center newer characters
  };

  // Sorting icon component
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;
    }
    return sortDirection === 'asc' 
      ? <ChevronUp className="h-4 w-4 text-primary" />
      : <ChevronDown className="h-4 w-4 text-primary" />;
  };

  // Pagination component
  const PaginationControls = () => (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <p className="text-sm text-muted-foreground">
          Showing {filteredConversations.length} of {pagination.count} conversations
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <p className="text-sm text-muted-foreground">Rows per page</p>
        <Select value={pageSize.toString()} onValueChange={(value) => {
          setPageSize(parseInt(value));
          setCurrentPage(1);
        }}>
          <SelectTrigger className="w-[70px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1 || loading}
          >
            Previous
          </Button>
          
          <div className="flex items-center space-x-1">
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {pagination.total_pages}
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(pagination.total_pages, currentPage + 1))}
            disabled={currentPage === pagination.total_pages || loading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Conversations</h1>
          <p className="text-muted-foreground">
            Monitor student interactions with AI characters
          </p>
        </div>
        <Button>
          <MessageCircle className="h-4 w-4 mr-2" />
          View Live Sessions
        </Button>
      </div>

      {/* Quick Stats */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                </CardTitle>
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2"></div>
                <div className="h-3 w-24 bg-muted animate-pulse rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              <p className="font-medium">Failed to load data</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.totalConversations}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.avgDuration} min</div>
              <p className="text-xs text-muted-foreground">Per conversation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Mood Score</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.avgMoodScore}/10</div>
              <p className="text-xs text-muted-foreground">Overall average</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Students</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.activeStudents}</div>
              <p className="text-xs text-muted-foreground">Today</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recent Conversations</TabsTrigger>
          <TabsTrigger value="characters">Character Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Conversations</CardTitle>
              <CardDescription>
                Latest student interactions with AI characters
              </CardDescription>
              <div className="flex flex-wrap gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by student name..."
                    className="pl-10 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <Select value={selectedCharacter} onValueChange={setSelectedCharacter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Characters" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Characters</SelectItem>
                    <SelectItem value="koko-panda">Koko the Panda</SelectItem>
                    <SelectItem value="mochi-cat">Mochi the Cat</SelectItem>
                    <SelectItem value="charlie-dog">Charlie the Dog</SelectItem>
                    <SelectItem value="ravi-fox">Ravi the Fox</SelectItem>
                    <SelectItem value="nova-owl">Nova the Owl</SelectItem>
                    <SelectItem value="dr-clover-goat">Dr. Clover the Goat</SelectItem>
                    <SelectItem value="zenzo-sloth">Zenzo the Sloth</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={moodFilter} onValueChange={setMoodFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Moods" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Moods</SelectItem>
                    <SelectItem value="high">High (8-10)</SelectItem>
                    <SelectItem value="medium">Medium (6-8)</SelectItem>
                    <SelectItem value="low">Low (0-6)</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCharacter('all');
                    setMoodFilter('all');
                    setDateFilter('all');
                  }}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Clear Filters
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('student')}
                        className="h-auto p-0 font-medium hover:bg-transparent"
                      >
                        Student
                        <SortIcon field="student" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('character')}
                        className="h-auto p-0 font-medium hover:bg-transparent"
                      >
                        Character
                        <SortIcon field="character" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('date')}
                        className="h-auto p-0 font-medium hover:bg-transparent"
                      >
                        Date
                        <SortIcon field="date" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('time')}
                        className="h-auto p-0 font-medium hover:bg-transparent"
                      >
                        Time
                        <SortIcon field="time" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('duration')}
                        className="h-auto p-0 font-medium hover:bg-transparent"
                      >
                        Duration
                        <SortIcon field="duration" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('mood')}
                        className="h-auto p-0 font-medium hover:bg-transparent"
                      >
                        Mood Score
                        <SortIcon field="mood" />
                      </Button>
                    </TableHead>
                    <TableHead>Topics</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    // Loading state
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded"></div></TableCell>
                        <TableCell><div className="h-4 w-32 bg-muted animate-pulse rounded"></div></TableCell>
                        <TableCell><div className="h-4 w-20 bg-muted animate-pulse rounded"></div></TableCell>
                        <TableCell><div className="h-4 w-16 bg-muted animate-pulse rounded"></div></TableCell>
                        <TableCell><div className="h-4 w-20 bg-muted animate-pulse rounded"></div></TableCell>
                        <TableCell><div className="h-4 w-12 bg-muted animate-pulse rounded"></div></TableCell>
                        <TableCell><div className="h-4 w-28 bg-muted animate-pulse rounded"></div></TableCell>
                        <TableCell><div className="h-8 w-24 bg-muted animate-pulse rounded"></div></TableCell>
                      </TableRow>
                    ))
                  ) : filteredConversations.length > 0 ? (
                    filteredConversations.map((conversation) => (
                      <TableRow key={conversation.id}>
                        <TableCell className="font-medium">{conversation.child_name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                              <div className="relative w-full h-full">
                                <Image
                                  src={getCharacterImage(conversation.character)}
                                  alt={conversation.character_name}
                                  fill
                                  className={getCharacterImageClasses(conversation.character)}
                                  sizes="32px"
                                  style={{ 
                                    transform: ['koko-panda', 'mochi-cat', 'charlie-dog'].includes(conversation.character) 
                                      ? 'scale(0.8) translateY(10%)' 
                                      : 'scale(1)' 
                                  }}
                                />
                              </div>
                            </div>
                            <span className="font-medium">{conversation.character_name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(conversation.start_date_time).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(conversation.start_date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </TableCell>
                        <TableCell>
                          {conversation.duration_minutes ? `${conversation.duration_minutes} min` : 'In progress'}
                        </TableCell>
                        <TableCell>
                          <span className={getMoodColor(conversation.mood_score || 7.5)}>
                            {(conversation.mood_score || 7.5).toFixed(1)}/10
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {(conversation.topics_discussed || []).slice(0, 2).map((topic, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {topic}
                              </Badge>
                            ))}
                            {(conversation.topics_discussed || []).length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{(conversation.topics_discussed || []).length - 2}
                              </Badge>
                            )}
                            {(!conversation.topics_discussed || conversation.topics_discussed.length === 0) && (
                              <Badge variant="secondary" className="text-xs">
                                general
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              View Transcript
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                        {error ? 'Failed to load conversations' : 'No conversations found'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              
              {/* Pagination Controls */}
              <div className="mt-6 border-t pt-4">
                <PaginationControls />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="characters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Character Performance</CardTitle>
              <CardDescription>
                Analytics for each AI character&apos;s engagement and effectiveness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  // Loading state
                  [...Array(6)].map((_, i) => (
                    <Card key={i}>
                      <CardHeader className="text-center">
                        <div className="relative w-16 h-16 mx-auto mb-3 rounded-full bg-muted animate-pulse"></div>
                        <div className="h-6 w-24 bg-muted animate-pulse rounded mx-auto"></div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center">
                          <div className="h-8 w-12 bg-muted animate-pulse rounded mx-auto mb-2"></div>
                          <div className="h-4 w-32 bg-muted animate-pulse rounded mx-auto"></div>
                        </div>
                        <div className="text-center">
                          <div className="h-6 w-16 bg-muted animate-pulse rounded mx-auto mb-2"></div>
                          <div className="h-4 w-24 bg-muted animate-pulse rounded mx-auto"></div>
                        </div>
                        <div className="text-center">
                          <div className="h-6 w-20 bg-muted animate-pulse rounded mx-auto mb-2"></div>
                          <div className="h-4 w-28 bg-muted animate-pulse rounded mx-auto"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : characterStats.length > 0 ? (
                  characterStats.map((characterStat, index) => (
                    <Card key={index}>
                      <CardHeader className="text-center">
                        <div className="relative w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                          <div className="relative w-full h-full">
                            <Image
                              src={getCharacterImage(characterStat.character_id)}
                              alt={characterStat.character}
                              fill
                              className={getCharacterImageClasses(characterStat.character_id)}
                              sizes="64px"
                              style={{ 
                                transform: ['koko-panda', 'mochi-cat', 'charlie-dog'].includes(characterStat.character_id) 
                                  ? 'scale(0.8) translateY(15%)' 
                                  : 'scale(1)' 
                              }}
                            />
                          </div>
                        </div>
                        <CardTitle className="text-lg">{characterStat.character}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{characterStat.conversations}</div>
                          <div className="text-sm text-muted-foreground">Total Conversations</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-semibold">{characterStat.avgMood}/10</div>
                          <div className="text-sm text-muted-foreground">Avg Mood Score</div>
                        </div>
                        <div className="text-center">
                          <Badge>{characterStat.favoriteTopic}</Badge>
                          <div className="text-sm text-muted-foreground mt-1">Most Popular Topic</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center text-muted-foreground py-8">
                    {error ? 'Failed to load character analytics' : 'No character data available'}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}