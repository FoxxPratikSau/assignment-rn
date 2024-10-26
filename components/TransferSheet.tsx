import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  Image,
  BackHandler
} from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Card, Transaction } from '@/models/userModel';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { images } from '@/constants';

interface TransferSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onTransfer: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  cards: Card[];
}

const TransferSheet = ({ 
  isVisible, 
  onClose, 
  onTransfer,
  cards 
}: TransferSheetProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();
  
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [amount, setAmount] = useState('');
  const [destination, setDestination] = useState('');

  const snapPoints = React.useMemo(() => ['90%'], []);

  useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible]);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    }
  }, [onClose]);

  const handleTransfer = () => {
    if (!selectedCard || !amount || !destination) return;

    onTransfer({
      cardId: selectedCard.id,
      amount: -Number(amount),
      description: destination,
      category: 'transfer',
      status: 'completed'
    });

    handleSheetClose();
  };

  const handleSheetClose = () => {
    bottomSheetRef.current?.close();
    setSelectedCard(null);
    setAmount('');
    setDestination('');
    onClose();
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
      handleIndicatorStyle={{ display: 'none' }}
      backgroundStyle={styles.bottomSheetBackground}
    >
      <BottomSheetView className="flex-1">
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-6 pt-2 pb-4">
            <View className="w-8 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            
            {/* Header */}
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl text-gray-900">Transfer Money</Text>
              <TouchableOpacity onPress={handleSheetClose}>
                <Text className="text-base text-gray-400">Cancel</Text>
              </TouchableOpacity>
            </View>

            {/* Form Content */}
            <View className="mb-6">
              <Text className="text-sm text-gray-400 mb-2">Destination Name</Text>
              <TextInput
                className="bg-gray-100 rounded-xl px-4 py-3 text-base text-gray-900"
                placeholder="Enter recipient name"
                value={destination}
                onChangeText={setDestination}
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm text-gray-400 mb-2">Amount</Text>
              <TextInput
                className="bg-gray-100 rounded-xl px-4 py-3 text-base text-gray-900"
                placeholder="$0"
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
              />
            </View>

            <View>
              <Text className="text-sm text-gray-400 mb-2">Select Card</Text>
              {cards.map((card) => (
                <TouchableOpacity
                  key={card.id}
                  className={`flex-row items-center p-4 rounded-xl mb-2 border ${
                    selectedCard?.id === card.id 
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white'
                  }`}
                  onPress={() => setSelectedCard(card)}
                >
                  <Image 
                    source={images.visa}
                    className="w-8 h-8 mr-3"
                    resizeMode="contain"
                  />
                  <View>
                    <Text className="text-base text-gray-900">
                      **** {card.cardNumber.slice(-4)}
                    </Text>
                    <Text className="text-sm text-gray-400">
                      Expires {card.expiryDate}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              className={`mt-6 rounded-xl py-4 px-6 ${
                selectedCard && amount && destination 
                  ? 'bg-black' 
                  : 'bg-gray-300'
              }`}
              onPress={handleTransfer}
              disabled={!selectedCard || !amount || !destination}
            >
              <Text className="text-white text-center text-base font-bold">
                Transfer Now
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = {
  bottomSheetBackground: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
  },
};

export default TransferSheet;
