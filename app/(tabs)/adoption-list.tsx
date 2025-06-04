import { FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import {
  ImageBackground,
  Modal,
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
import { colors, container, spacing, typography } from '../theme'

type FilterOptions = {
  age: string[];
  gender: string[];
  vaccinated: boolean | null;
  sterilized: boolean | null;
  breed: string[];
  color: string[];
  location: string;
}

// Mock location data
const locationData = [
  { id: 1, city: 'Surabaya', districts: ['Wonokromo', 'Rungkut', 'Darmo', 'Gubeng', 'Sukolilo'] },
  { id: 2, city: 'Sidoarjo', districts: ['Sidoarjo', 'Taman', 'Buduran', 'Waru'] },
  { id: 3, city: 'Gresik', districts: ['Gresik', 'Bungah', 'Manyar', 'Driyorejo'] },
]

export default function AdoptionListScreen() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [cats, setCats] = useState<Pet[]>([])
  const [filteredCats, setFilteredCats] = useState<Pet[]>([])
  const [showFilter, setShowFilter] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({
    age: [],
    gender: [],
    vaccinated: null,
    sterilized: null,
    breed: [],
    color: [],
    location: ''
  })
  const [locationSearch, setLocationSearch] = useState("")
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false)
  const [locationSuggestions, setLocationSuggestions] = useState<{city: string, district: string}[]>([])

  // Available filter options
  const ageOptions = ['Kitten (< 1 tahun)', 'Dewasa (1-3 tahun)', 'Senior (> 3 tahun)']
  const genderOptions = ['Laki-laki', 'Perempuan']
  const breedOptions = ['Domestik', 'Persia', 'Angora']
  const colorOptions = ['Hitam', 'Putih', 'Abu-abu', 'Oranye', 'Tricolor']

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
    ]

    setCats(mockCats)
    setFilteredCats(mockCats)
  }, [])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    applyFilters(query)
  }

  const handleLocationSearch = (text: string) => {
    setLocationSearch(text)
    if (text.trim() === '') {
      setLocationSuggestions([])
      return
    }

    const suggestions: {city: string, district: string}[] = []
    locationData.forEach(city => {
      city.districts.forEach(district => {
        if (district.toLowerCase().includes(text.toLowerCase()) || 
            city.city.toLowerCase().includes(text.toLowerCase())) {
          suggestions.push({
            city: city.city,
            district: district
          })
        }
      })
    })
    setLocationSuggestions(suggestions)
    setShowLocationSuggestions(true)
  }

  const selectLocation = (city: string, district: string) => {
    setFilters(prev => ({ ...prev, location: `${district}, ${city}` }))
    setLocationSearch('')
    setShowLocationSuggestions(false)
  }

  const toggleFilter = (category: keyof FilterOptions, value: string | boolean) => {
    setFilters(prev => {
      if (typeof value === 'boolean') {
        return { ...prev, [category]: value }
      }
      
      const currentValues = prev[category] as string[]
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value]
      
      return { ...prev, [category]: newValues }
    })
  }

  const applyFilters = (searchText: string = searchQuery) => {
    let filtered = cats

    // Apply search
    if (searchText.trim() !== "") {
      filtered = filtered.filter(
        (cat) =>
          cat.name.toLowerCase().includes(searchText.toLowerCase()) ||
          cat.location.toLowerCase().includes(searchText.toLowerCase())
      )
    }

    // Apply filters
    if (filters.age.length > 0) {
      filtered = filtered.filter(cat => filters.age.includes(cat.age))
    }
    if (filters.gender.length > 0) {
      filtered = filtered.filter(cat => filters.gender.includes(cat.gender))
    }
    if (filters.vaccinated !== null) {
      filtered = filtered.filter(cat => cat.vaccinated === filters.vaccinated)
    }
    if (filters.sterilized !== null) {
      filtered = filtered.filter(cat => cat.sterilized === filters.sterilized)
    }
    if (filters.breed.length > 0) {
      filtered = filtered.filter(cat => filters.breed.includes(cat.breed))
    }
    if (filters.color.length > 0) {
      filtered = filtered.filter(cat => filters.color.includes(cat.color))
    }
    if (filters.location) {
      filtered = filtered.filter(cat => 
        cat.location.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

      setFilteredCats(filtered)
    }

  const resetFilters = () => {
    setFilters({
      age: [],
      gender: [],
      vaccinated: null,
      sterilized: null,
      breed: [],
      color: [],
      location: ''
    })
    setFilteredCats(cats)
  }

  const renderFilterModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showFilter}
      onRequestClose={() => setShowFilter(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter</Text>
            <TouchableOpacity onPress={() => setShowFilter(false)}>
              <Ionicons name="close" size={24} color="#304153" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filterScroll}>
            {/* Lokasi */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Lokasi</Text>
              <View style={styles.locationInputContainer}>
                <View style={styles.locationSearchContainer}>
                  <Ionicons name="location-outline" size={20} color="#666" />
                  <TextInput
                    style={styles.locationInput}
                    placeholder="Cari kota atau kecamatan"
                    value={locationSearch}
                    onChangeText={handleLocationSearch}
                    placeholderTextColor="#666"
                  />
                </View>
                {filters.location && (
                  <View style={styles.selectedLocation}>
                    <Text style={styles.selectedLocationText}>{filters.location}</Text>
                    <TouchableOpacity 
                      onPress={() => setFilters(prev => ({ ...prev, location: '' }))}
                    >
                      <Ionicons name="close-circle" size={20} color="#666" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              {showLocationSuggestions && locationSuggestions.length > 0 && (
                <View style={styles.locationSuggestions}>
                  {locationSuggestions.map((item, index) => (
                    <TouchableOpacity
                      key={`${item.city}-${item.district}-${index}`}
                      style={styles.locationSuggestionItem}
                      onPress={() => selectLocation(item.city, item.district)}
                    >
                      <Ionicons name="location-outline" size={16} color="#666" />
                      <Text style={styles.locationSuggestionText}>
                        {item.district}, {item.city}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Umur */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Umur</Text>
              <View style={styles.filterOptions}>
                {ageOptions.map((age) => (
                  <TouchableOpacity
                    key={age}
                    style={[
                      styles.filterChip,
                      filters.age.includes(age) && styles.filterChipActive
                    ]}
                    onPress={() => toggleFilter('age', age)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      filters.age.includes(age) && styles.filterChipTextActive
                    ]}>{age}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Jenis Kelamin */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Jenis Kelamin</Text>
              <View style={styles.filterOptions}>
                {genderOptions.map((gender) => (
                  <TouchableOpacity
                    key={gender}
                    style={[
                      styles.filterChip,
                      filters.gender.includes(gender) && styles.filterChipActive
                    ]}
                    onPress={() => toggleFilter('gender', gender)}
                  >
                    <MaterialCommunityIcons 
                      name={gender === 'Laki-laki' ? 'gender-male' : 'gender-female'} 
                      size={16} 
                      color={filters.gender.includes(gender) ? '#fff' : '#304153'} 
                    />
                    <Text style={[
                      styles.filterChipText,
                      filters.gender.includes(gender) && styles.filterChipTextActive
                    ]}>{gender}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Vaksin */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Status Vaksin</Text>
              <View style={styles.filterOptions}>
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    filters.vaccinated === true && styles.filterChipActive
                  ]}
                  onPress={() => toggleFilter('vaccinated', true)}
                >
                  <Ionicons 
                    name="checkmark-circle" 
                    size={16} 
                    color={filters.vaccinated === true ? '#fff' : '#304153'} 
                  />
                  <Text style={[
                    styles.filterChipText,
                    filters.vaccinated === true && styles.filterChipTextActive
                  ]}>Sudah Vaksin</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    filters.vaccinated === false && styles.filterChipActive
                  ]}
                  onPress={() => toggleFilter('vaccinated', false)}
                >
                  <Ionicons 
                    name="close-circle" 
                    size={16} 
                    color={filters.vaccinated === false ? '#fff' : '#304153'} 
                  />
                  <Text style={[
                    styles.filterChipText,
                    filters.vaccinated === false && styles.filterChipTextActive
                  ]}>Belum Vaksin</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Sterilisasi */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Status Sterilisasi</Text>
              <View style={styles.filterOptions}>
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    filters.sterilized === true && styles.filterChipActive
                  ]}
                  onPress={() => toggleFilter('sterilized', true)}
                >
                  <Ionicons 
                    name="checkmark-circle" 
                    size={16} 
                    color={filters.sterilized === true ? '#fff' : '#304153'} 
                  />
                  <Text style={[
                    styles.filterChipText,
                    filters.sterilized === true && styles.filterChipTextActive
                  ]}>Sudah Steril</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    filters.sterilized === false && styles.filterChipActive
                  ]}
                  onPress={() => toggleFilter('sterilized', false)}
                >
                  <Ionicons 
                    name="close-circle" 
                    size={16} 
                    color={filters.sterilized === false ? '#fff' : '#304153'} 
                  />
                  <Text style={[
                    styles.filterChipText,
                    filters.sterilized === false && styles.filterChipTextActive
                  ]}>Belum Steril</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Ras */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Ras</Text>
              <View style={styles.filterOptions}>
                {breedOptions.map((breed) => (
                  <TouchableOpacity
                    key={breed}
                    style={[
                      styles.filterChip,
                      filters.breed.includes(breed) && styles.filterChipActive
                    ]}
                    onPress={() => toggleFilter('breed', breed)}
                  >
                    <FontAwesome 
                      name="paw" 
                      size={16} 
                      color={filters.breed.includes(breed) ? '#fff' : '#304153'} 
                    />
                    <Text style={[
                      styles.filterChipText,
                      filters.breed.includes(breed) && styles.filterChipTextActive
                    ]}>{breed}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Warna */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Warna</Text>
              <View style={styles.filterOptions}>
                {colorOptions.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.filterChip,
                      filters.color.includes(color) && styles.filterChipActive
                    ]}
                    onPress={() => toggleFilter('color', color)}
                  >
                    <Ionicons 
                      name="color-palette" 
                      size={16} 
                      color={filters.color.includes(color) ? '#fff' : '#304153'} 
                    />
                    <Text style={[
                      styles.filterChipText,
                      filters.color.includes(color) && styles.filterChipTextActive
                    ]}>{color}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={resetFilters}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={() => {
                applyFilters()
                setShowFilter(false)
              }}
            >
              <Text style={styles.applyButtonText}>Terapkan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )

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
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilter(true)}
          >
            <Ionicons name="options-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Cat List */}
        <View style={styles.catList}>{filteredCats.map(renderCatCard)}</View>
      </ScrollView>

      {renderFilterModal()}
    </SafeAreaView>
  )
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
}) 