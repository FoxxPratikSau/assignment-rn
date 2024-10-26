import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { ActivityIndicator, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const ONBOARDING_KEY = '@has_seen_onboarding';


export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "SFPro-Bold": require("../assets/fonts/sf-pro-bold.ttf"),
    "SFPro-Medium": require("../assets/fonts/sf-pro-medium.ttf"),
    "SFPro-Regular": require("../assets/fonts/sf-pro-regular.ttf"),
  });

  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);

  // Temporary change for development: always show onboarding screen
  const showOnboarding = true; // Set this to true to force showing the onboarding screen

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem(ONBOARDING_KEY);
        setHasSeenOnboarding(value === 'true');
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setHasSeenOnboarding(false);
      }
    };
    checkOnboardingStatus();
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded || hasSeenOnboarding === null) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#22C55E" />
        <Text className="mt-2 text-gray-600">Loading...</Text>
      </View>
    );
  }

  if (fontError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Error loading fonts</Text>
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#22C55E',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontFamily: 'SFPro-Medium',
          fontSize: 20,
        },
        headerTitleAlign: 'left',
        headerShadowVisible: false,
        headerShown: false,
      }}
    >
      {showOnboarding ? (
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
            title: 'Onboarding',
          }}
        />
      ) : (
        hasSeenOnboarding ? (
          <Stack.Screen
            name="/(tabs)"
            options={{
              headerShown: false,
            }}
          />
        ) : (
          <Stack.Screen
            name="OnboardingScreen"
            options={{
              headerShown: false,
              title: 'Onboarding',
            }}
          />
        )
      )}
      <Stack.Screen
        name="statistics/[id]"
        options={{
          headerShown: false,
          presentation: 'modal',
          animation: 'slide_from_right',
        }}
      />
    </Stack>
  );
}
