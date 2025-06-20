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
  TextInput,
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
  const [liked, setLiked] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    const fetchArticleDetail = async () => {
      try {
        const stored = await AsyncStorage.getItem('selectedArticle');
        const userData = await AsyncStorage.getItem('id');
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

          const likedUsersArray = JSON.parse(data.LikedUsers || "[]");
          if (likedUsersArray.includes(userData?.toString())) {
            setLiked(true);
          }

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

  const handleLike = async () => {
    if (!article) return;

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Autentikasi gagal", "Token tidak ditemukan. Silakan login kembali.");
        return;
      }

      const response = await axios.put(
        `${API_BASE_URL}/artikel/likes/${article.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLiked((prev) => {
        const newLiked = !prev;
        setLikeCount((count) => count + (newLiked ? 1 : -1));
        return newLiked;
      });
    } catch (error) {
      console.error("Gagal menyukai artikel:", error);
      Alert.alert("Error", "Gagal menyukai artikel.");
    }
  };

const handleAddComment = async () => {
  if (commentInput.trim() === "" || !article) return;

  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert("Autentikasi gagal", "Token tidak ditemukan. Silakan login ulang.");
      return;
    }

    await axios.post(
      `${API_BASE_URL}/comments`,
      {
        Artikel_ID: article.id,
        Comments: commentInput.trim(),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setCommentInput("");

    // Refresh data komentar
    const commentResponse = await axios.get(`${API_BASE_URL}/comments/artikel/${article.id}`);
    const commentData = commentResponse.data;

    const formattedComments = commentData.map((comment: any) => ({
      id: comment.Comments_ID,
      author: comment.user.Username,
      text: comment.Comments,
      avatar: { uri: `${API_BASE_URL}/${comment.user.Foto_Profil}` },
    }));

    setComments(formattedComments);
  } catch (error) {
    console.error("Gagal menambahkan komentar:", error);
    Alert.alert("Error", "Gagal menambahkan komentar.");
  }
};


  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
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
                <Text style={styles.categoryText}>
                  {article?.category || "Kategori"}
                </Text>
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

              <TouchableOpacity style={styles.statItem} onPress={handleLike}>
                <Ionicons
                  name={liked ? "heart" : "heart-outline"}
                  size={16}
                  color={liked ? "#E74C3C" : "#8A8A8A"}
                />
                <Text
                  style={[
                    styles.statText,
                    liked && { color: "#E74C3C", fontWeight: "bold" },
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
          </View>

          <View style={styles.commentsContainer}>
            <View style={styles.commentHeaderRow}>
              <Ionicons name="chatbubble-ellipses-outline" size={18} color={colors.text.primary} />
              <Text style={styles.commentHeader}>Komentar</Text>
            </View>

            {comments.length === 0 ? (
              <Text style={styles.emptyComment}>Belum ada komentar.</Text>
            ) : (
              comments.map((item) => (
                <View key={item.id} style={styles.commentItemCard}>
                  <Image
                    source={item.avatar || require("../assets/images/mini-avatar.jpeg")}
                    style={styles.avatar}
                  />
                  <View style={styles.commentContent}>
                    <Text style={styles.commentAuthor}>{item.author}</Text>
                    <Text style={styles.commentText}>{item.text}</Text>
                  </View>
                </View>
              ))
            )}
          </View>

        </ScrollView>

        {/* Input komentar tetap di bawah */}
        <View style={styles.commentInputRowFixed}>
          <TextInput
            placeholder="Tulis komentar di sini..."
            placeholderTextColor="#B0B0B0"
            style={styles.commentInput}
            value={commentInput}
            onChangeText={setCommentInput}
            underlineColorAndroid="transparent"
            selectionColor="#304153"
            autoCorrect={false}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleAddComment}>
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
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
  commentInputRowFixed: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface.dark,
    padding: 6,
    borderRadius: 32,
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
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

  commentHeaderRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
  marginBottom: 12,
},

commentsContainer: {
  paddingHorizontal: spacing.lg,
  marginTop: 12,
},

commentItemCard: {
  flexDirection: "row",
  alignItems: "flex-start",
  backgroundColor: colors.surface.light,
  padding: 10,
  borderRadius: 12,
  marginBottom: 12,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 2,
  elevation: 1,
},

emptyComment: {
  textAlign: "center",
  color: colors.text.secondary,
  fontStyle: "italic",
  ...typography.body.small.regular,
  marginTop: 6,
},

});
