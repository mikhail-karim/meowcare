import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { PetCard } from '../../components/PetCard';
import { Pet } from '../../components/types';
import { colors, container, spacing, typography } from '../theme';

const API_BASE_URL = 'http://192.168.0.108:8000';

export default function AdoptionListScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [cats, setCats] = useState<Pet[]>([]);
  const [filteredCats, setFilteredCats] = useState<Pet[]>([]);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/pets`);
        const petsFromApi = response.data.map((item: any) => ({
          id: item.Pet_ID,
          name: item.Nama,
          location: item.user?.Alamat ?? "Lokasi tidak tersedia",
          gender: item.Jenis_Kelamin === "Laki-Laki" ? "Laki-laki" : "Perempuan",
          age: parseInt(item.Umur),
          image: { uri: `${API_BASE_URL}/${item.Foto}` },
          vaccinated: Boolean(item.Divaksin),
          sterilized: Boolean(item.Sterilisasi),
          breed: item.ras?.Nama ?? "Tidak diketahui",
          color: item.warna?.Nama ?? "Tidak diketahui",
          owner: item.User_ID
        }));

        setCats(petsFromApi);
        setFilteredCats(petsFromApi);
      } catch (error) {
        console.error("Gagal memuat data pets:", error);
      }
    };

    fetchPets();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = cats.filter(cat =>
      (cat.name ?? '').toLowerCase().includes(query.toLowerCase()) ||
      (cat.location ?? '').toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCats(filtered);
  };

const renderCatCard = (pet: Pet) => (
  <PetCard
    key={pet.id}
    pet={pet}
    onPress={async () => {
      try {
        await AsyncStorage.setItem("selectedCat", JSON.stringify(pet));
        router.push({
          pathname: "/cat-detail",
          params: { cat: JSON.stringify(pet) }
        });
      } catch (error) {
        console.error("Gagal menyimpan data kucing ke AsyncStorage:", error);
      }
    }}
  />
);


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Adopsi</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={require('../../assets/images/Banner.png')}
          style={styles.banner}
          imageStyle={styles.bannerImage}
        >
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerText}>Cari & Temukan teman berbulumu di sini</Text>
          </View>
        </ImageBackground>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search-outline" size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari"
              value={searchQuery}
              onChangeText={handleSearch}
              placeholderTextColor="#666"
            />
          </View>
        </View>

        <View style={styles.catList}>
          {filteredCats.map(renderCatCard)}

          <TouchableOpacity
            style={styles.addButtonBelow}
            onPress={() => router.push('../add-kucing-form')}
          >
            <Ionicons name="add-circle-outline" size={24} color="white" />
            <Text style={styles.addButtonText}>Tambah Kucing</Text>
          </TouchableOpacity>
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
  banner: {
    height: 90,
    marginHorizontal: spacing.lg,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: spacing.md,
  },
  bannerImage: {
    borderRadius: 16,
  },
  bannerOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    padding: spacing.md,
  },
  bannerText: {
    ...typography.body.large.semiBold,
    color: colors.background,
    lineHeight: 28,
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
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    color: colors.text.primary,
    ...typography.body.medium.regular,
  },
  catList: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 8,
    ...typography.body.medium.semiBold,
  },
  addButtonBelow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 30,
    marginTop: spacing.lg,
    justifyContent: 'center',
  },
});
