# PEAR App - UI/UX Design Guidelines

## Overview
This document outlines the comprehensive design system and UI/UX standards for the PEAR app, ensuring consistency across all screens and components.

## 🎨 Brand Identity

### Mission Statement
PEAR (People Environmental Action & Rewards) is a gamified environmental cleanup platform that rewards users for making a positive impact on their communities.

### Design Philosophy
- **Clean & Modern**: Minimalist design with focus on content
- **Accessible**: High contrast, readable fonts, intuitive navigation
- **Gamified**: Engaging visual feedback for user actions
- **Role-Based**: Dynamic theming based on user roles
- **Mobile-First**: Optimized for mobile devices with responsive design

## 🎯 Role Color System

### Primary Role Colors
```typescript
TRASH_HERO: '#4CAF50'      // Green - Environmental action
IMPACT_WARRIOR: '#dc2626'   // Red - Social impact  
ECO_DEFENDER: '#007bff'     // Blue - Business/defense
VOLUNTEER: '#6f42c1'        // Purple - Community service
BUSINESS: '#fd7e14'         // Orange - Commercial
ADMIN: '#6c757d'           // Gray - Administrative
```

### Color Usage Guidelines
- **Primary Color**: Used for main actions, progress bars, and role identification
- **Secondary Color**: Used for secondary actions and accents
- **Success Color**: Used for completed actions and positive feedback
- **Warning Color**: Used for caution and pending states
- **Danger Color**: Used for errors and destructive actions

## 📝 Typography System

### Font Hierarchy
```typescript
// Headers
h1: 36px, Bold (700)     // Main page titles
h2: 30px, Bold (700)     // Section headers
h3: 24px, Semibold (600) // Subsection headers
h4: 20px, Semibold (600) // Card titles
h5: 18px, Medium (500)   // Component titles

// Body Text
body: 16px, Regular (400)    // Main content
bodySmall: 14px, Regular (400) // Secondary content
caption: 12px, Regular (400)   // Captions and labels
```

### Typography Rules
- **Line Height**: 1.4 for body text, 1.2 for headers
- **Font Weight**: Use semantic weights (regular, medium, semibold, bold)
- **Text Color**: Primary text for main content, secondary for supporting text
- **Accessibility**: Minimum 16px for body text, high contrast ratios

## 📏 Spacing System

### Base Unit: 8px
```typescript
xs: 4px    // Tight spacing
sm: 8px    // Small spacing  
md: 16px   // Medium spacing (base unit x2)
lg: 24px   // Large spacing
xl: 32px   // Extra large spacing
2xl: 48px  // Section spacing
3xl: 64px  // Page spacing
4xl: 96px  // Screen spacing
```

### Spacing Guidelines
- **Component Padding**: Use md (16px) for standard components
- **Section Spacing**: Use lg (24px) between sections
- **Screen Padding**: Use lg (24px) for screen edges
- **Card Spacing**: Use md (16px) for card content

## 🔲 Border Radius System

```typescript
none: 0px     // Sharp corners
sm: 4px       // Small radius
md: 8px       // Medium radius (default)
lg: 12px      // Large radius
xl: 16px      // Extra large radius
2xl: 24px     // Very large radius
full: 9999px  // Fully rounded (pills, circles)
```

### Usage Guidelines
- **Buttons**: Use md (8px) for standard buttons
- **Cards**: Use lg (12px) for card containers
- **Inputs**: Use md (8px) for form inputs
- **Badges**: Use full for pill-shaped badges

## 🌟 Shadow System

```typescript
none: No shadow
sm:   Subtle shadow for cards
md:   Standard shadow for elevated elements
lg:   Prominent shadow for modals
xl:   Dramatic shadow for overlays
```

### Shadow Guidelines
- **Cards**: Use md shadow for standard elevation
- **Buttons**: Use sm shadow for subtle depth
- **Modals**: Use lg shadow for prominent overlay
- **Floating Elements**: Use xl shadow for maximum elevation

## 🔘 Button Styles

### Primary Button
- **Background**: Role-specific primary color
- **Text**: White
- **Padding**: 16px vertical, 24px horizontal
- **Border Radius**: 8px
- **Shadow**: Small shadow
- **States**: Hover, active, disabled

