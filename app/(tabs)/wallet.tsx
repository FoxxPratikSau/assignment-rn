// screens/WalletScreen.tsx
import { View, ActivityIndicator, ScrollView, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CreditCard from '@/components/CreditCard';
import AddCardModal from '@/components/AddCardModal';
import { fetchUserData } from '@/api/fetchData';
import { Card } from '@/models/userModel';
import Header from '@/components/header';

const CARDS_STORAGE_KEY = '@financial_app_cards';

const WalletScreen = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      const savedCards = await AsyncStorage.getItem(CARDS_STORAGE_KEY);
      if (savedCards) {
        setCards(JSON.parse(savedCards));
      } else {
        const response = await fetchUserData();
        if (response?.record?.user?.cards) {
          setCards(response.record.user.cards);
          await AsyncStorage.setItem(
            CARDS_STORAGE_KEY,
            JSON.stringify(response.record.user.cards)
          );
        }
      }
    } catch (error) {
      console.error('Error loading cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async (cardData: Partial<Card>) => {
    const newCard: Card = {
      id: Date.now(),
      ...cardData,
      type: 'visa',
      isDefault: cards.length === 0,
    } as Card;

    const updatedCards = [...cards, newCard];
    setCards(updatedCards);

    try {
      await AsyncStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(updatedCards));
    } catch (error) {
      console.error('Error saving new card:', error);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ paddingBottom: 100 }} // Padding for floating navbar
      >
        <Header />
        <View className="items-center justify-center py-4">
          {cards.map((card, index) => (
            <View key={card.id} className="mb-4">
              <CreditCard card={card} index={index} />
            </View>
          ))}
          
          {/* Add Card Button with adjusted width */}
          <View className="w-full px-10 mt-4">
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              className="w-full h-14 bg-[#87DCFB] rounded-xl items-center justify-center mb-8"
            >
              <Text className="text-black font-sf-medium text-base">Add New Card</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modal */}
      <AddCardModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddCard}
      />
    </SafeAreaView>
  );
};

export default WalletScreen;
