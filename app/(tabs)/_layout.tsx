import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import { Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function TabLayout() {
  const insets = useSafeAreaInsets()

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#fff',
        borderTopColor: '#E2E8F0',
        height: Platform.OS === 'android' ? 70 + insets.bottom : 70,
        paddingBottom: Platform.OS === 'android' ? insets.bottom : 8,
        paddingTop: 10,
      },
      tabBarActiveTintColor: '#222E3A',
      tabBarInactiveTintColor: '#94A3B8',
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 4,
        fontFamily: 'Poppins-SemiBold',
      },
    }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="laporan"
        options={{
          title: 'Laporan',
          tabBarIcon: ({ color }) => (
            <Ionicons name="document-text-outline" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="adoption-list"
        options={{
          title: 'Adopsi',
          tabBarIcon: ({ color }) => (
            <Ionicons name="paw-outline" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="artikel"
        options={{
          title: 'Artikel',
          tabBarIcon: ({ color }) => (
            <Ionicons name="book-outline" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  )
} 