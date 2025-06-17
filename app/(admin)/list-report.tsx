// app/(admin)/list-report.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { colors, container, spacing, typography } from "../theme";

interface Report {
  Report_ID: number;
  User_ID: number;
  Deskripsi: string;
  Foto: string;
  Rescued: boolean;
  created_at: string;
  updated_at: string;
  user?: {
    Nama_Lengkap: string;
    Alamat: string;
  };
}

// Dummy data
const dummyReports: Report[] = [
  {
    Report_ID: 1,
    User_ID: 1,
    Deskripsi: "Kucing hitam-putih terlihat kurus dan lemah di sekitar area parkir. Sepertinya sudah beberapa hari tidak makan.",
    Foto: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    Rescued: false,
    created_at: "2024-03-15T10:30:00",
    updated_at: "2024-03-15T10:30:00",
    user: {
      Nama_Lengkap: "Budi Santoso",
      Alamat: "Jl. Wonokromo No. 123, Surabaya"
    }
  },
  {
    Report_ID: 2,
    User_ID: 2,
    Deskripsi: "Ada kucing oranye yang terlihat terluka di kaki belakangnya. Berjalan pincang dan terlihat kesakitan.",
    Foto: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    Rescued: true,
    created_at: "2024-03-14T15:45:00",
    updated_at: "2024-03-15T09:20:00",
    user: {
      Nama_Lengkap: "Siti Aminah",
      Alamat: "Jl. Darmo Permai No. 45, Surabaya"
    }
  },
  {
    Report_ID: 3,
    User_ID: 3,
    Deskripsi: "Kucing abu-abu terlihat hamil dan mencari tempat berlindung di bawah mobil. Kondisinya terlihat lemah.",
    Foto: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    Rescued: false,
    created_at: "2024-03-15T08:15:00",
    updated_at: "2024-03-15T08:15:00",
    user: {
      Nama_Lengkap: "Ahmad Rizki",
      Alamat: "Jl. Rungkut Asri No. 78, Surabaya"
    }
  }
];

type TabType = 'pending' | 'completed';

export default function ReportListScreen() {
  const router = useRouter();
  const [reports] = useState<Report[]>(dummyReports);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [modalType, setModalType] = useState<"accept" | "reject" | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('pending');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredReports = reports.filter(report => 
    activeTab === 'pending' ? !report.Rescued : report.Rescued
  );

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      <TouchableOpacity
        style={[
          styles.tabButton,
          activeTab === 'pending' && styles.activeTabButton
        ]}
        onPress={() => setActiveTab('pending')}
      >
        <Ionicons 
          name="time-outline" 
          size={20} 
          color={activeTab === 'pending' ? colors.primary : colors.text.secondary} 
        />
        <Text style={[
          styles.tabText,
          activeTab === 'pending' && styles.activeTabText
        ]}>
          Menunggu
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.tabButton,
          activeTab === 'completed' && styles.activeTabButton
        ]}
        onPress={() => setActiveTab('completed')}
      >
        <Ionicons 
          name="checkmark-circle-outline" 
          size={20} 
          color={activeTab === 'completed' ? colors.primary : colors.text.secondary} 
        />
        <Text style={[
          styles.tabText,
          activeTab === 'completed' && styles.activeTabText
        ]}>
          Selesai
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderReportCard = (report: Report) => (
    <View key={report.Report_ID} style={styles.reportCard}>
      <Image 
        source={{ uri: report.Foto }} 
        style={styles.reportImage}
      />
      <View style={styles.reportContent}>
        <View style={styles.reportHeader}>
          <View style={styles.reporterInfo}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {report.user?.Nama_Lengkap.charAt(0) || 'A'}
              </Text>
            </View>
            <View>
              <Text style={styles.reportTitle}>
                {report.user?.Nama_Lengkap || 'Anonim'}
              </Text>
              <Text style={styles.reportDate}>
                {formatDate(report.created_at)}
              </Text>
            </View>
          </View>
          <View style={[
            styles.statusBadge,
            report.Rescued ? styles.statusRescuedBadge : styles.statusPendingBadge
          ]}>
            <Text style={[
              styles.statusText,
              report.Rescued ? styles.statusRescued : styles.statusPending
            ]}>
              {report.Rescued ? 'Selesai' : 'Menunggu'}
            </Text>
          </View>
        </View>
        
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color={colors.text.secondary} />
          <Text style={styles.reportLocation}>
            {report.user?.Alamat || 'Lokasi tidak diketahui'}
          </Text>
        </View>
        
        <Text style={styles.reportDescription}>
          {report.Deskripsi}
        </Text>

        {!report.Rescued && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.acceptButton]}
              onPress={() => {
                setSelectedReport(report);
                setModalType("accept");
                setModalVisible(true);
              }}
            >
              <Ionicons name="checkmark-circle-outline" size={20} color={colors.background} />
              <Text style={styles.buttonText}>Terima</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => {
                setSelectedReport(report);
                setModalType("reject");
                setModalVisible(true);
              }}
            >
              <Ionicons name="close-circle-outline" size={20} color={colors.background} />
              <Text style={styles.buttonText}>Tolak</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Daftar Laporan</Text>
      </View>

      {renderTabBar()}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.reportList}>
          {filteredReports.map(renderReportCard)}
        </View>
      </ScrollView>

      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>
              {modalType === "accept"
                ? `Terima laporan dari ${selectedReport?.user?.Nama_Lengkap || 'Anonim'}?`
                : `Tolak laporan dari ${selectedReport?.user?.Nama_Lengkap || 'Anonim'}?`}
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.rejectButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  modalType === "accept" ? styles.acceptButton : styles.rejectButton,
                ]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>
                  {modalType === "accept" ? "Terima" : "Tolak"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { ...container.screen },
  header: {
    ...container.header,
    paddingTop: spacing.lg,
  },
  headerTitle: {
    ...typography.header.medium,
    color: colors.text.primary,
    textAlign: "center",
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface.medium,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.xs,
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: colors.surface.light,
  },
  tabText: {
    ...typography.body.medium.medium,
    color: colors.text.secondary,
  },
  activeTabText: {
    color: colors.primary,
  },
  content: { ...container.content },
  reportList: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  reportCard: {
    backgroundColor: colors.background,
    borderRadius: 16,
    marginBottom: spacing.lg,
    shadowColor: colors.text.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  reportImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  reportContent: {
    padding: spacing.md,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  reporterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  avatarText: {
    color: colors.background,
    ...typography.body.medium.semiBold,
  },
  reportTitle: {
    ...typography.body.medium.semiBold,
    color: colors.text.primary,
  },
  reportDate: {
    ...typography.body.small.regular,
    color: colors.text.secondary,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  reportLocation: {
    ...typography.body.small.regular,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  reportDescription: {
    ...typography.body.medium.regular,
    color: colors.text.primary,
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 999,
  },
  statusPendingBadge: {
    backgroundColor: '#FEF3C7',
  },
  statusRescuedBadge: {
    backgroundColor: '#D1FAE5',
  },
  statusText: {
    ...typography.body.small.medium,
  },
  statusPending: {
    color: '#D97706',
  },
  statusRescued: {
    color: '#059669',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 999,
    gap: spacing.xs,
  },
  acceptButton: {
    backgroundColor: colors.primary,
  },
  rejectButton: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    color: colors.background,
    ...typography.body.small.semiBold,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: colors.background,
    padding: spacing.lg,
    borderRadius: 16,
    alignItems: "center",
  },
  modalText: {
    ...typography.body.medium.regular,
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  modalActions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  modalButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 999,
  },
});
