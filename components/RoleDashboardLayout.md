# RoleDashboardLayout Component

A reusable layout component that provides a consistent UI skeleton for all role-based dashboards in the PEAR app.

## Features

- **Unified Header**: Consistent header with role-based theming
- **Role Toggle**: Optional toggle between Trash Hero and Impact Warrior roles
- **My Card Section**: Profile display with role-specific badges and information
- **Key Metrics**: Configurable metrics grid (3 columns)
- **Quick Actions**: Configurable action buttons (2x3 grid)
- **Recent Activity**: Activity feed with status indicators
- **Menu Modal**: Integrated menu with role-specific navigation
- **Custom Content**: Support for additional custom content and children

## Usage

### Basic Usage

```tsx
import RoleDashboardLayout from '../components/RoleDashboardLayout';
import { UserRole } from '../types/roles';
import { getRoleColor } from '../utils/roleColors';

const MyDashboard = ({ navigation }) => {
  const role: UserRole = 'ECO_DEFENDER';
  
  const roleConfig = {
    title: 'EcoDefender Corp',
    subtitle: 'EcoDefender',
    color: getRoleColor('business'),
    level: 6,
    points: 3450,
    progress: 93,
    nextLevelPoints: 150,
    badge: 'Green Pioneer',
    badgeIcon: '🌱',
  };

  const keyMetrics = [
    { label: 'Jobs Created', value: '47', icon: 'briefcase', color: getRoleColor('business') },
    { label: 'CO₂ Offset', value: '850 kg', icon: 'leaf', color: getRoleColor('trash-hero') },
    { label: 'ESG Rank', value: '#8', icon: 'trophy', color: '#8b5cf6' },
  ];

  const quickActions = [
    { title: 'Post New Job', icon: 'add-circle', color: getRoleColor('business'), onPress: () => navigation.navigate('PostJob') },
    { title: 'Manage Missions', icon: 'list', color: getRoleColor('trash-hero'), onPress: () => navigation.navigate('EcoDefenderMissions') },
    // ... more actions
  ];

  const recentActivity = [
    {
      id: '1',
      title: 'Beach Cleanup Funded',
      description: 'Sponsored 15 volunteers for Ocean Beach cleanup',
      status: 'Completed',
      time: '2 hours ago',
      icon: 'leaf',
      color: '#28a745',
    },
    // ... more activities
  ];

  return (
    <RoleDashboardLayout
      navigation={navigation}
      role={role}
      roleConfig={roleConfig}
      keyMetrics={keyMetrics}
      quickActions={quickActions}
      recentActivity={recentActivity}
    />
  );
};
```

### With Role Toggle

```tsx
const UnifiedHeroDashboard = ({ navigation }) => {
  const { currentRole, setCurrentRole, user } = useAuth();
  
  const toggleRole = () => {
    if (user && (user.role === 'TRASH_HERO' || user.role === 'IMPACT_WARRIOR')) {
      const newRole = currentRole === 'TRASH_HERO' ? 'IMPACT_WARRIOR' : 'TRASH_HERO';
      setCurrentRole(newRole);
    }
  };

  const showToggle = user && (user.role === 'TRASH_HERO' || user.role === 'IMPACT_WARRIOR');

  return (
    <RoleDashboardLayout
      navigation={navigation}
      role={currentRole}
      roleConfig={getRoleConfig()}
      keyMetrics={getKeyMetrics()}
      quickActions={getQuickActions()}
      recentActivity={getRecentActivity()}
      showToggle={showToggle}
      onToggleRole={toggleRole}
    />
  );
};
```

### With Custom Content

```tsx
const CustomDashboard = ({ navigation }) => {
  const customContent = (
    <View style={styles.customSection}>
      <Text>Custom dashboard content here</Text>
    </View>
  );

  return (
    <RoleDashboardLayout
      navigation={navigation}
      role="ADMIN"
      roleConfig={roleConfig}
      keyMetrics={keyMetrics}
      quickActions={quickActions}
      recentActivity={recentActivity}
      customContent={customContent}
    >
      <View style={styles.additionalContent}>
        <Text>Additional children content</Text>
      </View>
    </RoleDashboardLayout>
  );
};
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `navigation` | `any` | ✅ | Navigation object from React Navigation |
| `role` | `UserRole` | ✅ | Current user role |
| `roleConfig` | `RoleConfig` | ✅ | Role-specific configuration object |
| `keyMetrics` | `KeyMetric[]` | ✅ | Array of key metrics to display |
| `quickActions` | `QuickAction[]` | ✅ | Array of quick action buttons |
| `recentActivity` | `RecentActivity[]` | ✅ | Array of recent activities |
| `children` | `ReactNode` | ❌ | Additional content to render |
| `showToggle` | `boolean` | ❌ | Whether to show role toggle (default: false) |
| `onToggleRole` | `() => void` | ❌ | Callback for role toggle |
| `customHeader` | `ReactNode` | ❌ | Custom header component |
| `customContent` | `ReactNode` | ❌ | Custom content section |

## Type Definitions

### RoleConfig
```tsx
interface RoleConfig {
  title: string;
  subtitle: string;
  color: string;
  level: number;
  points: number;
  progress: number;
  nextLevelPoints: number;
  badge: string;
  badgeIcon: string;
}
```

### KeyMetric
```tsx
interface KeyMetric {
  label: string;
  value: string;
  icon: string;
  color: string;
}
```

### QuickAction
```tsx
interface QuickAction {
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
}
```

### RecentActivity
```tsx
interface RecentActivity {
  id: string;
  title: string;
  description: string;
  status: string;
  time: string;
  icon: string;
  color: string;
}
```

## Benefits

1. **Consistency**: All role-based dashboards use the same UI skeleton
2. **Maintainability**: Changes to the layout only need to be made in one place
3. **Reusability**: Easy to create new role-based dashboards
4. **Flexibility**: Support for custom content and role-specific configurations
5. **Type Safety**: Full TypeScript support with proper type definitions

## Migration Guide

To migrate an existing dashboard to use `RoleDashboardLayout`:

1. **Extract Configuration**: Move role-specific data to configuration objects
2. **Remove Duplicate Code**: Remove header, menu modal, and layout code
3. **Import Component**: Import `RoleDashboardLayout` and required types
4. **Pass Props**: Pass all required props to the layout component
5. **Test**: Ensure all functionality works as expected

## Examples

See the refactored dashboard examples:
- `screens/EcoDefenderDashboardRefactored.tsx`
- `screens/AdminDashboardRefactored.tsx`
- `screens/UnifiedHeroDashboardRefactored.tsx`
