import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { container, spacing, typography } from "./theme";


import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { API_BASE_URL } from '../components/types';

export default function EditProfilScreen() {
  const router = useRouter();


  const [name, setName] = useState("Satria");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  // Function to fetch user data by ID and populate form fields
  const loadUserProfile = async () => {
    try {
      const id = await AsyncStorage.getItem('id');

      if (!id) {
        Alert.alert('Error', 'User ID not found. Please login again.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/users/id/${id}`, {
        method: 'GET',
      });

      if (!response.ok) {
        Alert.alert('Error', `Failed to fetch user data: ${response.status}`);
        return;
      }

      const userData = await response.json();

      // Populate state with retrieved user data
      setName(userData.Nama_Lengkap || "");
      setUsername(userData.Username || "");
      setEmail(userData.Email || "");
      setPhone(userData.Nomor_HP || "");
      setAddress(userData.Alamat || "");
      if (userData.Foto_Profil) {
        // Assuming Foto_Profil is a relative path, prepend API_BASE_URL if needed
        setImageUri(`${API_BASE_URL}/${userData.Foto_Profil}`);
      }
    } catch (error: any) {
      Alert.alert('Error', `An error occurred: ${error.message}`);
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, []);


const handleChoosePhoto = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
    base64: true, // ⬅️ Tambahkan ini agar kita dapat base64
  });

  if (!result.canceled) {
    const selectedAsset = result.assets[0];
    setImageUri(selectedAsset.uri);

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "Token tidak ditemukan. Silakan login ulang.");
        return;
      }

      const fileName = selectedAsset.fileName || `photo_${Date.now()}.jpg`;
      const mimeType = selectedAsset.type || "image/jpeg";
      const base64Image = selectedAsset.base64;

      // Konversi base64 ke file
      const formData = new FormData();
      formData.append("photo", {
        uri: `data:${mimeType};base64,${base64Image}`,
        name: fileName,
        type: mimeType,
      } as any);

      const response = await axios.post(`${API_BASE_URL}/users/upload_photo`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload success:", response.data);
      setImageUri(`${API_BASE_URL}/${response.data.file_path}`);
    } catch (error: any) {
      console.error("Upload gagal:", error.response?.data || error.message);
      Alert.alert("Gagal", error.response?.data?.message || "Gagal upload gambar.");
    }
  }
};


const handleSaveProfile = async () => {
  try {
    console.log('Memulai proses update profil...');

    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Error', 'Token pengguna tidak ditemukan. Silakan login kembali.');
      return;
    }

    // Ekstrak path relatif dari imageUri
    let relativePhotoPath = null;
    if (imageUri && imageUri.startsWith(`${API_BASE_URL}/`)) {
      relativePhotoPath = imageUri.replace(`${API_BASE_URL}/`, '');
    }

    const payload: any = {
      Nama_Lengkap: name,
      Username: username,
      Email: email,
      Nomor_HP: phone,
      Alamat: address,
    };

    if (relativePhotoPath) {
      payload.Foto_Profil = relativePhotoPath;
    }

    console.log('Data profil yang akan dikirim:', payload);

    const response = await fetch(`${API_BASE_URL}/users/edit`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('Status response:', response.status);

    const result = await response.json();
    console.log('Response dari server:', result);

    if (response.ok) {
      Alert.alert('Sukses', 'Profil berhasil diperbarui!');
      router.back();
    } else {
      Alert.alert('Error', `Gagal memperbarui profil: ${result.message || JSON.stringify(result)}`);
    }
  } catch (error: any) {
    console.error('Error pada fetch:', error);
    Alert.alert('Error', `Terjadi kesalahan: ${error.message}`);
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ubah Profil</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={handleChoosePhoto}>
          <Image
            source={
              imageUri
                ? { uri: imageUri }
                : require("../assets/images/mini-avatar.png")
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>

        <Text style={styles.label}>Nama Lengkap</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Masukkan nama lengkap"
          placeholderTextColor="#94A3B8"
        />

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Masukkan username"
          placeholderTextColor="#94A3B8"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Masukkan email"
          placeholderTextColor="#94A3B8"
        />

        <Text style={styles.label}>Nomor HP</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Masukkan nomor HP"
          keyboardType="phone-pad"
          placeholderTextColor="#94A3B8"
        />

        <Text style={styles.label}>Alamat</Text>
        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: "top" }]}
          value={address}
          onChangeText={setAddress}
          placeholder="Masukkan alamat"
          multiline
          placeholderTextColor="#94A3B8"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
          <Text style={styles.saveButtonText}>Simpan</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...container.screen,
    backgroundColor: "#fff",
    flex: 1,
  },
  header: {
    ...container.header,
    backgroundColor: "#fff",
    paddingBottom: spacing.md,
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1E293B",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  headerTitle: {
    ...typography.header.medium,
    color: "#1E293B",
    textAlign: "center",
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: 40,
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignSelf: "center",
    marginVertical: spacing.md,
  },
  label: {
    ...typography.body.small.medium,
    color: "#1E293B",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    padding: spacing.sm,
    fontSize: 16,
    color: "#1E293B",
  },
  saveButton: {
    backgroundColor: "#1E293B",
    paddingVertical: spacing.sm,
    borderRadius: 12,
    alignItems: "center",
    marginTop: spacing.lg,
  },
  saveButtonText: {
    ...typography.body.medium.semiBold,
    color: "#fff",
  },
});
