import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useState } from "react"
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { typography } from '../theme'

export default function HomeScreen() {
  const router = useRouter()
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false)

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: () => {
            // TODO: Implement logout logic here
            router.replace('/signin')
          },
          style: "destructive"
        }
      ]
    )
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MeowCare</Text>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => setIsProfileModalVisible(true)}
        >
          <Ionicons name="person-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Profile Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isProfileModalVisible}
        onRequestClose={() => setIsProfileModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsProfileModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.modalItem}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
              <Text style={styles.modalItemText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Selamat Datang di MeowCare</Text>
        <Text style={styles.subtitleText}>
          Platform untuk membantu kucing terlantar menemukan rumah baru
        </Text>

        {/* Quick Actions */}
        <View style={styles.quickActions}>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/(tabs)/laporan')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="document-text-outline" size={24} color="#fff" />
            </View>
            <Text style={styles.actionText}>Lapor</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/(tabs)/adoption-list')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="paw-outline" size={24} color="#fff" />
            </View>
            <Text style={styles.actionText}>Adopsi</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/(tabs)/edukasi')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="book-outline" size={24} color="#fff" />
            </View>
            <Text style={styles.actionText}>Edukasi</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Statistik</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>150+</Text>
              <Text style={styles.statLabel}>Kucing Terselamatkan</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>100+</Text>
              <Text style={styles.statLabel}>Kucing Diadopsi</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>50+</Text>
              <Text style={styles.statLabel}>Relawan Aktif</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>20+</Text>
              <Text style={styles.statLabel}>Kota Terjangkau</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: "#fff",
  },
  headerTitle: {
    ...typography.header.large,
    color: "#222",
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  welcomeText: {
    ...typography.header.large,
    color: "#222",
    marginBottom: 8,
  },
  subtitleText: {
    ...typography.body.medium.regular,
    color: "#666",
    marginBottom: 32,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  actionButton: {
    alignItems: "center",
    width: "30%",
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#222E3A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionText: {
    ...typography.body.medium.semiBold,
    color: "#222",
  },
  statsContainer: {
    flex: 1,
  },
  statsTitle: {
    ...typography.header.medium,
    color: "#222",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  statCard: {
    width: "47%",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  statNumber: {
    ...typography.header.large,
    color: "#222E3A",
    marginBottom: 4,
  },
  statLabel: {
    ...typography.body.small.regular,
    color: "#666",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    width: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  modalItemText: {
    ...typography.body.medium.regular,
    color: '#FF3B30',
  },
}) 