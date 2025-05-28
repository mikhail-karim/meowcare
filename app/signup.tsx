import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { typography } from './theme';

export default function SignUpScreen() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    if (username && email && password) {
      console.log('Signing up with:', username, email, password);
      router.push('/home');
    } else {
      Alert.alert('Error', 'Mohon isi semua field');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

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
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Daftar</Text>
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
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    ...typography.header.large,
    color: '#1E1E1E',
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
    marginBottom: 24,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    ...typography.body.medium.regular,
    color: '#666',
  },
  footerLink: {
    ...typography.body.medium.semiBold,
    color: '#213448',
  },
}); 