import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Card } from '../models/userModel';
import { images } from '@/constants';

interface CardDetailsProps {
  card: Card;
  balance: number;
  currency?: string;
  isBlueBackground?: boolean;
}

const CardDetails = ({ 
  card, 
  balance, 
  currency = 'US Dollar',
  isBlueBackground = true 
}: CardDetailsProps) => {
  const [isAmountVisible, setAmountVisible] = useState(true);

  const formattedBalance = balance.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  const hiddenBalance = '•'.repeat(formattedBalance.length);

  const labelTextColor = isBlueBackground ? 'text-white' : 'text-gray-400';
  const valueTextColor = isBlueBackground ? 'text-gray-800' : 'text-gray-900';
  const flagContainerBg = isBlueBackground ? 'bg-white' : 'bg-gray-100';
  const toggleBtnBg = isBlueBackground ? 'bg-[#92d0e7]' : 'bg-gray-200';

  return (
    <View>
      {/* Currency and Card Type Row */}
      <View className="flex-row justify-between items-center">
        <View className={`${flagContainerBg} rounded-full py-4 px-4 flex-row items-center`}>
          <Image 
            source={images.usflag} 
            className="w-6 h-6 mr-2 rounded-full"
          />
          <Text className={`text-sm font-sf-medium ${valueTextColor}`}>
            {currency}
          </Text>
        </View>
        <Image 
          source={images.visa} 
          className="w-12 h-12"
          resizeMode="contain"
        />
      </View>
    
        {/* Balance Row */}
      <View className="mt-6">
        <Text className={`text-lg font-sf-regular ${labelTextColor}`}>
          Your balance
        </Text>
        <View className="flex-row items-center mt-1">
          <View className="min-w-[200px]">
            <Text className={`text-3xl font-sf-bold ${valueTextColor}`}>
              {isAmountVisible ? `$${formattedBalance}` : `$${hiddenBalance}`}
            </Text>
          </View>
          <TouchableOpacity 
            onPress={() => setAmountVisible(!isAmountVisible)}
            className="ml-3"
          >
            <View className={`${toggleBtnBg} rounded-full p-2 border-white border-1`}>
              <Image 
                source={isAmountVisible ? images.show : images.hide}
                className="w-5 h-5"
                tintColor={isBlueBackground ? "white" : "#666666"}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Card Details Row */}
      <View className="flex-row justify-between mt-8">
        <View>
          <Text className={`mb-1 font-sf-regular ${labelTextColor}`}>
            Account number
          </Text>
          <Text className={`font-sf-medium ${valueTextColor}`}>
            **** {card.cardNumber.slice(-4)}
          </Text>
        </View>
        <View>
          <Text className={`mb-1 font-sf-regular ${labelTextColor}`}>
            Valid Thru
          </Text>
          <Text className={`font-sf-medium ${valueTextColor}`}>
            {card.expiryDate}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CardDetails;