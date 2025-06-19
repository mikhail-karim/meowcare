import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
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


export default function AdoptionListScreen() {
  const router = useRouter();
  const [pengajuanList, setPengajuanList] = useState<any[]>([]);

  useEffect(() => {
    const fetchPengajuan = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/pengajuan`);
        const pengajuanFromApi = Array.isArray(response.data) ? response.data : [response.data];

        setPengajuanList(pengajuanFromApi);
      } catch (error) {
        console.error("Gagal memuat data pengajuan:", error);
      }
    };

    fetchPengajuan();
  }, []);


  const handleLogout = async () => {
  try {
    console.log('Logout process started');
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Token not found');

    // Panggil API logout dengan header Authorization Bearer token
    await axios.post(`${API_BASE_URL}/admins/logout`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Bersihkan semua data di local storage
    await AsyncStorage.clear();

    console.log('Logout success, navigating to signin');
    // Pindah ke halaman index atau signin
    router.replace('/welcome');
  } catch (error: unknown) {
    console.error('Logout error:', error);
    // Anda bisa tambahkan UI feedback error sesuai kebutuhan Anda di sini
  }
};

const renderPengajuanCard = (item: any, index: number) => {
  const statusApproved = item.Approved === 1;
  const statusText = statusApproved ? "Disetujui" : "Menunggu Persetujuan";
  const statusColor = statusApproved ? "#4CAF50" : "#FF9800";
  const statusIcon = statusApproved ? "checkmark-circle-outline" : "time-outline";

  const handleCardPress = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error("Token tidak ditemukan.");
        return;
      }

      await axios.post(`${API_BASE_URL}/konfirmasi`, {
        Pengajuan_ID: item.Pengajuan_ID
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log(`Pengajuan ${item.Pengajuan_ID} berhasil dikonfirmasi.`);

      // Hapus card dari state
      setPengajuanList(prevList =>
        prevList.filter(p => p.Pengajuan_ID !== item.Pengajuan_ID)
      );
    } catch (error) {
      console.error("Gagal mengonfirmasi pengajuan:", error);
    }
  };

  return (
    <TouchableOpacity key={index} style={styles.card} onPress={handleCardPress}>
      <Image
        source={{ uri: `${API_BASE_URL}/${item.pet.Foto}` }}
        style={styles.catImage}
      />
      <View style={styles.cardContent}>
        <Text style={styles.catName}>{item.pet.Nama}</Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Pengaju: </Text>
          {item.user.Nama_Lengkap}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Alasan: </Text>
          {item.Alasan}
        </Text>
        <View style={styles.statusRow}>
          <Ionicons name={statusIcon} size={16} color={statusColor} style={{ marginRight: 5 }} />
          <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#00000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Placeholder Admin Profile */}
        <View>
          <View style={[styles.view, styles.bg]}>
            <View style={styles.box}>
              <Image style={styles.pfp} resizeMode="cover" source={require('../../assets/images/adminplaceholder.png')} />
              <View>
                <Text style={styles.name}>Admin KPKTS</Text>
                <Text style={styles.aboutAdmin}>
                  MeowCare Admin{"\n"}
                  admin@admin.com
                </Text>
              </View>
            </View>
          </View>
        </View>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Daftar Pengajuan Kucing</Text>
      </View>

      
        {/* Cat List */}
      <View style={styles.catList}>
        {pengajuanList.length === 0 ? (
          <Text style={styles.emptyText}>Belum ada pengajuan adopsi saat ini.</Text>
        ) : (
          pengajuanList.map(renderPengajuanCard)
        )}
      </View>


      </ScrollView>
    </SafeAreaView>
  );
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
    ...typography.header.medium,
    color: colors.text.primary,
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    ...container.content,
  },
  bg: {
    backgroundColor: "#fff",
    flex: 1
  },
  box: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16 
  },
  view: {
    // width: "87%",
    shadowColor: "rgba(0, 0, 0, 0.05)",
    shadowOffset: {
        width: 0,
        height: 1
    },
    shadowRadius: 2,
    elevation: 2,
    shadowOpacity: 1,    
    marginHorizontal: spacing.lg,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: spacing.md,
    borderStyle: "solid",
    borderColor: "#94b4c1",
    borderWidth: 1,
  },
  pfp: {
    width: 100,
    height: 100,
    marginRight: 16,
    borderRadius: 50,
  },
  name: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Poppins-Medium",
    color: "#313131",
  },
  aboutAdmin: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#c2c3cc",
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: colors.secondary,
    paddingHorizontal: spacing.md,
    height: 48
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    color: colors.text.primary,
    ...typography.body.medium.regular,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: colors.primary,
    padding: 12,
    width: 48,
    height: 48,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  catList: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  modalTitle: {
    ...typography.header.medium,
    color: '#304153',
  },
  filterScroll: {
    paddingHorizontal: 24,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterTitle: {
    ...typography.body.medium.semiBold,
    color: '#304153',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: '#304153',
  },
  filterChipText: {
    ...typography.body.small.regular,
    color: '#304153',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 24,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#304153',
    alignItems: 'center',
  },
  resetButtonText: {
    ...typography.body.medium.semiBold,
    color: '#304153',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#304153',
    alignItems: 'center',
  },
  applyButtonText: {
    ...typography.body.medium.semiBold,
    color: '#fff',
  },
  locationInputContainer: {
    marginBottom: 8,
  },
  locationSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  locationInput: {
    flex: 1,
    marginLeft: 8,
    ...typography.body.medium.regular,
    color: '#304153',
  },
  selectedLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6EEF6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 8,
    gap: 8,
  },
  selectedLocationText: {
    ...typography.body.small.regular,
    color: '#304153',
    flex: 1,
  },
  locationSuggestions: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    maxHeight: 200,
    marginTop: 4,
  },
  locationSuggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  locationSuggestionText: {
    ...typography.body.medium.regular,
    color: '#304153',
  },
card: {
  backgroundColor: "#fff",
  borderRadius: 12,
  padding: 12,
  marginVertical: 8,
  marginHorizontal: 16,
  flexDirection: "row",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3
},
catImage: {
  width: 80,
  height: 80,
  borderRadius: 10,
  marginRight: 12,
  backgroundColor: "#f0f0f0"
},
cardContent: {
  flex: 1,
  justifyContent: "center"
},
catName: {
  fontSize: 16,
  fontWeight: "bold",
  color: "#333",
  marginBottom: 4
},
infoText: {
  fontSize: 14,
  color: "#444",
  marginBottom: 2
},
label: {
  fontWeight: "600",
  color: "#666"
},
statusRow: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 6
},
statusText: {
  fontSize: 14,
  fontWeight: "600"
},
emptyText: {
  fontSize: 16,
  color: "#888",
  textAlign: "center",
  marginTop: 20,
  paddingHorizontal: 20
}

}) 