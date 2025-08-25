'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  School, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Mail, 
  Key, 
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { getUserType } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface School {
  id: string;
  name: string;
  district: string;
  address: string;
  contact_email: string;
  created_at: string;
  educator_count: number;
  status: 'active' | 'inactive';
}

interface EducatorAccount {
  id: string;
  email: string;
  name: string;
  school_id: string;
  school_name: string;
  role: string;
  status: 'active' | 'pending' | 'inactive';
  created_at: string;
  last_login: string | null;
  password_reset_required: boolean;
}

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  // Data states
  const [schools, setSchools] = useState<School[]>([]);
  const [educators, setEducators] = useState<EducatorAccount[]>([]);
  
  // Form states
  const [isCreatingSchool, setIsCreatingSchool] = useState(false);
  const [isCreatingEducator, setIsCreatingEducator] = useState(false);
  
  // Form data
  const [schoolForm, setSchoolForm] = useState({
    name: '',
    district: '',
    address: '',
    contact_email: ''
  });
  
  const [educatorForm, setEducatorForm] = useState({
    email: '',
    name: '',
    school_id: '',
    role: 'educator'
  });
  
  const [alerts, setAlerts] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Check admin authorization (only admin users allowed)
  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        router.push('/login');
        return;
      }
      
      const userType = await getUserType(user);
      if (userType !== 'admin') {
        // Only admin users can access the admin portal
        router.push('/dashboard');
        return;
      }
      
      setIsAuthorized(true);
      setIsLoading(false);
    };
    
    // Only run if we have a user and haven't set authorized yet
    if (user && !isAuthorized && isLoading) {
      checkAuth();
    }
  }, [user, router, isAuthorized, isLoading]);

  // Mock data - replace with actual API calls
  useEffect(() => {
    if (isAuthorized) {
      // Mock schools data
      setSchools([
        {
          id: '1',
          name: 'Lincoln Elementary School',
          district: 'Metro School District',
          address: '123 Education Ave, Metro City, CA 90210',
          contact_email: 'admin@lincoln.edu',
          created_at: '2024-01-15T10:00:00Z',
          educator_count: 25,
          status: 'active'
        },
        {
          id: '2',
          name: 'Roosevelt Middle School',
          district: 'Metro School District',
          address: '456 Learning Blvd, Metro City, CA 90211',
          contact_email: 'admin@roosevelt.edu',
          created_at: '2024-02-20T14:30:00Z',
          educator_count: 18,
          status: 'active'
        }
      ]);

      // Mock educators data
      setEducators([
        {
          id: '1',
          email: 'sarah.johnson@lincoln.edu',
          name: 'Sarah Johnson',
          school_id: '1',
          school_name: 'Lincoln Elementary School',
          role: 'teacher',
          status: 'active',
          created_at: '2024-03-01T09:00:00Z',
          last_login: '2024-08-14T08:30:00Z',
          password_reset_required: false
        },
        {
          id: '2',
          email: 'mike.davis@roosevelt.edu',
          name: 'Mike Davis',
          school_id: '2',
          school_name: 'Roosevelt Middle School',
          role: 'educator',
          status: 'pending',
          created_at: '2024-08-10T16:45:00Z',
          last_login: null,
          password_reset_required: true
        }
      ]);
    }
  }, [isAuthorized]);

  const handleCreateSchool = async () => {
    setIsCreatingSchool(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newSchool: School = {
        id: String(schools.length + 1),
        ...schoolForm,
        created_at: new Date().toISOString(),
        educator_count: 0,
        status: 'active'
      };
      
      setSchools([...schools, newSchool]);
      setSchoolForm({ name: '', district: '', address: '', contact_email: '' });
      setAlerts({ type: 'success', message: 'School created successfully!' });
      
      setTimeout(() => setAlerts(null), 3000);
    } catch (error) {
      setAlerts({ type: 'error', message: 'Failed to create school. Please try again.' });
    } finally {
      setIsCreatingSchool(false);
    }
  };

  const generateRandomPassword = (): string => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  const handleCreateEducator = async () => {
    setIsCreatingEducator(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const randomPassword = generateRandomPassword();
      const schoolName = schools.find(s => s.id === educatorForm.school_id)?.name || 'Unknown School';
      
      const newEducator: EducatorAccount = {
        id: String(educators.length + 1),
        ...educatorForm,
        school_name: schoolName,
        status: 'pending',
        created_at: new Date().toISOString(),
        last_login: null,
        password_reset_required: true
      };
      
      setEducators([...educators, newEducator]);
      setEducatorForm({ email: '', name: '', school_id: '', role: 'educator' });
      
      setAlerts({ 
        type: 'success', 
        message: `Educator account created! Temporary password: ${randomPassword} (User will be prompted to change this on first login)` 
      });
      
      setTimeout(() => setAlerts(null), 10000);
    } catch (error) {
      setAlerts({ type: 'error', message: 'Failed to create educator account. Please try again.' });
    } finally {
      setIsCreatingEducator(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Admin Portal
          </h1>
          <p className="text-muted-foreground">
            Manage schools and educator accounts
          </p>
        </div>
        <Badge variant="secondary" className="gap-1">
          <Shield className="h-3 w-3" />
          Super Admin
        </Badge>
      </div>

      {/* Alerts */}
      {alerts && (
        <Alert className={alerts.type === 'error' ? 'border-destructive' : 'border-green-500'}>
          {alerts.type === 'error' ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          <AlertDescription>{alerts.message}</AlertDescription>
        </Alert>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schools.length}</div>
            <p className="text-xs text-muted-foreground">Active institutions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Educators</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{educators.length}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Activations</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {educators.filter(e => e.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting first login</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="schools" className="space-y-4">
        <TabsList>
          <TabsTrigger value="schools">School Management</TabsTrigger>
          <TabsTrigger value="educators">Educator Accounts</TabsTrigger>
        </TabsList>

        <TabsContent value="schools" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Schools</CardTitle>
                  <CardDescription>Manage educational institutions</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add School
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New School</DialogTitle>
                      <DialogDescription>
                        Add a new educational institution to the system
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">School Name</Label>
                        <Input
                          id="name"
                          value={schoolForm.name}
                          onChange={(e) => setSchoolForm({...schoolForm, name: e.target.value})}
                          placeholder="Lincoln Elementary School"
                        />
                      </div>
                      <div>
                        <Label htmlFor="district">District</Label>
                        <Input
                          id="district"
                          value={schoolForm.district}
                          onChange={(e) => setSchoolForm({...schoolForm, district: e.target.value})}
                          placeholder="Metro School District"
                        />
                      </div>
                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={schoolForm.address}
                          onChange={(e) => setSchoolForm({...schoolForm, address: e.target.value})}
                          placeholder="123 Education Ave, Metro City, CA 90210"
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact_email">Contact Email</Label>
                        <Input
                          id="contact_email"
                          type="email"
                          value={schoolForm.contact_email}
                          onChange={(e) => setSchoolForm({...schoolForm, contact_email: e.target.value})}
                          placeholder="admin@school.edu"
                        />
                      </div>
                      <Button 
                        onClick={handleCreateSchool} 
                        className="w-full"
                        disabled={isCreatingSchool || !schoolForm.name || !schoolForm.contact_email}
                      >
                        {isCreatingSchool && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Create School
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>School Name</TableHead>
                    <TableHead>District</TableHead>
                    <TableHead>Contact Email</TableHead>
                    <TableHead>Educators</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schools.map((school) => (
                    <TableRow key={school.id}>
                      <TableCell className="font-medium">{school.name}</TableCell>
                      <TableCell>{school.district}</TableCell>
                      <TableCell>{school.contact_email}</TableCell>
                      <TableCell>{school.educator_count}</TableCell>
                      <TableCell>
                        <Badge variant={school.status === 'active' ? 'default' : 'secondary'}>
                          {school.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="educators" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Educator Accounts</CardTitle>
                  <CardDescription>Manage teacher and staff accounts</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Educator
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Educator Account</DialogTitle>
                      <DialogDescription>
                        Create a new educator account with auto-generated password
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="educator_email">Email</Label>
                        <Input
                          id="educator_email"
                          type="email"
                          value={educatorForm.email}
                          onChange={(e) => setEducatorForm({...educatorForm, email: e.target.value})}
                          placeholder="teacher@school.edu"
                        />
                      </div>
                      <div>
                        <Label htmlFor="educator_name">Full Name</Label>
                        <Input
                          id="educator_name"
                          value={educatorForm.name}
                          onChange={(e) => setEducatorForm({...educatorForm, name: e.target.value})}
                          placeholder="Sarah Johnson"
                        />
                      </div>
                      <div>
                        <Label htmlFor="school_select">School</Label>
                        <Select 
                          value={educatorForm.school_id} 
                          onValueChange={(value) => setEducatorForm({...educatorForm, school_id: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a school" />
                          </SelectTrigger>
                          <SelectContent>
                            {schools.map((school) => (
                              <SelectItem key={school.id} value={school.id}>
                                {school.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="role_select">Role</Label>
                        <Select 
                          value={educatorForm.role} 
                          onValueChange={(value) => setEducatorForm({...educatorForm, role: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="educator">Educator</SelectItem>
                            <SelectItem value="teacher">Teacher</SelectItem>
                            <SelectItem value="principal">Principal</SelectItem>
                            <SelectItem value="administrator">Administrator</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button 
                        onClick={handleCreateEducator} 
                        className="w-full"
                        disabled={isCreatingEducator || !educatorForm.email || !educatorForm.name || !educatorForm.school_id}
                      >
                        {isCreatingEducator && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Create Account
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>School</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {educators.map((educator) => (
                    <TableRow key={educator.id}>
                      <TableCell className="font-medium">{educator.name}</TableCell>
                      <TableCell>{educator.email}</TableCell>
                      <TableCell>{educator.school_name}</TableCell>
                      <TableCell className="capitalize">{educator.role}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={
                              educator.status === 'active' ? 'default' : 
                              educator.status === 'pending' ? 'secondary' : 'destructive'
                            }
                          >
                            {educator.status}
                          </Badge>
                          {educator.password_reset_required && (
                            <Badge variant="outline" className="gap-1">
                              <Key className="h-3 w-3" />
                              Reset Required
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {educator.last_login 
                          ? new Date(educator.last_login).toLocaleDateString()
                          : 'Never'
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}