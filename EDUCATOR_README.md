# Wiillow Educator Dashboard

A modern web application for educators to manage students, track progress, and analyze conversations with AI characters.

## Features

- **Dashboard Overview**: Real-time analytics and student engagement metrics
- **Student Management**: View and manage student profiles, mood scores, and activity
- **Attendance Tracking**: Digital check-in/out system with reporting
- **Assignment Management**: Create and track learning activities
- **Conversation Monitoring**: Review student interactions with AI characters
- **Reports & Analytics**: Generate insights on student progress and engagement

## Tech Stack

- **Frontend**: Next.js 15 with App Router
- **UI**: shadcn/ui + Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Backend**: Django REST API (separate repository)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Running Django backend (see main Wiillow repository)

### Installation

1. **Clone and navigate to the directory**:
   ```bash
   cd educator-web-app-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.local.example .env.local
   ```
   Edit `.env.local` with your Django backend URL.

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser.

## Project Structure

```
educator-web-app-frontend/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard pages
│   │   ├── students/      # Student management
│   │   ├── attendance/    # Attendance tracking
│   │   ├── assignments/   # Assignment management
│   │   └── conversations/ # Conversation monitoring
│   ├── login/            # Authentication
│   └── layout.tsx        # Root layout
├── components/
│   ├── ui/               # shadcn/ui components
│   └── layout/           # Layout components (sidebar, header)
├── lib/
│   ├── api.ts            # API client configuration
│   ├── types.ts          # TypeScript type definitions
│   └── utils.ts          # Utility functions
└── public/               # Static assets
```

## API Integration

The frontend connects to the Django backend via REST API:

- **Base URL**: Configure in `NEXT_PUBLIC_API_URL`
- **Authentication**: JWT tokens stored in localStorage
- **Endpoints**: Student data, conversations, attendance, analytics

### Key API Endpoints

```typescript
// Students
GET /api/students/
GET /api/students/{id}/
GET /api/students/{id}/conversations/
GET /api/students/{id}/analytics/

// Attendance
GET /api/attendance/
POST /api/attendance/check-in/
POST /api/attendance/check-out/

// Analytics
GET /api/analytics/dashboard/
GET /api/analytics/mood-trends/
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Components

Use shadcn/ui CLI to add components:

```bash
npx shadcn add [component-name]
```

### Code Style

- TypeScript for type safety
- ESLint + Prettier for code formatting
- Follow Next.js and React best practices

## Key Features

### Dashboard
- Real-time student activity metrics
- Mood score trends and analytics
- Engagement level tracking
- Attendance rate monitoring

### Student Management
- Comprehensive student profiles
- Activity timeline and progress tracking
- Mood score history
- Conversation summaries

### Conversation Monitoring
- View student-AI character interactions
- Analyze conversation topics and sentiment
- Track learning objectives and outcomes
- Character performance analytics

### Attendance System
- Digital check-in/check-out
- Attendance reports and analytics
- Parent notification integration
- Compliance reporting

## Authentication

Currently uses a simple JWT-based system:

1. Login with email/password
2. Receive JWT token from Django backend
3. Store token in localStorage
4. Include token in API requests
5. Redirect to login on 401 errors

For production, consider implementing:
- OAuth integration (Google, Microsoft)
- Multi-factor authentication
- Role-based access control

## Deployment

### Vercel (Recommended for development)

1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Self-hosted

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start
   ```

3. Set up reverse proxy (nginx) if needed

## Environment Variables

```bash
# Required
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Optional (for enhanced features)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret
DATABASE_URL=postgres://...
```

## Contributing

1. Follow the existing code structure and patterns
2. Use TypeScript for all new components
3. Add proper error handling and loading states
4. Test with mock data before backend integration
5. Follow accessibility best practices

## License

This project is part of the Wiillow platform. See the main repository for license information.