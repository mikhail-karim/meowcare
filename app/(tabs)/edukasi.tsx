import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { typography } from "../theme";
import { ArticleCard } from "../../components/ArticleCard";  
import { Article } from "../../components/types"; 

export default function EdukasiScreen() {
  const router = useRouter();

  const articles: Article[] = Array(4).fill({
    title: "Judul Artikel",
    category: "Kategori",
    author: "Penulis",
    image: require("../../assets/images/cats/oyen.png"),
  });

  const renderArticleCard = (article: Article, index: number) => (
    <ArticleCard
      key={index}
      article={article} 
      onPress={() => {
        
      }}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edukasi</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Banner Edukasi */}
        <View style={styles.bannerCard}>
          <Text style={styles.bannerTitle}>Pahami pentingnya steriliasi</Text>
          <TouchableOpacity style={styles.bannerButton}>
            <Text style={styles.bannerButtonText}>Pelajari</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabContainer}>
          {['View all', 'Kesehatan', 'Perawatan', 'Gizi'].map((tab, i) => (
            <TouchableOpacity key={i} style={[styles.tabButton, i === 0 && styles.tabButtonActive]}>
              <Text style={[styles.tabText, i === 0 && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Article List */}
        <View style={styles.articleList}>{articles.map(renderArticleCard)}</View>
      </ScrollView>
    </SafeAreaView>
  );
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
    paddingBottom: 20,
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
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    backgroundColor: "#E2E8F0",
    borderRadius: 16,
  },
  bannerTitle: {
    ...typography.body.large.semiBold,
    color: "#1E293B",
    marginBottom: 10,
  },
  bannerButton: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  bannerButtonText: {
    ...typography.body.small.medium,
    color: "#1E293B",
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    marginRight: 10,
  },
  tabButtonActive: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
  },
  tabText: {
    ...typography.body.small.medium,
    color: "#64748B",
  },
  tabTextActive: {
    color: "#1E293B",
  },
  articleList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
});
