import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useState } from "react"
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native"
import { typography } from '../theme'

export default function LaporanScreen() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    location: '',
    description: '',
    image: null as string | null,
  })

  const handleSubmit = () => {
    // TODO: Implement form submission
    console.log('Form submitted:', formData)
    router.back()
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Ketemu kucing? Ayo laporin di sini!</Text>
          
        {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nama Pelapor</Text>
            <TextInput
              style={styles.input}
              placeholder="Nama Lengkap"
              value={formData.location}
              onChangeText={(text) => setFormData({ ...formData, location: text })}
              placeholderTextColor="#94A3B8"
            />
          </View>

        {/* Number Phone Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nomor Telepon</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan Nomor Telepon"
              value={formData.location}
              onChangeText={(text) => setFormData({ ...formData, location: text })}
              placeholderTextColor="#94A3B8"
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan Email"
              value={formData.location}
              onChangeText={(text) => setFormData({ ...formData, location: text })}
              placeholderTextColor="#94A3B8"
            />
          </View>

          {/* Location Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Lokasi</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan lokasi kucing"
              value={formData.location}
              onChangeText={(text) => setFormData({ ...formData, location: text })}
              placeholderTextColor="#94A3B8"
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
            <TouchableOpacity style={styles.imageUploadButton}>
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
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Kirim Laporan</Text>
          </TouchableOpacity>
        </View>
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
    paddingBottom: 12,
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
  formContainer: {
    padding: 20,
  },
  formTitle: {
    ...typography.header.medium,
    color: "#222",
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    ...typography.body.medium.semiBold,
    color: "#222",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    padding: 16,
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
    marginTop: 8,
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
  },
  submitButton: {
    backgroundColor: "#222E3A",
    borderRadius: 32,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 32, 
  },
  submitButtonText: {
    ...typography.body.medium.semiBold,
    color: "#fff",
  },
}) 