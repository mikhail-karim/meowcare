import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, spacing, typography } from "./theme";

export default function EdukasiDetailScreen() {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(259);
  const [comments, setComments] = useState([
    { id: 1, author: "jamet kudasai", text: "Awesome" },
    { id: 2, author: "jamet kudasai", text: "nice info" },
  ]);
  const [commentInput, setCommentInput] = useState("");

  const handleLike = () => {
    setLiked((prev) => {
      const newLiked = !prev;
      setLikeCount((count) => count + (newLiked ? 1 : -1));
      return newLiked;
    });
  };

  const handleAddComment = () => {
    if (commentInput.trim() !== "") {
      const newComment = {
        id: Date.now(),
        author: "jamet kudasai",
        text: commentInput.trim(),
      };
      setComments([...comments, newComment]);
      setCommentInput("");
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
              source={require("../assets/images/street-food.png")}
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
                LOREM IPSUM
              </Text>
              <View style={styles.category}>
                <Text style={styles.categoryText}>Kegiatan</Text>
              </View>
            </View>

            <View style={styles.authorRow}>
              <Ionicons
                name="person-outline"
                size={14}
                color="#8A8A8A"
                style={{ marginRight: 4 }}
              />
              <Text style={styles.author}>Penulis</Text>
            </View>

            <Text style={[typography.body.small.regular, styles.bodyText]}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
              pharetra metus metus, vitae maximus nulla maximus sit amet.
              Phasellus sed aliquam ligula. Nulla facilisi. Mauris ac
              consectetur metus. Nam sit amet varius felis, nec maximus quam...
            </Text>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="eye-outline" size={16} color="#8A8A8A" />
                <Text style={styles.statText}>259</Text>
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
                <Ionicons
                  name="chatbubble-outline"
                  size={16}
                  color="#8A8A8A"
                />
                <Text style={styles.statText}>{comments.length}</Text>
              </View>
            </View>

            <Text style={styles.commentHeader}>Komentar</Text>

            {comments.map((item) => (
              <View key={item.id} style={styles.commentItem}>
                <Image
                  source={require("../assets/images/mini-avatar.jpeg")}
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
});
