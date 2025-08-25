'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, MessageCircle, BarChart3 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { getUserType } from '@/lib/auth';
import { djangoApi } from '@/lib/api/django-client';

// Fallback mock data (only used if API fails completely)
const fallbackMockStudents = [
  {
    id: '1',
    name: 'Emma Wilson',
    age: 7,
    grade: 'N/A',
    last_active: '2 hours ago',
    mood_score: 8.5,
    status: 'active',
    conversations_today: 3,
  },
  {
    id: '2',
    name: 'Liam Johnson',
    age: 8,
    grade: 'N/A',
    last_active: '1 day ago',
    mood_score: 7.2,
    status: 'inactive',
    conversations_today: 0,
  },
];

interface Student {
  id: string;
  name: string;
  age: number;
  grade: string;
  last_active: string;
  mood_score: number;
  status: string;
  conversations_today: number;
  parent_email?: string;
}

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Load students based on user type
  useEffect(() => {
    async function loadStudents() {
      if (!user) return;

      const userType = await getUserType(user);
      setLoading(true);
      setError(null);

      try {
        // For admin accounts, use real data. For educator/demo accounts, use mock data via API
        const useMockData = userType !== 'admin';
        const response = await djangoApi.getAllChildrenAdmin(useMockData);
        
        if (response.error) {
          console.error('Failed to load students:', response.error);
          setError(response.error);
          // Fallback to hardcoded mock data on error
          setStudents(fallbackMockStudents);
        } else if (response.data) {
          // Transform Django API response to match our Student interface
          const apiStudents: Student[] = response.data.children.map((child) => ({
            id: child.id,
            name: child.name,
            age: child.age,
            grade: child.grade,
            last_active: child.last_active,
            mood_score: child.mood_score,
            status: child.status,
            conversations_today: child.conversations_today,
            parent_email: child.parent_email
          }));
          setStudents(apiStudents);
          
          // Log what type of data we're using
          if (response.data.is_mock_data) {
            console.log('🎭 Using mock data for educator/demo account');
          } else {
            console.log('📊 Using real database data for admin account');
          }
        }
      } catch (err) {
        console.error('Error loading students:', err);
        setError('Failed to load student data');
        // Fallback to hardcoded mock data on error
        setStudents(fallbackMockStudents);
      } finally {
        setLoading(false);
      }
    }

    loadStudents();
  }, [user]);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'needs_attention': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMoodColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground">
            Manage and monitor your student progress
          </p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {students.filter(s => s.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Need Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {students.filter(s => s.status === 'needs_attention').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student List */}
      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>
            View and manage all students in your class
          </CardDescription>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              className="pl-10 max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">Error: {error}</p>
              <p className="text-red-500 text-xs mt-1">Showing demo data instead.</p>
            </div>
          )}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-muted-foreground">Loading students...</p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Mood Score</TableHead>
                  <TableHead>Conversations Today</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{student.name}</div>
                        {student.parent_email && (
                          <div className="text-sm text-muted-foreground">
                            Parent: {student.parent_email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{student.age}</TableCell>
                    <TableCell>{student.grade}</TableCell>
                    <TableCell>{student.last_active}</TableCell>
                    <TableCell>
                      <span className={getMoodColor(student.mood_score)}>
                        {student.mood_score}/10
                      </span>
                    </TableCell>
                    <TableCell>{student.conversations_today}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(student.status)}>
                        {student.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}