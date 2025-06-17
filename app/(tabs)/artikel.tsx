import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ArticleCard } from "../../components/ArticleCard";
import { Article } from "../../components/types";
import { container, spacing, typography } from "../theme";
import api from "../../api/api";

export default function ArticleScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("View all");
  const [articles, setArticles] = useState<Article[]>([]);

  const tabs = ["View all", "Edukasi", "Kegiatan"];

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const token = "your_jwt_token"; // ganti dengan token asli, atau ambil dari state/context
        const response = await api.get("/artikel", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setArticles(response.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, []);

  const filteredArticles =
    activeTab === "View all"
      ? articles
      : articles.filter((a) => a.category === activeTab);

  const renderArticleCard = (article: Article, index: number) => (
    <ArticleCard
      key={index}
      article={article}
      onPress={() => {
        router.push("/artikel-detail");
      }}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edukasi</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.bannerCard}>
          <Text style={styles.bannerTitle}>Pahami pentingnya steriliasi</Text>
          <TouchableOpacity
            style={styles.bannerButton}
            onPress={() => router.push("/artikel-detail")}
          >
            <Text style={styles.bannerButtonText}>Pelajari</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabContainer}
        >
          {tabs.map((tab, i) => {
            const isActive = tab === activeTab;
            return (
              <TouchableOpacity
                key={i}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[styles.tabText, isActive && styles.tabTextActive]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

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
    color: "#1E293B",
    marginBottom: spacing.sm,
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
  articleList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
});
