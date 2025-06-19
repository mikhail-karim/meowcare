// app/(admin)/list-report.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { API_BASE_URL, Pet } from "../../components/types";
import { colors, container, spacing, typography } from "../theme";

export default function AdoptionListScreen() {
  const router = useRouter();
  const [cats, setCats] = useState<Pet[]>([]);
  const [acceptedCatIds, setAcceptedCatIds] = useState<number[]>([]);
  const [rejectedCatIds, setRejectedCatIds] = useState<number[]>([]);

  useEffect(() => {
    fetchCats();
  }, []);

  const fetchCats = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.warn("Token tidak ditemukan.");
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/report/listreport`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const reports = response.data.data;

      const mappedCats: Pet[] = reports.map((item: any) => ({
        id: item.Report_ID,
        name: item.user?.Nama_Lengkap || 'Tanpa Nama',
        image: `${API_BASE_URL}/${item.Foto}`,
        description: item.Deskripsi,
        status: item.Rescued === 1 ? "Diselamatkan" : "Belum Diselamatkan"
      }));


      setCats(mappedCats);
    } catch (error) {
      console.error("Gagal mengambil data kucing:", error);
    }
  };

const handleAccept = async (id: number) => {
  try {
    const token = await AsyncStorage.getItem('token');
    await axios.put(`${API_BASE_URL}/report/rescued/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Tambahkan ID ke list accepted dan hapus dari daftar card
    setAcceptedCatIds((prev) => [...prev, id]);
    setRejectedCatIds((prev) => prev.filter((catId) => catId !== id));
    setCats((prev) => prev.filter((cat) => cat.id !== id)); // ❗hapus dari list
  } catch (error) {
    console.error("Gagal menerima laporan:", error);
  }
};

const handleReject = async (id: number) => {
  try {
    const token = await AsyncStorage.getItem('token');
    await axios.delete(`${API_BASE_URL}/report/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Tambahkan ID ke list rejected dan hapus dari daftar card
    setRejectedCatIds((prev) => [...prev, id]);
    setAcceptedCatIds((prev) => prev.filter((catId) => catId !== id));
    setCats((prev) => prev.filter((cat) => cat.id !== id)); // ❗hapus dari list
  } catch (error) {
    console.error("Gagal menolak laporan:", error);
  }
};


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Daftar Laporan Kucing</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.catList}>
          {cats.length === 0 ? (
            <Text style={styles.emptyText}>Belum ada laporan masuk.</Text>
          ) : (
            cats.map((pet) => (
              <View key={pet.id} style={styles.card}>
                <Image source={{ uri: pet.image }} style={styles.image} />
                <Text style={styles.title}>Nama Pelapor: {pet.name}</Text>
                <Text style={styles.description}>Deskripsi: {pet.description}</Text>
                <Text style={styles.status}>Status: {pet.status}</Text>

                <View style={styles.buttonGroup}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.acceptButton]}
                    onPress={() => handleAccept(pet.id)}
                  >
                    <Text style={styles.buttonText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={() => handleReject(pet.id)}
                  >
                    <Text style={styles.buttonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { ...container.screen },
  header: { ...container.header },
  backButton: {
    position: "absolute",
    left: spacing.lg,
    top: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  headerTitle: {
    ...typography.header.medium,
    color: colors.text.primary,
    textAlign: "center",
  },
  content: { ...container.content },
  catList: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  petCardWrapper: {
    marginBottom: spacing.lg,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonGroup: {
    flexDirection: "row",
    gap: spacing.sm,
    marginLeft: spacing.sm,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  acceptButton: {
    backgroundColor: "#1E293B",
  },
  rejectButton: {
    backgroundColor: "#94A3B8",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    padding: spacing.lg,
    borderRadius: 16,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    color: "#1E293B",
    marginBottom: spacing.md,
    textAlign: "center",
  },
  modalActions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999,
  },

card: {
  backgroundColor: "#ffffff",
  padding: 16,
  borderRadius: 16,
  marginBottom: 20,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 4,
},

image: {
  width: "100%",
  height: 180,
  borderRadius: 12,
  resizeMode: "cover",
  marginBottom: 12,
},

title: {
  fontSize: 16,
  fontWeight: "600",
  color: "#1E293B",
  marginBottom: 6,
},

description: {
  fontSize: 14,
  color: "#334155",
  marginBottom: 6,
  lineHeight: 20,
},

status: {
  fontSize: 13,
  fontStyle: "italic",
  color: "#64748B",
  marginBottom: 12,
},

emptyText: {
  textAlign: "center",
  fontSize: 16,
  color: "#94A3B8",
  marginTop: spacing.lg,
},


});
