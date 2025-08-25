export type ThemeColor = {
  light: string;
  dark: string;
};

export type Theme = {
  name: string;
  colors: {
    // Primary brand colors
    primary: ThemeColor;
    primaryForeground: ThemeColor;
    
    // Secondary colors
    secondary: ThemeColor;
    secondaryForeground: ThemeColor;
    
    // Background colors
    background: ThemeColor;
    foreground: ThemeColor;
    
    // UI element colors
    card: ThemeColor;
    cardForeground: ThemeColor;
    popover: ThemeColor;
    popoverForeground: ThemeColor;
    
    // Interactive colors
    muted: ThemeColor;
    mutedForeground: ThemeColor;
    accent: ThemeColor;
    accentForeground: ThemeColor;
    
    // Status colors
    destructive: ThemeColor;
    destructiveForeground: ThemeColor;
    
    // Border and input colors
    border: ThemeColor;
    input: ThemeColor;
    ring: ThemeColor;
    
    // Chart colors
    chart1: ThemeColor;
    chart2: ThemeColor;
    chart3: ThemeColor;
    chart4: ThemeColor;
    chart5: ThemeColor;
  };
};

// Default Wiillow Theme (current shadcn theme)
export const wiillowTheme: Theme = {
  name: 'Wiillow',
  colors: {
    primary: {
      light: '222.2 84% 4.9%',      // Dark blue-gray
      dark: '210 40% 98%',          // Light gray
    },
    primaryForeground: {
      light: '210 40% 98%',         // Light text
      dark: '222.2 84% 4.9%',       // Dark text
    },
    secondary: {
      light: '210 40% 96%',         // Very light gray
      dark: '217.2 32.6% 17.5%',    // Dark gray
    },
    secondaryForeground: {
      light: '222.2 84% 4.9%',      // Dark text
      dark: '210 40% 98%',          // Light text
    },
    background: {
      light: '0 0% 100%',           // White
      dark: '222.2 84% 4.9%',       // Very dark
    },
    foreground: {
      light: '222.2 84% 4.9%',      // Dark text
      dark: '210 40% 98%',          // Light text
    },
    card: {
      light: '0 0% 100%',           // White
      dark: '222.2 84% 4.9%',       // Very dark
    },
    cardForeground: {
      light: '222.2 84% 4.9%',      // Dark text
      dark: '210 40% 98%',          // Light text
    },
    popover: {
      light: '0 0% 100%',           // White
      dark: '222.2 84% 4.9%',       // Very dark
    },
    popoverForeground: {
      light: '222.2 84% 4.9%',      // Dark text
      dark: '210 40% 98%',          // Light text
    },
    muted: {
      light: '210 40% 96%',         // Very light gray
      dark: '217.2 32.6% 17.5%',    // Dark gray
    },
    mutedForeground: {
      light: '215.4 16.3% 46.9%',   // Medium gray
      dark: '215 20.2% 65.1%',      // Light gray
    },
    accent: {
      light: '210 40% 96%',         // Very light gray
      dark: '217.2 32.6% 17.5%',    // Dark gray
    },
    accentForeground: {
      light: '222.2 84% 4.9%',      // Dark text
      dark: '210 40% 98%',          // Light text
    },
    destructive: {
      light: '0 84.2% 60.2%',       // Red
      dark: '0 62.8% 30.6%',        // Dark red
    },
    destructiveForeground: {
      light: '210 40% 98%',         // Light text
      dark: '210 40% 98%',          // Light text
    },
    border: {
      light: '214.3 31.8% 91.4%',   // Light border
      dark: '217.2 32.6% 17.5%',    // Dark border
    },
    input: {
      light: '214.3 31.8% 91.4%',   // Light border
      dark: '217.2 32.6% 17.5%',    // Dark border
    },
    ring: {
      light: '222.2 84% 4.9%',      // Dark ring
      dark: '212.7 26.8% 83.9%',    // Light ring
    },
    chart1: {
      light: '12 76% 61%',          // Orange
      dark: '220 70% 50%',          // Blue
    },
    chart2: {
      light: '173 58% 39%',         // Teal
      dark: '160 60% 45%',          // Green
    },
    chart3: {
      light: '197 37% 24%',         // Dark blue
      dark: '30 80% 55%',           // Orange
    },
    chart4: {
      light: '43 74% 66%',          // Yellow
      dark: '280 65% 60%',          // Purple
    },
    chart5: {
      light: '27 87% 67%',          // Red-orange
      dark: '340 75% 55%',          // Pink
    },
  },
};

