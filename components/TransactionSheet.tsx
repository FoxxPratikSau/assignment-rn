import React, { useRef, useCallback, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image,
  Dimensions,
  StyleSheet 
} from 'react-native';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { Transaction } from '@/models/userModel';
import { images } from '@/constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TransactionSheetProps {
  transactions: Transaction[];
}

const { height } = Dimensions.get('window');

const TransactionSheet = ({ transactions }: TransactionSheetProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const snapPoints = ['35%', '90%'];

  const handleSheetChanges = useCallback((index: number) => {
    setIsExpanded(index === 1);
  }, []);

  const handleToggleExpand = useCallback(() => {
    if (isExpanded) {
      bottomSheetRef.current?.snapToIndex(0);
    } else {
      bottomSheetRef.current?.snapToIndex(1);
    }
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const renderTransactionItem = useCallback(({ item }: { item: Transaction }) => {
    const isPositive = item.amount > 0;
    const formattedAmount = Math.abs(item.amount).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    
    return (
      <View className="flex-row items-center justify-between py-3 px-6">
        <View className="flex-row items-center flex-1">
          <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3">
            <Image 
              source={isPositive ? images.request : images.transfer}
              className="w-4 h-4"
            />
          </View>
          <View>
            <Text className="text-[15px] text-gray-900 font-sf-regular">
              {isPositive ? `Receive from ${item.description}` : `Transfer to ${item.description}`}
            </Text>
            <Text className="text-sm text-gray-400 font-sf-regular mt-0.5">
              {new Date(item.date).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}
            </Text>
          </View>
        </View>
        <Text 
          className={`text-[15px] font-sf-regular ${isPositive ? 'text-green-500' : 'text-red-500'}`}
        >
          {isPositive ? '+' : '-'} {formattedAmount}
        </Text>
      </View>
    );
  }, []);

  const renderHeader = useCallback(() => (
    <View className="px-6 pt-2 pb-2">
      <View className="w-8 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-2xl text-gray-900 font-sf-regular">
          Transaction
        </Text>
        <TouchableOpacity onPress={handleToggleExpand}>
          <Text className="text-base text-gray-500">
            {isExpanded ? 'Hide all' : 'View all'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  ), [isExpanded, handleToggleExpand]);

  const renderSeparator = useCallback(() => (
    <View className="h-[1px] bg-gray-100 ml-[76px]" />
  ), []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      handleIndicatorStyle={{ display: 'none' }}
      backgroundStyle={styles.bottomSheetBackground}
      onChange={handleSheetChanges}
    >
      <BottomSheetFlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTransactionItem}
        ListHeaderComponent={renderHeader}
        ItemSeparatorComponent={renderSeparator}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 20
        }}
        showsVerticalScrollIndicator={false}
      />
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0,
    shadowRadius: 8,
    elevation: 0,
  }
});

export default TransactionSheet;