import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location'
import { useFocusEffect, useNavigation, useRouter } from "expo-router"
import { useCallback, useEffect, useRef, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native"
import CatFound from '../../assets/svg/CatFound.svg'
import { API_BASE_URL } from '../../components/types'
import { container, spacing, typography } from '../theme'

export default function LaporanScreen() {
  const router = useRouter()
  const navigation = useNavigation()
  const initialFormState = {
    description: '',
    image: null as string | null,
  }
  const [formData, setFormData] = useState(initialFormState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0)).current

  const resetForm = useCallback(() => {
    setFormData(initialFormState)
    setShowSuccess(false)
    setIsSubmitting(false)
    fadeAnim.setValue(0)
    scaleAnim.setValue(0)
  }, [])

  // Reset form when component mounts
  useEffect(() => {
    resetForm()
  }, [])

  // Reset form when screen becomes focused
  useFocusEffect(
    useCallback(() => {
      resetForm()
    }, [])
  )

  // Reset form when navigating back
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      resetForm()
    })

    return unsubscribe
  }, [navigation, resetForm])

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Please allow location access to use this feature.'
        )
      }
    })()
  }, [])

  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!')
      return
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      setFormData({ ...formData, image: result.assets[0].uri })
    }
  }

  const handleSubmit = async () => {
    if (!formData.description) {
      Alert.alert('Peringatan', 'Mohon isi deskripsi terlebih dahulu.')
      return
    }

    setIsSubmitting(true)

    try {
      const token = await AsyncStorage.getItem('token') // Ganti jika key berbeda
      if (!token) {
        Alert.alert('Gagal', 'Token tidak ditemukan. Silakan login ulang.')
        setIsSubmitting(false)
        return
      }

      const formDataToSend = new FormData()
      formDataToSend.append('Deskripsi', formData.description)

      if (formData.image) {
        const uriParts = formData.image.split('.')
        const fileType = uriParts[uriParts.length - 1]

        formDataToSend.append('Foto', {
          uri: formData.image,
          name: `photo.${fileType}`,
          type: `image/${fileType}`,
        } as any)
      }

      const response = await axios.post(
        `${API_BASE_URL}/report`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      // Jika berhasil
      setIsSubmitting(false)
      setShowSuccess(true)
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]).start()
    } catch (error: any) {
      console.error('Error sending report:', error)
      Alert.alert('Gagal', 'Laporan gagal dikirim. Silakan coba lagi.')
      setIsSubmitting(false)
    }
  }

  const handleBackToHome = () => {
    router.push('/(tabs)/home')
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lapor Kucing</Text>
      </View>

      {showSuccess ? (
        <Animated.View 
          style={[
            styles.successContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <View style={styles.successIconContainer}>
            <Ionicons name="checkmark-circle" size={80} color="#22C55E" />
          </View>
          <Text style={styles.successText}>Laporan Berhasil Dikirim</Text>
          <TouchableOpacity 
            style={styles.homeButton} 
            onPress={handleBackToHome}
          >
            <Text style={styles.homeButtonText}>Kembali ke Beranda</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            {/* Illustration */}
            <View style={styles.catIllustrationWrapper}>
              <CatFound width={300} height={300} />
            </View>
            <Text style={styles.formTitle}>Ketemu kucing? Ayo laporin di sini!</Text>
            
            {/* Description Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Deskripsi</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Deskripsikan kondisi kucing"
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            {/* Image Upload */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Foto Kucing</Text>
              <TouchableOpacity style={styles.imageUploadButton} onPress={pickImage}>
                {formData.image ? (
                  <Image
                    source={{ uri: formData.image }}
                    style={styles.uploadedImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.uploadPlaceholder}>
                    <Ionicons name="camera-outline" size={32} color="#94A3B8" />
                    <Text style={styles.uploadText}>Pilih Foto</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Submit Button */}
            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Kirim Laporan</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    ...container.screen,
  },
  header: {
    ...container.header,
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
  formContainer: {
    paddingHorizontal: spacing.lg,
  },
  formTitle: {
    ...typography.header.medium,
    color: "#222",
    marginBottom: spacing.xl,
  },
  catIllustrationWrapper: {
    alignItems: 'center',
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    ...typography.body.medium.semiBold,
    color: "#222",
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    padding: spacing.md,
    ...typography.body.medium.regular,
    color: "#222",
  },
  textArea: {
    height: 120,
  },
  imageUploadButton: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderStyle: "dashed",
    overflow: "hidden",
  },
  uploadPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  uploadText: {
    ...typography.body.medium.regular,
    color: "#94A3B8",
    marginTop: spacing.sm,
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
  },
  submitButton: {
    backgroundColor: "#222E3A",
    borderRadius: 32,
    padding: spacing.md,
    alignItems: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.xl, 
  },
  submitButtonText: {
    ...typography.body.medium.semiBold,
    color: "#fff",
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  locationInput: {
    flex: 1,
  },
  locationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E6EEF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: spacing.lg,
  },
  successIconContainer: {
    marginBottom: spacing.lg,
  },
  successText: {
    ...typography.header.medium,
    color: '#222E3A',
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  homeButton: {
    backgroundColor: '#222E3A',
    borderRadius: 32,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.md,
  },
  homeButtonText: {
    ...typography.body.medium.semiBold,
    color: '#fff',
  },
}) 