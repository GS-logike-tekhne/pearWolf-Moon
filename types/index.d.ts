// Type declarations for modules without built-in TypeScript support

declare module 'react-native' {
  export * from 'react-native/types';
  export interface ViewProps {
    style?: any;
    children?: React.ReactNode;
  }
  
  export interface TextProps {
    style?: any;
    children?: React.ReactNode;
    numberOfLines?: number;
  }
  
  export interface TouchableOpacityProps {
    style?: any;
    children?: React.ReactNode;
    onPress?: () => void;
    disabled?: boolean;
    activeOpacity?: number;
  }
  
  export interface ScrollViewProps {
    style?: any;
    children?: React.ReactNode;
    showsVerticalScrollIndicator?: boolean;
    showsHorizontalScrollIndicator?: boolean;
  }
  
  export interface SafeAreaViewProps {
    style?: any;
    children?: React.ReactNode;
  }
  
  export interface TextInputProps {
    style?: any;
    placeholder?: string;
    placeholderTextColor?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    multiline?: boolean;
    numberOfLines?: number;
    textAlignVertical?: 'auto' | 'top' | 'bottom' | 'center';
  }
  
  export interface ImageProps {
    source: { uri: string } | number;
    style?: any;
    resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  }
  
  export interface AlertStatic {
    alert(title: string, message?: string, buttons?: any[], options?: any): void;
  }
  
  export interface DimensionsStatic {
    get(dimension: 'window' | 'screen'): { width: number; height: number; scale: number; fontScale: number };
  }
  
  export interface StyleSheetStatic {
    create<T extends Record<string, any>>(styles: T): T;
  }
  
  export const View: React.FC<ViewProps>;
  export const Text: React.FC<TextProps>;
  export const TouchableOpacity: React.FC<TouchableOpacityProps>;
  export const ScrollView: React.FC<ScrollViewProps>;
  export const SafeAreaView: React.FC<SafeAreaViewProps>;
  export const TextInput: React.FC<TextInputProps>;
  export const Image: React.FC<ImageProps>;
  export const StatusBar: any;
  export const Alert: AlertStatic;
  export const Dimensions: DimensionsStatic;
  export const StyleSheet: StyleSheetStatic;
}

declare module 'expo-status-bar' {
  export interface StatusBarProps {
    style?: 'auto' | 'inverted' | 'light' | 'dark';
    backgroundColor?: string;
    translucent?: boolean;
    hidden?: boolean;
    networkActivityIndicatorVisible?: boolean;
    animated?: boolean;
  }
  
  export const StatusBar: React.FC<StatusBarProps>;
}

declare module '@react-navigation/native' {
  export interface NavigationContainerProps {
    children: React.ReactNode;
    theme?: any;
    linking?: any;
    fallback?: React.ComponentType<any> | null;
    documentTitle?: {
      enabled?: boolean;
      formatter?: (options: Record<string, any>, route?: any) => string;
    };
    onReady?: () => void;
    onStateChange?: (state: any) => void;
    initialState?: any;
  }
  
  export const NavigationContainer: React.FC<NavigationContainerProps>;
  export function useNavigation(): any;
  export function useRoute(): any;
  export function useFocusEffect(callback: () => void): void;
}

declare module '@react-navigation/stack' {
  export interface StackNavigationOptions {
    title?: string;
    headerShown?: boolean;
    headerTitle?: string;
    headerTitleStyle?: any;
    headerStyle?: any;
    headerTintColor?: string;
    cardStyle?: any;
    gestureEnabled?: boolean;
    animationEnabled?: boolean;
  }
  
  export interface StackScreenProps {
    name: string;
    component: React.ComponentType<any>;
    options?: StackNavigationOptions | ((props: any) => StackNavigationOptions);
    initialParams?: object;
  }
  
  export interface StackNavigatorProps {
    initialRouteName?: string;
    screenOptions?: StackNavigationOptions | ((props: any) => StackNavigationOptions);
    children: React.ReactNode;
  }
  
  export function createStackNavigator(): {
    Navigator: React.FC<StackNavigatorProps>;
    Screen: React.FC<StackScreenProps>;
  };
}

declare module '@expo/vector-icons' {
  export interface IoniconProps {
    name: string;
    size?: number;
    color?: string;
    style?: any;
  }
  
  export const Ionicons: React.FC<IoniconProps>;
}

declare module '@react-native-async-storage/async-storage' {
  export interface AsyncStorageStatic {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
    clear(): Promise<void>;
    getAllKeys(): Promise<readonly string[]>;
    multiGet(keys: readonly string[]): Promise<readonly [string, string | null][]>;
    multiSet(keyValuePairs: readonly [string, string][]): Promise<void>;
    multiRemove(keys: readonly string[]): Promise<void>;
  }
  
  declare const AsyncStorage: AsyncStorageStatic;
  export default AsyncStorage;
}

declare module 'expo-image-picker' {
  export interface ImagePickerOptions {
    mediaTypes?: MediaTypeOptions;
    allowsEditing?: boolean;
    aspect?: [number, number];
    quality?: number;
    allowsMultipleSelection?: boolean;
  }
  
  export enum MediaTypeOptions {
    All = 'All',
    Videos = 'Videos',
    Images = 'Images',
  }
  
  export interface ImagePickerAsset {
    uri: string;
    width: number;
    height: number;
    type?: 'image' | 'video';
    fileName?: string;
    fileSize?: number;
  }
  
  export interface ImagePickerResult {
    canceled: boolean;
    assets?: ImagePickerAsset[];
  }
  
  export interface PermissionResponse {
    granted: boolean;
    canAskAgain: boolean;
    expires: string;
    status: string;
  }
  
  export function requestCameraPermissionsAsync(): Promise<PermissionResponse>;
  export function requestMediaLibraryPermissionsAsync(): Promise<PermissionResponse>;
  export function launchCameraAsync(options?: ImagePickerOptions): Promise<ImagePickerResult>;
  export function launchImageLibraryAsync(options?: ImagePickerOptions): Promise<ImagePickerResult>;
}