import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ArticleCard } from "../../components/ArticleCard";
import { API_BASE_URL, Article } from "../../components/types";
import { container, spacing, typography } from "../theme";

export default function ArticleScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("View all");
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noArticlesMessage, setNoArticlesMessage] = useState<string | null>(null);


  const tabs = ["View all", "Edukasi", "Kegiatan"];
  const fetchArticles = async (kategori: string | null = null) => {
    try {
      const url = kategori
        ? `${API_BASE_URL}/artikel/kategori/${kategori.toLowerCase()}`
        : `${API_BASE_URL}/artikel`;

      const response = await axios.get(url);
      const result = response.data;

      if (!Array.isArray(result) || result.length === 0) {
        setArticles([]);
        setFilteredArticles([]);
        setNoArticlesMessage("Tidak ada artikel terkait.");
        return;
      }

      const formattedArticles: Article[] = result.map((item: any) => ({
        id: item.Artikel_ID,
        title: item.Judul,
        category: item.Kategori,
        author: "KPTKS",
        image: { uri: `${API_BASE_URL}/${item.Thumbnail}` },
      }));

      setArticles(formattedArticles);
      setFilteredArticles(formattedArticles);
      setNoArticlesMessage(null);
    } catch (error: any) {
      console.error("Gagal mengambil artikel:", error);
      if (error.response?.status === 404) {
        setArticles([]);
        setFilteredArticles([]);
        setNoArticlesMessage("Tidak ada artikel terkait.");
      } else {
        setNoArticlesMessage("Terjadi kesalahan saat mengambil artikel.");
      }
    }
  };


  useEffect(() => {
    if (activeTab === "View all") {
      fetchArticles();
    } else {
      fetchArticles(activeTab);
    }
  }, [activeTab]);

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
        // Simpan artikel ke AsyncStorage
        await AsyncStorage.setItem('selectedArticle', JSON.stringify(article));

        // Ambil token dari AsyncStorage
        const token = await AsyncStorage.getItem('token');

        // Jalankan PUT /artikel/view/{id}
        await axios.put(`${API_BASE_URL}/artikel/view/${article.id}`, null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Navigasi ke halaman detail
        router.push("/artikel-detail");
      } catch (error) {
        console.error("Gagal saat membuka artikel:", error);
      }
    }}
  />
);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Artikel</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={require("../../assets/images/sterilisasi.jpeg")}
          style={styles.bannerCard}
          imageStyle={{ borderRadius: 16 }}
        >
          <Text style={styles.bannerTitle}>Pahami pentingnya sterilisasi</Text>
          <TouchableOpacity
            style={styles.bannerButton}
            onPress={() => router.push("../sterilisasi")}
          >
            <Text style={styles.bannerButtonText}>Pelajari</Text>
          </TouchableOpacity>
        </ImageBackground>

        {/* Tab Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabContainer}>
          {tabs.map((tab, i) => {
            const isActive = tab === activeTab;
            return (
              <TouchableOpacity
                key={i}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
                onPress={() => {
                  setSearchQuery(""); // reset search saat tab diganti
                  setActiveTab(tab);
                }}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Search Box */}
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

        {/* List Artikel */}
        <View style={styles.articleList}>
          {filteredArticles.map(renderArticleCard)}
        </View>
      </ScrollView>
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
    flex: 1,
  },
  bannerCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    backgroundColor: "#E2E8F0",
    borderRadius: 16,
  },
  bannerTitle: {
    ...typography.body.large.semiBold,
    color: "#fff",
    marginBottom: spacing.sm,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  bannerButton: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  bannerButtonText: {
    ...typography.body.small.medium,
    color: "#1E293B",
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
  searchContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#1E293B",
  },
  articleList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
});
