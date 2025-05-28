import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { typography } from '../theme'

const articles = [
  {
    id: 1,
    title: "Cara Merawat Kucing yang Benar",
    description: "Pelajari cara merawat kucing dengan baik dan benar, mulai dari makanan hingga kebersihan.",
    icon: "paw-outline",
  },
  {
    id: 2,
    title: "Pentingnya Vaksinasi Kucing",
    description: "Kenali jadwal dan jenis vaksin yang diperlukan untuk menjaga kesehatan kucing Anda.",
    icon: "medkit-outline",
  },
  {
    id: 3,
    title: "Mengenal Perilaku Kucing",
    description: "Pahami bahasa tubuh dan perilaku kucing untuk komunikasi yang lebih baik.",
    icon: "heart-outline",
  },
  {
    id: 4,
    title: "Nutrisi yang Tepat untuk Kucing",
    description: "Ketahui kebutuhan nutrisi kucing berdasarkan usia dan kondisi kesehatannya.",
    icon: "nutrition-outline",
  },
]

export default function EdukasiScreen() {
  const router = useRouter()

  const handleArticlePress = (article: typeof articles[0]) => {
    // TODO: Implement article detail navigation
    console.log('Article pressed:', article.title)
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Edukasi</Text>
        </View>

        {/* Scrollable Content */}
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.welcomeText}>Panduan Perawatan Kucing</Text>
          <Text style={styles.subtitleText}>
            Pelajari cara merawat kucing dengan baik dan benar
          </Text>

          {/* Articles */}
          <View style={styles.articlesContainer}>
            {articles.map((article) => (
              <TouchableOpacity
                key={article.id}
                style={styles.articleCard}
                onPress={() => handleArticlePress(article)}
              >
                <View style={styles.articleIcon}>
                  <Ionicons name={article.icon as any} size={24} color="#fff" />
                </View>
                <View style={styles.articleContent}>
                  <Text style={styles.articleTitle}>{article.title}</Text>
                  <Text style={styles.articleDescription} numberOfLines={2}>
                    {article.description}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#94A3B8" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Tips Section */}
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>Tips Harian</Text>
            <View style={styles.tipsCard}>
              <Text style={styles.tipsText}>
                • Sediakan air bersih setiap hari{"\n"}
                • Bersihkan litter box secara rutin{"\n"}
                • Sikat bulu kucing secara teratur{"\n"}
                • Berikan mainan untuk stimulasi{"\n"}
                • Jaga kebersihan lingkungan
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: "#fff",
  },
  headerTitle: {
    ...typography.header.medium,
    color: "#222",
  },
  welcomeText: {
    ...typography.header.medium,
    color: "#222",
    marginBottom: 8,
  },
  subtitleText: {
    ...typography.body.medium.regular,
    color: "#666",
    marginBottom: 32,
  },
  articlesContainer: {
    gap: 16,
    marginBottom: 32,
  },
  articleCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  articleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#222E3A",
    justifyContent: "center",
    alignItems: "center",
  },
  articleContent: {
    flex: 1,
  },
  articleTitle: {
    ...typography.body.medium.semiBold,
    color: "#222",
    marginBottom: 4,
  },
  articleDescription: {
    ...typography.body.small.regular,
    color: "#666",
  },
  tipsContainer: {
    marginBottom: 20,
  },
  tipsTitle: {
    ...typography.header.medium,
    color: "#222",
    marginBottom: 16,
  },
  tipsCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 20,
  },
  tipsText: {
    ...typography.body.medium.regular,
    color: "#666",
    lineHeight: 24,
  },
}) 