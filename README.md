# 🌱 PEAR - Eco Cleaning Platform (Clean Architecture)

A React Native application for environmental cleanup missions with gamification, role-based access, and community features.

## 🏗️ Clean Architecture

This version has been completely rebuilt with a clean, organized architecture:

### 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   └── ui/             # Core UI components (Button, Card, Text, etc.)
├── contexts/           # React Context providers
│   ├── AuthContext.tsx # Authentication state
│   ├── ThemeContext.tsx # Theme management
│   └── XPContext.tsx   # Gamification system
├── navigation/         # Navigation configuration
│   ├── AppNavigator.tsx
│   └── MainTabsNavigator.tsx
├── screens/           # Screen components
│   ├── LoginScreen.tsx
│   ├── DashboardScreen.tsx
│   ├── MissionsScreen.tsx
│   └── ...
├── types/             # TypeScript type definitions
│   └── index.ts
├── constants/         # App constants
│   ├── theme.ts
│   └── levels.ts
└── App.tsx           # Main app component
```

## ✨ Key Features

### 🔐 Authentication System
- Role-based access control
- Demo accounts for testing
- Secure token management
- User profile management

### 🎮 Gamification
- XP and leveling system
- Badges and achievements
- Progress tracking
- Streak counters

### 🎨 Design System
- Consistent UI components
- Dark/light theme support
- Role-based color schemes
- Responsive design

### 📱 Core Screens
- **Login**: Authentication with demo accounts
- **Dashboard**: Overview of user progress and stats
- **Missions**: Browse and accept cleanup missions
- **Map**: Interactive map view (placeholder)
- **Rewards**: Badges, achievements, and level progress
- **Profile**: User settings and account management

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Run on device/simulator:**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   ```

## 🧪 Demo Accounts

Try these demo accounts to explore different roles:

| Username | Password | Role | Description |
|----------|----------|------|-------------|
| `admin` | `admin123` | Admin | Full access to all features |
| `testuser` | `password123` | Trash Hero | Basic cleanup missions |
| `volunteer` | `volunteer123` | Impact Warrior | Community-focused missions |
| `jjmoore254` | `business123` | Eco Defender | Advanced environmental work |

## 🎯 Role System

### Trash Hero
- Basic cleanup missions
- Simple rewards and XP
- Community participation

### Impact Warrior
- Community-focused missions
- Event organization
- Social impact tracking

### Eco Defender
- Advanced environmental work
- Business partnerships
- Impact reporting

### Admin
- Full system access
- User management
- Mission oversight
- Analytics and reporting

## 🛠️ Development

### Code Quality
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Formatting
npm run format

# All quality checks
npm run quality
```

### Testing
```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## 📱 Features Implemented

### ✅ Core Features
- [x] Clean architecture with TypeScript
- [x] Authentication system with role-based access
- [x] Theme system (light/dark mode)
- [x] Gamification (XP, levels, badges)
- [x] Navigation system
- [x] UI component library
- [x] Dashboard with user stats
- [x] Mission browsing system
- [x] Profile management

### 🚧 Placeholder Features
- [ ] Interactive map integration
- [ ] Mission completion flow
- [ ] Photo upload and verification
- [ ] Push notifications
- [ ] Offline support
- [ ] Advanced analytics

## 🎨 Design Principles

### Component Architecture
- **Atomic Design**: Small, reusable components
- **Composition**: Build complex UIs from simple parts
- **Consistency**: Unified design system
- **Accessibility**: Screen reader support

### State Management
- **Context API**: Global state management
- **Local State**: Component-specific state
- **Persistence**: AsyncStorage for user data
- **Type Safety**: Full TypeScript coverage

## 🔧 Configuration

### TypeScript Path Aliases
```typescript
// Use clean imports
import { Button } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types';
```

### Theme Configuration
```typescript
// Customize colors and spacing
const customTheme = {
  colors: { /* ... */ },
  spacing: { /* ... */ },
  typography: { /* ... */ }
};
```

## 📈 Performance

### Optimizations
- **Lazy Loading**: Screen-based code splitting
- **Memoization**: React.memo for expensive components
- **Efficient Re-renders**: Optimized context usage
- **Bundle Size**: Minimal dependencies

### Monitoring
- Performance metrics tracking
- Error boundary implementation
- Memory leak prevention
- Bundle size analysis

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run quality checks
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- React Native community
- Expo team
- Design system inspiration from Material Design
- Gamification patterns from successful apps

---

**Built with ❤️ for a cleaner planet**
