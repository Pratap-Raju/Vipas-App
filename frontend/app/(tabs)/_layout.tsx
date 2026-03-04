import { Tabs } from 'expo-router';
import { Circle, Briefcase, BarChart2, Trophy, User } from 'lucide-react-native';
import { View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const baseBottomPadding = Platform.OS === 'ios' ? 18 : 12;
  const tabPaddingBottom = Math.max(baseBottomPadding, insets.bottom + 4);
  const tabBarHeight = 50 + tabPaddingBottom;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#09090B',
          borderTopWidth: 0,
          height: tabBarHeight,
          paddingBottom: tabPaddingBottom,
          paddingTop: 15,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#3F3F46',
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View className={focused ? 'bg-white/10 p-2 rounded-2xl' : 'p-2'}>
              <Circle size={26} color={color} strokeWidth={focused ? 3 : 2} fill={focused ? 'white' : 'transparent'} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="vault"
        options={{
          title: 'Vault',
          tabBarIcon: ({ color, focused }) => (
            <View className={focused ? 'bg-white/10 p-2 rounded-2xl' : 'p-2'}>
              <Briefcase size={26} color={color} strokeWidth={focused ? 2.5 : 2} fill={focused ? color : 'transparent'} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color, focused }) => (
            <View className={focused ? 'bg-white/10 p-2 rounded-2xl' : 'p-2'}>
              <BarChart2 size={26} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="shield"
        options={{
          title: 'Leaderboard',
          tabBarIcon: ({ color, focused }) => (
            <View className={focused ? 'bg-white/10 p-2 rounded-2xl' : 'p-2'}>
              <Trophy size={26} color={color} strokeWidth={focused ? 2.5 : 2} fill={focused ? color : 'transparent'} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View className={focused ? 'bg-white/10 p-2 rounded-2xl' : 'p-2'}>
              <User size={26} color={color} strokeWidth={focused ? 2.5 : 2} fill={focused ? color : 'transparent'} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
