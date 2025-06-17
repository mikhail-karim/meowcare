// app/list-report.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { PetCard } from "../../components/PetCard";
import { Pet } from "../../components/types";
import { colors, container, spacing, typography } from "../theme";

export default function AdoptionListScreen() {
  const router = useRouter();
  const [cats, setCats] = useState<Pet[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCat, setSelectedCat] = useState<Pet | null>(null);
  const [modalType, setModalType] = useState<"accept" | "reject" | null>(null);
  const [acceptedCatIds, setAcceptedCatIds] = useState<number[]>([]);
  const [rejectedCatIds, setRejectedCatIds] = useState<number[]>([]);

  useEffect(() => {
    const mockCats: Pet[] = [
      {
        id: 1,
        name: "Wili",
        location: "Wonokromo, Surabaya",
        gender: "Laki-laki",
        age: "1 Tahun",
        image: require("../../assets/images/cats/wili.png"),
        vaccinated: true,
        sterilized: true,
        breed: "Domestik",
        color: "Hitam-Putih",
      },
      {
        id: 2,
        name: "Oyen",
        location: "Rungkut, Surabaya",
        gender: "Laki-laki",
        age: "3 Tahun",
        image: require("../../assets/images/cats/oyen.png"),
        vaccinated: true,
        sterilized: false,
        breed: "Persia",
        color: "Oranye",
      },
      {
        id: 3,
        name: "Bonie",
        location: "Darmo, Surabaya",
        gender: "Laki-laki",
        age: "5 Tahun",
        image: require("../../assets/images/cats/bonie.png"),
        vaccinated: false,
        sterilized: true,
        breed: "Angora",
        color: "Abu-abu",
      },
    ];
    setCats(mockCats);
  }, []);

  const handleAccept = (id: number) => {
    setAcceptedCatIds((prev) => [...prev, id]);
    setRejectedCatIds((prev) => prev.filter((catId) => catId !== id));
    setModalVisible(false);
  };

  const handleReject = (id: number) => {
    setRejectedCatIds((prev) => [...prev, id]);
    setAcceptedCatIds((prev) => prev.filter((catId) => catId !== id));
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daftar Laporan Kucing</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.catList}>
          {cats.map((pet) => (
            <View key={pet.id} style={styles.petCardWrapper}>
              <View style={styles.cardRow}>
                <View style={{ flex: 1 }}>
                  <PetCard
                    pet={pet}
                    onPress={() =>
                      router.push({
                        pathname: "/cat-detail",
                        params: { cat: JSON.stringify(pet) },
                      })
                    }
                  />
                </View>
                <View style={styles.buttonGroup}>
                  {acceptedCatIds.includes(pet.id) ? (
                    <TouchableOpacity style={[styles.actionButton, styles.acceptButton]}>
                      <Text style={styles.buttonText}>Accepted</Text>
                    </TouchableOpacity>
                  ) : rejectedCatIds.includes(pet.id) ? (
                    <TouchableOpacity style={[styles.actionButton, styles.rejectButton]}>
                      <Text style={styles.buttonText}>Rejected</Text>
                    </TouchableOpacity>
                  ) : (
                    <>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.acceptButton]}
                        onPress={() => {
                          setSelectedCat(pet);
                          setModalType("accept");
                          setModalVisible(true);
                        }}
                      >
                        <Text style={styles.buttonText}>Accept</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.rejectButton]}
                        onPress={() => {
                          setSelectedCat(pet);
                          setModalType("reject");
                          setModalVisible(true);
                        }}
                      >
                        <Text style={styles.buttonText}>Reject</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* MODAL KONFIRMASI */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>
              {modalType === "accept"
                ? `Terima laporan kucing ${selectedCat?.name}?`
                : `Tolak laporan kucing ${selectedCat?.name}?`}
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.rejectButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  modalType === "accept" ? styles.acceptButton : styles.rejectButton,
                ]}
                onPress={() => {
                  if (modalType === "accept" && selectedCat) handleAccept(selectedCat.id);
                  else if (modalType === "reject" && selectedCat) handleReject(selectedCat.id);
                }}
              >
                <Text style={styles.buttonText}>
                  {modalType === "accept" ? "Terima" : "Tolak"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...container.screen,
  },
  header: {
    ...container.header,
  },
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
  content: {
    ...container.content,
  },
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

  // MODAL
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
});
