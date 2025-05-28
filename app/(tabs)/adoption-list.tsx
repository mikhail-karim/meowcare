import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native"
import { PetCard } from '../../components/PetCard'
import { Pet } from '../../components/types'
import { typography } from '../theme'

export default function AdoptionListScreen() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [cats, setCats] = useState<Pet[]>([])
  const [filteredCats, setFilteredCats] = useState<Pet[]>([])

  useEffect(() => {
    // Simulasi data kucing dari API
    const mockCats: Pet[] = [
      {
        id: 1,
        name: "Wili",
        location: "Wonokromo, Surabaya",
        gender: "Laki-laki",
        age: "1 Tahun",
        image: require('../../assets/images/cats/wili.png'),
      },
      {
        id: 2,
        name: "Oyen",
        location: "Rungkut, Surabaya",
        gender: "Laki-laki",
        age: "3 Tahun",
        image: require('../../assets/images/cats/oyen.png'),
      },
      {
        id: 3,
        name: "Bonie",
        location: "Darmo, Surabaya",
        gender: "Laki-laki",
        age: "5 Tahun",
        image: require('../../assets/images/cats/bonie.png'),
      },
    ]

    setCats(mockCats)
    setFilteredCats(mockCats)
  }, [])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim() === "") {
      setFilteredCats(cats)
    } else {
      const filtered = cats.filter(
        (cat) =>
          cat.name.toLowerCase().includes(query.toLowerCase()) ||
          cat.location.toLowerCase().includes(query.toLowerCase()),
      )
      setFilteredCats(filtered)
    }
  }

  const renderCatCard = (pet: Pet) => (
    <PetCard
      key={pet.id}
      pet={pet}
      onPress={() => router.push({
        pathname: "/cat-detail",
        params: { cat: JSON.stringify(pet) }
      })}
    />
  )

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Adopsi</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <ImageBackground
          source={require('../../assets/images/Banner.png')}
          style={styles.banner}
          imageStyle={styles.bannerImage}
        >
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerText}>Cari & Temukan teman berbulumu di sini</Text>
          </View>
        </ImageBackground>

        {/* Search and Filter */}
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
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Cat List */}
        <View style={styles.catList}>{filteredCats.map(renderCatCard)}</View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    position: "relative",
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 16,
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
    color: "#222",
    textAlign: "center",
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
  },
  banner: {
    height: 90,
    marginHorizontal: 20,
    marginTop: 0,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 18,
  },
  bannerImage: {
    borderRadius: 16,
  },
  bannerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    padding: 16,
  },
  bannerText: {
    ...typography.body.large.semiBold,
    color: "#fff",
    lineHeight: 28,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 8,
    gap: 10,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: "#222",
    ...typography.body.medium.regular,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#222E3A",
    justifyContent: "center",
    alignItems: "center",
  },
  catList: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 100,
  },
}) 