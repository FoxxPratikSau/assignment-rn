import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import StatisticsScreen from '@/components/StatisticsScreen';
import { Stack } from 'expo-router';

const StatisticsPage = () => {
  const { id, card, balance } = useLocalSearchParams<{
    id: string;
    card: string;
    balance: string;
  }>();

  const cardData = JSON.parse(card);
  const balanceData = Number(balance);

  return <StatisticsScreen card={cardData} balance={balanceData} />;
};


StatisticsPage.getLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: 'modal',
        animation: 'slide_from_right',
      }}
    />
  );
};

export default StatisticsPage;