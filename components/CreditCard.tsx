import React from 'react';
import { View, Text, Image } from 'react-native';
import { Card } from '../models/userModel';
import { images } from '@/constants';

interface CreditCardProps {
  card: Card;
  index: number;
}

const CreditCard: React.FC<CreditCardProps> = ({ card, index }) => {
  // add spaces after every 4 digits
  const formatCardNumber = (num: string) => {
    return num.replace(/(\d{4})/g, '$1 ').trim();
  };

  
  const isEvenIndex = index % 2 === 0;
  const bgColor = isEvenIndex ? '#C8E9CA' : '#363532';
  const textColor = isEvenIndex ? 'text-black' : 'text-white';

  return (
    <View
      style={{ elevation: 5 }}
      className="w-[320px] h-[200px] rounded-2xl overflow-hidden border-gray-100 border-2"
    >
      {/* Top section with dynamic background */}
      <View style={{ backgroundColor: bgColor }} className="h-[60%] px-6 py-6">
        <Image
          source={images.nfc}
          style={{ width: 24, height: 24 }}
          className="mb-6"
          resizeMode="contain"
        />
        <Text className={`${textColor} text-xl font-medium`}>
          {formatCardNumber(card.cardNumber)}
        </Text>
      </View>

      {/* Bottom white section */}
      <View className="h-[40%] bg-white px-6 py-4">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-black text-base">{card.cardName}</Text>
            <Text className="text-black text-sm mt-1">Exp {card.expiryDate}</Text>
          </View>
          <Image
            source={images.visa}
            style={{ width: 48, height: 48 }}
            resizeMode="contain"
          />
        </View>
      </View>
    </View>
  );
};

export default CreditCard;
