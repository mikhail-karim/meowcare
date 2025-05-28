import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { typography } from '../app/theme';
import { Ionicons } from '@expo/vector-icons';
import { Article } from './types'; // Buat interface Article di file ini atau terpisah

interface ArticleCardProps {
  article: Article;
  onPress?: () => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={typeof article.image === 'string' ? { uri: article.image } : article.image}
          style={styles.image}
          resizeMode="cover"
          accessibilityLabel={article.title}
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{article.title}</Text>
        <View style={styles.row}>
          <Ionicons name="pricetag-outline" size={16} color="#888" />
          <Text style={styles.text}>{article.category}</Text>
        </View>
        <View style={styles.row}>
          <Ionicons name="person-outline" size={16} color="#888" />
          <Text style={styles.text}>{article.author}</Text>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  text: {
    ...typography.body.small.regular,
    color: '#888',
    marginLeft: 4,
  },
});
