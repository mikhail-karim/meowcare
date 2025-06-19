import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { API_BASE_URL } from '../components/types';
import { colors, spacing, typography } from "./theme";


export default function EdukasiDetailScreen() {
  const router = useRouter();
  const [likeCount, setLikeCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [article, setArticle] = useState<any>(null);

  type Comment = {
    id: number;
    author: string;
    text: string;
    avatar?: { uri: string };
  };

  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchArticleDetail = async () => {
      try {
        const stored = await AsyncStorage.getItem('selectedArticle');
        if (stored) {
          const parsed = JSON.parse(stored);
          const articleId = parsed.id || parsed.Artikel_ID;

          // GET artikel detail
          const response = await axios.get(`${API_BASE_URL}/artikel/${articleId}`);
          const data = response.data;

          const fullArticle = {
            id: data.Artikel_ID,
            title: data.Judul,
            category: data.Kategori,
            content: data.Artikel,
            image: { uri: `${API_BASE_URL}/${data.Thumbnail}` },
          };

          setArticle(fullArticle);
          setLikeCount(data.Likes || 0);
          setViewCount(data.View || 0);

          // GET komentar artikel
          const commentResponse = await axios.get(`${API_BASE_URL}/comments/artikel/${articleId}`);
          const commentData = commentResponse.data;

          const formattedComments = commentData.map((comment: any) => ({
            id: comment.Comments_ID,
            author: comment.user.Username,
            text: comment.Comments,
            avatar: { uri: `${API_BASE_URL}/${comment.user.Foto_Profil}` },
          }));

          setComments(formattedComments);
        }
      } catch (error) {
        console.error("Gagal memuat artikel atau komentar:", error);
      }
    };

    fetchArticleDetail();
  }, []);


  {/* Fungsi Delete (Placeholder) */}
  const handleDelete = async () => {
    try {
      const stored = await AsyncStorage.getItem('selectedArticle');
      if (!stored) throw new Error("Artikel tidak ditemukan di penyimpanan lokal.");

      const parsed = JSON.parse(stored);
      const artikelId = parsed.id || parsed.Artikel_ID;

      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error("Token tidak ditemukan.");

      await axios.delete(`${API_BASE_URL}/artikel/${artikelId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert("Berhasil", "Artikel berhasil dihapus.");
      router.back(); // kembali ke halaman sebelumnya
    } catch (error) {
      console.error("Gagal menghapus artikel:", error);
      Alert.alert("Gagal", "Terjadi kesalahan saat menghapus artikel.");
    }
  };

  {/* =========================== */}

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image
            source={
              article?.image
                ? article.image
                : require("../assets/images/street-food.png")
            }
            style={styles.headerImage}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#304153" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={[typography.header.medium, styles.title]}>
              {article?.title || "Judul tidak tersedia"}
            </Text>

            <View style={styles.category}>
              <Text style={styles.categoryText}>{article?.category || "Kategori"}</Text>
            </View>
          </View>

          <View style={styles.authorRow}>
            <Ionicons
              name="person-outline"
              size={14}
              color="#8A8A8A"
              style={{ marginRight: 4 }}
            />
            <Text style={styles.author}>KPTKS</Text>
          </View>

          <Text style={[typography.body.small.regular, styles.bodyText]}>
            {article?.content || "Konten artikel tidak tersedia."}
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="eye-outline" size={16} color="#8A8A8A" />
              <Text style={styles.statText}>{viewCount}</Text>
            </View>

            <TouchableOpacity style={styles.statItem}>
              <Ionicons
                name={"heart-outline"}
                size={16}
                color={"#8A8A8A"}
              />
              <Text
                style={[
                  styles.statText,
                ]}
              >
                {likeCount}
              </Text>
            </TouchableOpacity>

            <View style={styles.statItem}>
              <Ionicons name="chatbubble-outline" size={16} color="#8A8A8A" />
              <Text style={styles.statText}>{comments.length}</Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionButton} onPress={() => router.push("/edit-artikel-admin")}>
                <Ionicons name="create-outline" size={16} color="#2563EB" />
                <Text style={[styles.actionText, { color: "#2563EB" }]}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={handleDelete}
            >
              <Ionicons name="trash-outline" size={16} color="#DC2626" />
              <Text style={[styles.actionText, { color: "#DC2626" }]}>Delete</Text>
            </TouchableOpacity>

          </View>

          <Text style={styles.commentHeader}>Komentar</Text>

      {comments.map((item) => (
        <View key={item.id} style={styles.commentItem}>
          <Image
            source={item.avatar || require("../assets/images/mini-avatar.jpeg")}
            style={styles.avatar}
          />
          <View style={styles.commentContent}>
            <Text style={styles.commentAuthor}>{item.author}</Text>
            <Text style={styles.commentText}>{item.text}</Text>
          </View>
        </View>
      ))}


        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 280,
    backgroundColor: "#eee",
    overflow: "hidden",
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E6EEF6",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  content: {
    backgroundColor: colors.background,
    marginTop: -36,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    padding: spacing.lg,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    color: colors.text.primary,
  },
  category: {
    backgroundColor: colors.surface.medium,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  categoryText: {
    ...typography.body.small.medium,
    color: colors.text.secondary,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  author: {
    ...typography.body.small.regular,
    color: colors.text.secondary,
  },
  bodyText: {
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.surface.medium,
    paddingVertical: 12,
    marginBottom: spacing.md,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    ...typography.body.small.regular,
    color: colors.text.secondary,
  },
  commentHeader: {
    ...typography.body.medium.semiBold,
    color: colors.text.primary,
    marginBottom: 12,
  },
  commentItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentAuthor: {
    ...typography.body.small.semiBold,
    color: colors.text.primary,
    marginBottom: 2,
  },
  commentText: {
    ...typography.body.small.regular,
    color: colors.text.secondary,
  },
  commentInputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface.dark,
    padding: 6,
    borderRadius: 32,
  },
  commentInput: {
    flex: 1,
    height: 44,
    ...typography.body.small.regular,
    color: colors.text.primary,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.surface.dark,
    borderRadius: 12,
  },
  sendButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 20,
    marginLeft: 8,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12, // if your RN version doesn’t support gap, use marginRight on first button
    marginBottom: spacing.md,
  },

  actionButton: {
    flex: 1, // Makes both buttons share equal space
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 999, // Fully rounded
    backgroundColor: "#F1F5F9",
  },
  deleteButton: {
    backgroundColor: "#FEE2E2", // subtle red background for Delete
  },
  actionText: {
    marginLeft: 6,
    ...typography.body.small.medium,
  },
});
