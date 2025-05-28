import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { typography } from './theme';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleReset = () => {
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Mohon isi semua field');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Password tidak sama');
      return;
    }
    // TODO: Integrasi reset password
    Alert.alert('Berhasil', 'Password berhasil direset.');
    router.push('/signin');
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
        <TouchableOpacity style={styles.button} onPress={handleReset}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    ...typography.header.large,
    color: '#213448',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    ...typography.body.medium.semiBold,
    color: '#1E1E1E',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#B0C4DE',
    borderRadius: 32,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#000',
    ...typography.body.medium.regular,
  },
  buttonWrapper: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#213448',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 32,
    alignItems: 'center',
    width: 150,
  },
  buttonText: {
    ...typography.body.medium.semiBold,
    color: '#fff',
  },
}); 