import { Ionicons } from "@expo/vector-icons";
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { typography } from '../app/theme';

interface BottomNavBarProps {
  activeTab: string;
  onTabPress?: (tabName: string) => void;
}

type IconName = 'home-outline' | 'home' | 'document-text-outline' | 'document-text' | 'paw-outline' | 'paw' | 'book-outline' | 'book';

interface TabItem {
  name: string;
  icon: IconName;
  activeIcon: IconName;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabPress
}) => {
  const tabs: TabItem[] = [
    { name: 'Home', icon: 'home-outline', activeIcon: 'home' },
    { name: 'Laporan', icon: 'document-text-outline', activeIcon: 'document-text' },
    { name: 'Adopsi', icon: 'paw-outline', activeIcon: 'paw' },
    { name: 'Edukasi', icon: 'book-outline', activeIcon: 'book' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = tab.name === activeTab;

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.navItem}
            onPress={() => onTabPress && onTabPress(tab.name)}
            accessibilityLabel={tab.name}
            accessibilityState={{ selected: isActive }}
          >
            <Ionicons 
              name={isActive ? tab.activeIcon : tab.icon} 
              size={24} 
              color={isActive ? "#4A90E2" : "#666"} 
            />
            <Text style={[
              styles.navText,
              isActive && styles.activeNavText
            ]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingVertical: 6,
    paddingHorizontal: 0,
    height: 70,
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  navText: {
    ...typography.body.small.regular,
    color: '#888',
    marginTop: 2,
  },
  activeNavText: {
    ...typography.body.small.bold,
    color: '#222E3A',
    marginTop: 2,
  },
}); 