### Secondary Button
- **Background**: Light gray (#f8f9fa)
- **Text**: Dark gray (#212529)
- **Border**: 1px solid gray
- **Padding**: 16px vertical, 24px horizontal
- **Border Radius**: 8px

### Outline Button
- **Background**: Transparent
- **Text**: Role-specific primary color
- **Border**: 2px solid primary color
- **Padding**: 16px vertical, 24px horizontal
- **Border Radius**: 8px

### Ghost Button
- **Background**: Transparent
- **Text**: Role-specific primary color
- **Padding**: 8px vertical, 16px horizontal
- **Border Radius**: 4px

### Disabled Button
- **Background**: Light gray (#e9ecef)
- **Text**: Muted gray (#6c757d)
- **Opacity**: 0.6
- **No interactions**: Disabled state

## 🃏 Card Styles

### Standard Card
- **Background**: White
- **Border Radius**: 12px
- **Padding**: 24px
- **Shadow**: Medium shadow
- **Border**: None

### Elevated Card
- **Background**: White
- **Border Radius**: 12px
- **Padding**: 24px
- **Shadow**: Large shadow
- **Border**: None

### Flat Card
- **Background**: White
- **Border Radius**: 12px
- **Padding**: 24px
- **Shadow**: None
- **Border**: 1px solid light gray

## 📝 Input Styles

### Default Input
- **Background**: White
- **Border**: 1px solid medium gray
- **Border Radius**: 8px
- **Padding**: 16px vertical, 24px horizontal
- **Font Size**: 16px
- **Text Color**: Dark gray

### Focused Input
- **Background**: White
- **Border**: 2px solid primary color
- **Border Radius**: 8px
- **Padding**: 16px vertical, 24px horizontal
- **Font Size**: 16px
- **Text Color**: Dark gray

### Error Input
- **Background**: White
- **Border**: 2px solid danger color
- **Border Radius**: 8px
- **Padding**: 16px vertical, 24px horizontal
- **Font Size**: 16px
- **Text Color**: Dark gray

### Disabled Input
- **Background**: Light gray
- **Border**: 1px solid light gray
- **Border Radius**: 8px
- **Padding**: 16px vertical, 24px horizontal
- **Font Size**: 16px
- **Text Color**: Muted gray
- **Opacity**: 0.6

## 🎮 Gamification Styles

### XP Progress Bar
- **Height**: 8px
- **Background**: Light gray
- **Fill**: Role-specific primary color
- **Border Radius**: Full (pill shape)
- **Animation**: Smooth progress animation

### Badge Styles
- **Background**: Warning color (#ffc107)
- **Text**: Dark gray
- **Padding**: 4px vertical, 8px horizontal
- **Border Radius**: Full (pill shape)
- **Shadow**: Subtle glow effect

### Level Indicator
- **Background**: Role-specific primary color
- **Text**: White
- **Padding**: 4px vertical, 8px horizontal
- **Border Radius**: 8px
- **Font Weight**: Semibold

### Achievement Styles
- **Standard**: White background, medium shadow
- **Unlocked**: White background, warning border, large shadow
- **Animation**: Subtle glow and scale effect

## 📱 Layout Guidelines

### Safe Area Rules
- **Top**: Account for status bar (44px on iOS)
- **Bottom**: Account for home indicator (34px on iOS)
- **Sides**: Use standard screen padding (24px)

### Screen Layout
- **Container**: Full screen with safe area
- **Content**: Scrollable with consistent padding
- **Header**: Fixed or sticky with role color
- **Footer**: Optional, with consistent styling

### Responsive Design
- **Mobile First**: Design for mobile, scale up
- **Breakpoints**: Use device dimensions for scaling
- **Touch Targets**: Minimum 44px for interactive elements
- **Accessibility**: Support for screen readers and voice control

## 🎨 Animation Guidelines

### Duration
- **Fast**: 150ms (micro-interactions)
- **Normal**: 300ms (standard transitions)
- **Slow**: 500ms (complex animations)

### Easing
- **Ease In**: For elements appearing
- **Ease Out**: For elements disappearing
- **Ease In Out**: For state changes

### Animation Types
- **Fade**: For content transitions
- **Slide**: For navigation
- **Scale**: For button presses
- **Glow**: For achievements and badges

## ♿ Accessibility Guidelines

### Color Contrast
- **Normal Text**: 4.5:1 minimum ratio
- **Large Text**: 3:1 minimum ratio
- **UI Elements**: 3:1 minimum ratio

### Touch Targets
- **Minimum Size**: 44px x 44px
- **Spacing**: 8px minimum between targets
- **Visual Feedback**: Clear pressed states

### Screen Reader Support
- **Labels**: All interactive elements labeled
- **Headings**: Proper heading hierarchy
- **Focus**: Clear focus indicators
- **Announcements**: Important state changes announced

## 🔧 Implementation Guidelines

### Component Structure
```typescript
// Use ScreenLayout wrapper
<ScreenLayout>
  <View style={styles.container}>
    {/* Screen content */}
  </View>
</ScreenLayout>
```

### Style Organization
```typescript
// Use theme constants
const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.background,
    padding: THEME.SPACING.lg,
  },
  button: {
    ...THEME.BUTTON_STYLES.primary,
    backgroundColor: getRoleColor(role),
  },
});
```

### Role-Based Theming
```typescript
// Get role-specific colors
const roleColor = getRoleColor(currentRole);
const roleTheme = getRoleTheme(currentRole);
```

## 📊 Quality Checklist

### Before Release
- [ ] All screens use ScreenLayout wrapper
- [ ] No hardcoded colors or spacing
- [ ] Consistent typography hierarchy
- [ ] Proper button and input styling
- [ ] Role-based color theming
- [ ] Accessibility compliance
- [ ] Animation performance
- [ ] Cross-platform consistency

### Testing Requirements
- [ ] Visual regression testing
- [ ] Accessibility testing
- [ ] Performance testing
- [ ] Cross-device testing
- [ ] User acceptance testing

---

*This document is living and should be updated as the design system evolves.*
