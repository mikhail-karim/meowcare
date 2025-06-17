import { Ionicons } from "@expo/vector-icons";
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { container, spacing, typography } from './theme';


export default function AddArticleForm() {
  const router = useRouter()
  const navigation = useNavigation()
  const { params } = useLocalSearchParams(); // or useRoute()
  const articleToEdit = params?.article ? JSON.parse(params.article as string) : null;
  const initialFormState = {
    judul: articleToEdit?.Judul || '',
    kategori: articleToEdit?.Kategori || 'edukasi',
    artikel: articleToEdit?.Artikel || '',
    thumbnail: articleToEdit?.Thumbnail || null,
  };

  const [judul, setJudul] = useState(initialFormState.judul);
  const [kategori, setKategori] = useState(initialFormState.kategori);
  const [artikel, setArtikel] = useState(initialFormState.artikel);
  const [thumbnail, setThumbnail] = useState<ImagePicker.ImagePickerAsset | null>(
    initialFormState.thumbnail ? { uri: initialFormState.thumbnail } as any : null
  );
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

    useEffect(() => {
      if (articleToEdit) {
        setJudul(articleToEdit.Judul || '');
        setKategori(articleToEdit.Kategori || 'edukasi');
        setArtikel(articleToEdit.Artikel || '');
        setThumbnail(articleToEdit.Thumbnail ? { uri: articleToEdit.Thumbnail } as any : null);
      }
    }, []);
  
//     // Reset form when screen becomes focused
//   useFocusEffect(
//       useCallback(() => {
//         resetForm()
//     }, [])
//    )

    const handleSubmit = () => {
      const payload = {
        Judul: judul,
        Kategori: kategori,
        Artikel: artikel,
        Thumbnail: thumbnail?.uri,
      };

      if (articleToEdit?.Artikel_ID) {
        // Do update request here
        console.log('Updating article:', articleToEdit.Artikel_ID, payload);
        // await axios.put(`/api/articles/${articleToEdit.Artikel_ID}`, payload);
      }
    };

  useEffect(() => {
      const unsubscribe = navigation.addListener('beforeRemove', () => {
        resetForm()
      })
  
      return unsubscribe
  }, [navigation, resetForm])

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        {/* <TouchableOpacity style={styles.backButton} onPress={() => router.back()}> */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/(admin)/article-admin')}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tambah Artikel</Text>
      </View>

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