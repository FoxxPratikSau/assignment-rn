import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const LoadingScreen = () => {
  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-gray-100">
      <Text className="text-lg text-gray-500">Loading...</Text>
    </SafeAreaView>
  );
};