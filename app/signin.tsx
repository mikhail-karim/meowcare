import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors, container, spacing, typography } from './theme';

export default function SignInScreen() {
  const router = useRouter();
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');

  const API_BASE_URL = 'http://192.168.43.232:8000';

  const handleSignIn = async () => {
    if (!Email || !Password) {
      Alert.alert('Error', 'Mohon masukkan Email dan Password');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/users/login`, {
        Email,
        Password,
      });

      const data = response.data;

      await AsyncStorage.setItem('token', data.token);

      if (Email.toLowerCase() === 'admin@admin.com') {
        router.push('/(admin)/dashboard-admin');
      } else {
        router.push('/home');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Alert.alert('Login Failed', error.response?.data?.message || 'Gagal login, periksa kembali Email dan Password Anda.');
      } else {
        Alert.alert('Error', 'Terjadi kesalahan jaringan. Silakan coba lagi.');
      }
      console.error('Login error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={Email}
          onChangeText={setEmail}
          placeholder="Masukkan Email Anda"
          placeholderTextColor="#A9A9A9"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          value={Password}
          onChangeText={setPassword}
          placeholder="Masukkan Password Anda"
          placeholderTextColor="#A9A9A9"
          style={styles.input}
          secureTextEntry
        />
        <TouchableOpacity onPress={() => router.push('/forgot-password')}>
          <Text style={styles.forgot}>Lupa Password?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Masuk</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Belum punya akun? </Text>
        <TouchableOpacity onPress={() => router.push('/signup')}>
          <Text style={styles.footerLink}>Sign Up</Text>
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
    color: colors.text.primary,
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
  forgot: {
    marginTop: spacing.xs,
    ...typography.body.small.regular,
    color: colors.text.secondary,
    alignSelf: 'flex-end',
  },
  buttonWrapper: {
    alignItems: 'flex-end',
    marginBottom: spacing.lg,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    ...typography.body.medium.regular,
    color: colors.text.secondary,
  },
  footerLink: {
    ...typography.body.medium.semiBold,
    color: colors.primary,
  },
});
