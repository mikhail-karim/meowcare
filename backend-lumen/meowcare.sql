-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.4.3 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for meowcare
DROP DATABASE IF EXISTS `meowcare`;
CREATE DATABASE IF NOT EXISTS `meowcare` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `meowcare`;

-- Dumping structure for table meowcare.admins
DROP TABLE IF EXISTS `admins`;
CREATE TABLE IF NOT EXISTS `admins` (
  `Admin_ID` bigint unsigned NOT NULL AUTO_INCREMENT,
  `Nama_Lengkap` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Nomor_HP` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Alamat` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`Admin_ID`),
  UNIQUE KEY `admins_username_unique` (`Username`),
  UNIQUE KEY `admins_email_unique` (`Email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table meowcare.admins: ~0 rows (approximately)

-- Dumping structure for table meowcare.artikel
DROP TABLE IF EXISTS `artikel`;
CREATE TABLE IF NOT EXISTS `artikel` (
  `Artikel_ID` bigint unsigned NOT NULL AUTO_INCREMENT,
  `Judul` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Thumbnail` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Artikel` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `Kategori` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Likes` bigint unsigned NOT NULL DEFAULT '0',
  `LikedUsers` text COLLATE utf8mb4_unicode_ci COMMENT 'JSON array of user IDs who liked the article',
  `View` bigint unsigned NOT NULL DEFAULT '0',
  `Admin_ID` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`Artikel_ID`),
  KEY `artikel_admin_id_foreign` (`Admin_ID`),
  CONSTRAINT `artikel_admin_id_foreign` FOREIGN KEY (`Admin_ID`) REFERENCES `admins` (`Admin_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table meowcare.artikel: ~0 rows (approximately)

-- Dumping structure for table meowcare.comments
DROP TABLE IF EXISTS `comments`;
CREATE TABLE IF NOT EXISTS `comments` (
  `Comments_ID` bigint unsigned NOT NULL AUTO_INCREMENT,
  `Artikel_ID` bigint unsigned NOT NULL,
  `User_ID` bigint unsigned NOT NULL,
  `Comments` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`Comments_ID`),
  KEY `comments_artikel_id_foreign` (`Artikel_ID`),
  KEY `comments_user_id_foreign` (`User_ID`),
  CONSTRAINT `comments_artikel_id_foreign` FOREIGN KEY (`Artikel_ID`) REFERENCES `artikel` (`Artikel_ID`) ON DELETE CASCADE,
  CONSTRAINT `comments_user_id_foreign` FOREIGN KEY (`User_ID`) REFERENCES `users` (`User_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table meowcare.comments: ~0 rows (approximately)

-- Dumping structure for table meowcare.donation
DROP TABLE IF EXISTS `donation`;
CREATE TABLE IF NOT EXISTS `donation` (
  `Donation_ID` int unsigned NOT NULL AUTO_INCREMENT,
  `Nominal` decimal(12,2) NOT NULL,
  `Catatan` text COLLATE utf8mb4_unicode_ci,
  `User_ID` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`Donation_ID`),
  KEY `donation_user_id_foreign` (`User_ID`),
  CONSTRAINT `donation_user_id_foreign` FOREIGN KEY (`User_ID`) REFERENCES `users` (`User_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table meowcare.donation: ~0 rows (approximately)

-- Dumping structure for table meowcare.konfirmasis
DROP TABLE IF EXISTS `konfirmasis`;
CREATE TABLE IF NOT EXISTS `konfirmasis` (
  `Konfirmasi_ID` bigint unsigned NOT NULL AUTO_INCREMENT,
  `Admin_ID` bigint unsigned NOT NULL,
  `Pengajuan_ID` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`Konfirmasi_ID`),
  KEY `konfirmasis_admin_id_foreign` (`Admin_ID`),
  KEY `konfirmasis_pengajuan_id_foreign` (`Pengajuan_ID`),
  CONSTRAINT `konfirmasis_admin_id_foreign` FOREIGN KEY (`Admin_ID`) REFERENCES `admins` (`Admin_ID`) ON DELETE CASCADE,
  CONSTRAINT `konfirmasis_pengajuan_id_foreign` FOREIGN KEY (`Pengajuan_ID`) REFERENCES `pengajuans` (`Pengajuan_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table meowcare.konfirmasis: ~0 rows (approximately)

-- Dumping structure for table meowcare.migrations
DROP TABLE IF EXISTS `migrations`;
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table meowcare.migrations: ~0 rows (approximately)
REPLACE INTO `migrations` (`id`, `migration`, `batch`) VALUES
	(1, '2025_05_25_140914_create_users_table', 1),
	(2, '2025_05_28_104935_create_admins_table', 1),
	(3, '2025_06_02_131348_create_penyakit_table', 1),
	(4, '2025_06_02_133453_create_ras_table', 1),
	(5, '2025_06_02_135901_create_warna_table', 1),
	(6, '2025_06_03_003104_create_pets_table', 1),
	(7, '2025_06_10_063637_create_pengajuan_table', 1),
	(8, '2025_06_10_125600_create_konfirmasi_table', 1),
	(9, '2025_06_11_063955_create_artikel_table', 1),
	(10, '2025_06_11_072341_create_comments_table', 1),
	(11, '2025_06_11_075449_create_riwayat_penyakit_table', 1),
	(12, '2025_06_11_081333_create_donation_table', 1),
	(13, '2025_06_11_085827_create_reports_table', 1);

-- Dumping structure for table meowcare.pengajuans
DROP TABLE IF EXISTS `pengajuans`;
CREATE TABLE IF NOT EXISTS `pengajuans` (
  `Pengajuan_ID` bigint unsigned NOT NULL AUTO_INCREMENT,
  `Alasan` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `Approved` tinyint(1) NOT NULL DEFAULT '0',
  `User_ID` bigint unsigned NOT NULL,
  `Pet_ID` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`Pengajuan_ID`),
  KEY `pengajuans_user_id_foreign` (`User_ID`),
  KEY `pengajuans_pet_id_foreign` (`Pet_ID`),
  CONSTRAINT `pengajuans_pet_id_foreign` FOREIGN KEY (`Pet_ID`) REFERENCES `pets` (`Pet_ID`) ON DELETE CASCADE,
  CONSTRAINT `pengajuans_user_id_foreign` FOREIGN KEY (`User_ID`) REFERENCES `users` (`User_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table meowcare.pengajuans: ~0 rows (approximately)

-- Dumping structure for table meowcare.penyakit
DROP TABLE IF EXISTS `penyakit`;
CREATE TABLE IF NOT EXISTS `penyakit` (
  `Penyakit_ID` bigint unsigned NOT NULL AUTO_INCREMENT,
  `Nama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Gejala` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `Penyebab` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `Obat` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`Penyakit_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table meowcare.penyakit: ~0 rows (approximately)

-- Dumping structure for table meowcare.pets
DROP TABLE IF EXISTS `pets`;
CREATE TABLE IF NOT EXISTS `pets` (
  `Pet_ID` bigint unsigned NOT NULL AUTO_INCREMENT,
  `Nama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Foto` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Umur` int NOT NULL,
  `Jenis_Kelamin` enum('Laki-Laki','Perempuan') COLLATE utf8mb4_unicode_ci NOT NULL,
  `Adopted` tinyint(1) NOT NULL DEFAULT '0',
  `Divaksin` tinyint(1) NOT NULL DEFAULT '0',
  `Sterilisasi` tinyint(1) NOT NULL DEFAULT '0',
  `Ras_ID` bigint unsigned NOT NULL,
  `Warna_ID` bigint unsigned NOT NULL,
  `User_ID` bigint unsigned DEFAULT NULL,
  `Admin_ID` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`Pet_ID`),
  KEY `pets_ras_id_foreign` (`Ras_ID`),
  KEY `pets_warna_id_foreign` (`Warna_ID`),
  KEY `pets_user_id_foreign` (`User_ID`),
  KEY `pets_admin_id_foreign` (`Admin_ID`),
  CONSTRAINT `pets_admin_id_foreign` FOREIGN KEY (`Admin_ID`) REFERENCES `admins` (`Admin_ID`) ON DELETE CASCADE,
  CONSTRAINT `pets_ras_id_foreign` FOREIGN KEY (`Ras_ID`) REFERENCES `ras` (`Ras_ID`) ON DELETE CASCADE,
  CONSTRAINT `pets_user_id_foreign` FOREIGN KEY (`User_ID`) REFERENCES `users` (`User_ID`) ON DELETE CASCADE,
  CONSTRAINT `pets_warna_id_foreign` FOREIGN KEY (`Warna_ID`) REFERENCES `warna` (`Warna_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table meowcare.pets: ~0 rows (approximately)

-- Dumping structure for table meowcare.ras
DROP TABLE IF EXISTS `ras`;
CREATE TABLE IF NOT EXISTS `ras` (
  `Ras_ID` bigint unsigned NOT NULL AUTO_INCREMENT,
  `Nama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Asal` text COLLATE utf8mb4_unicode_ci,
  `Ciri_Khas` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`Ras_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table meowcare.ras: ~0 rows (approximately)

-- Dumping structure for table meowcare.report
DROP TABLE IF EXISTS `report`;
CREATE TABLE IF NOT EXISTS `report` (
  `Report_ID` bigint unsigned NOT NULL AUTO_INCREMENT,
  `User_ID` bigint unsigned NOT NULL,
  `Deskripsi` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `Foto` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Rescued` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`Report_ID`),
  KEY `report_user_id_foreign` (`User_ID`),
  CONSTRAINT `report_user_id_foreign` FOREIGN KEY (`User_ID`) REFERENCES `users` (`User_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table meowcare.report: ~0 rows (approximately)

-- Dumping structure for table meowcare.riwayat_penyakit
DROP TABLE IF EXISTS `riwayat_penyakit`;
CREATE TABLE IF NOT EXISTS `riwayat_penyakit` (
  `RiwayatPenyakit_ID` bigint unsigned NOT NULL AUTO_INCREMENT,
  `Penyakit_ID` bigint unsigned NOT NULL,
  `Pet_ID` bigint unsigned NOT NULL,
  `Status` enum('sehat','diobati','sakit') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`RiwayatPenyakit_ID`),
  UNIQUE KEY `riwayat_penyakit_penyakit_id_pet_id_unique` (`Penyakit_ID`,`Pet_ID`),
  KEY `riwayat_penyakit_pet_id_foreign` (`Pet_ID`),
  CONSTRAINT `riwayat_penyakit_penyakit_id_foreign` FOREIGN KEY (`Penyakit_ID`) REFERENCES `penyakit` (`Penyakit_ID`) ON DELETE CASCADE,
  CONSTRAINT `riwayat_penyakit_pet_id_foreign` FOREIGN KEY (`Pet_ID`) REFERENCES `pets` (`Pet_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table meowcare.riwayat_penyakit: ~0 rows (approximately)

-- Dumping structure for table meowcare.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `User_ID` bigint unsigned NOT NULL AUTO_INCREMENT,
  `Nama_Lengkap` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Foto_Profil` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Nomor_HP` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Alamat` text COLLATE utf8mb4_unicode_ci,
  `Role` enum('Adopter','Owner') COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`User_ID`),
  UNIQUE KEY `users_username_unique` (`Username`),
  UNIQUE KEY `users_email_unique` (`Email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table meowcare.users: ~0 rows (approximately)

-- Dumping structure for table meowcare.warna
DROP TABLE IF EXISTS `warna`;
CREATE TABLE IF NOT EXISTS `warna` (
  `Warna_ID` bigint unsigned NOT NULL AUTO_INCREMENT,
  `Nama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Kode_Warna` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`Warna_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table meowcare.warna: ~0 rows (approximately)

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
