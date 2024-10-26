import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { images } from '@/constants';

interface ActionButtonProps {
  onRequestPress?: () => void;
  onTransferPress?: () => void;
  onAddPress?: () => void;
}

const ActionButtons = ({ 
  onRequestPress, 
  onTransferPress, 
  onAddPress 
}: ActionButtonProps) => {
  return (
    <View className="flex-row items-center justify-between ">
      {/* Request Button */}
      <TouchableOpacity 
        onPress={onRequestPress}
        className="flex-row items-center bg-white rounded-full px-4 py-3  "
      >
        <Image 
          source={images.request} 
          className="w-5 h-5 mr-2"
          resizeMode="contain"
        />
        <Text className="text-base text-gray-900 font-sf-bold p-2">
          Request
        </Text>
      </TouchableOpacity>

      {/* Transfer Button */}
      <TouchableOpacity 
        onPress={onTransferPress}
        className="flex-row items-center bg-white rounded-full px-4 py-3  "
      >
        <Image 
          source={images.transfer} 
          className="w-4 h-4 mr-2"
          resizeMode="contain"
        />
        <Text className="text-base text-gray-900 font-sf-bold p-2">
          Transfer
        </Text>
      </TouchableOpacity>

      {/* Add Button */}
      <TouchableOpacity 
        onPress={onAddPress}
        className="w-16 h-16 bg-black rounded-full items-center justify-center"
      >
        <Text className="text-white text-2xl" style={{ marginTop: -2 }}>
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ActionButtons;