// Education-focused theme with calming blues and greens
export const educationTheme: Theme = {
  name: 'Education',
  colors: {
    primary: {
      light: '217 91% 60%',         // Bright blue
      dark: '217 91% 60%',          // Same blue
    },
    primaryForeground: {
      light: '0 0% 100%',           // White
      dark: '0 0% 100%',            // White
    },
    secondary: {
      light: '142 76% 36%',         // Green
      dark: '142 76% 36%',          // Green
    },
    secondaryForeground: {
      light: '0 0% 100%',           // White
      dark: '0 0% 100%',            // White
    },
    background: {
      light: '210 100% 99%',        // Very light blue
      dark: '217 33% 7%',           // Very dark blue
    },
    foreground: {
      light: '217 33% 17%',         // Dark blue
      dark: '210 40% 98%',          // Light text
    },
    card: {
      light: '0 0% 100%',           // White
      dark: '217 33% 12%',          // Dark blue
    },
    cardForeground: {
      light: '217 33% 17%',         // Dark blue
      dark: '210 40% 98%',          // Light text
    },
    popover: {
      light: '0 0% 100%',           // White
      dark: '217 33% 12%',          // Dark blue
    },
    popoverForeground: {
      light: '217 33% 17%',         // Dark blue
      dark: '210 40% 98%',          // Light text
    },
    muted: {
      light: '210 100% 95%',        // Light blue
      dark: '217 33% 15%',          // Dark blue
    },
    mutedForeground: {
      light: '217 33% 45%',         // Medium blue
      dark: '217 33% 65%',          // Light blue
    },
    accent: {
      light: '142 76% 90%',         // Very light green
      dark: '142 76% 25%',          // Dark green
    },
    accentForeground: {
      light: '142 76% 25%',         // Dark green
      dark: '142 76% 90%',          // Light green
    },
    destructive: {
      light: '0 84% 60%',           // Red
      dark: '0 63% 31%',            // Dark red
    },
    destructiveForeground: {
      light: '210 40% 98%',         // Light text
      dark: '210 40% 98%',          // Light text
    },
    border: {
      light: '217 91% 85%',         // Light blue border
      dark: '217 33% 20%',          // Dark blue border
    },
    input: {
      light: '217 91% 85%',         // Light blue border
      dark: '217 33% 20%',          // Dark blue border
    },
    ring: {
      light: '217 91% 60%',         // Blue ring
      dark: '217 91% 60%',          // Blue ring
    },
    chart1: {
      light: '217 91% 60%',         // Blue
      dark: '217 91% 60%',          // Blue
    },
    chart2: {
      light: '142 76% 36%',         // Green
      dark: '142 76% 45%',          // Light green
    },
    chart3: {
      light: '45 93% 47%',          // Orange
      dark: '45 93% 55%',           // Light orange
    },
    chart4: {
      light: '262 83% 58%',         // Purple
      dark: '262 83% 65%',          // Light purple
    },
    chart5: {
      light: '346 87% 43%',         // Pink
      dark: '346 87% 55%',          // Light pink
    },
  },
};

// Warm, friendly theme with oranges and soft colors
export const friendlyTheme: Theme = {
  name: 'Friendly',
  colors: {
    primary: {
      light: '25 95% 53%',          // Bright orange
      dark: '25 95% 53%',           // Same orange
    },
    primaryForeground: {
      light: '0 0% 100%',           // White
      dark: '0 0% 100%',            // White
    },
    secondary: {
      light: '48 96% 53%',          // Yellow
      dark: '48 96% 53%',           // Yellow
    },
    secondaryForeground: {
      light: '25 95% 15%',          // Dark orange
      dark: '25 95% 15%',           // Dark orange
    },
    background: {
      light: '48 100% 99%',         // Very light yellow
      dark: '25 25% 8%',            // Very dark orange
    },
    foreground: {
      light: '25 25% 15%',          // Dark orange-brown
      dark: '48 100% 98%',          // Light text
    },
    card: {
      light: '0 0% 100%',           // White
      dark: '25 25% 12%',           // Dark orange
    },
    cardForeground: {
      light: '25 25% 15%',          // Dark orange-brown
      dark: '48 100% 98%',          // Light text
    },
    popover: {
      light: '0 0% 100%',           // White
      dark: '25 25% 12%',           // Dark orange
    },
    popoverForeground: {
      light: '25 25% 15%',          // Dark orange-brown
      dark: '48 100% 98%',          // Light text
    },
    muted: {
      light: '48 100% 95%',         // Light yellow
      dark: '25 25% 18%',           // Dark orange
    },
    mutedForeground: {
      light: '25 25% 45%',          // Medium orange
      dark: '25 25% 65%',           // Light orange
    },
    accent: {
      light: '340 82% 90%',         // Very light pink
      dark: '340 82% 25%',          // Dark pink
    },
    accentForeground: {
      light: '340 82% 25%',         // Dark pink
      dark: '340 82% 90%',          // Light pink
    },
    destructive: {
      light: '0 84% 60%',           // Red
      dark: '0 63% 31%',            // Dark red
    },
    destructiveForeground: {
      light: '210 40% 98%',         // Light text
      dark: '210 40% 98%',          // Light text
    },
    border: {
      light: '25 95% 85%',          // Light orange border
      dark: '25 25% 25%',           // Dark orange border
    },
    input: {
      light: '25 95% 85%',          // Light orange border
      dark: '25 25% 25%',           // Dark orange border
    },
    ring: {
      light: '25 95% 53%',          // Orange ring
      dark: '25 95% 53%',           // Orange ring
    },
    chart1: {
      light: '25 95% 53%',          // Orange
      dark: '25 95% 60%',           // Light orange
    },
    chart2: {
      light: '340 82% 52%',         // Pink
      dark: '340 82% 60%',          // Light pink
    },
    chart3: {
      light: '48 96% 53%',          // Yellow
      dark: '48 96% 60%',           // Light yellow
    },
    chart4: {
      light: '262 83% 58%',         // Purple
      dark: '262 83% 65%',          // Light purple
    },
    chart5: {
      light: '142 76% 36%',         // Green
      dark: '142 76% 45%',          // Light green
    },
  },
};

