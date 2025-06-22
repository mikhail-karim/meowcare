import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, spacing, typography } from "./theme";

export default function Sterilisasi() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.imageContainer}>
            <Image
              source={require("../assets/images/sterilisasi.jpeg")}
              style={styles.headerImage}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={24} color="#304153" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.headerRow}>
              <Text style={[typography.header.medium, styles.title]}>
                Pentingnya Edukasi Steril Kucing
              </Text>
              <View style={styles.category}>
                <Text style={styles.categoryText}>Edukasi</Text>
              </View>
            </View>

            <View style={styles.authorRow}>
              <Ionicons
                name="person-outline"
                size={14}
                color="#8A8A8A"
                style={{ marginRight: 4 }}
              />
              <Text style={styles.author}>Admin KPKTS</Text>
            </View>

            <Text style={[typography.body.small.regular, styles.bodyText]}>
              Sterilisasi kucing adalah langkah penting untuk mengendalikan populasi, 
              mencegah penyebaran penyakit, dan meningkatkan kesejahteraan kucing, baik peliharaan 
              maupun jalanan. Tanpa steril, kucing bisa berkembang biak tak terkendali, menyebabkan 
              ledakan populasi yang berujung pada banyak kucing terlantar dan hidup menderita di jalanan.{"\n\n"}

              <Text style={typography.body.medium.semiBold}>Manfaat Sterilisasi:</Text>
              {"\n"}• Mengurangi jumlah kucing liar/tidak diinginkan.
              {"\n"}• Mencegah penyakit reproduksi dan perilaku agresif.
              {"\n"}• Membuat kucing lebih sehat, tenang, dan berumur panjang.
              {"\n"}• Bentuk tanggung jawab pemilik terhadap hewannya.{"\n\n"}

              <Text style={typography.body.medium.semiBold}>Cara Steril Kucing Lewat Komunitas KPKTS:</Text>
              {"\n"}1. Hubungi admin KPKTS via Instagram @home_kpkts atau WhatsApp (lihat di bio IG).
              {"\n"}2. Konsultasi & daftar program steril.
              {"\n"}3. Ikuti instruksi pra-steril (puasa, dll).
              {"\n"}4. Bawa kucing sesuai jadwal yang ditentukan.
              {"\n"}5. Rawat pasca-steril sesuai panduan.{"\n\n"}

              Dengan mensterilkan satu kucing, kamu sudah menyelamatkan ratusan kucing jalanan di masa depan.
              Yuk, ambil bagian sekarang juga!
            </Text>

            <TouchableOpacity
              style={styles.igButton}
              onPress={() => Linking.openURL("https://instagram.com/home_kpkts")}
            >
              <FontAwesome name="instagram" size={16} color="#E1306C" style={{ marginRight: 6 }} />
              <Text style={styles.igText}>@home_kpkts</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 280,
    backgroundColor: "#eee",
    overflow: "hidden",
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E6EEF6",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  content: {
    backgroundColor: colors.background,
    marginTop: -36,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    padding: spacing.lg,
  },
  headerRow: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
    color: colors.text.primary,
  },
  category: {
    backgroundColor: colors.surface.medium,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginVertical: 12,
    borderRadius: 16,
  },
  categoryText: {
    ...typography.body.small.medium,
    color: colors.text.secondary,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  author: {
    ...typography.body.small.regular,
    color: colors.text.secondary,
  },
  bodyText: {
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  igButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.md,
    paddingVertical: 8,
  },
  igText: {
    ...typography.body.small.semiBold,
    color: "#E1306C",
  },
});
