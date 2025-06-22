// ProfilScreen.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LocationIcon } from "../components/Icons";
import { API_BASE_URL } from "../components/types";

const STATUS_COLORS = {
  available: "#DCFCE7",
  adopted: "#DBEAFE",
  approved: "#BBF7D0",
  pending: "#FEF9C3",
  rejected: "#FECACA",
};

const STATUS_TEXT_COLORS = {
  available: "#15803D",
  adopted: "#1D4ED8",
  approved: "#166534",
  pending: "#A16207",
  rejected: "#B91C1C",
};

const REPORT_STATUS_COLORS = {
  diproses: "#FEF9C3",
  ditolak: "#FECACA",
  "menunggu ditinjau": "#E0F2FE",
  selesai: "#DCFCE7",
};

const REPORT_TEXT_COLORS = {
  diproses: "#A16207",
  ditolak: "#B91C1C",
  "menunggu ditinjau": "#0369A1",
  selesai: "#15803D",
};

export default function ProfilScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Kucingku");
  const [profile, setProfile] = useState({ username: "", foto: "", role: "" });
  const [myCats, setMyCats] = useState([]);
  const [adoptions, setAdoptions] = useState([]);
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const id = await AsyncStorage.getItem("id");
      const address = await AsyncStorage.getItem("alamat");
      if (!id) return;

      try {
        const petRes = await axios.get(`${API_BASE_URL}/pets/user/${id}`);
        const formattedPet = petRes.data.data.map(pet => ({
          name: pet.Nama,
          image: { uri: `${API_BASE_URL}/${pet.Foto}` },
          gender: pet.Jenis_Kelamin,
          age: `${pet.Umur} bulan`,
          location: address,
          status: pet.Adopted === 0 ? "available" : "adopted",
        }));
        setMyCats(formattedPet);

        const adoptionRes = await axios.get(`${API_BASE_URL}/pengajuan/user/${id}`);
        const formattedAdoption = adoptionRes.data.data.map(item => ({
          name: item.Pet.Nama,
          image: { uri: `${API_BASE_URL}/${item.Pet.Foto}` },
          gender: item.Pet.Jenis_Kelamin,
          age: `${item.Pet.Umur} bulan`,
          location: address,
          status: item.Approved === 0 ? "pending" : item.Approved === 1 ? "approved" : "rejected",
        }));
        setAdoptions(formattedAdoption);

        const reportRes = await axios.get(`${API_BASE_URL}/report/user/${id}`);
        const formattedReport = reportRes.data.data.map(report => {
          const date = new Date(report.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
          return {
            id: report.id,
            date,
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
      const username = await AsyncStorage.getItem("username");
      const foto = await AsyncStorage.getItem("foto");
      const role = await AsyncStorage.getItem("role");
      setProfile({
        username: username || "",
        foto: foto ? `${API_BASE_URL}/${foto}` : "",
        role: role || "",
      });
    };
    loadProfile();
  }, []);

  const filteredPets = activeTab === "Kucingku" ? myCats : activeTab === "Adopsi" ? adoptions : [];

  return (
    <SafeAreaView style={styles.container}>
      {/* header dan profileCard tetap */}
      <ScrollView>
        {/* tabs tetap */}
        <View style={styles.petList}>
          {activeTab !== "Laporan"
            ? filteredPets.map((pet, index) => (
                <TouchableOpacity key={index} style={styles.petCard}>
                  {/* konten kucing */}
                </TouchableOpacity>
              ))
            : reportData.map((report, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.petCard}
                  onPress={async () => {
                    await AsyncStorage.setItem("reportId", report.id.toString());
                    router.push("/detail-laporan");
                  }}
                >
                  <Image source={report.image} style={styles.petImage} />
                  <View style={styles.petInfo}>
                    <View style={styles.petHeader}>
                      <Text style={styles.petName}>{report.date}</Text>
                      <View style={{ backgroundColor: REPORT_STATUS_COLORS[report.status] }}>
                        <Text style={{ color: REPORT_TEXT_COLORS[report.status] }}>{report.status}</Text>
                      </View>
                    </View>
                    <View style={styles.metaRow}>
                      <LocationIcon />
                      <Text>{report.location}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  petList: { padding: 16 },
  petCard: { backgroundColor: "#F8FAFC", padding: 12, borderRadius: 12, marginBottom: 12, flexDirection: "row" },
  petImage: { width: 80, height: 80, borderRadius: 10, marginRight: 12 },
  petInfo: { flex: 1 },
  petHeader: { flexDirection: "row", justifyContent: "space-between" },
  petName: { fontWeight: "bold" },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
});


// detail-laporan.tsx
import React from "react";
import { ActivityIndicator } from "react-native";

export default function DetailLaporanScreen() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const id = await AsyncStorage.getItem("reportId");
        const res = await axios.get(`${API_BASE_URL}/report/${id}`);
        setReport(res.data.data);
      } catch (error) {
        console.error("Gagal mengambil detail laporan:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 100 }} size="large" color="#000" />;
  if (!report) return <Text style={{ marginTop: 100, textAlign: "center" }}>Data laporan tidak ditemukan.</Text>;

  return (
    <ScrollView style={{ padding: 16 }}>
      <Image source={{ uri: `${API_BASE_URL}/${report.Foto}` }} style={{ height: 200, borderRadius: 12 }} />
      <Text style={styles.label}>Tanggal:</Text>
      <Text style={styles.value}>{new Date(report.created_at).toLocaleDateString("id-ID")}</Text>
      <Text style={styles.label}>Lokasi:</Text>
      <Text style={styles.value}>{report.Lokasi || "-"}</Text>
      <Text style={styles.label}>Status:</Text>
      <Text style={styles.value}>{report.Rescued === 0 ? "Diproses" : "Selesai"}</Text>
      <Text style={styles.label}>Deskripsi:</Text>
      <Text style={styles.value}>{report.Deskripsi || "-"}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  label: { marginTop: 16, fontWeight: "bold", fontSize: 14, color: "#475569" },
  value: { fontSize: 16, marginTop: 4, color: "#1E293B" },
});
