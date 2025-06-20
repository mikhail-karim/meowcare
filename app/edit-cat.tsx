// app/edit-cat.tsx

import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import { Pet } from '../components/types'

export default function EditCatScreen() {
  const { cat } = useLocalSearchParams()
  const router = useRouter()
  const [catData, setCatData] = useState<Pet | null>(null)

  useEffect(() => {
    if (cat) {
      try {
        const parsedCat = JSON.parse(cat as string) as Pet
        setCatData(parsedCat)
      } catch (error) {
        console.error('Failed to parse cat data:', error)
      }
    }
  }, [cat])

  if (!catData) return <Text>Loading...</Text>

  const handleSave = () => {
    // Simpan perubahan (misalnya: kirim ke backend atau update state)
    console.log('Saved cat:', catData)
    router.back()
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Kucing</Text>
      <TextInput
        style={styles.input}
        value={catData.name}
        onChangeText={(text) => setCatData({ ...catData, name: text })}
        placeholder="Nama Kucing"
      />
      <TextInput
        style={styles.input}
        value={catData.age}
        onChangeText={(text) => setCatData({ ...catData, age: text })}
        placeholder="Umur"
      />
      <TextInput
        style={styles.input}
        value={catData.location}
        onChangeText={(text) => setCatData({ ...catData, location: text })}
        placeholder="Lokasi"
      />
      <Button title="Simpan" onPress={handleSave} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
  },
})
