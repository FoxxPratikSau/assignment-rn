import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from '@/models/userModel';
import CardDetails from './CardDetails';
import { useRouter } from 'expo-router';

interface AccountProps {
  cards: Card[];
  balances?: { [key: number]: number };
}

const Account = ({ cards, balances = {
  1: 40500.80,
  2: 25750.50,
  3: 15200.25,
  4: 8900.60
} }: AccountProps) => {
  const router = useRouter();

  const handleCardPress = (card: Card) => {
    router.push({
      pathname: '/statistics/[id]',
      params: { 
        id: card.id.toString(),
        card: JSON.stringify(card),
        balance: balances[card.id]
      }
    });
  };

  return (
    <View className="mb-6">
      <Text className="text-2xl font-sf-regular text-gray-800 mb-4 px-4">
        Account
      </Text>

      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      >
        {cards.map((card, index) => (
          <TouchableOpacity 
            key={card.id} 
            onPress={() => handleCardPress(card)}
            className={`w-80 ${index > 0 ? 'ml-4' : ''}`}
            style={{
              backgroundColor: index % 2 === 0 ? '#87DCFB' : 'white',
              borderRadius: 24,
              padding: 24,
            }}
          >
            <CardDetails
              card={card}
              balance={balances[card.id]}
              currency={card.type === 'VISA' ? 'US Dollar' : 'USD'}
              isBlueBackground={index % 2 === 0}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default Account;