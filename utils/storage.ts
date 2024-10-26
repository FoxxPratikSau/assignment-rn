import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '@/models/userModel';

const TRANSACTIONS_STORAGE_KEY = '@financial_app_transactions';

export const saveTransactions = async (transactions: Transaction[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      TRANSACTIONS_STORAGE_KEY,
      JSON.stringify(transactions)
    );
  } catch (error) {
    console.error('Error saving transactions:', error);
  }
};

export const loadTransactions = async (): Promise<Transaction[]> => {
  try {
    const savedTransactions = await AsyncStorage.getItem(TRANSACTIONS_STORAGE_KEY);
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  } catch (error) {
    console.error('Error loading transactions:', error);
    return [];
  }
};