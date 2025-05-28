import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { typography } from './theme';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    if (email) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        Alert.alert('Berhasil', 'Instruksi reset password telah dikirim ke email Anda.');
        router.push('/reset-password');
      }, 1500);
    } else {
      Alert.alert('Error', 'Mohon masukkan email Anda');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lupa Password?</Text>
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
      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.button} onPress={handleSend} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Kirim</Text>
          )}
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