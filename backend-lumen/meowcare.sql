DROP DATABASE IF EXISTS `meowcare`;
CREATE DATABASE IF NOT EXISTS `meowcare` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `meowcare`;

-- Table: admins
CREATE TABLE `admins` (
  `Admin_ID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `Nama_Lengkap` VARCHAR(255) NOT NULL,
  `Username` VARCHAR(255) NOT NULL UNIQUE,
  `Email` VARCHAR(255) NOT NULL UNIQUE,
  `Password` VARCHAR(255) NOT NULL,
  `Nomor_HP` VARCHAR(255),
  `Alamat` TEXT,
  PRIMARY KEY (`Admin_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: users
CREATE TABLE `users` (
  `User_ID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `Nama_Lengkap` VARCHAR(255) NOT NULL,
  `Foto_Profil` VARCHAR(255) NOT NULL,
  `Username` VARCHAR(255) NOT NULL UNIQUE,
  `Email` VARCHAR(255) NOT NULL UNIQUE,
  `Password` VARCHAR(255) NOT NULL,
  `Nomor_HP` VARCHAR(255),
  `Alamat` TEXT,
  `Role` ENUM('Adopter', 'Owner') NOT NULL,
  PRIMARY KEY (`User_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: artikel
CREATE TABLE `artikel` (
  `Artikel_ID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `Judul` VARCHAR(255) NOT NULL,
  `Thumbnail` VARCHAR(255),
  `Artikel` TEXT NOT NULL,
  `Kategori` VARCHAR(255) NOT NULL,
  `Likes` BIGINT UNSIGNED NOT NULL DEFAULT 0,
  `LikedUsers` TEXT COMMENT 'JSON array of user IDs who liked the article',
  `View` BIGINT UNSIGNED NOT NULL DEFAULT 0,
  `Admin_ID` BIGINT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`Artikel_ID`),
  FOREIGN KEY (`Admin_ID`) REFERENCES `admins` (`Admin_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: comments
CREATE TABLE `comments` (
  `Comments_ID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `Artikel_ID` BIGINT UNSIGNED NOT NULL,
  `User_ID` BIGINT UNSIGNED NOT NULL,
  `Comments` TEXT NOT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`Comments_ID`),
  FOREIGN KEY (`Artikel_ID`) REFERENCES `artikel` (`Artikel_ID`) ON DELETE CASCADE,
  FOREIGN KEY (`User_ID`) REFERENCES `users` (`User_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: donation
CREATE TABLE `donation` (
  `Donation_ID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `Nominal` DECIMAL(12,2) NOT NULL,
  `Catatan` TEXT,
  `User_ID` BIGINT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`Donation_ID`),
  FOREIGN KEY (`User_ID`) REFERENCES `users` (`User_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: migrations
CREATE TABLE `migrations` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `migration` VARCHAR(255) NOT NULL,
  `batch` INT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: penyakit
CREATE TABLE `penyakit` (
  `Penyakit_ID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `Nama` VARCHAR(255) NOT NULL,
  `Gejala` TEXT NOT NULL,
  `Penyebab` TEXT NOT NULL,
  `Obat` TEXT NOT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`Penyakit_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: ras
CREATE TABLE `ras` (
  `Ras_ID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `Nama` VARCHAR(255) NOT NULL,
  `Asal` TEXT,
  `Ciri_Khas` TEXT,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`Ras_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: warna
CREATE TABLE `warna` (
  `Warna_ID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `Nama` VARCHAR(255) NOT NULL,
  `Kode_Warna` VARCHAR(255),
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`Warna_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: pets
CREATE TABLE `pets` (
  `Pet_ID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `Nama` VARCHAR(255) NOT NULL,
  `Foto` VARCHAR(255) NOT NULL,
  `Umur` INT NOT NULL,
  `Jenis_Kelamin` ENUM('Laki-Laki','Perempuan') NOT NULL,
  `Adopted` TINYINT(1) NOT NULL DEFAULT 0,
  `Divaksin` TINYINT(1) NOT NULL DEFAULT 0,
  `Sterilisasi` TINYINT(1) NOT NULL DEFAULT 0,
  `Ras_ID` BIGINT UNSIGNED NOT NULL,
  `Warna_ID` BIGINT UNSIGNED NOT NULL,
  `User_ID` BIGINT UNSIGNED,
  `Admin_ID` BIGINT UNSIGNED,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`Pet_ID`),
  FOREIGN KEY (`Ras_ID`) REFERENCES `ras` (`Ras_ID`) ON DELETE CASCADE,
  FOREIGN KEY (`Warna_ID`) REFERENCES `warna` (`Warna_ID`) ON DELETE CASCADE,
  FOREIGN KEY (`User_ID`) REFERENCES `users` (`User_ID`) ON DELETE CASCADE,
  FOREIGN KEY (`Admin_ID`) REFERENCES `admins` (`Admin_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: pengajuans
CREATE TABLE `pengajuans` (
  `Pengajuan_ID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `Alasan` TEXT NOT NULL,
  `Approved` TINYINT(1) NOT NULL DEFAULT 0,
  `User_ID` BIGINT UNSIGNED NOT NULL,
  `Pet_ID` BIGINT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`Pengajuan_ID`),
  FOREIGN KEY (`User_ID`) REFERENCES `users` (`User_ID`) ON DELETE CASCADE,
  FOREIGN KEY (`Pet_ID`) REFERENCES `pets` (`Pet_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: konfirmasis (dipindahkan setelah pengajuans)
CREATE TABLE `konfirmasis` (
  `Konfirmasi_ID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `Admin_ID` BIGINT UNSIGNED NOT NULL,
  `Pengajuan_ID` BIGINT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`Konfirmasi_ID`),
  FOREIGN KEY (`Admin_ID`) REFERENCES `admins` (`Admin_ID`) ON DELETE CASCADE,
  FOREIGN KEY (`Pengajuan_ID`) REFERENCES `pengajuans` (`Pengajuan_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: report
CREATE TABLE `report` (
  `Report_ID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `User_ID` BIGINT UNSIGNED NOT NULL,
  `Deskripsi` TEXT NOT NULL,
  `Foto` VARCHAR(255),
  `Rescued` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`Report_ID`),
  FOREIGN KEY (`User_ID`) REFERENCES `users` (`User_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: riwayat_penyakit
CREATE TABLE `riwayat_penyakit` (
  `RiwayatPenyakit_ID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `Penyakit_ID` BIGINT UNSIGNED NOT NULL,
  `Pet_ID` BIGINT UNSIGNED NOT NULL,
  `Status` ENUM('sehat','diobati','sakit') NOT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`RiwayatPenyakit_ID`),
  UNIQUE (`Penyakit_ID`, `Pet_ID`),
  FOREIGN KEY (`Penyakit_ID`) REFERENCES `penyakit` (`Penyakit_ID`) ON DELETE CASCADE,
  FOREIGN KEY (`Pet_ID`) REFERENCES `pets` (`Pet_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