// Professional corporate theme
export const corporateTheme: Theme = {
  name: 'Corporate',
  colors: {
    primary: {
      light: '221 83% 53%',         // Professional blue
      dark: '221 83% 53%',          // Same blue
    },
    primaryForeground: {
      light: '0 0% 100%',           // White
      dark: '0 0% 100%',            // White
    },
    secondary: {
      light: '210 40% 94%',         // Light gray
      dark: '215 28% 17%',          // Dark gray
    },
    secondaryForeground: {
      light: '215 28% 17%',         // Dark gray
      dark: '210 40% 94%',          // Light gray
    },
    background: {
      light: '0 0% 100%',           // Pure white
      dark: '224 71% 4%',           // Very dark blue
    },
    foreground: {
      light: '224 71% 4%',          // Very dark blue
      dark: '210 20% 98%',          // Light text
    },
    card: {
      light: '0 0% 100%',           // White
      dark: '224 71% 7%',           // Dark blue
    },
    cardForeground: {
      light: '224 71% 4%',          // Very dark blue
      dark: '210 20% 98%',          // Light text
    },
    popover: {
      light: '0 0% 100%',           // White
      dark: '224 71% 7%',           // Dark blue
    },
    popoverForeground: {
      light: '224 71% 4%',          // Very dark blue
      dark: '210 20% 98%',          // Light text
    },
    muted: {
      light: '220 14% 96%',         // Very light gray
      dark: '215 28% 17%',          // Dark gray
    },
    mutedForeground: {
      light: '220 9% 46%',          // Medium gray
      dark: '217 20% 65%',          // Light gray
    },
    accent: {
      light: '220 14% 96%',         // Very light gray
      dark: '215 28% 17%',          // Dark gray
    },
    accentForeground: {
      light: '220 9% 15%',          // Dark gray
      dark: '210 20% 98%',          // Light text
    },
    destructive: {
      light: '0 84% 60%',           // Red
      dark: '0 63% 31%',            // Dark red
    },
    destructiveForeground: {
      light: '210 40% 98%',         // Light text
      dark: '210 40% 98%',          // Light text
    },
    border: {
      light: '220 13% 91%',         // Light border
      dark: '215 28% 17%',          // Dark border
    },
    input: {
      light: '220 13% 91%',         // Light border
      dark: '215 28% 17%',          // Dark border
    },
    ring: {
      light: '221 83% 53%',         // Blue ring
      dark: '221 83% 53%',          // Blue ring
    },
    chart1: {
      light: '221 83% 53%',         // Blue
      dark: '221 83% 60%',          // Light blue
    },
    chart2: {
      light: '220 9% 46%',          // Gray
      dark: '220 9% 55%',           // Light gray
    },
    chart3: {
      light: '215 28% 17%',         // Dark gray
      dark: '215 28% 25%',          // Medium dark gray
    },
    chart4: {
      light: '197 37% 24%',         // Navy
      dark: '197 37% 35%',          // Light navy
    },
    chart5: {
      light: '200 50% 30%',         // Steel blue
      dark: '200 50% 40%',          // Light steel blue
    },
  },
};

export const themes = {
  wiillow: wiillowTheme,
  education: educationTheme,
  friendly: friendlyTheme,
  corporate: corporateTheme,
} as const;

export type ThemeName = keyof typeof themes;