import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { typography } from './theme';

export default function SignInScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    // TODO: Integrasi autentikasi
    if (email && password) {
      console.log('Logging in with:', email, password);
      router.push('/home'); 
    } else {
      Alert.alert('Error', 'Mohon masukkan email dan password');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

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
  forgot: {
    marginTop: 6,
    ...typography.body.small.regular,
    color: '#555',
    alignSelf: 'flex-end',
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