import { Ionicons } from "@expo/vector-icons"
import * as Clipboard from 'expo-clipboard'
import { useRouter } from "expo-router"
import { useState } from "react"
import { Alert, Image, Linking, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { colors, container, typography } from '../theme'

export default function HomeScreen() {
  const router = useRouter()
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false)
  const [showCopyFeedback, setShowCopyFeedback] = useState(false)

  const handleProfilePress = () => {
  setIsProfileModalVisible(false);
  router.push('../profil'); 
  };

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

  const handleWhatsAppRedirect = () => {
    // TODO: Replace with actual WhatsApp number
    Linking.openURL('https://wa.me/6282228294844')
  }

  const handleCopyAccountNumber = async () => {
    await Clipboard.setStringAsync('7210359758')
    setShowCopyFeedback(true)
    setTimeout(() => setShowCopyFeedback(false), 2000)
  }

  const programs = [
    {
      id: 1,
      title: "Rescue",
      description: "Menyelamatkan kucing yang membutuhkan pertolongan",
      icon: "heart" as const,
      image: require('../../assets/images/activity_rescue.jpg')
    },
    {
      id: 2,
      title: "Sterilisasi",
      description: "Menjalankan program sterilisasi bersubsidi",
      icon: "medkit" as const,
      image: require('../../assets/images/activity_steril.jpg')
    },
    {
      id: 3,
      title: "Lepas Adopsi",
      description: "Membantu kucing menemukan rumah baru",
      icon: "home" as const,
      image: require('../../assets/images/activity_adoption.jpg')
    },
    {
      id: 4,
      title: "Street Feeding",
      description: "Program pemberian makan kucing liar",
      icon: "fish" as const,
      image: require('../../assets/images/activity_street_feeding.jpg')
    }
  ]

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
            {/* Tombol Profil Saya */}
            <TouchableOpacity 
              style={styles.modalItem}
              onPress={handleProfilePress} 
            >
              <Ionicons name="person-outline" size={20} color="#000000" />
              <Text style={[styles.modalItemText, { color: '#000000' }]}>Profil Saya</Text>
            </TouchableOpacity>

            {/* Tombol Logout */}
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

      {/* Scrollable Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
              onPress={() => router.push('/(tabs)/artikel')}
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
                <Text style={styles.statNumber}>1000+</Text>
                <Text style={styles.statLabel}>Kucing Disteril</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>20+</Text>
                <Text style={styles.statLabel}>Relawan Aktif</Text>
              </View>
            </View>
          </View>

          {/* Program Unggulan KPKTS */}
          <View style={styles.programsContainer}>
            <Text style={styles.programsTitle}>Kegiatan Utama KPKTS</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.programsScrollContent}
            >
              {programs.map((program) => (
                <View key={program.id} style={styles.programCard}>
                  <View style={styles.programImageContainer}>
                    <Image 
                      source={program.image}
                      style={styles.programImage}
                      resizeMode="cover"
                    />
                    <View style={styles.programIconOverlay}>
                      <Ionicons name={program.icon} size={32} color={colors.background} />
                    </View>
                  </View>
                  <View style={styles.programContent}>
                    <Text style={styles.programTitle}>{program.title}</Text>
                    <Text style={styles.programDescription}>{program.description}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Sterilization Promotion Section */}
          <View style={styles.sterilizationContainer}>
            <Text style={styles.sterilizationTitle}>Ayo Steril Bersama KPKTS!</Text>
            <Text style={styles.sterilizationSubtitle}>Kendalikan Populasi, Sejahterakan Hewan</Text>
            
            <View style={styles.sterilizationContent}>
              <Image 
                source={require('../../assets/images/home_steril.jpg')}
                style={styles.sterilizationImage}
                resizeMode="cover"
              />
              
              <Text style={styles.sterilizationText}>
                Sterilisasi adalah langkah penting untuk mengontrol populasi hewan jalanan dan meningkatkan kesehatan mereka.{'\n\n'}
                KPKTS menyediakan program sterilisasi bersubsidi/gratis. Mari jadi pemilik yang bertanggung jawab!
              </Text>

              <View style={styles.sterilizationButtons}>
                <TouchableOpacity 
                  style={[styles.sterilizationButton, styles.primaryButton]}
                  onPress={handleWhatsAppRedirect}
                >
                  <Text style={styles.primaryButtonText}>Daftar Sekarang</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.sterilizationButton, styles.secondaryButton]}
                  onPress={() => router.push('/(tabs)/artikel')}
                >
                  <Text style={styles.secondaryButtonText}>Pelajari Manfaat Steril</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Donation Section */}
          <View style={styles.donationContainer}>
            <Text style={styles.donationTitle}>Bantu Kami Merawat Mereka</Text>
            <Text style={styles.donationText}>
              Setiap donasi, berapapun nilainya akan sangat berarti untuk kelangsungan operasional, biaya medis, pakan, dan program-program kami.
            </Text>

            <View style={styles.bankInfoContainer}>
              <View style={styles.bankLogoContainer}>
                <Image 
                  source={require('../../assets/images/bca_logo.png')}
                  style={styles.bankLogo}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.accountInfoContainer}>
                <Text style={styles.accountName}>Evi Bintari</Text>
                <View style={styles.accountNumberContainer}>
                  <Text style={styles.accountNumber}>7210359758</Text>
                  <TouchableOpacity 
                    style={styles.copyButton}
                    onPress={handleCopyAccountNumber}
                  >
                    <Ionicons name="copy-outline" size={20} color="#666" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Copy Feedback */}
      {showCopyFeedback && (
        <View style={styles.copyFeedback}>
          <Text style={styles.copyFeedbackText}>Nomor Rekening berhasil disalin!</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...container.screen,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: colors.background,
  },
  headerTitle: {
    ...typography.header.large,
    color: colors.text.primary,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  welcomeText: {
    ...typography.header.large,
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitleText: {
    ...typography.body.medium.regular,
    color: colors.text.secondary,
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
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionText: {
    ...typography.body.medium.semiBold,
    color: colors.text.primary,
  },
  statsContainer: {
    marginBottom: 32,
  },
  statsTitle: {
    ...typography.header.medium,
    color: colors.text.primary,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  statCard: {
    width: "47%",
    backgroundColor: colors.surface.light,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  statNumber: {
    ...typography.header.large,
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    ...typography.body.small.regular,
    color: colors.text.secondary,
    textAlign: "center",
  },
  programsContainer: {
    marginBottom: 32,
  },
  programsTitle: {
    ...typography.header.medium,
    color: colors.text.primary,
    marginBottom: 16,
  },
  programsScrollContent: {
    paddingRight: 20,
  },
  programCard: {
    width: 220,
    backgroundColor: colors.surface.light,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
  },
  programImageContainer: {
    position: 'relative',
    height: 160,
  },
  programImage: {
    width: '100%',
    height: '100%',
  },
  programIconOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.9,
  },
  programContent: {
    padding: 16,
  },
  programTitle: {
    ...typography.body.medium.semiBold,
    color: colors.text.primary,
    marginBottom: 4,
  },
  programDescription: {
    ...typography.body.small.regular,
    color: colors.text.secondary,
  },
  sterilizationContainer: {
    marginBottom: 32,
    backgroundColor: colors.surface.light,
    borderRadius: 16,
    padding: 20,
  },
  sterilizationTitle: {
    ...typography.header.large,
    color: colors.text.primary,
    marginBottom: 8,
  },
  sterilizationSubtitle: {
    ...typography.header.small,
    color: colors.text.secondary,
    marginBottom: 20,
  },
  sterilizationContent: {
    alignItems: "center",
  },
  sterilizationImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  sterilizationText: {
    ...typography.body.medium.regular,
    color: colors.text.secondary,
    textAlign: "left",
    marginBottom: 24,
    lineHeight: 24,
  },
  sterilizationButtons: {
    width: "100%",
    gap: 12,
  },
  sterilizationButton: {
    width: "100%",
    padding: 16,
    borderRadius: 32,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.surface.dark,
  },
  primaryButtonText: {
    ...typography.body.medium.semiBold,
    color: colors.background,
  },
  secondaryButtonText: {
    ...typography.body.medium.semiBold,
    color: colors.primary,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 20,
  },
  modalContent: {
    backgroundColor: colors.background,
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
  donationContainer: {
    marginBottom: 32,
    backgroundColor: colors.surface.light,
    borderRadius: 16,
    padding: 20,
  },
  donationTitle: {
    ...typography.header.large,
    color: colors.text.primary,
    marginBottom: 12,
  },
  donationText: {
    ...typography.body.medium.regular,
    color: colors.text.secondary,
    marginBottom: 24,
    lineHeight: 24,
  },
  bankInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  bankLogoContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.surface.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  bankLogo: {
    width: 60,
    height: 60,
  },
  accountInfoContainer: {
    flex: 1,
  },
  accountName: {
    ...typography.body.medium.semiBold,
    color: colors.text.primary,
  },
  accountNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  accountNumber: {
    ...typography.body.large.medium,
    color: colors.text.primary,
  },
  copyButton: {
    padding: 4,
  },
  copyFeedback: {
    position: "absolute",
    bottom: 18,
    left: 36,
    right: 36,
    backgroundColor: colors.feedback.success,
    opacity: 0.9,
    borderRadius: 32,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  copyFeedbackText: {
    ...typography.body.small.regular,
    color: colors.background,
  },
}) 