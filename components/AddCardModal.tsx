// components/AddCardModal.tsx
import { Card } from '@/models/userModel';
import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity } from 'react-native';

interface AddCardModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (cardData: Partial<Card>) => void;
}

const AddCardModal: React.FC<AddCardModalProps> = ({ visible, onClose, onAdd }) => {
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const handleSubmit = () => {
    if (!cardName || !cardNumber || !expiryDate || !cvv) {
      return;
    }

    onAdd({
      cardName,
      cardNumber: cardNumber.replace(/\s/g, ''),
      expiryDate,
      cvv,
      type: 'visa',
      isDefault: false,
    });

    setCardName('');
    setCardNumber('');
    setExpiryDate('');
    setCvv('');
    onClose();
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      setExpiryDate(`${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`);
    } else {
      setExpiryDate(cleaned);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white p-6 rounded-t-3xl">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold">Add New Card</Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-gray-500 text-lg">✕</Text>
            </TouchableOpacity>
          </View>
          
          <View className="space-y-4">
            <View>
              <Text className="text-sm text-gray-600 mb-1.5">Card Holder Name</Text>
              <TextInput
                className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-gray-50"
                value={cardName}
                onChangeText={setCardName}
                placeholder="Enter card holder name"
              />
            </View>

            <View>
              <Text className="text-sm text-gray-600 mb-1.5">Card Number</Text>
              <TextInput
                className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-gray-50"
                value={cardNumber}
                onChangeText={formatCardNumber}
                placeholder="1234 5678 9012 3456"
                keyboardType="numeric"
                maxLength={19}
              />
            </View>

            <View className="flex-row space-x-4">
              <View className="flex-1">
                <Text className="text-sm text-gray-600 mb-1.5">Expiry Date</Text>
                <TextInput
                  className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-gray-50"
                  value={expiryDate}
                  onChangeText={formatExpiryDate}
                  placeholder="MM/YY"
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-600 mb-1.5">CVV</Text>
                <TextInput
                  className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-gray-50"
                  value={cvv}
                  onChangeText={setCvv}
                  placeholder="123"
                  keyboardType="numeric"
                  maxLength={3}
                  secureTextEntry
                />
              </View>
            </View>

            <TouchableOpacity 
              onPress={handleSubmit}
              className="w-full h-14 bg-blue-500 rounded-xl items-center justify-center mt-4"
            >
              <Text className="text-white font-semibold text-base">Add Card</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddCardModal;