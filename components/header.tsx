import React from 'react';
import { View, Text, Image } from 'react-native';
import { images } from '@/constants';
import "../global.css"
export default function Header() {
    return (
        <View className="flex-row justify-between items-center p-4">
            {/* Left Section: Avatar and Text */}
            <View className="flex-row items-center">
                {/* Circular Avatar Placeholder */}
                <Image
                    source={{ uri: 'https://via.placeholder.com/50' }} // Replace with your actual avatar URL if available
                    className="w-10 h-10 rounded-full"
                />
                {/* Welcome Text */}
                <View className="ml-3">
                    <Text className="text-gray-600 font-sf-regular">Welcome back,</Text>
                    <Text className="text-black font-sf-bold">Sarah Muller</Text>
                </View>
            </View>

            <View className="relative">
                {/* Bell Icon */}
                <Image
                    source={images.bell} // Using the bell icon
                    className="w-8 h-8"
                    resizeMode="contain"
                />
            </View>
        </View>
    );
}
