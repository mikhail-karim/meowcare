import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect } from "react";

import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AgeIcon, GenderIcon, LocationIcon } from "../components/Icons";
import { container, spacing, typography } from "./theme";

const STATUS_COLORS: { [key: string]: string } = {
  available: "#DCFCE7",
  adopted: "#DBEAFE",
  approved: "#BBF7D0",
  pending: "#FEF9C3",
  rejected: "#FECACA",
};

const STATUS_TEXT_COLORS: { [key: string]: string } = {
  available: "#15803D",
  adopted: "#1D4ED8",
  approved: "#166534",
  pending: "#A16207",
  rejected: "#B91C1C",
};

const REPORT_STATUS_COLORS: { [key: string]: string } = {
  diproses: "#FEF9C3",
  ditolak: "#FECACA",
  "menunggu ditinjau": "#E0F2FE",
  selesai: "#DCFCE7",
};

const REPORT_TEXT_COLORS: { [key: string]: string } = {
  diproses: "#A16207",
  ditolak: "#B91C1C",
  "menunggu ditinjau": "#0369A1",
  selesai: "#15803D",
};


export default function ProfilScreen() {
  const API_BASE_URL = 'http://192.168.0.108:8000';
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Kucingku");
  
  const [profile, setProfile] = useState({
    username: '',
    foto: '',
    role: '',
  });
  const tabs = ["Kucingku", "Adopsi", "Laporan"];

  const [petData, setPetData] = useState<any[]>([]);
  const [reportData, setReportData] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userAddress, setUserAddress] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const id = await AsyncStorage.getItem("id");
      const address = await AsyncStorage.getItem("alamat");
      if (!id) return;
      setUserId(id);
      setUserAddress(address || "");

      try {
        // Kucingku
        const petRes = await axios.get(`${API_BASE_URL}/pets/user/${id}`);
        const formattedPet = petRes.data.data.map((pet: any) => ({
          name: pet.Nama,
          image: { uri: `${API_BASE_URL}/${pet.Foto}` },
          gender: pet.Jenis_Kelamin,
          age: `${pet.Umur} bulan`,
          location: address,
          status: pet.Adopted === 0 ? "available" : "adopted",
        }));

        // Adopsi
        const adoptionRes = await axios.get(`${API_BASE_URL}/pengajuan/user/${id}`);
        const formattedAdoption = adoptionRes.data.data.map((item: any) => ({
          name: item.Pet.Nama,
          image: { uri: `${API_BASE_URL}/${item.Pet.Foto}` },
          gender: item.Pet.Jenis_Kelamin,
          age: `${item.Pet.Umur} bulan`,
          location: address,
          status: item.Approved === 0 ? "pending" : "approved",
        }));

        // Gabungkan hasil
        setPetData([...formattedPet, ...formattedAdoption]);

        // Laporan
        const reportRes = await axios.get(`${API_BASE_URL}/report/user/${id}`);

        const formattedReport = reportRes.data.data.map((report: any) => {
          const date = new Date(report.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });

          return {
            date, // Contoh hasil: "18 Juni 2025"
            image: { uri: `${API_BASE_URL}/${report.Foto}` },
            location: address,
            status: report.Rescued === 0 ? "diproses" : "selesai",
          };
        });

        setReportData(formattedReport);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
  const loadProfile = async () => {
    try {
      const username = await AsyncStorage.getItem("username");
      const foto = await AsyncStorage.getItem("foto");
      const role = await AsyncStorage.getItem("role");

      setProfile({
        username: username || '',
        foto: foto ? `${API_BASE_URL}/${foto}` : '', // gunakan URI jika ada
        role: role || '',
      });
    } catch (error) {
      console.error("Gagal memuat data profil dari localStorage:", error);
    }
  };

  loadProfile();
}, []);

  const filteredPets = petData.filter((pet) => {
    if (activeTab === "Kucingku") {
      return ["available", "adopted"].includes(pet.status);
    }
    if (activeTab === "Adopsi") {
      return ["approved", "pending"].includes(pet.status);
    }
    return false;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil</Text>
      </View>

      <ScrollView style={styles.content}>
      <View style={styles.profileCard}>
        <Image
          source={
            profile.foto
              ? { uri: profile.foto }
              : require("../assets/images/mini-avatar.png")
          }
          style={styles.profileImage}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.profileName}>{profile.username || "Pengguna"}</Text>
          <Text style={styles.profileRole}>{profile.role || "MeowCare Member"}</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/ubah-profil")}>
          <Ionicons name="create-outline" size={24} color="#1E293B" />
        </TouchableOpacity>
      </View>


        <View style={styles.tabs}>
          {tabs.map((tab) => {
            const isActive = tab === activeTab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.petList}>
            {activeTab !== "Laporan"
              ? filteredPets.map((pet, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.petCard}
                    onPress={async () => {
                      try {
                        await AsyncStorage.setItem("selectedPet", JSON.stringify(pet));
                        router.push("/view-cat");
                      } catch (error) {
                        console.error("Gagal menyimpan data pet:", error);
                      }
                    }}
                  >
                  <Image source={pet.image} style={styles.petImage} />
                  <View style={styles.petInfo}>
                    <View style={styles.petHeader}>
                      <Text style={styles.petName}>{pet.name}</Text>
                      <View
                        style={[
                          styles.petStatus,
                          { backgroundColor: STATUS_COLORS[pet.status] || "#E5E7EB" },
                        ]}
                      >
                        <Text
                          style={[
                            styles.petStatusText,
                            { color: STATUS_TEXT_COLORS[pet.status] || "#374151" },
                          ]}
                        >
                          {pet.status}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.metaRow}>
                      <LocationIcon />
                      <Text style={styles.petMeta}>{pet.location}</Text>
                    </View>
                    <View style={styles.metaRow}>
                      <GenderIcon />
                      <Text style={styles.petMeta}>{pet.gender}</Text>
                      <View style={{ width: 12 }} />
                      <AgeIcon />
                      <Text style={styles.petMeta}>{pet.age}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            : reportData.map((report, index) => (
                <View key={index} style={styles.petCard}>
                  <Image source={report.image} style={styles.petImage} />
                  <View style={styles.petInfo}>
                    <View style={styles.petHeader}>
                      <Text style={styles.petName}>{report.date}</Text>
                      <View
                        style={[
                          styles.petStatus,
                          {
                            backgroundColor:
                              REPORT_STATUS_COLORS[report.status] || "#E5E7EB",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.petStatusText,
                            {
                              color:
                                REPORT_TEXT_COLORS[report.status] || "#374151",
                            },
                          ]}
                        >
                        {report.status
                          .split(" ")
                          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.metaRow}>
                      <LocationIcon />
                      <Text style={styles.petMeta}>{report.location}</Text>
                    </View>
                  </View>
                </View>
              ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...container.screen,
    backgroundColor: "#fff",
  },
  header: {
    ...container.header,
    backgroundColor: "#fff",
    paddingBottom: spacing.md,
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1E293B",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  headerTitle: {
    ...typography.header.medium,
    color: "#1E293B",
    textAlign: "center",
  },
  content: {
    flex: 1,
  },
  profileCard: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  profileName: {
    ...typography.body.large.semiBold,
    color: "#1E293B",
  },
  profileRole: {
    ...typography.body.small.regular,
    color: "#64748B",
  },
  tabs: {
    flexDirection: "row",
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  tabButton: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: spacing.sm,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    alignItems: "center",
  },
  tabButtonActive: {
    backgroundColor: "#000",
  },
  tabText: {
    ...typography.body.small.medium,
    color: "#000",
  },
  tabTextActive: {
    color: "#fff",
  },
  petList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  petCard: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: spacing.sm,
    alignItems: "center",
    gap: spacing.md,
  },
  petImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
  },
  petInfo: {
    flex: 1,
  },
  petHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  petName: {
    ...typography.body.medium.semiBold,
    color: "#1E293B",
  },
  petStatus: {
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  petStatusText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  petMeta: {
    color: "#64748B",
    fontSize: 14,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    gap: 4,
  },
});
