import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { ArticleCard } from "../../components/ArticleCard";
import { API_BASE_URL, Article } from "../../components/types";
import { colors, container, spacing, typography } from "../theme";


export default function EdukasiScreen() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);

  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/artikel`);
        const result = response.data;

        const formattedArticles: Article[] = result.map((item: any) => ({
          id: item.Artikel_ID,
          title: item.Judul,
          category: item.Kategori,
          author: "KPTKS",
          image: { uri: `${API_BASE_URL}/${item.Thumbnail}` }, // asumsikan path relatif
        }));

        setArticles(formattedArticles);
        setFilteredArticles(formattedArticles);
      } catch (error) {
        console.error("Gagal mengambil artikel:", error);
      }
    };

    fetchArticles();
  }, []);


  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = articles.filter((article) =>
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.category.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredArticles(filtered);
  };


const renderArticleCard = (article: Article, index: number) => (
  <ArticleCard
    key={index}
    article={article}
    onPress={async () => {
      try {
        await AsyncStorage.setItem('selectedArticle', JSON.stringify(article));
        router.push("/artikel-detail-admin");
      } catch (error) {
        console.error("Gagal menyimpan artikel ke AsyncStorage:", error);
      }
    }}
  />
);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Artikel</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Tab Filter */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
              <Ionicons name="search-outline" size={20} color="#666" />
              <TextInput 
                style={styles.searchInput} 
                placeholder="Cari" 
                value={searchQuery} 
                onChangeText={handleSearch}
                placeholderTextColor="#666"
              />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabContainer}
        >
        </ScrollView>

        {/* Article List */}
        <View style={styles.articleList}>
          {filteredArticles.map(renderArticleCard)}
        </View>
      </ScrollView>
      <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/add-artikel-admin')}
      >
          <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...container.screen,
  },
  header: {
    ...container.header,
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  headerTitle: {
    ...typography.header.medium,
    color: "#222",
    textAlign: "center",
  },
  content: {
    ...container.content,
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: colors.secondary,
    paddingHorizontal: spacing.md,
    height: 48
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    color: colors.text.primary,
    ...typography.body.medium.regular,
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  tabButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    marginRight: spacing.sm,
  },
  tabButtonActive: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  tabText: {
    ...typography.body.small.medium,
    color: "#64748B",
  },
  tabTextActive: {
    color: "#1E293B",
    fontWeight: "600",
  },
  articleList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  addButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: colors.primary,
    padding: 12,
    width: 48,
    height: 48,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  }
});
