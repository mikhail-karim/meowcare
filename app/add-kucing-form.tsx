// app/add-kucing-form.tsx
import { Ionicons } from "@expo/vector-icons"
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
import { container, spacing, typography } from './theme'

export default function LaporanScreen() {
  const router = useRouter()
  const navigation = useNavigation()
  const initialFormState = {
    name:'',
    nomortelepon:'',
    email:'',
    location: '',
    jeniskelamin:'',
    umur:'',
    ras:'',
    warna:'',
    description: '',
    image: null as string | null,
  }
  const [formData, setFormData] = useState(initialFormState)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
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

  const getCurrentLocation = async () => {
    try {
      setIsLoadingLocation(true)
      const { status } = await Location.requestForegroundPermissionsAsync()
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Please allow location access to use this feature.'
        )
        return
      }

      const location = await Location.getCurrentPositionAsync({})
      const { latitude, longitude } = location.coords

      // Get address from coordinates
      const [address] = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      })

      if (address) {
        const locationString = `${address.street}, ${address.city}, ${address.region}`
        setFormData({ ...formData, location: locationString })
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Could not get your location. Please try again or enter manually.'
      )
    } finally {
      setIsLoadingLocation(false)
    }
  }

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

  const takePhoto = async () => {
    // Request permission
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera permissions to make this work!')
      return
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      setFormData({ ...formData, image: result.assets[0].uri })
    }
  }

  const showImageOptions = () => {
    Alert.alert(
      'Pilih Sumber Gambar',
      'Dari mana anda ingin mengambil gambar?',
      [
        {
          text: 'Kamera',
          onPress: takePhoto,
        },
        {
          text: 'Galeri',
          onPress: pickImage,
        },
        {
          text: 'Batal',
          style: 'cancel',
        },
      ]
    )
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setShowSuccess(true)
      
      // Start success animation
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
        })
      ]).start()
    }, 1000)
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
        <Text style={styles.headerTitle}>Tambahkan Kucing</Text>
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
          <Text style={styles.successText}>Berhasil Menambahkan Kucing</Text>
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
            <Text style={styles.formTitle}>Klik, sayang, peluk, adopsi meong hari ini juga!</Text>
            
            {/* Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nama Pawrents</Text>
              <TextInput
                style={styles.input}
                placeholder="Nama Lengkap"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Number Phone Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nomor Telepon</Text>
              <TextInput
                style={styles.input}
                placeholder="Masukkan Nomor Telepon"
                value={formData.nomortelepon}
                onChangeText={(text) => setFormData({ ...formData, nomortelepon: text })}
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
              />
            </View>

            {/* Email Input
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Masukkan Email"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View> */}

            {/* Location Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Lokasi</Text>
              <View style={styles.locationInputContainer}>
                <TextInput
                  style={[styles.input, styles.locationInput]}
                  placeholder="Masukkan lokasi kucing"
                  value={formData.location}
                  onChangeText={(text) => setFormData({ ...formData, location: text })}
                  placeholderTextColor="#94A3B8"
                />
                <TouchableOpacity 
                  style={styles.locationButton}
                  onPress={getCurrentLocation}
                  disabled={isLoadingLocation}
                >
                  {isLoadingLocation ? (
                    <ActivityIndicator color="#304153" />
                  ) : (
                    <Ionicons name="location" size={24} color="#304153" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Jenis Kelamin Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Jenis Kelamin</Text>
              <View style={styles.genderContainer}>
                <TouchableOpacity 
                  style={[
                    styles.genderButton,
                    formData.jeniskelamin === 'Laki-laki' && styles.genderButtonActive
                  ]}
                  onPress={() => setFormData({ ...formData, jeniskelamin: 'Laki-laki' })}
                >
                  <Text style={[
                    styles.genderButtonText,
                    formData.jeniskelamin === 'Laki-laki' && styles.genderButtonTextActive
                  ]}>Laki-laki</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.genderButton,
                    formData.jeniskelamin === 'Perempuan' && styles.genderButtonActive
                  ]}
                  onPress={() => setFormData({ ...formData, jeniskelamin: 'Perempuan' })}
                >
                  <Text style={[
                    styles.genderButtonText,
                    formData.jeniskelamin === 'Perempuan' && styles.genderButtonTextActive
                  ]}>Perempuan</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Umur Kucing Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Umur Kucing</Text>
              <TextInput
                style={styles.input}
                placeholder="Masukkan Umur Kucing"
                value={formData.umur}
                onChangeText={(text) => setFormData({ ...formData, umur: text })}
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
              />
            </View>

             {/* Ras Kucing Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Ras Kucing</Text>
              <TextInput
                style={styles.input}
                placeholder="Masukkan Ras Kucing"
                value={formData.ras}
                onChangeText={(text) => setFormData({ ...formData, ras: text })}
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
              />
            </View>

            {/* Warna Kucing Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Warna Kucing</Text>
              <TextInput
                style={styles.input}
                placeholder="Masukkan Warna Kucing"
                value={formData.warna}
                onChangeText={(text) => setFormData({ ...formData, warna: text })}
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
              />
            </View>

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
              <TouchableOpacity style={styles.imageUploadButton} onPress={showImageOptions}>
                {formData.image ? (
                  <Image
                    source={{ uri: formData.image }}
                    style={styles.uploadedImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.uploadPlaceholder}>
                    <Ionicons name="camera-outline" size={32} color="#94A3B8" />
                    <Text style={styles.uploadText}>Ambil Foto</Text>
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
                <Text style={styles.submitButtonText}>Adopsikan</Text>
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
    padding: spacing.lg,
  },
  formTitle: {
    ...typography.header.medium,
    color: "#222",
    marginBottom: spacing.xl,
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
  genderContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  genderButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 30,
    padding: spacing.md,
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: '#222E3A',
    borderColor: '#222E3A',
  },
  genderButtonText: {
    ...typography.body.medium.regular,
    color: '#222',
  },
  genderButtonTextActive: {
    color: '#fff',
  },
}) 