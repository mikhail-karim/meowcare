import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView, // tambahkan ini
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { container, spacing, typography } from "./theme";

export default function EditProfilScreen() {
  const router = useRouter();

  const [name, setName] = useState("Satria");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handleChoosePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
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

      {/* Scrollable content */}
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

        {/* Input fields */}
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

        <TouchableOpacity style={styles.saveButton} onPress={() => router.back()}>
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
    paddingBottom: 40, // tambahan biar button terakhir ga ketutupan
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
