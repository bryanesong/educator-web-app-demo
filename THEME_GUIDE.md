# 🎨 Theme System Guide

The Wiillow Educator Dashboard uses a completely modular theme system that allows you to change colors, create new themes, and customize the entire appearance from centralized configuration files.

## 📁 Theme Architecture

### Core Files
- **`/lib/themes.ts`** - Main theme configuration (⭐ **Change colors here!**)
- **`/contexts/theme-context.tsx`** - Theme provider and state management
- **`/components/theme-switcher.tsx`** - UI components for theme switching
- **`/app/dashboard/settings/page.tsx`** - Settings page with theme preview

## 🛠️ How to Change Theme Colors

### Option 1: Modify Existing Themes
Edit `/lib/themes.ts` to change colors for existing themes:

```typescript
export const wiillowTheme: Theme = {
  name: 'Wiillow',
  colors: {
    primary: {
      light: '222.2 84% 4.9%',      // ← Change this for light mode primary
      dark: '210 40% 98%',          // ← Change this for dark mode primary
    },
    // ... other colors
  },
};
```

**Color Format**: HSL values without `hsl()` wrapper
- `'222.2 84% 4.9%'` = `hsl(222.2, 84%, 4.9%)`
- Use tools like [HSL Color Picker](https://hslpicker.com/) to get HSL values

### Option 2: Create New Theme
Add a new theme to the `themes` object:

```typescript
export const myCustomTheme: Theme = {
  name: 'My Custom Theme',
  colors: {
    primary: {
      light: '260 100% 50%',        // Purple primary
      dark: '260 100% 70%',         // Lighter purple for dark mode
    },
    // ... copy other colors from existing theme and modify
  },
};

// Add to themes object
export const themes = {
  wiillow: wiillowTheme,
  education: educationTheme,
  friendly: friendlyTheme,
  corporate: corporateTheme,
  custom: myCustomTheme,           // ← Add your theme here
} as const;
```

### Option 3: Brand-Specific Themes
Create themes for different brands or schools:

```typescript
export const springfieldTheme: Theme = {
  name: 'Springfield Elementary',
  colors: {
    primary: {
      light: '120 100% 40%',        // School green
      dark: '120 100% 60%',
    },
    secondary: {
      light: '200 100% 50%',        // School blue
      dark: '200 100% 70%',
    },
    // ... rest of colors
  },
};
```

## 🎯 Available Theme Colors

Each theme defines these color properties:

### Brand Colors
- **`primary`** - Main brand color (buttons, links, active states)
- **`primaryForeground`** - Text color on primary background
- **`secondary`** - Secondary brand color
- **`secondaryForeground`** - Text color on secondary background

### Layout Colors
- **`background`** - Main page background
- **`foreground`** - Main text color
- **`card`** - Card/panel backgrounds
- **`cardForeground`** - Text color on cards

### Interactive Colors
- **`muted`** - Subtle backgrounds (disabled states, etc.)
- **`mutedForeground`** - Subtle text
- **`accent`** - Highlight color (hover states, etc.)
- **`accentForeground`** - Text on accent backgrounds

### System Colors
- **`destructive`** - Error/danger color
- **`border`** - Border color
- **`input`** - Input field borders
- **`ring`** - Focus ring color

### Chart Colors
- **`chart1`** through **`chart5`** - Data visualization colors

## 🔧 Theme Switching Features

### User Controls
1. **Header Theme Switcher** - Palette icon + light/dark toggle
2. **Settings Page** - Full theme management interface
3. **Persistent Storage** - Saves user preferences in localStorage

### Programmatic Control
```typescript
import { useTheme } from '@/contexts/theme-context';

function MyComponent() {
  const { theme, mode, setTheme, setMode, toggleMode } = useTheme();
  
  // Change theme programmatically
  const switchToEducation = () => setTheme('education');
  const enableDarkMode = () => setMode('dark');
  const toggle = () => toggleMode();
}
```

## 🎨 Built-in Themes

### 1. **Wiillow** (Default)
- **Style**: Clean, professional
- **Colors**: Dark blue-gray primary, neutral grays
- **Use**: Default brand theme

### 2. **Education**
- **Style**: Calming, academic
- **Colors**: Bright blue primary, soft greens
- **Use**: Educational institutions

### 3. **Friendly**
- **Style**: Warm, approachable
- **Colors**: Orange and yellow palette
- **Use**: Elementary schools, playful environments

### 4. **Corporate**
- **Style**: Professional, minimal
- **Colors**: Business blue, clean grays
- **Use**: Corporate training, professional settings

## 🌙 Dark Mode Support

Every color in every theme has both light and dark variants:

```typescript
colors: {
  primary: {
    light: '222.2 84% 4.9%',      // Dark color for light mode
    dark: '210 40% 98%',          // Light color for dark mode
  }
}
```

The theme system automatically applies the correct colors based on the user's mode preference.

## 🧪 Testing Themes

### Settings Page Preview
Visit `/dashboard/settings` → Appearance tab to:
- See current theme colors
- Preview how components look
- Switch between all available themes
- View color palettes

### Development Testing
```typescript
// Test all themes quickly
const testThemes = ['wiillow', 'education', 'friendly', 'corporate'];
testThemes.forEach(theme => {
  console.log(`Testing ${theme} theme`);
  setTheme(theme);
});
```

## 🔄 CSS Variable System

The theme system uses CSS custom properties for real-time updates:

```css
/* These are automatically generated from theme config */
:root {
  --primary: 222.2 84% 4.9%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  /* ... all other theme colors */
}

.dark {
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 84% 4.9%;
  /* ... dark mode overrides */
}
```

## 🚀 Advanced Customization

### Dynamic Theme Loading
```typescript
// Load theme from API or user preferences
const loadUserTheme = async (userId: string) => {
  const userPrefs = await fetchUserPreferences(userId);
  if (userPrefs.customTheme) {
    setTheme(userPrefs.customTheme);
  }
};
```

### School-Specific Branding
```typescript
// Set theme based on school domain
const setSchoolTheme = (schoolDomain: string) => {
  const schoolThemes = {
    'springfield.edu': 'education',
    'corporate-training.com': 'corporate',
    'sunny-elementary.org': 'friendly',
  };
  
  const theme = schoolThemes[schoolDomain] || 'wiillow';
  setTheme(theme);
};
```

### Custom CSS Properties
Add your own CSS variables in any theme:

```typescript
// In your theme configuration
colors: {
  // ... standard colors
  customBrand: {
    light: '300 100% 50%',
    dark: '300 100% 70%',
  }
}
```

Then use in CSS:
```css
.my-component {
  background-color: hsl(var(--custom-brand));
}
```

## 📝 Best Practices

1. **Use HSL Colors** - Better for programmatic manipulation
2. **Test Both Modes** - Always check light and dark mode
3. **Maintain Contrast** - Ensure accessibility standards
4. **Keep Consistency** - Use semantic color names
5. **Document Changes** - Comment your custom themes

## 🎯 Quick Start Checklist

To change your app's theme colors:

1. ✅ Open `/lib/themes.ts`
2. ✅ Find the theme you want to modify (e.g., `wiillowTheme`)
3. ✅ Update the HSL values for the colors you want to change
4. ✅ Test in the browser - changes apply instantly!
5. ✅ Check both light and dark modes
6. ✅ Visit `/dashboard/settings` to see the preview

That's it! Your entire app will instantly use the new colors. 🎨