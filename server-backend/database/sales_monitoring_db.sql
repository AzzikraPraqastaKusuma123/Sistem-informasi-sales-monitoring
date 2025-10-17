-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 17, 2025 at 04:39 AM
-- Server version: 8.0.30
-- PHP Version: 8.3.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sales_monitoring_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `achievements`
--

CREATE TABLE `achievements` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED NOT NULL,
  `product_id` int UNSIGNED NOT NULL,
  `achieved_value` int NOT NULL DEFAULT '0',
  `achievement_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `achievements`
--

INSERT INTO `achievements` (`id`, `user_id`, `product_id`, `achieved_value`, `achievement_date`, `created_at`, `updated_at`) VALUES
(6, 1, 3, 100, '2025-10-10', '2025-10-16 15:13:51', '2025-10-16 15:13:51'),
(8, 1, 3, 800, '2025-10-14', '2025-10-16 15:36:23', '2025-10-16 15:36:23');

-- --------------------------------------------------------

--
-- Table structure for table `evaluations`
--

CREATE TABLE `evaluations` (
  `id` int UNSIGNED NOT NULL,
  `supervisor_id` int UNSIGNED NOT NULL,
  `sales_id` int UNSIGNED NOT NULL,
  `comment` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `evaluations`
--

INSERT INTO `evaluations` (`id`, `supervisor_id`, `sales_id`, `comment`, `created_at`) VALUES
(1, 1, 2, 'evaluasi', '2025-10-16 17:33:12');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(3, 'tes3', 'tes', '2025-10-16 15:13:07', '2025-10-16 15:13:07'),
(4, 'MTB', 'Produk Tabungan Muda atau sejenisnya', '2025-10-16 19:03:30', '2025-10-16 19:03:30'),
(5, 'TAB FP', 'Tabungan Fungsional Pribadi', '2025-10-16 19:03:30', '2025-10-16 19:03:30'),
(7, 'MTR', 'Mutasi Transaksi Rekening atau produk transaksi lainnya', '2025-10-16 19:03:30', '2025-10-16 19:03:30'),
(8, 'MTB iB', 'Multi Tabungan iB (produk syariah)', '2025-10-16 19:03:30', '2025-10-16 19:03:30'),
(9, 'TAB NOW', 'Produk tabungan online atau digital', '2025-10-16 19:03:30', '2025-10-16 19:03:30'),
(10, 'TAB MULTICURRENCY', 'Tabungan dengan fitur multi mata uang', '2025-10-16 19:03:30', '2025-10-16 19:03:30'),
(11, 'GIRO', 'Rekening giro untuk nasabah bisnis', '2025-10-16 19:03:30', '2025-10-16 19:03:30'),
(12, 'LWM / LVM', 'Produk investasi seperti Wealth Management atau Virtual Money', '2025-10-16 19:03:30', '2025-10-16 19:03:30'),
(13, 'AOB / EDC', 'Account Opening Booking atau aktivasi mesin EDC', '2025-10-16 19:03:30', '2025-10-16 19:03:30'),
(14, 'CC', 'Credit Card (Kartu Kredit)', '2025-10-16 19:03:30', '2025-10-16 19:03:30'),
(15, 'Reff AXA', 'Referral produk asuransi AXA', '2025-10-16 19:03:30', '2025-10-16 19:03:30');

-- --------------------------------------------------------

--
-- Table structure for table `targets`
--

CREATE TABLE `targets` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED NOT NULL,
  `product_id` int UNSIGNED NOT NULL,
  `target_value` int NOT NULL DEFAULT '0',
  `period_start` date NOT NULL,
  `period_end` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('sales','supervisor','admin') NOT NULL DEFAULT 'sales',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES
(1, 'andi', 'andi@example.com', '$2b$10$r3m2V3BRMFBotSWrWmKfBuCi6D7RFasOY/SiWY6mXKqL2388tOx96', 'admin', '2025-10-13 17:10:32', '2025-10-17 03:31:52'),
(2, 'zikra', 'zikra@gmail.com', '$2b$10$ayVx5knJfxNzk7mwgX1ZtOBwJY7g.hhiKsb3SbOB4.iT6.CZihxgK', 'admin', '2025-10-16 16:48:38', '2025-10-16 18:15:30'),
(3, 'PRASETYO', 'prasetyo@example.com', '$2b$10$fWvA3cQ3f8G8b9hG8j7kFe.o5u3U3j2u1iI0o4u2iI0o4u2iI0o4u', 'sales', '2025-10-16 19:03:47', '2025-10-16 19:03:47'),
(4, 'PRAYOGA', 'prayoga@example.com', '$2b$10$fWvA3cQ3f8G8b9hG8j7kFe.o5u3U3j2u1iI0o4u2iI0o4u2iI0o4u', 'sales', '2025-10-16 19:03:47', '2025-10-16 19:03:47'),
(5, 'FAJAR', 'fajar@example.com', '$2b$10$fWvA3cQ3f8G8b9hG8j7kFe.o5u3U3j2u1iI0o4u2iI0o4u2iI0o4u', 'sales', '2025-10-16 19:03:47', '2025-10-16 19:03:47'),
(6, 'INDRA', 'indra@example.com', '$2b$10$fWvA3cQ3f8G8b9hG8j7kFe.o5u3U3j2u1iI0o4u2iI0o4u2iI0o4u', 'sales', '2025-10-16 19:03:47', '2025-10-16 19:03:47'),
(7, 'REZA', 'reza@example.com', '$2b$10$fWvA3cQ3f8G8b9hG8j7kFe.o5u3U3j2u1iI0o4u2iI0o4u2iI0o4u', 'sales', '2025-10-16 19:03:47', '2025-10-16 19:03:47'),
(8, 'HENDRA', 'hendra@example.com', '$2b$10$fWvA3cQ3f8G8b9hG8j7kFe.o5u3U3j2u1iI0o4u2iI0o4u2iI0o4u', 'sales', '2025-10-16 19:03:47', '2025-10-16 19:03:47'),
(9, 'JOKO', 'joko@example.com', '$2b$10$fWvA3cQ3f8G8b9hG8j7kFe.o5u3U3j2u1iI0o4u2iI0o4u2iI0o4u', 'sales', '2025-10-16 19:03:47', '2025-10-16 19:03:47'),
(10, 'DWI', 'dwi@example.com', '$2b$10$fWvA3cQ3f8G8b9hG8j7kFe.o5u3U3j2u1iI0o4u2iI0o4u2iI0o4u', 'sales', '2025-10-16 19:03:47', '2025-10-16 19:03:47'),
(11, 'BAYU', 'bayu@example.com', '$2b$10$fWvA3cQ3f8G8b9hG8j7kFe.o5u3U3j2u1iI0o4u2iI0o4u2iI0o4u', 'sales', '2025-10-16 19:03:47', '2025-10-16 19:03:47'),
(12, 'ARIF', 'arif@example.com', '$2b$10$fWvA3cQ3f8G8b9hG8j7kFe.o5u3U3j2u1iI0o4u2iI0o4u2iI0o4u', 'sales', '2025-10-16 19:03:47', '2025-10-16 19:03:47'),
(13, 'YOGA', 'yoga@example.com', '$2b$10$fWvA3cQ3f8G8b9hG8j7kFe.o5u3U3j2u1iI0o4u2iI0o4u2iI0o4u', 'sales', '2025-10-16 19:03:47', '2025-10-16 19:03:47'),
(15, 'Budi Admin', 'admin@example.com', '$2b$10$fWvA3cQ3f8G8b9hG8j7kFe.o5u3U3j2u1iI0o4u2iI0o4u2iI0o4u', 'admin', '2025-10-16 19:03:47', '2025-10-16 19:03:47'),
(16, 'Citra Supervisor', 'supervisor@example.com', '$2b$10$fWvA3cQ3f8G8b9hG8j7kFe.o5u3U3j2u1iI0o4u2iI0o4u2iI0o4u', 'supervisor', '2025-10-16 19:03:47', '2025-10-16 19:03:47');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `achievements`
--
ALTER TABLE `achievements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_achievements_users_idx` (`user_id`),
  ADD KEY `fk_achievements_products_idx` (`product_id`);

--
-- Indexes for table `evaluations`
--
ALTER TABLE `evaluations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_evaluations_supervisor_idx` (`supervisor_id`),
  ADD KEY `fk_evaluations_sales_idx` (`sales_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `targets`
--
ALTER TABLE `targets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_targets_users_idx` (`user_id`),
  ADD KEY `fk_targets_products_idx` (`product_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email_UNIQUE` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `achievements`
--
ALTER TABLE `achievements`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `evaluations`
--
ALTER TABLE `evaluations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `targets`
--
ALTER TABLE `targets`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `achievements`
--
ALTER TABLE `achievements`
  ADD CONSTRAINT `fk_achievements_products` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_achievements_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `evaluations`
--
ALTER TABLE `evaluations`
  ADD CONSTRAINT `fk_evaluations_sales` FOREIGN KEY (`sales_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_evaluations_supervisor` FOREIGN KEY (`supervisor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `targets`
--
ALTER TABLE `targets`
  ADD CONSTRAINT `fk_targets_products` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_targets_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
