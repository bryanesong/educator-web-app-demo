'use client';

import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { getUserType } from '@/lib/auth';

export function DemoModeBanner() {
  const { user } = useAuth();
  const [showDemoBanner, setShowDemoBanner] = useState(false);

  useEffect(() => {
    const checkDemoStatus = async () => {
      if (user) {
        const userType = await getUserType(user);
        setShowDemoBanner(userType === 'demo');
      } else {
        setShowDemoBanner(false);
      }
    };
    
    checkDemoStatus();
  }, [user]);

  if (!showDemoBanner) {
    return null;
  }

  return (
    <Alert className="mx-6 mt-4 border-blue-200 bg-blue-50 text-blue-800">
      <Info className="h-4 w-4" />
      <AlertDescription>
        <strong>Demo Mode:</strong> You&apos;re viewing sample data to explore the platform. 
        This data is not from real students and is for demonstration purposes only.
      </AlertDescription>
    </Alert>
  );
}