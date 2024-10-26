import { View } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import CustomTabBar from '@/components/CustomTabBar';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const TabLayout = () => {
  return (
    <Tabs 
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
      tabBar={(props: BottomTabBarProps) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen 
        name="index"
        options={{
          href: '/',
        }}
      />
      <Tabs.Screen 
        name="qrscan"
        options={{
          href: '/qrscan',
        }}
      />
      <Tabs.Screen 
        name="wallet"
        options={{
          href: '/wallet',
        }}
      />
    </Tabs>
  );
};

export default TabLayout;