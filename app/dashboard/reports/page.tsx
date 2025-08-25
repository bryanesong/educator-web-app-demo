'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Download, FileText, TrendingUp, Users, BookOpen, Target } from 'lucide-react';

const mockReports = [
  {
    id: '1',
    title: 'Student Progress Summary',
    type: 'progress',
    dateRange: 'Last 30 Days',
    generatedDate: new Date('2024-08-14'),
    status: 'completed',
    downloadUrl: '/reports/student-progress-summary.pdf',
  },
  {
    id: '2',
    title: 'Character Engagement Analysis',
    type: 'engagement',
    dateRange: 'Last Week',
    generatedDate: new Date('2024-08-13'),
    status: 'completed',
    downloadUrl: '/reports/character-engagement.pdf',
  },
  {
    id: '3',
    title: 'Learning Outcomes Report',
    type: 'outcomes',
    dateRange: 'Current Month',
    generatedDate: new Date('2024-08-12'),
    status: 'pending',
    downloadUrl: null,
  },
  {
    id: '4',
    title: 'Attendance & Participation',
    type: 'attendance',
    dateRange: 'Last 2 Weeks',
    generatedDate: new Date('2024-08-10'),
    status: 'completed',
    downloadUrl: '/reports/attendance-participation.pdf',
  },
];

const reportTemplates = [
  {
    id: 'student-progress',
    name: 'Student Progress Report',
    description: 'Individual student learning progress, milestones, and recommendations',
    icon: <TrendingUp className="h-5 w-5" />,
    category: 'Academic'
  },
  {
    id: 'class-overview',
    name: 'Class Overview Report',
    description: 'Class-wide statistics, engagement metrics, and overall performance',
    icon: <Users className="h-5 w-5" />,
    category: 'Academic'
  },
  {
    id: 'character-usage',
    name: 'Character Usage Report',
    description: 'AI character interaction patterns and effectiveness analysis',
    icon: <BookOpen className="h-5 w-5" />,
    category: 'Engagement'
  },
  {
    id: 'learning-outcomes',
    name: 'Learning Outcomes Report',
    description: 'Assessment of educational goals and curriculum alignment',
    icon: <Target className="h-5 w-5" />,
    category: 'Academic'
  },
  {
    id: 'parent-summary',
    name: 'Parent Summary Report',
    description: 'Student activity summary for parent communication',
    icon: <FileText className="h-5 w-5" />,
    category: 'Communication'
  },
];

export default function ReportsPage() {
  const [selectedDateRange, setSelectedDateRange] = useState('last-30-days');
  const [selectedReportType, setSelectedReportType] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredReports = mockReports.filter(report => 
    selectedReportType === 'all' || report.type === selectedReportType
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">
            Generate and download educational reports and analytics
          </p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export All
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockReports.length}</div>
            <p className="text-xs text-muted-foreground">Generated this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockReports.filter(r => r.status === 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground">Ready for download</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockReports.filter(r => r.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Points</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">Student interactions</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList>
          <TabsTrigger value="generate">Generate Reports</TabsTrigger>
          <TabsTrigger value="history">Report History</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Report</CardTitle>
              <CardDescription>
                Select a report template and customize the parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reportTemplates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:bg-accent transition-colors">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          {template.icon}
                        </div>
                        <div>
                          <CardTitle className="text-base">{template.name}</CardTitle>
                          <Badge variant="secondary" className="text-xs">
                            {template.category}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {template.description}
                      </p>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium">Date Range</label>
                          <Select defaultValue="last-30-days">
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                              <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                              <SelectItem value="current-month">Current Month</SelectItem>
                              <SelectItem value="last-month">Last Month</SelectItem>
                              <SelectItem value="custom">Custom Range</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button className="w-full" size="sm">
                          Generate Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report History</CardTitle>
              <CardDescription>
                View and download previously generated reports
              </CardDescription>
              <div className="flex gap-4 mt-4">
                <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reports</SelectItem>
                    <SelectItem value="progress">Progress Reports</SelectItem>
                    <SelectItem value="engagement">Engagement Reports</SelectItem>
                    <SelectItem value="outcomes">Learning Outcomes</SelectItem>
                    <SelectItem value="attendance">Attendance Reports</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                    <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                    <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date Range</TableHead>
                    <TableHead>Generated</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {report.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{report.dateRange}</TableCell>
                      <TableCell>
                        {report.generatedDate.toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {report.status === 'completed' && report.downloadUrl && (
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            View
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