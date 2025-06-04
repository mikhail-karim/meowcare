import { FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect, useState } from "react"
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native"
import { Pet } from '../components/types'
import { typography } from './theme'

export default function CatDetailScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const [cat, setCat] = useState<Pet | null>(null)

  useEffect(() => {
    if (params.cat) {
      try {
        const catData = JSON.parse(params.cat as string) as Pet
        setCat(catData)
      } catch (error) {
        console.error('Error parsing cat data:', error)
      }
    }
  }, [params.cat])

  // Mock data for breed, color, description, poster, and date
  const breed = 'Kucing Domestik'
  const color = 'Hitam- Putih'
  const description = 'Dulu ditemuin di jalan, sekarang cari rumah aman. Agak malu-malu.'
  const poster = {
    name: 'Satria',
    role: 'MeowCare Member',
    avatar: require('../assets/images/mini-avatar.png'), // fallback avatar
    date: '25 Mei, 2025',
  }

  if (!cat) return null

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={{paddingBottom: 120}} showsVerticalScrollIndicator={false}>
        {/* Cat Image with floating back button */}
        <View style={styles.imageContainer}>
          <Image
            source={typeof cat.image === 'string' ? { uri: cat.image } : cat.image}
            style={styles.catImage}
            resizeMode="cover"
          />
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#304153" />
          </TouchableOpacity>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.catName}>{cat.name}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={16} color="#8A8A8A" style={{marginRight: 4}} />
            <Text style={styles.locationText}>{cat.location}</Text>
          </View>

          {/* Info Pills */}
          <View style={styles.pillsRow}>
            <View style={styles.pillItem}>
              <View style={styles.pill}>
                <MaterialCommunityIcons name={cat.gender === 'Laki-laki' ? 'gender-male' : 'gender-female'} size={22} color="#547792" />
              </View>
              <Text style={styles.pillLabel}>{cat.gender}</Text>
            </View>
            <View style={styles.pillItem}>
              <View style={styles.pill}>
                <FontAwesome name="paw" size={20} color="#547792" />
              </View>
              <Text style={styles.pillLabel}>{cat.age}</Text>
            </View>
            <View style={styles.pillItem}>
              <View style={styles.pill}>
                <Ionicons name="grid-outline" size={20} color="#547792" />
              </View>
              <Text style={styles.pillLabel}>{breed}</Text>
            </View>
            <View style={styles.pillItem}>
              <View style={styles.pill}>
                <Ionicons name="color-palette-outline" size={20} color="#547792" />
              </View>
              <Text style={styles.pillLabel}>{color}</Text>
            </View>
          </View>

          {/* About Section */}
          <View style={styles.aboutSection}>
            <Text style={styles.aboutTitle}>Tentang {cat.name}</Text>
            <Text style={styles.aboutText}>{description}</Text>
          </View>

          {/* Posted By */}
          <View style={styles.postedBySection}>
            <Image source={poster.avatar} style={styles.posterImage} />
            <View style={styles.posterInfo}>
              <Text style={styles.posterName}>{poster.name}</Text>
              <Text style={styles.posterRole}>{poster.role}</Text>
            </View>
            <Text style={styles.postDate}>{poster.date}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.adoptButton} onPress={() => router.push({ pathname: '/adoption-form', params: { cat: JSON.stringify(cat) } })}>
          <Text style={styles.adoptButtonText}>Ajukan Adopsi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.chatButton}>
          <Ionicons name="chatbubble-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 280,
    backgroundColor: '#eee',
    overflow: 'hidden',
  },
  catImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E6EEF6',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    marginTop: -36,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  catName: {
    ...typography.header.large,
    color: '#304153',
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  locationText: {
    ...typography.body.medium.regular,
    color: '#8A8A8A',
  },
  pillsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    gap: 8,
  },
  pillItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  pill: {
    backgroundColor: '#E6EEF6',
    borderRadius: 36,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  pillLabel: {
    ...typography.body.small.semiBold,
    color: '#304153',
    textAlign: 'center',
    lineHeight: 16,
  },
  aboutSection: {
    marginBottom: 18,
  },
  aboutTitle: {
    ...typography.body.medium.semiBold,
    color: '#304153',
    marginBottom: 6,
  },
  aboutText: {
    ...typography.body.small.regular,
    color: '#7B7B7B',
    lineHeight: 22,
  },
  postedBySection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginTop: 8,
  },
  posterImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  posterInfo: {
    flex: 1,
    marginLeft: 12,
  },
  posterName: {
    ...typography.body.medium.semiBold,
    color: '#304153',
  },
  posterRole: {
    ...typography.body.small.regular,
    color: '#7B7B7B',
  },
  postDate: {
    ...typography.body.small.regular,
    color: '#7B7B7B',
  },
  bottomActions: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 60,
    gap: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  adoptButton: {
    flex: 1,
    backgroundColor: '#304153',
    borderRadius: 36,
    paddingVertical: 16,
    alignItems: 'center',
  },
  adoptButtonText: {
    ...typography.body.medium.semiBold,
    color: '#fff',
  },
  chatButton: {
    width: 60,
    height: 60,
    borderRadius: 36,
    backgroundColor: '#304153',
    justifyContent: 'center',
    alignItems: 'center',
  },
}) 