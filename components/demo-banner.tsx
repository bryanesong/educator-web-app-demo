'use client';

import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { X, Eye } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const { user } = useAuth();

  // Check if user is a demo account
  const isDemoAccount = user?.email === 'demo@teacher.com' || user?.email === 'admin@school.edu';

  if (!isDemoAccount || !isVisible) {
    return null;
  }

  return (
    <Alert className="rounded-none border-l-0 border-r-0 border-t-0 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
      <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      <AlertDescription className="flex items-center justify-between w-full text-blue-900 dark:text-blue-100">
        <span>
          <strong>Demo Mode:</strong> You&apos;re viewing sample data. This is a demonstration of the educator dashboard features.
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="h-6 w-6 p-0 hover:bg-blue-100 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300"
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
}