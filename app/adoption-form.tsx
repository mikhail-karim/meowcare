import { FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Pet } from '../components/types';
import { typography } from './theme';

import { API_BASE_URL } from '../components/types';

export default function AdoptionFormScreen() {
  
  const [initialFormData, setInitialFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const router = useRouter()
  const params = useLocalSearchParams()
  const [cat, setCat] = useState<Pet | null>(null)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    motivation: '',
    environment: '',
    familyApproval: null as null | boolean,
  })
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem('id');
        const token = await AsyncStorage.getItem('token');
        if (!userId || !token) return;

        const response = await axios.get(`${API_BASE_URL}/users/id/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const user = response.data; // Langsung ambil dari response.data

        const userData = {
          name: user.Nama_Lengkap || '',
          phone: user.Nomor_HP || '',
          address: user.Alamat || '',
        };

        setFormData(prev => ({ ...prev, ...userData }));
        setInitialFormData(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);


  useEffect(() => {
    if (params.cat) {
      try {
        const catData = JSON.parse(params.cat as string) as Pet
        setCat(catData)
      } catch (error) {
        console.error('Error parsing cat data:', error)
      }
    }
  }, [params.cat])

  const handleNext = async () => {
    if (step === 1) {
      const isChanged =
        formData.name !== initialFormData.name ||
        formData.phone !== initialFormData.phone ||
        formData.address !== initialFormData.address;

      if (isChanged) {
        try {
          const token = await AsyncStorage.getItem('token');
          await axios.put(`${API_BASE_URL}/users/edit`, {
            Nama_Lengkap: formData.name,
            Nomor_HP: formData.phone,
            Alamat: formData.address,
          }, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          // Perbarui data awal setelah edit berhasil
          setInitialFormData({
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
          });
        } catch (error) {
          console.error('Error updating user info:', error);
        }
      }
    }

    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step === 1) router.back()
    else setStep(step - 1)
  }

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const selectedCatStr = await AsyncStorage.getItem('selectedCat');
      if (!token || !selectedCatStr) {
        console.error('Token atau selectedCat tidak ditemukan.');
        return;
      }

      const selectedCat = JSON.parse(selectedCatStr);
      const response = await axios.post(`${API_BASE_URL}/pengajuan`, {
        Alasan: formData.motivation,
        Pet_ID: selectedCat.id,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Pengajuan berhasil:', response.data);
      setStep(3);
    } catch (error) {
      console.error('Gagal mengirim pengajuan:', error);
    }
  };

  if (!cat) return null

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color="#304153" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ajukan Adopsi</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cat Card */}
        <View style={styles.catCard}>
          <Image source={typeof cat.image === 'string' ? require('../assets/images/cats/wili.png') : cat.image} style={styles.catImage} />
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text style={styles.catName}>{cat.name}</Text>
            <View style={styles.catInfoRow}>
              <Ionicons name="location-outline" size={16} color="#8A8A8A" style={{marginRight: 4}} />
              <Text style={styles.catInfoText}>{cat.location}</Text>
            </View>
            <View style={[styles.catInfoRow, {marginTop: 4}]}>  
              <MaterialCommunityIcons name={cat.gender === 'Laki-laki' ? "gender-male" : "gender-female"} size={16} color="#8A8A8A" style={{marginRight: 4}} />
              <Text style={styles.catInfoText}>{cat.gender}</Text>
              <FontAwesome name="paw" size={14} color="#8A8A8A" style={{marginLeft: 12, marginRight: 4}} />
              <Text style={styles.catInfoText}>{cat.age}</Text>
            </View>
          </View>
        </View>

        {/* Stepper */}
        <View style={styles.stepper}>
          <View style={styles.stepperItem}>
            <View style={[styles.stepCircle, step >= 1 && styles.stepCircleActive]}>
              <Ionicons name="person" size={22} color={step >= 1 ? '#fff' : '#7B9EBE'} />
            </View>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.stepperItem}>
            <View style={[styles.stepCircle, step >= 2 && styles.stepCircleActive]}>
              <Ionicons name="document-text-outline" size={22} color={step >= 2 ? '#fff' : '#7B9EBE'} />
            </View>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.stepperItem}>
            <View style={[styles.stepCircle, step === 3 && styles.stepCircleActive]}>
              <Ionicons name="checkmark" size={22} color={step === 3 ? '#fff' : '#7B9EBE'} />
            </View>
          </View>
        </View>

        {/* Step 1: Personal Info */}
        {step === 1 && (
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Informasi Pribadi</Text>
            <Text style={styles.sectionDesc}>Masukkan data diri kamu untuk melanjutkan proses permohonan adopsi.</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                placeholder="Nama Lengkap"
                value={formData.name}
                onChangeText={text => setFormData({ ...formData, name: text })}
                placeholderTextColor="#B0B0B0"
              />
            </View>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                placeholder="Nomor Telepon"
                value={formData.phone}
                onChangeText={text => setFormData({ ...formData, phone: text })}
                placeholderTextColor="#B0B0B0"
                keyboardType="phone-pad"
              />
            </View>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                placeholder="Alamat"
                value={formData.address}
                onChangeText={text => setFormData({ ...formData, address: text })}
                placeholderTextColor="#B0B0B0"
              />
            </View>
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Berikutnya</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 2: Motivation & Environment */}
        {step === 2 && (
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Informasi Tambahan</Text>
            <Text style={styles.sectionDesc}>Mohon lengkapi beberapa pertanyaan berikut.</Text>
            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>Apa alasanmu untuk mengadopsi kucing?</Text>
              <TextInput
                style={styles.input}
                placeholder="Tuliskan alasanmu"
                value={formData.motivation}
                onChangeText={text => setFormData({ ...formData, motivation: text })}
                placeholderTextColor="#B0B0B0"
              />
            </View>
            <TouchableOpacity style={styles.nextButton} onPress={handleSubmit}>
              <Text style={styles.nextButtonText}>Kirim Permohonan</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Berhasil Dikirim! <FontAwesome name="paw" size={18} color="#304153" /></Text>
            <Text style={styles.sectionDesc}>
              Permohonan adopsimu sudah masuk ke sistem kami. Kami senang kamu mau jadi bagian dari keluarga penyelamat kucing.
              {'\n'}
              Tim Meowcare akan segera melakukan review dan akan mengabari Anda secepatnya untuk proses berikutnya. Terima kasih banyak!
            </Text>
            <TouchableOpacity style={styles.nextButton} onPress={() => router.push({
              pathname: '/home',
            })}>
              <Text style={styles.nextButtonText}>Kembali</Text>
            </TouchableOpacity>
          </View>
          
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    position: "relative",
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E6EEF6",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  headerTitle: {
    ...typography.header.medium,
    color: "#304153",
    textAlign: "center",
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
  },
  catCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  catImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#eee',
  },
  catName: {
    ...typography.header.small,
    color: '#304153',
    marginBottom: 2,
  },
  catInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  catInfoText: {
    ...typography.body.medium.regular,
    color: '#8A8A8A',
    marginRight: 8,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    marginTop: 2,
  },
  stepperItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E6EEF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: '#547792',
  },
  stepLine: {
    width: 48,
    height: 3,
    backgroundColor: '#BFD3E6',
    marginHorizontal: 2,
    borderRadius: 2,
  },
  formSection: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 1,
  },
  sectionTitle: {
    ...typography.header.small,
    color: '#304153',
    marginBottom: 8,
  },
  sectionDesc: {
    ...typography.body.small.regular,
    color: '#7B7B7B',
    marginBottom: 18,
  },
  inputWrap: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#F7FAFC',
    borderRadius: 32,
    paddingHorizontal: 18,
    paddingVertical: 14,
    color: '#222',
    ...typography.body.medium.regular,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  inputLabel: {
    ...typography.body.medium.semiBold,
    color: '#304153',
    marginBottom: 6,
  },
  nextButton: {
    backgroundColor: '#304153',
    borderRadius: 36,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  nextButtonText: {
    ...typography.body.medium.semiBold,
    color: '#fff',
  },
  choiceButton: {
    borderWidth: 1.5,
    borderColor: '#BFD3E6',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  choiceButtonActive: {
    backgroundColor: '#7B9EBE',
    borderColor: '#7B9EBE',
  },
  choiceButtonText: {
    color: '#304153',
    ...typography.body.medium.semiBold,
  },
  choiceButtonTextActive: {
    color: '#fff',
  },
}) 