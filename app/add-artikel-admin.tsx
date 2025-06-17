import { Ionicons } from "@expo/vector-icons";
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
  
  useEffect(() => {
      resetForm()
  }, [])
  
  useFocusEffect(
      useCallback(() => {
        resetForm()
    }, [])
   )

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
  };

  const handleBackToArticle = () => {
    router.push('/(admin)/article-admin')
  }

  useEffect(() => {
      const unsubscribe = navigation.addListener('beforeRemove', () => {
        resetForm()
      })
  
      return unsubscribe
  }, [navigation, resetForm])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/(admin)/article-admin')}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tambah Artikel</Text>
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
          <Text style={styles.successText}>Berhasil Menambahkan Artikel</Text>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBackToArticle}
          >
            <Text style={styles.backButtonText}>Kembali ke Artikel</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Buat Artikel Baru</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Judul</Text>
              <TextInput
                value={judul}
                onChangeText={setJudul}
                style={styles.input}
                placeholder="Masukkan judul artikel"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Kategori</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={kategori}
                  onValueChange={(itemValue) => setKategori(itemValue)}
                  mode="dropdown"
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
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Thumbnail</Text>
              <TouchableOpacity onPress={pickImage} style={styles.imageUploadButton}>
                {thumbnail ? (
                  <Image source={{ uri: thumbnail.uri }} style={styles.uploadedImage} resizeMode="cover" />
                ) : (
                  <View style={styles.uploadPlaceholder}>
                    <Ionicons name="image-outline" size={32} color="#94A3B8" />
                    <Text style={styles.uploadText}>Pilih Gambar</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Publish Artikel</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
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
    backgroundColor: "transparent",
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
  backButtonText: {
    ...typography.body.medium.semiBold,
    color: '#fff',
  },
});