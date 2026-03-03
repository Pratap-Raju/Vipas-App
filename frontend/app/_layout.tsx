import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { ErrorBoundary } from './error-boundary';
import { AuthProvider, useAuth } from '@/lib/auth';
import { useEffect } from 'react';
import React from 'react';

function RootLayoutContent() {
  const { colorScheme } = useColorScheme();
  const { session, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';

    if (!session && !inAuthGroup && !inOnboardingGroup && segments.length > 0) {
      // Not logged in, and not in auth/onboarding group -> redirect to onboarding
      router.replace('/(onboarding)');
    } else if (session && (inAuthGroup || inOnboardingGroup)) {
      // Logged in, but in auth/onboarding group -> redirect to dashboard
      // router.replace('/(tabs)/dashboard');
    }
  }, [session, isLoading, segments]);

  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(onboarding)/index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/signup" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)/dashboard" options={{ headerShown: false }} />
          <Stack.Screen name="pricing" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <RootLayoutContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}
