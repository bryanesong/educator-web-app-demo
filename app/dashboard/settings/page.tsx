'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { useTheme } from '@/contexts/theme-context';
import { themes } from '@/lib/themes';
import { useAuth } from '@/hooks/use-auth';
import { User, Palette, School } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, currentTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application preferences
        </p>
      </div>

      <Tabs defaultValue="appearance" className="space-y-6">
        <TabsList>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="school">School</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Theme & Appearance
              </CardTitle>
              <CardDescription>
                Customize the look and feel of your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Theme Display */}
              <div>
                <Label className="text-base font-medium">Current Theme</Label>
                <div className="mt-2 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{currentTheme.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Active theme configuration
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <div 
                        className="w-8 h-8 rounded-full border-2"
                        style={{ backgroundColor: `hsl(${currentTheme.colors.primary.light})` }}
                        title="Primary Light"
                      />
                      <div 
                        className="w-8 h-8 rounded-full border-2"
                        style={{ backgroundColor: `hsl(${currentTheme.colors.secondary.light})` }}
                        title="Secondary Light"
                      />
                      <div 
                        className="w-8 h-8 rounded-full border-2"
                        style={{ backgroundColor: `hsl(${currentTheme.colors.accent.light})` }}
                        title="Accent Light"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Theme Controls */}
              <div>
                <Label className="text-base font-medium">Theme Controls</Label>
                <div className="mt-2 flex items-center gap-4">
                  <ThemeSwitcher />
                  <span className="text-sm text-muted-foreground">
                    Use the palette and mode buttons to change themes
                  </span>
                </div>
              </div>

              {/* Theme Preview */}
              <div>
                <Label className="text-base font-medium">Theme Preview</Label>
                <div className="mt-2 p-6 border rounded-lg space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Sample Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Sample Card</CardTitle>
                        <CardDescription>This is how cards look with your theme</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button className="mr-2">Primary Button</Button>
                        <Button variant="outline">Secondary Button</Button>
                      </CardContent>
                    </Card>

                    {/* Color Palette */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Color Palette</h4>
                      <div className="grid grid-cols-4 gap-2">
                        {Object.entries(currentTheme.colors).slice(0, 8).map(([name, color]) => (
                          <div key={name} className="text-center">
                            <div 
                              className="w-full h-8 rounded border"
                              style={{ backgroundColor: `hsl(${color.light})` }}
                            />
                            <span className="text-xs text-muted-foreground mt-1 block">
                              {name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Available Themes */}
              <div>
                <Label className="text-base font-medium">Available Themes</Label>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(themes).map(([themeName, themeConfig]) => (
                    <div 
                      key={themeName}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        theme === themeName ? 'border-primary bg-accent' : 'hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{themeConfig.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {themeName === 'wiillow' && 'Default Wiillow theme'}
                            {themeName === 'education' && 'Calming blues and greens'}
                            {themeName === 'friendly' && 'Warm oranges and yellows'}
                            {themeName === 'corporate' && 'Professional blue palette'}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <div 
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: `hsl(${themeConfig.colors.primary.light})` }}
                          />
                          <div 
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: `hsl(${themeConfig.colors.secondary.light})` }}
                          />
                          <div 
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: `hsl(${themeConfig.colors.accent.light})` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  value={user?.email || ''} 
                  disabled 
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input 
                  id="fullName" 
                  defaultValue={user?.user_metadata?.full_name || ''} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input 
                  id="role" 
                  defaultValue={user?.user_metadata?.role || 'teacher'} 
                />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="school" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="h-5 w-5" />
                School Information
              </CardTitle>
              <CardDescription>
                Manage your school and district settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="school">School Name</Label>
                <Input 
                  id="school" 
                  defaultValue={user?.user_metadata?.school || ''} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input 
                  id="district" 
                  defaultValue={user?.user_metadata?.district || ''} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input 
                  id="timezone" 
                  defaultValue="America/New_York" 
                />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}