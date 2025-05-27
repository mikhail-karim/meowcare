import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function SignUpScreen() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    if (username && email && password) {
      console.log('Signing up with:', username, email, password);
      router.push('/home'); // Sesuaikan rute
    } else {
      alert('Please fill in all fields');
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
          placeholder="Your Username"
          placeholderTextColor="#A9A9A9"
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Your Email"
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
          placeholder="Your Password"
          placeholderTextColor="#A9A9A9"
          style={styles.input}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
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
    fontSize: 32,
    fontWeight: '600',
    marginBottom: 32,
    color: '#1E1E1E',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    color: '#1E1E1E',
  },
  input: {
    borderWidth: 1,
    borderColor: '#B0C4DE',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#000',
  },
  buttonWrapper: {
    alignItems: 'flex-end',
  },
  button: {
    backgroundColor: '#1E2A38',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
    width: 150,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});