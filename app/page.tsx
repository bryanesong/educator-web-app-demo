import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to dashboard (in production, check auth first)
  redirect('/dashboard');
}
