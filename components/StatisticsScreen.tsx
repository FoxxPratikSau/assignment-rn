import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CardDetails from './CardDetails';
import TransactionCard from './TransactionCard'; 
import { Card } from '@/models/userModel';

interface StatisticsScreenProps {
  card: Card;
  balance: number;
}

const StatisticsScreen: React.FC<StatisticsScreenProps> = ({ card, balance }) => {
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState('Oct');
  const [isEarnings, setIsEarnings] = useState(true);
  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar','Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

  const data = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu"],
    datasets: [
      {
        data: [Math.random() * 10, Math.random() * 10, Math.random() * 10, Math.random() * 10, Math.random() * 10],
        color: (opacity = 1) => `#87DCFB`,
        strokeWidth: 3,
      },
    ],
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-gray-100 px-6 pt-4 pb-6">
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-medium ml-4">Statistics</Text>
        </View>

        {/* Card Details */}
        <View className="bg-white rounded-3xl p-6">
          <CardDetails
            card={card}
            balance={balance}
            currency="US Dollar"
            isBlueBackground={false}
          />
        </View>

        {/* Month Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-6 p-2 rounded-full bg-white"
        >
          <View className="flex-row gap-2 items-center justify-center mr-3">
            {months.map((month) => (
              <TouchableOpacity
                key={month}
                onPress={() => setSelectedMonth(month)}
                className={`py-3 px-3 rounded-full ${
                  selectedMonth === month ? 'bg-[#87DCFB]' : 'bg-white'
                }`}
              >
                <Text
                  className={`font-regular text-base ${
                    selectedMonth === month ? 'text-black' : 'text-gray-400'
                  }`}
                >
                  {month}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Transaction Card */}
      <View className=' mr-3 ml-3'>
        <TransactionCard
          data={data}
          isEarnings={isEarnings}
          toggleEarnings={() => setIsEarnings(!isEarnings)}
        />
      </View>
    </ScrollView>
  );
};

export default StatisticsScreen;
