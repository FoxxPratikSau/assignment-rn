import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

const CustomTabBar: React.FC<BottomTabBarProps> = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />
      <View style={styles.container}>
        <View style={styles.navbar}>
          <TouchableOpacity 
            style={styles.tabButton} 
            onPress={() => router.push('/')}
          >
            <Ionicons 
              name={isActive('/') ? 'home' : 'home-outline'}
              size={24}
              color={isActive('/') ? '#000' : '#9CA3AF'}
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.tabButton} 
            onPress={() => router.push('/qrscan')}
          >
            <MaterialCommunityIcons 
              name={isActive('/qrscan') ? 'qrcode-scan' : 'qrcode-scan'}
              size={24}
              color={isActive('/qrscan') ? '#000' : '#9CA3AF'}
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.tabButton} 
            onPress={() => router.push('/wallet')}
          >
            <Ionicons 
              name={isActive('/wallet') ? 'wallet' : 'wallet-outline'}
              size={24}
              color={isActive('/wallet') ? '#000' : '#9CA3AF'}
            />
          </TouchableOpacity>
        </View>
      </View>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  container: {
    position: 'relative',
    zIndex: 2,
  },
  navbar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 3,
  },
  tabButton: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CustomTabBar;