import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors, container, spacing, typography } from './theme';

const API_BASE_URL = 'http://192.168.0.108:8000';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Mohon isi semua field');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Password tidak sama');
      return;
    }

    setLoading(true);
    try {
      const email = await AsyncStorage.getItem('userEmail');
      if (!email) {
        setLoading(false);
        Alert.alert('Error', 'Email tidak ditemukan. Mohon ulangi proses lupa password.');
        return;
      }

      const response = await axios.put(`${API_BASE_URL}/users/forget_password`, {
        Email: email,
        New_Password: password,
      });

      setLoading(false);

      // Bisa modifikasi sesuai response API Anda
      if (response.status === 200) {
        Alert.alert('Berhasil', 'Password berhasil direset.');
        router.push('/signin');
      } else {
        Alert.alert('Error', 'Gagal mereset password. Silakan coba lagi.');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Terjadi kesalahan saat mereset password.');
      console.error('Reset password error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password Baru</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password baru"
          placeholderTextColor="#A9A9A9"
          style={styles.input}
          secureTextEntry
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Konfirmasi Password</Text>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Konfirmasi password"
          placeholderTextColor="#A9A9A9"
          style={styles.input}
          secureTextEntry
        />
      </View>
      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.button} onPress={handleReset} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Reset'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...container.screen,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  title: {
    ...typography.header.large,
    color: colors.primary,
    marginBottom: spacing.xl,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.body.medium.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 32,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.text.primary,
    ...typography.body.medium.regular,
  },
  buttonWrapper: {
    alignItems: 'flex-end',
    marginTop: spacing.sm,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: 32,
    alignItems: 'center',
    width: 150,
  },
  buttonText: {
    ...typography.body.medium.semiBold,
    color: colors.background,
  },
});
