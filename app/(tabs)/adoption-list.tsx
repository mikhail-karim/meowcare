import { Ionicons } from "@expo/vector-icons";
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

type FilterOptions = {
  age: string[];
  gender: string[];
  vaccinated: boolean | null;
  sterilized: boolean | null;
  breed: string[];
  color: string[];
  location: string;
};

const locationData = [
  { id: 1, city: 'Surabaya', districts: ['Wonokromo', 'Rungkut', 'Darmo', 'Gubeng', 'Sukolilo'] },
  { id: 2, city: 'Sidoarjo', districts: ['Sidoarjo', 'Taman', 'Buduran', 'Waru'] },
  { id: 3, city: 'Gresik', districts: ['Gresik', 'Bungah', 'Manyar', 'Driyorejo'] },
];

export default function AdoptionListScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [cats, setCats] = useState<Pet[]>([]);
  const [filteredCats, setFilteredCats] = useState<Pet[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    age: [],
    gender: [],
    vaccinated: null,
    sterilized: null,
    breed: [],
    color: [],
    location: ''
  });
  const [locationSearch, setLocationSearch] = useState("");
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<{city: string, district: string}[]>([]);

  const ageOptions = ['Kitten (< 1 tahun)', 'Dewasa (1-3 tahun)', 'Senior (> 3 tahun)'];
  const genderOptions = ['Laki-laki', 'Perempuan'];
  const breedOptions = ['Domestik', 'Persia', 'Angora'];
  const colorOptions = ['Hitam', 'Putih', 'Abu-abu', 'Oranye', 'Tricolor'];

  useEffect(() => {
    const mockCats: Pet[] = [
      {
        id: 1,
        name: "Wili",
        location: "Wonokromo, Surabaya",
        gender: "Laki-laki",
        age: "1 Tahun",
        image: require('../../assets/images/cats/wili.png'),
        vaccinated: true,
        sterilized: true,
        breed: "Domestik",
        color: "Hitam-Putih"
      },
      {
        id: 2,
        name: "Oyen",
        location: "Rungkut, Surabaya",
        gender: "Laki-laki",
        age: "3 Tahun",
        image: require('../../assets/images/cats/oyen.png'),
        vaccinated: true,
        sterilized: false,
        breed: "Persia",
        color: "Oranye"
      },
      {
        id: 3,
        name: "Bonie",
        location: "Darmo, Surabaya",
        gender: "Laki-laki",
        age: "5 Tahun",
        image: require('../../assets/images/cats/bonie.png'),
        vaccinated: false,
        sterilized: true,
        breed: "Angora",
        color: "Abu-abu"
      },
    ];
    setCats(mockCats);
    setFilteredCats(mockCats);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query);
  };

  const handleLocationSearch = (text: string) => {
    setLocationSearch(text);
    if (text.trim() === '') {
      setLocationSuggestions([]);
      return;
    }

    const suggestions: {city: string, district: string}[] = [];
    locationData.forEach(city => {
      city.districts.forEach(district => {
        if (district.toLowerCase().includes(text.toLowerCase()) || 
            city.city.toLowerCase().includes(text.toLowerCase())) {
          suggestions.push({
            city: city.city,
            district: district
          });
        }
      });
    });
    setLocationSuggestions(suggestions);
    setShowLocationSuggestions(true);
  };

  const selectLocation = (city: string, district: string) => {
    setFilters(prev => ({ ...prev, location: `${district}, ${city}` }));
    setLocationSearch('');
    setShowLocationSuggestions(false);
  };

  const toggleFilter = (category: keyof FilterOptions, value: string | boolean) => {
    setFilters(prev => {
      if (typeof value === 'boolean') {
        return { ...prev, [category]: value };
      }
      const currentValues = prev[category] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [category]: newValues };
    });
  };

  const applyFilters = (searchText: string = searchQuery) => {
    let filtered = cats;
    if (searchText.trim() !== "") {
      filtered = filtered.filter(
        (cat) =>
          cat.name.toLowerCase().includes(searchText.toLowerCase()) ||
          cat.location.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (filters.age.length > 0) {
      filtered = filtered.filter(cat => filters.age.includes(cat.age));
    }
    if (filters.gender.length > 0) {
      filtered = filtered.filter(cat => filters.gender.includes(cat.gender));
    }
    if (filters.vaccinated !== null) {
      filtered = filtered.filter(cat => cat.vaccinated === filters.vaccinated);
    }
    if (filters.sterilized !== null) {
      filtered = filtered.filter(cat => cat.sterilized === filters.sterilized);
    }
    if (filters.breed.length > 0) {
      filtered = filtered.filter(cat => filters.breed.includes(cat.breed));
    }
    if (filters.color.length > 0) {
      filtered = filtered.filter(cat => filters.color.includes(cat.color));
    }
    if (filters.location) {
      filtered = filtered.filter(cat => 
        cat.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    setFilteredCats(filtered);
  };

  const resetFilters = () => {
    setFilters({
      age: [],
      gender: [],
      vaccinated: null,
      sterilized: null,
      breed: [],
      color: [],
      location: ''
    });
    setFilteredCats(cats);
  };

  const renderCatCard = (pet: Pet) => (
    <PetCard
      key={pet.id}
      pet={pet}
      onPress={() => router.push({
        pathname: "/cat-detail",
        params: { cat: JSON.stringify(pet) }
      })}
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
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilter(true)}
        >
          <Ionicons name="options-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.catList}>
        {filteredCats.map(renderCatCard)}

        {/* Tombol Tambah Kucing sekarang di bawah daftar */}
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
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
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