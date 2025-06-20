import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { API_BASE_URL } from '../../components/types';
import { colors, container, spacing, typography } from '../theme';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const [pengajuanList, setPengajuanList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    fetchPengajuan();
  }, []);

  const fetchPengajuan = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/pengajuan`);
      const pengajuanFromApi = Array.isArray(response.data) ? response.data : [response.data];
      
      // Sort pengajuan list: pending first, then approved, then rejected
      const sortedPengajuan = pengajuanFromApi.sort((a, b) => {
        // Pending (Approved === 0) should come first
        if (a.Approved === 0 && b.Approved !== 0) return -1;
        if (a.Approved !== 0 && b.Approved === 0) return 1;
        
        // If both are pending, approved, or rejected, maintain original order
        return 0;
      });
      
      setPengajuanList(sortedPengajuan);
    } catch (error) {
      console.error("Gagal memuat data pengajuan:", error);
      Alert.alert("Error", "Gagal memuat data pengajuan");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Konfirmasi Logout",
      "Apakah Anda yakin ingin keluar?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              if (!token) throw new Error('Token not found');

              await axios.post(`${API_BASE_URL}/admins/logout`, {}, {
                headers: { Authorization: `Bearer ${token}` }
              });

              await AsyncStorage.clear();
              router.replace('/welcome');
            } catch (error: unknown) {
              console.error('Logout error:', error);
              Alert.alert("Error", "Gagal melakukan logout");
            }
          }
        }
      ]
    );
  };

  const handleApprove = async (item: any) => {
    Alert.alert(
      "Konfirmasi Persetujuan",
      `Apakah Anda yakin ingin menyetujui pengajuan adopsi untuk ${item.pet.Nama}?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Setujui",
          style: "default",
          onPress: async () => {
            await processRequest(item.Pengajuan_ID, 'approve');
          }
        }
      ]
    );
  };

  const handleReject = async (item: any) => {
    Alert.alert(
      "Konfirmasi Penolakan",
      `Apakah Anda yakin ingin menolak pengajuan adopsi untuk ${item.pet.Nama}?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Tolak",
          style: "destructive",
          onPress: async () => {
            await processRequest(item.Pengajuan_ID, 'reject');
          }
        }
      ]
    );
  };

  const processRequest = async (pengajuanId: number, action: 'approve' | 'reject') => {
    try {
      setProcessingId(pengajuanId);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert("Error", "Token tidak ditemukan");
        return;
      }

      const endpoint = action === 'approve' ? '/konfirmasi' : '/reject';
      await axios.post(`${API_BASE_URL}${endpoint}`, {
        Pengajuan_ID: pengajuanId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const actionText = action === 'approve' ? 'disetujui' : 'ditolak';
      Alert.alert("Sukses", `Pengajuan berhasil ${actionText}`);

      // Refresh data
      await fetchPengajuan();
    } catch (error) {
      console.error(`Gagal ${action} pengajuan:`, error);
      Alert.alert("Error", `Gagal ${action === 'approve' ? 'menyetujui' : 'menolak'} pengajuan`);
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusInfo = (approved: number) => {
    if (approved === 1) {
      return {
        text: "Disetujui",
        color: "#10B981",
        icon: "checkmark-circle" as const,
        bgColor: "#D1FAE5"
      };
    } else if (approved === 2) {
      return {
        text: "Ditolak",
        color: "#EF4444",
        icon: "close-circle" as const,
        bgColor: "#FEE2E2"
      };
    } else {
      return {
        text: "Menunggu",
        color: "#F59E0B",
        icon: "time" as const,
        bgColor: "#FEF3C7"
      };
    }
  };

  const renderPengajuanCard = (item: any, index: number) => {
    const statusInfo = getStatusInfo(item.Approved);
    const isProcessing = processingId === item.Pengajuan_ID;
    const isPending = item.Approved === 0;

    return (
      <View key={index} style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.petInfo}>
            <Image
              source={{ uri: `${API_BASE_URL}/${item.pet.Foto}` }}
              style={styles.catImage}
            />
            <View style={styles.petDetails}>
              <Text style={styles.catName}>{item.pet.Nama}</Text>
              <View style={styles.petMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="paw-outline" size={14} color="#6B7280" />
                  <Text style={styles.metaText}>{item.pet.ras?.Nama || "Ras tidak diketahui"}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="location-outline" size={14} color="#6B7280" />
                  <Text style={styles.metaText} numberOfLines={1} ellipsizeMode="tail">
                    {item.user.Alamat || "Lokasi tidak diketahui"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.bgColor }]}>
            <Ionicons name={statusInfo.icon} size={16} color={statusInfo.color} />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.text}
            </Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.applicantInfo}>
            <View style={styles.applicantHeader}>
              <Ionicons name="person-outline" size={16} color="#374151" />
              <Text style={styles.applicantTitle}>Informasi Pengaju</Text>
            </View>
            <Text style={styles.applicantName}>{item.user.Nama_Lengkap}</Text>
            <Text style={styles.applicantEmail}>{item.user.Email}</Text>
          </View>

          <View style={styles.reasonSection}>
            <View style={styles.reasonHeader}>
              <Ionicons name="chatbubble-outline" size={16} color="#374151" />
              <Text style={styles.reasonTitle}>Alasan Adopsi</Text>
            </View>
            <Text style={styles.reasonText}>{item.Alasan}</Text>
          </View>

          <View style={styles.cardBottomSection}>
            {isPending ? (
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.rejectButton]}
                  onPress={() => handleReject(item)}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <ActivityIndicator size="small" color="#EF4444" />
                  ) : (
                    <>
                      <Ionicons name="close" size={16} color="#EF4444" />
                      <Text style={styles.rejectButtonText}>Tolak</Text>
                    </>
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.actionButton, styles.approveButton]}
                  onPress={() => handleApprove(item)}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                      <Text style={styles.approveButtonText}>Setujui</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.statusConfirmation}>
                <Ionicons 
                  name={item.Approved === 1 ? "checkmark-circle" : "close-circle"} 
                  size={20} 
                  color={item.Approved === 1 ? "#10B981" : "#EF4444"} 
                />
                <Text style={[
                  styles.statusConfirmationText, 
                  { color: item.Approved === 1 ? "#10B981" : "#EF4444" }
                ]}>
                  {item.Approved === 1 ? "Pengajuan telah disetujui" : "Pengajuan telah ditolak"}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Dashboard Admin</Text>
          <Text style={styles.headerSubtitle}>Kelola pengajuan adopsi kucing</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Admin Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileContent}>
            <Image 
              style={styles.profileImage} 
              resizeMode="cover" 
              source={require('../../assets/images/adminplaceholder.png')} 
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Admin KPKTS</Text>
              <Text style={styles.profileRole}>Administrator</Text>
              <Text style={styles.profileEmail}>admin@kpkts.com</Text>
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Statistik Pengajuan</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Ionicons name="time-outline" size={24} color="#F59E0B" />
              </View>
              <Text style={styles.statNumber}>
                {pengajuanList.filter(p => p.Approved === 0).length}
              </Text>
              <Text style={styles.statLabel}>Menunggu</Text>
            </View>
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Ionicons name="checkmark-circle-outline" size={24} color="#10B981" />
              </View>
              <Text style={styles.statNumber}>
                {pengajuanList.filter(p => p.Approved === 1).length}
              </Text>
              <Text style={styles.statLabel}>Disetujui</Text>
            </View>
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Ionicons name="close-circle-outline" size={24} color="#EF4444" />
              </View>
              <Text style={styles.statNumber}>
                {pengajuanList.filter(p => p.Approved === 2).length}
              </Text>
              <Text style={styles.statLabel}>Ditolak</Text>
            </View>
          </View>
        </View>

        {/* Pengajuan List */}
        <View style={styles.pengajuanSection}>
          <Text style={styles.sectionTitle}>Daftar Pengajuan Adopsi</Text>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Memuat data pengajuan...</Text>
            </View>
          ) : pengajuanList.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-outline" size={64} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>Belum ada pengajuan</Text>
              <Text style={styles.emptySubtitle}>
                Saat ini belum ada pengajuan adopsi yang masuk
              </Text>
            </View>
          ) : (
            <View style={styles.pengajuanList}>
              {pengajuanList.map(renderPengajuanCard)}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...container.screen,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerTitle: {
    ...typography.header.medium,
    color: colors.text.primary,
    marginBottom: 2,
  },
  headerSubtitle: {
    ...typography.body.small.regular,
    color: colors.text.secondary,
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  profileCard: {
    margin: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  profileContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...typography.header.small,
    color: colors.text.primary,
    marginBottom: 4,
  },
  profileRole: {
    ...typography.body.medium.semiBold,
    color: colors.primary,
    marginBottom: 2,
  },
  profileEmail: {
    ...typography.body.small.regular,
    color: colors.text.secondary,
  },
  statsSection: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.header.medium,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: "row",
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: spacing.md,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  statNumber: {
    ...typography.header.large,
    color: colors.text.primary,
    marginBottom: 2,
  },
  statLabel: {
    ...typography.body.small.regular,
    color: colors.text.secondary,
  },
  pengajuanSection: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xxl,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: spacing.xl,
  },
  loadingText: {
    ...typography.body.medium.regular,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: spacing.xl,
  },
  emptyTitle: {
    ...typography.header.small,
    color: colors.text.secondary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    ...typography.body.medium.regular,
    color: colors.text.secondary,
    textAlign: "center",
    paddingHorizontal: spacing.lg,
  },
  pengajuanList: {
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  petInfo: {
    flexDirection: "column",
    flex: 1,
  },
  catImage: {
    width: 120,
    height: 120,
    borderRadius: 16,
    marginRight: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: "#F3F4F6",
  },
  petDetails: {
    flex: 1,
    justifyContent: "center",
  },
  catName: {
    ...typography.body.large.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  petMeta: {
    gap: spacing.xs,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minHeight: 20,
  },
  metaText: {
    ...typography.body.small.regular,
    color: colors.text.secondary,
    flex: 1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    gap: 4,
  },
  statusText: {
    ...typography.body.small.semiBold,
  },
  cardBody: {
    padding: spacing.lg,
  },
  applicantInfo: {
    marginBottom: spacing.lg,
  },
  applicantHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
    gap: 6,
  },
  applicantTitle: {
    ...typography.body.medium.semiBold,
    color: colors.text.primary,
  },
  applicantName: {
    ...typography.body.medium.regular,
    color: colors.text.primary,
    marginBottom: 2,
  },
  applicantEmail: {
    ...typography.body.small.regular,
    color: colors.text.secondary,
  },
  reasonSection: {
    marginBottom: spacing.lg,
  },
  reasonHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
    gap: 6,
  },
  reasonTitle: {
    ...typography.body.medium.semiBold,
    color: colors.text.primary,
  },
  reasonText: {
    ...typography.body.medium.regular,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  cardBottomSection: {
    marginTop: spacing.lg,
  },
  actionButtons: {
    flexDirection: "row",
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    gap: 6,
  },
  rejectButton: {
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  approveButton: {
    backgroundColor: colors.primary,
  },
  rejectButtonText: {
    ...typography.body.medium.semiBold,
    color: "#EF4444",
  },
  approveButtonText: {
    ...typography.body.medium.semiBold,
    color: colors.background,
  },
  statusConfirmation: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.sm,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  statusConfirmationText: {
    ...typography.body.small.regular,
    marginLeft: spacing.sm,
  },
}); 