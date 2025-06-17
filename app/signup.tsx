import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors, container, spacing, typography } from './theme';

const API_BASE_URL = 'http://192.168.1.154:8000'; // Global base URL yang sama seperti di SignInScreen

export default function SignUpScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!fullName || !username || !email || !password) {
      Alert.alert('Error', 'Mohon isi semua field');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/users/register`, {
        Nama_Lengkap: fullName,
        Username: username,
        Email: email,
        Password: password,
      });

      const data = response.data;

      if (data.token) {
        await AsyncStorage.setItem('token', data.token);
        router.push('/home');
      } else {
        Alert.alert('Error', 'Token tidak ditemukan pada response');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Alert.alert('Error', error.response?.data?.message || 'Gagal melakukan registrasi');
      } else {
        Alert.alert('Error', 'Terjadi kesalahan jaringan atau server');
      }
      console.error('SignUp error: ', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nama Lengkap</Text>
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          placeholder="Masukkan nama lengkap Anda"
          placeholderTextColor="#A9A9A9"
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Masukkan username Anda"
          placeholderTextColor="#A9A9A9"
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Masukkan email Anda"
          placeholderTextColor="#A9A9A9"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Masukkan password Anda"
          placeholderTextColor="#A9A9A9"
          style={styles.input}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={styles.buttonText}>Daftar</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Sudah punya akun? </Text>
        <TouchableOpacity onPress={() => router.push('/signin')}>
          <Text style={styles.footerLink}>Sign In</Text>
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
