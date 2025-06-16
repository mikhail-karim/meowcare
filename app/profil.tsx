import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Kucingku");

  const tabs = ["Kucingku", "Adopsi", "Laporan"];

  const petData = [
    {
      name: "Wili",
      location: "Wonokromo, Surabaya",
      gender: "Laki-laki",
      age: "1 Tahun",
      image: require("../assets/images/cats/oyen.png"),
      status: "available",
    },
    {
      name: "Wili",
      location: "Wonokromo, Surabaya",
      gender: "Laki-laki",
      age: "1 Tahun",
      image: require("../assets/images/cats/oyen.png"),
      status: "adopted",
    },
    {
      name: "Wili",
      location: "Wonokromo, Surabaya",
      gender: "Laki-laki",
      age: "1 Tahun",
      image: require("../assets/images/cats/oyen.png"),
      status: "approved",
    },
    {
      name: "Wili",
      location: "Wonokromo, Surabaya",
      gender: "Laki-laki",
      age: "1 Tahun",
      image: require("../assets/images/cats/oyen.png"),
      status: "pending",
    },
    {
      name: "Wili",
      location: "Wonokromo, Surabaya",
      gender: "Laki-laki",
      age: "1 Tahun",
      image: require("../assets/images/cats/oyen.png"),
      status: "rejected",
    },
  ];

  const reportData = [
    {
      date: "29 Maret 2020",
      location: "Wonokromo, Surabaya",
      image: require("../assets/images/cats/oyen.png"),
      status: "diproses",
    },
    {
      date: "29 Maret 2020",
      location: "Wonokromo, Surabaya",
      image: require("../assets/images/cats/oyen.png"),
      status: "ditolak",
    },
    {
      date: "29 Maret 2020",
      location: "Wonokromo, Surabaya",
      image: require("../assets/images/cats/oyen.png"),
      status: "menunggu ditinjau",
    },
    {
      date: "29 Maret 2020",
      location: "Wonokromo, Surabaya",
      image: require("../assets/images/cats/oyen.png"),
      status: "selesai",
    },
  ];

  const filteredPets = petData.filter((pet) => {
    if (activeTab === "Kucingku") {
      return ["available", "adopted"].includes(pet.status);
    }
    if (activeTab === "Adopsi") {
      return ["approved", "pending", "rejected"].includes(pet.status);
    }
    return true;
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
            source={require("../assets/images/mini-avatar.png")}
            style={styles.profileImage}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>Satria</Text>
            <Text style={styles.profileRole}>MeowCare Member</Text>
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
                <View key={index} style={styles.petCard}>
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
                </View>
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
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
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
