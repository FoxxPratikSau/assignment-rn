import { View } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '@/components/header';
import { fetchUserData } from '@/api/fetchData';
import { ApiResponse, Transaction } from '@/models/userModel';
import Account from '@/components/Account';
import { LoadingScreen } from '@/components/LoadingScreen';
import ActionButtons from '@/components/ActionButtons';
import TransactionSheet from '@/components/TransactionSheet';
import TransferSheet from '@/components/TransferSheet';

const TRANSACTIONS_KEY = '@app_transactions';

const HomeScreen = () => {
  const [userData, setUserData] = useState<ApiResponse | null>(null);
  const [isTransferVisible, setTransferVisible] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const savedTransactions = await AsyncStorage.getItem(TRANSACTIONS_KEY);
        const parsedSavedTransactions: Transaction[] = savedTransactions 
          ? JSON.parse(savedTransactions) 
          : [];

        const data = await fetchUserData();
        if (data) {
          setUserData(data);
          
          const apiTransactions = Object.values(data.record.transactions).flat();
          const combinedTransactions = [...parsedSavedTransactions, ...apiTransactions]
            .reduce((acc: Transaction[], current) => {
              const exists = acc.find(t => t.id === current.id);
              if (!exists) {
                acc.push(current);
              }
              return acc;
            }, [])
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

          setTransactions(combinedTransactions);
          await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(combinedTransactions));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    getData();
  }, []);

  const handleRequest = () => {
    console.log('Request pressed');
  };

  const handleTransfer = useCallback(() => {
    setTransferVisible(true);
  }, []);

  const handleCloseTransfer = useCallback(() => {
    setTransferVisible(false);
  }, []);

  const handleAdd = () => {
    console.log('Add pressed');
  };

  const handleNewTransfer = async (transferData: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transferData,
      id: Date.now(),
      date: new Date().toISOString()
    };

    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);

    try {
      await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updatedTransactions));
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  if (!userData) {
    return <LoadingScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="flex-1">
        <Header />
        <View className="py-4">
          <Account cards={userData.record.user.cards} />
        </View>
        <View className="px-6">
          <ActionButtons 
            onRequestPress={handleRequest}
            onTransferPress={handleTransfer}
            onAddPress={handleAdd}
          />
        </View>
        <TransactionSheet transactions={transactions} />
        <TransferSheet
          isVisible={isTransferVisible}
          onClose={handleCloseTransfer}
          onTransfer={handleNewTransfer}
          cards={userData.record.user.cards}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default HomeScreen;