'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  FileText, 
  Settings, 
  BookOpen,
  MessageSquare,
  LogOut,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { signOut, getUserType, UserType } from '@/lib/auth';
import { useState, useEffect } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Students', href: '/dashboard/students', icon: Users },
  { name: 'Attendance', href: '/dashboard/attendance', icon: Calendar },
  { name: 'Assignments', href: '/dashboard/assignments', icon: BookOpen },
  { name: 'Conversations', href: '/dashboard/conversations', icon: MessageSquare },
  { name: 'Reports', href: '/dashboard/reports', icon: FileText },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

const adminNavigation = [
  { name: 'Admin Portal', href: '/dashboard/admin', icon: Shield },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [userType, setUserType] = useState<UserType>('demo');

  useEffect(() => {
    const checkUserType = async () => {
      if (user) {
        const type = await getUserType(user);
        setUserType(type);
      } else {
        setUserType('demo');
      }
    };
    
    checkUserType();
  }, [user]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="flex flex-col w-64 bg-card border-r border-border h-screen">
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-border">
        <h1 className="text-2xl font-bold text-primary">Wiillow</h1>
        <span className="ml-2 text-sm text-muted-foreground">Educator</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? 'default' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-3',
                  isActive && 'bg-primary text-primary-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          );
        })}
        
        {/* Admin Navigation Section - Only for admin users */}
        {userType === 'admin' && (
          <>
            <div className="my-4 border-t border-border"></div>
            <div className="mb-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium px-3">
                Administration
              </p>
            </div>
            {adminNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    className={cn(
                      'w-full justify-start gap-3',
                      isActive && 'bg-primary text-primary-foreground'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* User info and logout */}
      <div className="p-4 border-t border-border">
        <div className="mb-3">
          <p className="text-sm font-medium">
            {user?.user_metadata?.full_name || user?.email || 'User'}
          </p>
          <div className="flex items-center gap-1">
            <p className="text-xs text-muted-foreground">
              {user?.user_metadata?.school || 'School Name'}
            </p>
            {userType !== 'educator' && (
              <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded capitalize">
                {userType}
              </span>
            )}
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full gap-2"
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          <LogOut className="h-4 w-4" />
          {isSigningOut ? 'Signing Out...' : 'Sign Out'}
        </Button>
      </div>
    </div>
  );
}