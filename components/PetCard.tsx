import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { typography } from '../app/theme';
import { AgeIcon, GenderIcon, LocationIcon } from './Icons';
import { Pet } from './types';

interface PetCardProps {
  pet: Pet;
  onPress?: () => void;
}

export const PetCard: React.FC<PetCardProps> = ({ pet, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={typeof pet.image === 'string' ? { uri: pet.image } : pet.image}
          style={styles.image}
          resizeMode="cover"
          accessibilityLabel={pet.name}
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{pet.name}</Text>
        <View style={styles.locationRow}>
          <LocationIcon />
          <Text style={styles.location}>{pet.location}</Text>
        </View>
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <GenderIcon />
            <Text style={styles.detailText}>{pet.gender}</Text>
          </View>
          <View style={styles.detailItem}>
            <AgeIcon />
            <Text style={styles.detailText}>{pet.age}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 16,
    overflow: 'hidden',
  },
  imageWrapper: {
    width: 90,
    height: 90,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    paddingTop: 6,
    ...typography.header.small,
    color: '#222',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    ...typography.body.small.regular,
    color: '#888',
    marginLeft: 4,
  },
  detailsRow: {
    flexDirection: 'row',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    ...typography.body.small.regular,
    color: '#888',
    marginLeft: 4,
  },
});