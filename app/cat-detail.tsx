import { FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Pet } from '../components/types';
import { typography } from './theme';

const API_BASE_URL = 'http://192.168.0.108:8000';

export default function CatDetailScreen() {
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);

  const [cat, setCat] = useState<Pet | null>(null);
  
  const [poster, setPoster] = useState<{
    name: string;
    role: string;
    avatar: { uri: string };
  } | null>(null);

  useEffect(() => {
    const loadCatData = async () => {
      try {
        const value = await AsyncStorage.getItem('selectedCat');
        const loginId = await AsyncStorage.getItem('id');

        if (loginId) setUserId(parseInt(loginId));

        if (value !== null) {
          const parsedCat = JSON.parse(value) as Pet & { owner?: number };
          setCat(parsedCat);

          // Fetch poster (user) data
          if (parsedCat.owner) {
            const response = await axios.get(`${API_BASE_URL}/users/id/${parsedCat.owner}`);
            const userData = response.data;

            setPoster({
              name: userData.Nama_Lengkap,
              role: userData.Role,
              avatar: { uri: `${API_BASE_URL}/${userData.Foto_Profil}` },
            });
          }
        }
      } catch (error) {
        console.error('Gagal memuat data:', error);
      }
    };

    loadCatData();
  }, []);

  if (!cat) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Cat Image with back button */}
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
            <Ionicons name="location-outline" size={16} color="#8A8A8A" style={{ marginRight: 4 }} />
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
              <Text style={styles.pillLabel}>{cat.age} bulan</Text>
            </View>
            <View style={styles.pillItem}>
              <View style={styles.pill}>
                <Ionicons name="grid-outline" size={20} color="#547792" />
              </View>
              <Text style={styles.pillLabel}>{cat.breed}</Text>
            </View>
            <View style={styles.pillItem}>
              <View style={styles.pill}>
                <Ionicons name="color-palette-outline" size={20} color="#547792" />
              </View>
              <Text style={styles.pillLabel}>{cat.color}</Text>
            </View>
          </View>

          {/* Posted By */}
          {poster && (
            <View style={styles.postedBySection}>
              <Image source={poster.avatar} style={styles.posterImage} />
              <View style={styles.posterInfo}>
                <Text style={styles.posterName}>{poster.name}</Text>
                <Text style={styles.posterRole}>{poster.role}</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      {cat?.owner !== userId && (
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.adoptButton}
            onPress={() => router.push({
              pathname: '/adoption-form',
              params: { cat: JSON.stringify(cat) }
            })}
          >
            <Text style={styles.adoptButtonText}>Ajukan Adopsi</Text>
          </TouchableOpacity>
        </View>
      )}

    </SafeAreaView>
  );
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
}) 