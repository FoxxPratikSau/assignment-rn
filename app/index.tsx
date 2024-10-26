import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import CardDetails from '@/components/CardDetails';
import { images } from '@/constants';
import { opacity } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';

const ONBOARDING_KEY = '@has_seen_onboarding';

// Mock card data for display
const mockCard = {
  id: 1,
  cardNumber: "****9934",
  cardName: "John Doe",
  expiryDate: "05/28",
  cvv: "***",
  type: "visa",
  isDefault: true,
};

export default function OnboardingScreen() {
  const router = useRouter();

  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };


  const styles = {
    whiteCardOffset: {
      top: -14,    // Moves card up/down
      right: -120,   // Moves card left/right
      rotate: '12deg', // Rotation angle
      scale: 0.95,    // Size of the card (1 = 100%)
      blurintensity: 80, // Intensity of the blur effect
      opacity: 0.5, // Opacity of the card
    },
    greenCardPosition: {
      top: 80,     // Distance from top of screen
      left: 20,    // Distance from left of screen
      rotate: '-4deg', // Rotation angle
    },
    requestButton: {
      bottom: -15,  // Vertical position
      right: 20,    // Horizontal position
      rotate: '30deg', // Rotation angle
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header Section  */}
      <View className="px-6 pt-8">
        <Text className="text-2xl font-sf-medium text-black">ProfitPilot.</Text>
      </View>

      {/* Cards Container  */}
      <View className="w-[400px] h-[400px] relative">
        {/* White Blurred Card  */}
        <View 
          style={{
            position: 'absolute',
            top: styles.whiteCardOffset.top,
            right: styles.whiteCardOffset.right,
            transform: [
              { rotate: styles.whiteCardOffset.rotate },
              { scale: styles.whiteCardOffset.scale }
            ],
            zIndex: 2
          }}
          className="w-[320px] bg-white/60 rounded-3xl p-6 shadow-lg"
        >
          <BlurView intensity={20} tint="light" className="absolute inset-0 rounded-3xl" />
          <CardDetails
            card={mockCard}
            balance={40500.80}
            isBlueBackground={false}
          />
        </View>

        {/* Green Main Card */}
        <View 
          style={{
            position: 'absolute',
            top: styles.greenCardPosition.top,
            left: styles.greenCardPosition.left,
            transform: [{ rotate: styles.greenCardPosition.rotate }],
            zIndex: 1
          }}
          className="w-[320px] bg-[#C8E9CA] rounded-3xl p-6 shadow-lg"
        >
          <CardDetails
            card={mockCard}
            balance={40500.80}
            isBlueBackground={false}
          />

          {/* Request Button */}
          <View 
            style={{
              position: 'absolute',
              bottom: styles.requestButton.bottom,
              right: styles.requestButton.right,
              transform: [{ rotate: styles.requestButton.rotate }]
            }}
            className="bg-white/90 px-6 py-3 rounded-full flex-row items-center shadow-sm"
          >
            <Image 
              source={images.request} 
              className="w-4 h-4 mr-2"
              resizeMode="contain"
            />
            <Text className="text-base font-sf-medium">Request</Text>
          </View>
        </View>
      </View>

      {/* Content Section */}
      <View className="flex-1 px-6">
        {/* Title */}
        <Text className="text-[40px] font-sf-regular leading-[48px] text-black mb-1">
          Your
        </Text>
        <Text className="text-[40px] font-sf-bold leading-[48px] text-black mb-1">
          Financial
        </Text>
        <Text className="text-[40px] font-sf-bold leading-[48px] text-black mb-1">
          Navigator
        </Text>
        {/* Description */}
        <Text className="text-gray-500 text-sm font-sf-regular mb-8 leading-6">
          Invest in projects that make a difference. Join us in supporting impactful initiatives and create a positive change in the world.
        </Text>

        {/* Get Started Button */}
        <TouchableOpacity
          onPress={handleGetStarted}
          className="w-full h-[60px] bg-black rounded-2xl items-center justify-center mb-8"
        >
          <Text className="text-white text-lg font-sf-medium">Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}