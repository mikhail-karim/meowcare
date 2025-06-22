// app/add-kucing-form.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Ionicons } from "@expo/vector-icons";
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { API_BASE_URL } from '../components/types';
import { container, spacing, typography } from './theme';

export default function LaporanScreen() {
  const [rasList, setRasList] = useState<string[]>([]);
  const [warnaList, setWarnaList] = useState<string[]>([]);
  const router = useRouter()
  const navigation = useNavigation()
  const initialFormState = {
    name: '',
    umur: '',
    jeniskelamin: '',
    ras: '',
    warna: '',
    image: null as string | null,
    vaccinated: false,
    sterilized: false,
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

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const rasResponse = await axios.get(`${API_BASE_URL}/ras`);
        const warnaResponse = await axios.get(`${API_BASE_URL}/warna`);

        setRasList(rasResponse.data.map((item: any) => item.Nama));
        setWarnaList(warnaResponse.data.map((item: any) => item.Nama));
      } catch (error) {
        console.error("Gagal mengambil data ras/warna:", error);
      }
    };

    fetchOptions();
  }, []);


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
    if (!formData.name || !formData.umur || !formData.jeniskelamin || !formData.ras || !formData.warna) {
      Alert.alert('Peringatan', 'Mohon lengkapi semua data (kecuali foto boleh kosong).');
      return;
    }

    try {
      setIsSubmitting(true);
      const token = await AsyncStorage.getItem('token');

      const rasId = rasList.findIndex(r => r === formData.ras) + 1;
      const warnaId = warnaList.findIndex(w => w === formData.warna) + 1;

      const form = new FormData();
      form.append('Nama', formData.name);
      form.append('Umur', formData.umur);
      form.append('Jenis_Kelamin', formData.jeniskelamin);
      form.append('Ras_ID', rasId.toString());
      form.append('Warna_ID', warnaId.toString());
      form.append('Divaksin', formData.vaccinated ? '1' : '0');
      form.append('Sterilisasi', formData.sterilized ? '1' : '0');

      if (formData.image) {
        const uriParts = formData.image.split('.');
        const fileType = uriParts[uriParts.length - 1];
        form.append('Foto', {
          uri: formData.image,
          name: `foto-kucing.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      } else {
        form.append('Foto', '');
      }

      const response = await axios.post(`${API_BASE_URL}/pets`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200 || response.status === 201) {
        await axios.put(`${API_BASE_URL}/users/change-role`, null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setShowSuccess(true);
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
        ]).start(() => {
          handleBackToHome();
        });
      } else {
        Alert.alert('Gagal', 'Gagal mengirim data ke server.');
      }
    } catch (error: any) {
      if (error.response) {
        console.error('Upload error:', error.response.data);
      } else {
        console.error('Upload error:', error);
      }
      Alert.alert('Gagal', 'Terjadi kesalahan saat mengunggah data.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
  <Text style={styles.formTitle}>Isi Data Kucing</Text>

  {/* Nama Kucing */}
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>Nama Kucing</Text>
    <TextInput
      style={styles.input}
      placeholder="Masukkan Nama Kucing"
      value={formData.name}
      onChangeText={(text) => setFormData({ ...formData, name: text })}
      placeholderTextColor="#94A3B8"
    />
  </View>

  {/* Umur Kucing */}
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>Umur Kucing</Text>
    <TextInput
      style={styles.input}
      placeholder="Masukkan angka umur (dalam bulan)"
      value={formData.umur}
      onChangeText={(text) => setFormData({ ...formData, umur: text })}
      placeholderTextColor="#94A3B8"
    />
  </View>

  {/* Jenis Kelamin */}
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>Jenis Kelamin</Text>
    <Picker
      selectedValue={formData.jeniskelamin}
      onValueChange={(value) => setFormData({ ...formData, jeniskelamin: value })}
      style={styles.input}
    >
      <Picker.Item label="Pilih Jenis Kelamin" value="" />
      <Picker.Item label="Laki-Laki" value="Laki-Laki" />
      <Picker.Item label="Perempuan" value="Perempuan" />
    </Picker>
  </View>

{/* Ras Kucing - Dropdown */}
<View style={styles.inputContainer}>
  <Text style={styles.inputLabel}>Ras</Text>
  <Picker
    selectedValue={formData.ras}
    onValueChange={(value) => setFormData({ ...formData, ras: value })}
    style={styles.input}
  >
    <Picker.Item label="Pilih Ras" value="" />
    {Array.isArray(rasList) && rasList.map((ras, index) => (
      <Picker.Item key={index} label={ras} value={ras} />
    ))}
  </Picker>
</View>



{/* Warna Kucing - Dropdown */}
<View style={styles.inputContainer}>
  <Text style={styles.inputLabel}>Warna</Text>
  <Picker
    selectedValue={formData.warna}
    onValueChange={(value) => setFormData({ ...formData, warna: value })}
    style={styles.input}
  >
    <Picker.Item label="Pilih Warna" value="" />
    {Array.isArray(warnaList) && warnaList.map((warna, index) => (
      <Picker.Item key={index} label={warna} value={warna} />
    ))}
  </Picker>
</View>

{/* Status Vaksinasi */}
<View style={styles.inputContainer}>
  <Text style={styles.inputLabel}>Status Vaksinasi</Text>
  <View style={styles.switchContainer}>
    <Text style={styles.switchLabel}>
      {formData.vaccinated ? 'Sudah Divaksin' : 'Belum Divaksin'}
    </Text>
    <Switch
      value={formData.vaccinated}
      onValueChange={(value) => setFormData({ ...formData, vaccinated: value })}
      trackColor={{ false: '#CBD5E1', true: '#222E3A' }}
      thumbColor={formData.vaccinated ? '#fff' : '#f4f3f4'}
    />
  </View>
</View>

{/* Status Sterilisasi */}
<View style={styles.inputContainer}>
  <Text style={styles.inputLabel}>Status Sterilisasi</Text>
  <View style={styles.switchContainer}>
    <Text style={styles.switchLabel}>
      {formData.sterilized ? 'Sudah Disteril' : 'Belum Disteril'}
    </Text>
    <Switch
      value={formData.sterilized}
      onValueChange={(value) => setFormData({ ...formData, sterilized: value })}
      trackColor={{ false: '#CBD5E1', true: '#222E3A' }}
      thumbColor={formData.sterilized ? '#fff' : '#f4f3f4'}
    />
  </View>
</View>

  {/* Foto Kucing */}
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
          <Text style={styles.uploadText}>Ambil Foto</Text>
        </View>
      )}
    </TouchableOpacity>
  </View>

  {/* Tombol Submit */}
  <TouchableOpacity
    style={styles.submitButton}
    onPress={handleSubmit}
    disabled={isSubmitting}
  >
    {isSubmitting ? (
      <ActivityIndicator color="#fff" />
    ) : (
      <Text style={styles.submitButtonText}>Simpan Data</Text>
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
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  switchLabel: {
    ...typography.body.medium.regular,
    color: "#222",
  },
}) 