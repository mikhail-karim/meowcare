import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Animated, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { API_BASE_URL } from '../components/types';
import { container, spacing, typography } from './theme';


export default function AddArticleForm() {
  const router = useRouter()
  const navigation = useNavigation()
  const initialFormState = {
    judul: '',
    kategori: 'edukasi',
    artikel: '',
    thumbnail: null as string | null,
  }
  const [judul, setJudul] = useState('');
  const [kategori, setKategori] = useState('edukasi');
  const [artikel, setArtikel] = useState('');
  const [thumbnail, setThumbnail] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [formData, setFormData] = useState(initialFormState)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0)).current

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setThumbnail(result.assets[0]);
    }
  };

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

  const handleSubmit = async () => {
    if (!judul || !artikel) {
      Alert.alert('Judul dan Artikel wajib diisi!');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Token tidak ditemukan. Silakan login kembali.');
        return;
      }

      const formData = new FormData();

      formData.append('Judul', judul);
      formData.append('Kategori', kategori);
      formData.append('Artikel', artikel);

      if (thumbnail) {
        const uriParts = thumbnail.uri.split('.');
        const fileType = uriParts[uriParts.length - 1];

        formData.append('Thumbnail', {
          uri: thumbnail.uri,
          name: `thumbnail.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      }

      await axios.post(`${API_BASE_URL}/artikel`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
      });

      setShowSuccess(true);
      Alert.alert('Artikel berhasil ditambahkan!');
      resetForm();
      router.push('/(admin)/article-admin');
    } catch (error: any) {
      console.error('Gagal submit artikel:', error?.response?.data || error.message);
      Alert.alert('Gagal menambahkan artikel. Periksa koneksi atau input Anda.');
    } finally {
      setIsSubmitting(false);
    }
  };


  useEffect(() => {
      const unsubscribe = navigation.addListener('beforeRemove', () => {
        resetForm()
      })
  
      return unsubscribe
  }, [navigation, resetForm])

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/(admin)/article-admin')}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tambah Artikel</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Informasi Artikel</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Judul</Text>
            <TextInput
              value={judul}
              onChangeText={setJudul}
              style={styles.input}
              placeholder="Masukkan judul artikel"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Kategori</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={kategori}
                  onValueChange={(itemValue) => setKategori(itemValue)}
                  mode="dropdown" // Only affects Android
                  style={styles.picker}
                >
                <Picker.Item label="Edukasi" value="edukasi" />
                <Picker.Item label="Kegiatan" value="kegiatan" />
                </Picker>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Artikel</Text>
            <TextInput
              value={artikel}
              onChangeText={setArtikel}
              style={[styles.input, styles.textArea]}
              placeholder="Tulis isi artikel di sini"
              multiline
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Thumbnail</Text>
            <TouchableOpacity onPress={pickImage} style={styles.imageUploadButton}>
              {thumbnail ? (
                <Image source={{ uri: thumbnail.uri }} style={styles.uploadedImage} />
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <Text style={styles.uploadText}>Pilih Gambar</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
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
    backgroundColor: '#fff',
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
    color: '#222',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    padding: spacing.lg,
  },
  formTitle: {
    ...typography.header.medium,
    color: '#222',
    marginBottom: spacing.xl,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    ...typography.body.medium.semiBold,
    color: '#222',
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: spacing.md,
    ...typography.body.medium.regular,
    color: '#222',
  },
  pickerContainer: {
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    backgroundColor: "#fff",
  },
  picker: {
    height: 48,
    color: "#222",
    backgroundColor: "transparent", // Remove white box look
    ...typography.body.medium.regular,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  imageUploadButton: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  uploadPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  uploadText: {
    ...typography.body.medium.regular,
    color: '#94A3B8',
    marginTop: spacing.sm,
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
  },
  submitButton: {
    backgroundColor: '#222E3A',
    borderRadius: 32,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  submitButtonText: {
    ...typography.body.medium.semiBold,
    color: '#fff',
  },
});