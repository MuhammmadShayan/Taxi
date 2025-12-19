-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 03, 2025 at 04:01 PM
-- Server version: 10.4.20-MariaDB
-- PHP Version: 7.3.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `my_travel_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `agencies`
--

CREATE TABLE `agencies` (
  `agency_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `business_name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `contact_name` varchar(150) DEFAULT NULL,
  `business_phone` varchar(20) DEFAULT NULL,
  `business_email` varchar(150) DEFAULT NULL,
  `business_address` varchar(255) DEFAULT NULL,
  `business_city` varchar(100) DEFAULT NULL,
  `business_state` varchar(100) DEFAULT NULL,
  `business_country` varchar(100) DEFAULT NULL,
  `business_postal_code` varchar(20) DEFAULT NULL,
  `payment_methods` varchar(255) DEFAULT NULL,
  `commission_rate` decimal(5,2) DEFAULT 15.00,
  `status` enum('pending','approved','rejected','suspended') DEFAULT 'pending',
  `license_number` varchar(100) DEFAULT NULL,
  `tax_id` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `stripe_account_id` varchar(255) DEFAULT NULL,
  `payment_terms` enum('weekly','biweekly','monthly') DEFAULT 'monthly',
  `financial_status` enum('active','suspended','pending_verification') DEFAULT 'active',
  `total_earnings` decimal(10,2) DEFAULT 0.00,
  `pending_payouts` decimal(10,2) DEFAULT 0.00,
  `last_payout_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `agencies`
--

INSERT INTO `agencies` (`agency_id`, `user_id`, `business_name`, `description`, `contact_name`, `business_phone`, `business_email`, `business_address`, `business_city`, `business_state`, `business_country`, `business_postal_code`, `payment_methods`, `commission_rate`, `status`, `license_number`, `tax_id`, `created_at`, `updated_at`, `stripe_account_id`, `payment_terms`, `financial_status`, `total_earnings`, `pending_payouts`, `last_payout_date`) VALUES
(1, 2, 'Test Agency', 'Test Agency - Role: . Services: . Navigation: yes. Seats: ', 'John Doe', '+212600123456', 'test1756034218720@example.com', NULL, 'Marrakech', '', 'Spain', '40000', '[\"pay_all\"]', '15.00', 'approved', NULL, NULL, '2025-08-24 11:16:59', '2025-11-12 19:28:42', NULL, 'monthly', 'active', '0.00', '0.00', NULL),
(2, 3, 'kirastay', 'additional Comments, additional Comments, additional Comments, ', 'agency', '+21260052254', 'agency@kirastay.com', 'kirastay', 'Karachi', '', 'Pakistan', '123456', '[\"pay_all\",\"20_percent\"]', '15.00', 'approved', NULL, NULL, '2025-08-24 11:17:24', '2025-08-25 04:52:02', NULL, 'monthly', 'active', '0.00', '0.00', NULL),
(3, 4, 'Kirastay', 'sdfdsfa', 'agency', '+212600212', 'agency2@kirastay.com', ' Street Number', 'Hyderabad', '', 'Algeria', '123456789', '[\"pay_all\",\"20_percent\"]', '15.00', 'approved', NULL, NULL, '2025-08-24 11:25:01', '2025-09-09 10:46:14', NULL, 'monthly', 'active', '0.00', '0.00', NULL),
(4, 5, 'Debug Test Agency', 'Debug Test Agency - Role: . Services: . Navigation: no. Seats: ', 'Debug User', '+212600111222', 'debug1756034831596@example.com', '789 Debug Street', 'Rabat', '', 'Morocco', '10000', '[\"pay_all\"]', '15.00', 'approved', NULL, NULL, '2025-08-24 11:27:13', '2025-11-12 19:28:37', NULL, 'monthly', 'active', '0.00', '0.00', NULL),
(5, 6, 'DB_TEST_AGENCY', 'DB_TEST_AGENCY - Role: . Services: . Navigation: no. Seats: ', 'DB Test', '+212600000000', 'dbtest1756034944392@example.com', 'Test Street', 'Test City', '', 'Morocco', '', '[\"pay_all\"]', '15.00', 'approved', NULL, NULL, '2025-08-24 11:29:05', '2025-11-12 19:28:35', NULL, 'monthly', 'active', '0.00', '0.00', NULL),
(6, 128, 'KiraStay Agency 1', NULL, 'Agency1 Owner', NULL, 'agency1@kirastay.com', NULL, NULL, NULL, NULL, NULL, NULL, '15.00', 'approved', NULL, NULL, '2025-09-09 10:45:27', '2025-09-09 10:46:14', NULL, 'monthly', 'active', '0.00', '0.00', NULL),
(11, 138, 'Al Badar Travels', 'Al Badar Travels - Role: Owner. Services: . Navigation: yes. Seats: Baby Child Booster', 'Muhammad Shayan', '+923167286342', 'ali@gmail.com', 'kacha qila shah faisal coloney', 'hyderabad', '', 'Morocco', '', '[\"pay_all\",\"20_percent\"]', '15.00', 'approved', NULL, NULL, '2025-11-10 18:47:58', '2025-11-12 19:28:25', NULL, 'monthly', 'active', '0.00', '0.00', NULL),
(12, 141, 'Basit Travel', 'Basit Travel - Role: . Services: Multiple Service Available at affordable prices. Navigation: yes. Seats: Baby Child Booster', 'Muhammad Shayan', '+923145398765', 'Basit1@gmail.com', NULL, 'hyderabad', '', 'Morocco', '', '[\"pay_all\",\"20_percent\"]', '15.00', 'approved', NULL, NULL, '2025-11-10 19:54:25', '2025-11-24 07:46:00', NULL, 'monthly', 'active', '0.00', '0.00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `agency_vehicles`
--

CREATE TABLE `agency_vehicles` (
  `vehicle_id` int(11) NOT NULL,
  `agency_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `vehicle_number` varchar(50) NOT NULL,
  `type` enum('small_car','transporter','suv','luxury','motorcycle','van','truck','other') NOT NULL,
  `brand` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  `year` year(4) NOT NULL,
  `energy` enum('petrol','diesel','electric','hybrid') NOT NULL,
  `gear_type` enum('manual','automatic') NOT NULL,
  `doors` int(11) DEFAULT NULL,
  `seats` int(11) DEFAULT NULL,
  `air_conditioning` tinyint(1) DEFAULT 1,
  `airbags` tinyint(1) DEFAULT 1,
  `navigation_system` tinyint(1) DEFAULT 0,
  `bluetooth` tinyint(1) DEFAULT 0,
  `wifi` tinyint(1) DEFAULT 0,
  `price_low` decimal(10,2) NOT NULL,
  `price_high` decimal(10,2) NOT NULL,
  `price_holiday` decimal(10,2) NOT NULL,
  `daily_rate` decimal(10,2) NOT NULL,
  `weekly_rate` decimal(10,2) DEFAULT NULL,
  `monthly_rate` decimal(10,2) DEFAULT NULL,
  `deposit_amount` decimal(10,2) NOT NULL DEFAULT 200.00,
  `mileage_limit` int(11) DEFAULT 200,
  `extra_mileage_cost` decimal(5,2) DEFAULT 0.15,
  `description` text DEFAULT NULL,
  `images` text DEFAULT NULL,
  `status` enum('available','rented','maintenance','inactive') DEFAULT 'available',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `agency_vehicles`
--

INSERT INTO `agency_vehicles` (`vehicle_id`, `agency_id`, `category_id`, `vehicle_number`, `type`, `brand`, `model`, `year`, `energy`, `gear_type`, `doors`, `seats`, `air_conditioning`, `airbags`, `navigation_system`, `bluetooth`, `wifi`, `price_low`, `price_high`, `price_holiday`, `daily_rate`, `weekly_rate`, `monthly_rate`, `deposit_amount`, `mileage_limit`, `extra_mileage_cost`, `description`, `images`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'MAR-001-A', 'small_car', 'Renault', 'Clio', 2022, 'petrol', 'manual', 5, 5, 1, 1, 0, 1, 0, '35.00', '45.00', '55.00', '35.00', '220.00', '800.00', '200.00', 200, '0.15', 'Compact and fuel-efficient car perfect for city driving', '[\"/html-folder/images/car-img.jpg\",\"/html-folder/images/car-img2.jpg\"]', 'available', '2025-08-24 20:46:18', '2025-08-25 06:22:09'),
(2, 1, 2, 'MAR-002-A', 'small_car', 'Peugeot', '208', 2023, 'petrol', 'automatic', 5, 5, 1, 1, 1, 1, 0, '45.00', '55.00', '65.00', '45.00', '280.00', '1000.00', '250.00', 200, '0.15', 'Modern compact car with automatic transmission and GPS', '[\"/html-folder/images/car-img2.jpg\",\"/html-folder/images/car-img3.jpg\"]', 'available', '2025-08-24 20:46:18', '2025-08-25 06:22:09'),
(3, 1, 3, 'MAR-003-A', 'suv', 'Toyota', 'RAV4', 2023, 'hybrid', 'automatic', 5, 5, 1, 1, 1, 1, 1, '75.00', '95.00', '115.00', '75.00', '480.00', '1800.00', '400.00', 200, '0.20', 'Spacious hybrid SUV perfect for families and long trips', '[\"/html-folder/images/car-img3.jpg\",\"/html-folder/images/car-img4.jpg\"]', 'available', '2025-08-24 20:46:18', '2025-08-25 06:22:09'),
(4, 1, 4, 'MAR-004-A', 'luxury', 'BMW', 'X3', 2023, 'petrol', 'automatic', 5, 5, 1, 1, 1, 1, 1, '120.00', '150.00', '180.00', '120.00', '750.00', '2800.00', '600.00', 200, '0.25', 'Luxury SUV with premium features and excellent comfort', '[\"/html-folder/images/car-img4.jpg\",\"/html-folder/images/car-img.jpg\"]', 'available', '2025-08-24 20:46:18', '2025-08-25 06:22:09'),
(5, 1, 1, 'MAR-005-A', 'small_car', 'Dacia', 'Logan', 2021, 'petrol', 'manual', 4, 5, 1, 1, 0, 0, 0, '28.00', '38.00', '48.00', '28.00', '180.00', '650.00', '150.00', 200, '0.12', 'Budget-friendly reliable sedan for economical travel', '[\"/html-folder/images/car-img.jpg\",\"/html-folder/images/car-img2.jpg\"]', 'available', '2025-08-24 20:46:18', '2025-08-25 06:22:09'),
(6, 1, 4, 'MAR-006-A', 'luxury', 'Mercedes', 'E-Class', 2023, 'diesel', 'automatic', 4, 5, 1, 1, 1, 1, 1, '140.00', '170.00', '200.00', '140.00', '900.00', '3200.00', '700.00', 200, '0.30', 'Premium executive sedan with luxury appointments', '[\"/html-folder/images/car-img2.jpg\",\"/html-folder/images/car-img.jpg\"]', 'available', '2025-08-24 20:46:18', '2025-08-25 06:22:09'),
(7, 2, 1, 'KHI-001-A', 'small_car', 'Honda', 'City', 2022, 'petrol', 'automatic', 4, 5, 1, 1, 0, 1, 0, '40.00', '50.00', '60.00', '40.00', '250.00', '900.00', '200.00', 200, '0.15', 'Reliable Honda City perfect for Karachi traffic', '[\"/html-folder/images/car-img.jpg\",\"/html-folder/images/car-img2.jpg\"]', 'available', '2025-08-25 04:50:25', '2025-08-25 06:22:09'),
(8, 2, 2, 'KHI-002-A', 'small_car', 'Toyota', 'Corolla', 2023, 'petrol', 'automatic', 4, 5, 1, 1, 1, 1, 0, '50.00', '60.00', '70.00', '50.00', '320.00', '1200.00', '250.00', 200, '0.15', 'Popular Toyota Corolla with GPS navigation', '[\"/html-folder/images/car-img2.jpg\",\"/html-folder/images/car-img3.jpg\"]', 'available', '2025-08-25 04:50:25', '2025-08-25 06:22:09'),
(9, 2, 3, 'KHI-003-A', 'suv', 'Honda', 'BR-V', 2023, 'petrol', 'automatic', 5, 7, 1, 1, 1, 1, 1, '80.00', '100.00', '120.00', '80.00', '500.00', '1900.00', '400.00', 200, '0.20', 'Spacious 7-seater SUV for families', '[\"/html-folder/images/car-img3.jpg\",\"/html-folder/images/car-img4.jpg\"]', 'available', '2025-08-25 04:50:25', '2025-08-25 06:22:09'),
(10, 2, 4, 'KHI-004-A', 'luxury', 'Toyota', 'Camry', 2023, 'hybrid', 'automatic', 4, 5, 1, 1, 1, 1, 1, '130.00', '160.00', '190.00', '130.00', '800.00', '3000.00', '600.00', 200, '0.25', 'Luxury hybrid sedan with premium features', '[\"/html-folder/images/car-img4.jpg\",\"/html-folder/images/car-img.jpg\"]', 'available', '2025-08-25 04:50:25', '2025-08-25 06:22:09'),
(11, 2, 1, 'KHI-005-A', 'small_car', 'Suzuki', 'Alto', 2021, 'petrol', 'manual', 5, 4, 1, 1, 0, 0, 0, '25.00', '35.00', '45.00', '25.00', '150.00', '550.00', '150.00', 200, '0.12', 'Budget-friendly compact car for city driving', '[\"/html-folder/images/car-img.jpg\",\"/html-folder/images/car-img2.jpg\"]', 'available', '2025-08-25 04:50:25', '2025-08-25 06:22:09'),
(13, 3, 2, 'ABC-123', 'small_car', 'Audi', 'A3', 2025, 'petrol', 'manual', 4, 5, 1, 1, 0, 0, 0, '10.00', '10.00', '40.00', '10.00', '20.00', '30.00', '200.00', 200, '0.15', 'testing Description', NULL, 'available', '2025-08-27 16:26:15', '2025-08-27 16:26:15'),
(14, 6, 1, '6-1757414728005-308', 'small_car', 'Jeep', 'Grand Cherokee Sterling Edition', 2018, '', 'automatic', 4, 5, 1, 1, 0, 0, 0, '652.00', '847.60', '978.00', '652.00', '3912.00', '16300.00', '200.00', 200, '0.15', 'Jeep Grand Cherokee Sterling Edition 2018', '[\"/images/cars/Jeep_Grand_Cherokee_Sterling_Edition_2018_1757410668951.jpg\"]', 'available', '2025-09-09 10:45:28', '2025-09-09 10:45:28'),
(15, 6, 1, '6-1757414728021-794', 'small_car', 'Hyundai', 'SANTA FE Ultimate 2.0T', 2019, '', 'automatic', 4, 5, 1, 1, 0, 0, 0, '646.00', '839.80', '969.00', '646.00', '3876.00', '16150.00', '200.00', 200, '0.15', 'Hyundai SANTA FE Ultimate 2.0T 2019', '[\"/images/cars/Hyundai_SANTA_FE_Ultimate_2.0T_2019_1757410670168.jpg\"]', 'available', '2025-09-09 10:45:28', '2025-09-09 10:45:28'),
(16, 6, 1, '6-1757414728026-877', 'small_car', 'Nissan', 'Rogue SV', 2023, '', 'automatic', 4, 5, 1, 1, 0, 0, 0, '712.00', '925.60', '1068.00', '712.00', '4272.00', '17800.00', '200.00', 200, '0.15', 'Nissan Rogue SV 2023', '[\"/images/cars/Nissan_Rogue_SV_2023_1757410667268.jpg\"]', 'available', '2025-09-09 10:45:28', '2025-09-09 10:45:28'),
(17, 3, 1, '3-1757414728070-814', 'small_car', 'Toyota', 'Camry SE', 2022, '', 'automatic', 4, 5, 1, 1, 0, 0, 0, '966.00', '1255.80', '1449.00', '966.00', '5796.00', '24150.00', '200.00', 200, '0.15', 'Toyota Camry SE 2022', '[\"/images/cars/Toyota_Camry_SE_2022_1757410668277.jpg\"]', 'available', '2025-09-09 10:45:28', '2025-09-09 10:45:28'),
(18, 3, 1, '3-1757414728074-281', 'small_car', 'Chrysler', 'Pacifica L', 2026, '', 'automatic', 4, 5, 1, 1, 0, 0, 0, '1632.00', '2121.60', '2448.00', '1632.00', '9792.00', '40800.00', '200.00', 200, '0.15', 'Chrysler Pacifica L 2026', '[\"/images/cars/Chrysler_Pacifica_L_2026_1757410666282.jpg\"]', 'available', '2025-09-09 10:45:28', '2025-09-09 10:45:28'),
(19, 3, 1, '3-1757414728077-10', 'small_car', 'Mitsubishi', 'Outlander PHEV SEL', 2025, '', 'automatic', 4, 5, 1, 1, 0, 0, 0, '1421.00', '1847.30', '2131.50', '1421.00', '8526.00', '35525.00', '200.00', 200, '0.15', 'Mitsubishi Outlander PHEV SEL 2025', '[\"/images/cars/Mitsubishi_Outlander_PHEV_SEL_2025_1757410665637.jpg\"]', 'available', '2025-09-09 10:45:28', '2025-09-09 10:45:28'),
(29, 6, 1, '6-1757441053870', 'small_car', 'Acura', 'MDX', 2026, '', 'automatic', 4, 5, 1, 1, 1, 1, 1, '1865.00', '2424.50', '2797.50', '1865.00', '11190.00', '46625.00', '200.00', 200, '0.15', 'Acura MDX 2026', '[\"/images/cars/Acura_MDX_2026_1757408329453.jpg\"]', 'available', '2025-09-09 18:04:13', '2025-09-09 18:04:13'),
(30, 6, 1, '6-1757441085581', 'small_car', 'Chrysler', 'Pacifica L', 2026, '', 'automatic', 4, 5, 1, 1, 0, 0, 0, '1632.00', '2121.60', '2448.00', '1632.00', '9792.00', '40800.00', '200.00', 200, '0.15', 'Chrysler Pacifica L 2026', '[\"/images/cars/Chrysler_Pacifica_L_2026_1757410666282.jpg\"]', 'available', '2025-09-09 18:04:45', '2025-09-09 18:04:45'),
(32, 12, 1, 'BAC 231', 'luxury', 'Mercedes-Benz', 'GLC 300 4MATIC Coupe', 2026, 'petrol', 'manual', 4, 5, 1, 1, 1, 1, 0, '232.00', '348.00', '278.40', '230.00', '1800.00', '70000.00', '200.00', 200, '0.15', '', '[\"/images/cars/Mercedes-Benz_GLC_300_4MATIC_Coupe_2026_1757410649612.jpg\"]', 'available', '2025-11-14 18:43:35', '2025-11-14 20:21:22'),
(33, 12, 1, 'SAL 320', 'suv', 'Hyundai', 'SANTA FE SE', 2026, 'petrol', 'manual', 4, 5, 1, 1, 1, 1, 0, '138.00', '207.00', '165.60', '139.99', '800.00', '2200.00', '200.00', 200, '0.15', '', '[\"/images/cars/Hyundai_SANTA_FE_SE_2026_1757408332657.jpg\"]', 'inactive', '2025-11-14 20:24:37', '2025-11-23 14:25:14');

-- --------------------------------------------------------

--
-- Table structure for table `cars`
--

CREATE TABLE `cars` (
  `id` int(11) NOT NULL,
  `make` varchar(50) NOT NULL,
  `model` varchar(50) NOT NULL,
  `year` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `transmission` enum('automatic','manual') DEFAULT 'manual',
  `fuel_type` enum('petrol','diesel','electric','hybrid') DEFAULT 'petrol',
  `seats` int(11) DEFAULT 5,
  `doors` int(11) DEFAULT 4,
  `air_conditioning` tinyint(1) DEFAULT 1,
  `price_per_day` decimal(10,2) NOT NULL,
  `location` varchar(100) DEFAULT NULL,
  `is_available` tinyint(1) DEFAULT 1,
  `rating` decimal(3,2) DEFAULT 0.00,
  `total_ratings` int(11) DEFAULT 0,
  `description` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `cars`
--

INSERT INTO `cars` (`id`, `make`, `model`, `year`, `category_id`, `transmission`, `fuel_type`, `seats`, `doors`, `air_conditioning`, `price_per_day`, `location`, `is_available`, `rating`, `total_ratings`, `description`, `image_url`, `created_at`, `updated_at`) VALUES
(1, 'Toyota', 'Corolla', 2023, 1, 'automatic', 'petrol', 5, 4, 1, '35.00', 'Casablanca', 1, '4.50', 120, 'Reliable and fuel-efficient car perfect for city driving', '/images/cars/toyota-corolla.jpg', '2025-08-28 17:06:26', '2025-08-28 17:06:26'),
(2, 'Renault', 'Clio', 2022, 2, 'manual', 'petrol', 5, 4, 1, '30.00', 'Marrakech', 1, '4.20', 85, 'Compact car ideal for navigating narrow streets', '/images/cars/renault-clio.jpg', '2025-08-28 17:06:26', '2025-08-28 17:06:26'),
(3, 'BMW', 'X3', 2023, 6, 'automatic', 'diesel', 5, 4, 1, '85.00', 'Casablanca', 1, '4.80', 95, 'Premium SUV with luxury features and excellent performance', '/images/cars/bmw-x3.jpg', '2025-08-28 17:06:26', '2025-08-28 17:06:26'),
(4, 'Mercedes', 'C-Class', 2023, 5, 'automatic', 'petrol', 5, 4, 1, '90.00', 'Rabat', 1, '4.70', 78, 'Luxury sedan with advanced safety features', '/images/cars/mercedes-c-class.jpg', '2025-08-28 17:06:26', '2025-08-28 17:06:26'),
(5, 'Dacia', 'Logan', 2022, 1, 'manual', 'petrol', 5, 4, 1, '25.00', 'Fes', 1, '4.00', 156, 'Budget-friendly option with good reliability', '/images/cars/dacia-logan.jpg', '2025-08-28 17:06:26', '2025-08-28 17:06:26');

-- --------------------------------------------------------

--
-- Table structure for table `car_booking_searches`
--

CREATE TABLE `car_booking_searches` (
  `id` int(11) NOT NULL,
  `pickup_location` varchar(255) DEFAULT NULL,
  `pickup_date` date DEFAULT NULL,
  `pickup_time` time DEFAULT NULL,
  `dropoff_date` date DEFAULT NULL,
  `dropoff_time` time DEFAULT NULL,
  `pickup_latitude` decimal(10,8) DEFAULT NULL,
  `pickup_longitude` decimal(10,8) DEFAULT NULL,
  `dropoff_latitude` decimal(10,8) DEFAULT NULL,
  `dropoff_longitude` decimal(10,8) DEFAULT NULL,
  `search_timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `car_booking_searches`
--

INSERT INTO `car_booking_searches` (`id`, `pickup_location`, `pickup_date`, `pickup_time`, `dropoff_date`, `dropoff_time`, `search_timestamp`) VALUES
(1, 'karachi', '2025-08-30', '09:00:00', '2025-08-31', '09:00:00', '2025-08-29 21:01:59'),
(2, 'Karachi', '2025-09-02', '09:00:00', '2025-09-03', '09:00:00', '2025-09-01 20:54:31'),
(3, 'karachi', '2025-09-09', '09:00:00', '2025-09-12', '09:00:00', '2025-09-09 17:50:27'),
(4, 'karachi', '2025-11-04', '09:00:00', '2025-11-07', '09:00:00', '2025-11-02 18:50:13'),
(5, 'karachi', '2025-11-04', '09:00:00', '2025-11-07', '09:00:00', '2025-11-02 18:50:13'),
(6, 'Moux, Narbonne, Aude, Occitania, Metropolitan France, 11700, France', '2025-11-10', '06:30:00', '2025-11-12', '09:00:00', '2025-11-09 12:39:58'),
(7, 'moroco', '2025-11-11', '09:00:00', '2025-11-13', '09:00:00', '2025-11-10 17:52:18'),
(8, 'Biblioteca Municipal de Santander, 4, Calle Gravina, Cabildo de Arriba, Santander, Cantabria, 39011, Spain', '2025-11-28', '12:00:00', '2025-11-30', '09:00:00', '2025-11-27 07:33:56'),
(9, 'Biblioteca Municipal de Santander, 4, Calle Gravina, Cabildo de Arriba, Santander, Cantabria, 39011, Spain', '2025-11-28', '12:00:00', '2025-11-30', '09:00:00', '2025-11-27 07:51:45');

-- --------------------------------------------------------

--
-- Table structure for table `car_categories`
--

CREATE TABLE `car_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `car_categories`
--

INSERT INTO `car_categories` (`id`, `name`, `description`, `created_at`) VALUES
(1, 'Economy', 'Budget-friendly cars for everyday use', '2025-08-28 17:06:26'),
(2, 'Compact', 'Small cars perfect for city driving', '2025-08-28 17:06:26'),
(3, 'Mid-size', 'Comfortable cars for medium trips', '2025-08-28 17:06:26'),
(4, 'Full-size', 'Spacious cars for longer journeys', '2025-08-28 17:06:26'),
(5, 'Premium', 'Luxury vehicles for special occasions', '2025-08-28 17:06:26'),
(6, 'SUV', 'Sport utility vehicles for all terrains', '2025-08-28 17:06:26'),
(7, 'Van', 'Large vehicles for group transportation', '2025-08-28 17:06:26'),
(8, 'Convertible', 'Open-top cars for scenic drives', '2025-08-28 17:06:26');

-- --------------------------------------------------------

--
-- Table structure for table `car_features`
--

CREATE TABLE `car_features` (
  `id` int(11) NOT NULL,
  `car_id` int(11) DEFAULT NULL,
  `feature_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `chat_attachments`
--

CREATE TABLE `chat_attachments` (
  `attachment_id` int(11) NOT NULL,
  `message_id` int(11) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_type` varchar(100) NOT NULL,
  `file_size` int(11) NOT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `chat_conversations`
--

CREATE TABLE `chat_conversations` (
  `conversation_id` int(11) NOT NULL,
  `title` varchar(200) DEFAULT NULL,
  `type` enum('direct','support','group') NOT NULL DEFAULT 'direct',
  `status` enum('active','archived','blocked') DEFAULT 'active',
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `last_message_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `chat_conversations`
--

INSERT INTO `chat_conversations` (`conversation_id`, `title`, `type`, `status`, `created_by`, `created_at`, `updated_at`, `last_message_at`) VALUES
(1, 'General Support', 'support', 'active', 1, '2025-08-25 13:14:22', '2025-08-25 13:14:22', NULL),
(2, NULL, 'direct', 'active', 3, '2025-08-25 13:57:41', '2025-08-25 14:03:05', '2025-08-25 14:03:05'),
(4, NULL, 'support', 'active', 1, '2025-11-24 09:15:11', '2025-11-24 09:15:11', '2025-11-24 09:15:11'),
(5, 'Booking #42', 'direct', 'active', 1, '2025-11-28 06:45:12', '2025-11-28 06:45:12', NULL),
(6, 'Booking #42', 'direct', 'active', 1, '2025-11-28 06:46:43', '2025-11-28 06:46:43', NULL),
(7, 'Booking #43', 'direct', 'active', 1, '2025-11-28 12:40:11', '2025-11-28 12:40:18', '2025-11-28 12:40:18'),
(8, 'Booking #43', 'direct', 'active', 1, '2025-11-28 12:59:05', '2025-11-28 12:59:15', '2025-11-28 12:59:15'),
(9, 'Booking #43', 'direct', 'active', 1, '2025-11-28 20:08:23', '2025-11-28 20:08:23', NULL),
(10, 'Booking #43', 'direct', 'active', 1, '2025-11-28 20:08:36', '2025-11-28 20:08:36', NULL),
(11, 'Booking #43', 'direct', 'active', 1, '2025-11-28 20:41:37', '2025-11-28 20:41:37', NULL),
(12, 'Booking #41', 'direct', 'active', 1, '2025-11-29 15:03:28', '2025-11-29 15:03:28', NULL),
(13, 'Booking #41', 'direct', 'active', 1, '2025-11-29 15:05:12', '2025-11-29 15:05:12', NULL),
(14, 'Booking #39', 'direct', 'active', 1, '2025-11-29 15:18:12', '2025-11-29 15:18:12', NULL),
(15, 'Booking #40', 'direct', 'active', 1, '2025-11-29 15:20:46', '2025-11-29 15:20:46', NULL),
(16, 'Booking #40', 'direct', 'active', 1, '2025-11-29 15:26:44', '2025-11-29 15:26:44', NULL),
(17, 'Booking #40', 'direct', 'active', 1, '2025-11-29 15:27:35', '2025-11-29 15:27:35', NULL),
(18, 'Booking #40', 'direct', 'active', 1, '2025-11-29 15:31:21', '2025-11-29 15:31:21', NULL),
(19, 'Booking #41', 'direct', 'active', 1, '2025-11-29 15:32:44', '2025-11-29 15:32:44', NULL),
(20, 'Booking #41', 'direct', 'active', 1, '2025-11-29 15:37:00', '2025-11-29 15:46:25', '2025-11-29 15:46:25'),
(21, 'Booking #41', 'direct', 'active', 1, '2025-11-29 15:48:08', '2025-11-29 15:48:08', NULL),
(22, 'Booking #41', 'direct', 'active', 1, '2025-11-29 15:51:28', '2025-11-29 15:51:35', '2025-11-29 15:51:35');

-- --------------------------------------------------------

--
-- Table structure for table `chat_messages`
--

CREATE TABLE `chat_messages` (
  `message_id` int(11) NOT NULL,
  `conversation_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `message_text` text NOT NULL,
  `message_type` enum('text','image','file','system','reservation_link') DEFAULT 'text',
  `file_url` varchar(500) DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `file_size` int(11) DEFAULT NULL,
  `reply_to_message_id` int(11) DEFAULT NULL,
  `is_edited` tinyint(1) DEFAULT 0,
  `is_deleted` tinyint(1) DEFAULT 0,
  `reservation_id` int(11) DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `chat_messages`
--

INSERT INTO `chat_messages` (`message_id`, `conversation_id`, `sender_id`, `message_text`, `message_type`, `file_url`, `file_name`, `file_size`, `reply_to_message_id`, `is_edited`, `is_deleted`, `reservation_id`, `metadata`, `created_at`, `updated_at`) VALUES
(1, 2, 3, 'Hi', 'text', NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, '2025-08-25 13:58:19', '2025-08-25 13:58:19'),
(2, 2, 3, 'How are you', 'text', NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, '2025-08-25 13:58:24', '2025-08-25 13:58:24'),
(3, 2, 1, 'i am fine you tell me', 'text', NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, '2025-08-25 14:03:05', '2025-08-25 14:03:05'),
(4, 4, 1, 'Re: Booking #43 - bilal', 'text', NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, '2025-11-24 09:15:11', '2025-11-24 09:15:11'),
(5, 7, 1, 'hi', 'text', NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, '2025-11-28 12:40:18', '2025-11-28 12:40:18'),
(6, 8, 1, 'hello dear', 'text', NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, '2025-11-28 12:59:15', '2025-11-28 12:59:15'),
(7, 20, 1, 'Assalam u alaikum', 'text', NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, '2025-11-29 15:37:27', '2025-11-29 15:37:27'),
(8, 20, 1, 'We are reviewing your request and will reply shortly.', 'text', NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, '2025-11-29 15:37:41', '2025-11-29 15:37:41'),
(9, 20, 1, 'How are you sir?', 'text', NULL, NULL, NULL, 8, 0, 0, NULL, NULL, '2025-11-29 15:42:00', '2025-11-29 15:42:00'),
(10, 20, 140, 'yes sir we have received your messages.', 'text', NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, '2025-11-29 15:46:25', '2025-11-29 15:46:25'),
(11, 22, 1, 'hi', 'text', NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, '2025-11-29 15:51:35', '2025-11-29 15:51:35');

-- --------------------------------------------------------

--
-- Table structure for table `chat_message_reads`
--

CREATE TABLE `chat_message_reads` (
  `message_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `read_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `chat_message_reads`
--

INSERT INTO `chat_message_reads` (`message_id`, `user_id`, `read_at`) VALUES
(1, 1, '2025-08-25 14:00:09'),
(2, 1, '2025-08-25 14:00:09'),
(3, 3, '2025-08-30 02:00:33'),
(7, 140, '2025-11-29 15:45:49'),
(8, 140, '2025-11-29 15:45:49'),
(9, 140, '2025-11-29 15:45:49'),
(10, 1, '2025-11-29 15:48:14'),
(11, 140, '2025-11-29 15:52:00');

-- --------------------------------------------------------

--
-- Table structure for table `chat_participants`
--

CREATE TABLE `chat_participants` (
  `conversation_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `role` enum('member','admin','moderator') DEFAULT 'member',
  `joined_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `left_at` timestamp NULL DEFAULT NULL,
  `last_read_at` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `chat_participants`
--

INSERT INTO `chat_participants` (`conversation_id`, `user_id`, `role`, `joined_at`, `left_at`, `last_read_at`, `is_active`) VALUES
(1, 1, 'admin', '2025-08-25 13:14:22', NULL, NULL, 1),
(2, 1, 'member', '2025-08-25 13:57:41', NULL, '2025-08-25 14:00:09', 1),
(2, 3, 'admin', '2025-08-25 13:57:41', NULL, '2025-08-30 02:00:33', 1),
(4, 1, 'admin', '2025-11-24 09:15:11', NULL, NULL, 1),
(5, 1, 'admin', '2025-11-28 06:45:12', NULL, NULL, 1),
(5, 139, 'member', '2025-11-28 06:45:12', NULL, NULL, 1),
(6, 1, 'admin', '2025-11-28 06:46:43', NULL, NULL, 1),
(6, 132, 'member', '2025-11-28 06:46:43', NULL, NULL, 1),
(7, 1, 'admin', '2025-11-28 12:40:11', NULL, NULL, 1),
(7, 145, 'member', '2025-11-28 12:40:11', NULL, NULL, 1),
(8, 1, 'admin', '2025-11-28 12:59:05', NULL, NULL, 1),
(8, 3, 'member', '2025-11-28 12:59:05', NULL, NULL, 1),
(9, 1, 'admin', '2025-11-28 20:08:23', NULL, NULL, 1),
(9, 139, 'member', '2025-11-28 20:08:23', NULL, NULL, 1),
(10, 1, 'admin', '2025-11-28 20:08:36', NULL, NULL, 1),
(10, 139, 'member', '2025-11-28 20:08:36', NULL, NULL, 1),
(11, 1, 'admin', '2025-11-28 20:41:37', NULL, NULL, 1),
(11, 119, 'member', '2025-11-28 20:41:37', NULL, NULL, 1),
(12, 1, 'admin', '2025-11-29 15:03:28', NULL, NULL, 1),
(12, 140, 'member', '2025-11-29 15:03:28', NULL, NULL, 1),
(13, 1, 'admin', '2025-11-29 15:05:12', NULL, NULL, 1),
(13, 140, 'member', '2025-11-29 15:05:12', NULL, NULL, 1),
(14, 1, 'admin', '2025-11-29 15:18:12', NULL, NULL, 1),
(14, 135, 'member', '2025-11-29 15:18:12', NULL, NULL, 1),
(15, 1, 'admin', '2025-11-29 15:20:46', NULL, NULL, 1),
(15, 135, 'member', '2025-11-29 15:20:46', NULL, NULL, 1),
(16, 1, 'admin', '2025-11-29 15:26:44', NULL, NULL, 1),
(16, 135, 'member', '2025-11-29 15:26:44', NULL, NULL, 1),
(17, 1, 'admin', '2025-11-29 15:27:35', NULL, NULL, 1),
(17, 135, 'member', '2025-11-29 15:27:35', NULL, NULL, 1),
(18, 1, 'admin', '2025-11-29 15:31:21', NULL, NULL, 1),
(18, 135, 'member', '2025-11-29 15:31:22', NULL, NULL, 1),
(19, 1, 'admin', '2025-11-29 15:32:44', NULL, NULL, 1),
(19, 140, 'member', '2025-11-29 15:32:44', NULL, NULL, 1),
(20, 1, 'admin', '2025-11-29 15:37:00', NULL, '2025-11-29 15:48:14', 1),
(20, 140, 'member', '2025-11-29 15:37:00', NULL, '2025-11-29 15:45:50', 1),
(21, 1, 'admin', '2025-11-29 15:48:08', NULL, NULL, 1),
(21, 140, 'member', '2025-11-29 15:48:08', NULL, NULL, 1),
(22, 1, 'admin', '2025-11-29 15:51:28', NULL, NULL, 1),
(22, 140, 'member', '2025-11-29 15:51:28', NULL, '2025-11-29 15:52:00', 1);

-- --------------------------------------------------------

--
-- Table structure for table `commission_records`
--

CREATE TABLE `commission_records` (
  `id` int(11) NOT NULL,
  `reservation_id` int(11) NOT NULL,
  `agency_id` int(11) NOT NULL,
  `gross_amount` decimal(10,2) NOT NULL,
  `commission_rate` decimal(5,2) NOT NULL,
  `commission_amount` decimal(10,2) NOT NULL,
  `processing_fee` decimal(10,2) NOT NULL DEFAULT 0.00,
  `net_agency_earnings` decimal(10,2) NOT NULL,
  `status` enum('pending','calculated','paid','disputed') DEFAULT 'pending',
  `payment_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `customer_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `driving_license_number` varchar(50) DEFAULT NULL,
  `driving_license_issue_date` date DEFAULT NULL,
  `driving_license_expiry_date` date DEFAULT NULL,
  `travel_preferences` text DEFAULT NULL,
  `emergency_contact_name` varchar(100) DEFAULT NULL,
  `emergency_contact_phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`customer_id`, `user_id`, `driving_license_number`, `driving_license_issue_date`, `driving_license_expiry_date`, `travel_preferences`, `emergency_contact_name`, `emergency_contact_phone`, `created_at`, `updated_at`) VALUES
(1, 102, '1234567987', NULL, NULL, NULL, NULL, NULL, '2025-08-25 07:01:05', '2025-08-25 07:01:05'),
(2, 103, '13456798', NULL, NULL, NULL, NULL, NULL, '2025-08-25 07:24:05', '2025-08-25 07:24:05'),
(3, 104, '123456789', NULL, NULL, NULL, NULL, NULL, '2025-08-25 07:32:09', '2025-08-25 07:32:09'),
(4, 105, '1234567897', NULL, NULL, NULL, NULL, NULL, '2025-08-25 07:38:28', '2025-08-25 07:38:28'),
(5, 108, '12345678979', NULL, NULL, NULL, NULL, NULL, '2025-08-26 00:39:41', '2025-08-26 00:39:41'),
(6, 110, '12345678979', NULL, NULL, NULL, NULL, NULL, '2025-08-26 00:45:16', '2025-08-26 00:45:16'),
(7, 112, '12345678979', NULL, NULL, NULL, NULL, NULL, '2025-08-26 00:49:15', '2025-08-26 00:49:15'),
(8, 113, '123456789', NULL, NULL, NULL, NULL, NULL, '2025-08-26 00:55:06', '2025-08-26 00:55:06'),
(9, 106, '123456789', NULL, NULL, NULL, NULL, NULL, '2025-08-26 22:52:38', '2025-08-26 22:52:38'),
(10, 118, '123456789', NULL, NULL, NULL, NULL, NULL, '2025-08-29 19:11:01', '2025-08-29 19:11:01'),
(11, 119, '123456789', NULL, NULL, NULL, NULL, NULL, '2025-08-29 19:18:07', '2025-08-29 19:18:07'),
(12, 121, '123456798', NULL, NULL, NULL, NULL, NULL, '2025-08-29 20:50:32', '2025-08-29 20:50:32'),
(13, 122, '123456879', NULL, NULL, NULL, NULL, NULL, '2025-08-29 21:04:27', '2025-08-29 21:04:27'),
(14, 3, '123456', NULL, NULL, NULL, NULL, NULL, '2025-08-30 01:13:35', '2025-08-30 01:13:35'),
(15, 125, '12346789', NULL, NULL, NULL, NULL, NULL, '2025-09-01 20:06:56', '2025-09-01 20:06:56'),
(16, 126, '123456789', NULL, NULL, NULL, NULL, NULL, '2025-09-01 23:32:14', '2025-09-01 23:32:14'),
(17, 128, '123123', NULL, NULL, NULL, NULL, NULL, '2025-09-09 17:42:36', '2025-09-09 17:42:36'),
(19, 135, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-02 18:57:47', '2025-11-02 18:57:47'),
(20, 140, '2324234233242342', NULL, NULL, NULL, NULL, NULL, '2025-11-10 19:09:26', '2025-11-10 19:09:26'),
(21, 1, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-14 02:51:27', '2025-11-14 02:51:27'),
(22, 141, '01202101230132', NULL, NULL, NULL, NULL, NULL, '2025-11-14 18:14:24', '2025-11-14 18:14:24');

-- --------------------------------------------------------

--
-- Table structure for table `email_logs`
--

CREATE TABLE `email_logs` (
  `id` int(11) NOT NULL,
  `to_email` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `template_key` varchar(100) DEFAULT NULL,
  `status` enum('queued','sent','failed') DEFAULT 'queued',
  `provider_message_id` varchar(255) DEFAULT NULL,
  `error_text` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `sent_at` timestamp NULL DEFAULT NULL,
  `retry_count` int(11) DEFAULT 0,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `email_logs`
--

INSERT INTO `email_logs` (`id`, `to_email`, `subject`, `template_key`, `status`, `provider_message_id`, `error_text`, `created_at`, `sent_at`, `retry_count`, `metadata`) VALUES
(1, 'shayanshaikh168@gmail.com', 'Welcome to KIRASTAY! Your account is ready 🚗', NULL, 'sent', '<ad974ec9-fae6-5ace-5037-84993edd34fc@gmail.com>', NULL, '2025-11-24 15:43:22', '2025-11-24 15:43:24', 0, '{\"hash\":\"047d70cc2d817fe9322e1af77b2234eb\"}'),
(2, 'smartestdevelopers@gmail.com', 'New User Registration - KIRASTAY', NULL, 'sent', '<4c899079-d61d-5715-436c-acc43f30e10d@gmail.com>', NULL, '2025-11-24 15:43:24', '2025-11-24 15:43:26', 0, '{\"hash\":\"681a1a6e9ee3b61cdb784799ad54a797\"}'),
(3, 'shayanshaikh168@gmail.com', 'Password Reset Request - KIRASTAY', NULL, 'sent', '<31bb8672-7579-d23c-30d4-8973e2ad12ef@gmail.com>', NULL, '2025-11-29 16:11:37', '2025-11-29 16:11:40', 0, '{\"hash\":\"082894826e13df6e8bcfe657c8329f32\"}'),
(4, 'smartestdevelopers@gmail.com', 'Password Reset Request - KIRASTAY Admin', NULL, 'sent', '<e5679ac8-d4ab-c50d-378e-12b5c811a8bc@gmail.com>', NULL, '2025-11-29 16:11:40', '2025-11-29 16:11:42', 0, '{\"hash\":\"05e95c18b998393b323e66b9419574f0\"}'),
(5, 'shayanshaikh168@gmail.com', 'We received your message — KIRASTAY', NULL, 'sent', '<0a615dd3-2537-e0e8-55fa-3e511e45fb74@gmail.com>', NULL, '2025-11-30 13:59:11', '2025-11-30 13:59:14', 0, '{\"hash\":\"2581fd02590dee2aacb35d66ff3c931b\"}'),
(6, 'smartestdevelopers@gmail.com', 'New contact message — KIRASTAY', NULL, 'sent', '<07161b2b-f845-5f94-ca9b-4bca57fda562@gmail.com>', NULL, '2025-11-30 13:59:14', '2025-11-30 13:59:16', 0, '{\"hash\":\"5b91f382800ac44f991ff5d048f3e8f2\"}'),
(7, 'shayanshaikh168@gmail.com', 'We received your message — KIRASTAY', NULL, 'sent', '<025149e4-fe40-a1a6-f511-881fb406a14e@gmail.com>', NULL, '2025-11-30 14:12:34', '2025-11-30 14:12:36', 0, '{\"hash\":\"8b646b7d661fe70b26f0aedcec71fbcc\"}'),
(8, 'smartestdevelopers@gmail.com', 'New contact message — KIRASTAY', NULL, 'sent', '<55d7a73a-8b01-ba48-f195-a9d3d1c77376@gmail.com>', NULL, '2025-11-30 14:12:36', '2025-11-30 14:12:39', 0, '{\"hash\":\"6d3ca57f331dda4f61c741797f17bafe\"}');

-- --------------------------------------------------------

--
-- Table structure for table `email_queue`
--

CREATE TABLE `email_queue` (
  `id` int(11) NOT NULL,
  `to_email` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `html` mediumtext DEFAULT NULL,
  `text` text DEFAULT NULL,
  `template_key` varchar(100) DEFAULT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`payload`)),
  `status` enum('queued','processing','sent','failed') DEFAULT 'queued',
  `attempts` int(11) DEFAULT 0,
  `scheduled_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_error` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `email_rate_limits`
--

CREATE TABLE `email_rate_limits` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `template_key` varchar(100) NOT NULL,
  `window_start` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `count` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `email_rate_limits`
--

INSERT INTO `email_rate_limits` (`id`, `email`, `template_key`, `window_start`, `count`) VALUES
(1, 'shayanshaikh168@gmail.com', '', '2025-11-24 15:00:00', 1),
(2, 'smartestdevelopers@gmail.com', '', '2025-11-24 15:00:00', 1),
(3, 'shayanshaikh168@gmail.com', '', '2025-11-29 16:00:00', 1),
(4, 'smartestdevelopers@gmail.com', '', '2025-11-29 16:00:00', 1),
(5, 'shayanshaikh168@gmail.com', '', '2025-11-30 13:00:00', 1),
(6, 'smartestdevelopers@gmail.com', '', '2025-11-30 13:00:00', 1),
(7, 'shayanshaikh168@gmail.com', '', '2025-11-30 14:00:00', 1),
(8, 'smartestdevelopers@gmail.com', '', '2025-11-30 14:00:00', 1);

-- --------------------------------------------------------

--
-- Table structure for table `email_templates`
--

CREATE TABLE `email_templates` (
  `id` int(11) NOT NULL,
  `template_key` varchar(100) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `html` mediumtext NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `email_unsubscribes`
--

CREATE TABLE `email_unsubscribes` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `extras`
--

CREATE TABLE `extras` (
  `extra_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `price_type` enum('per_day','per_rental','per_item') DEFAULT 'per_day',
  `category` enum('insurance','equipment','service','other') DEFAULT 'other',
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `extras`
--

INSERT INTO `extras` (`extra_id`, `name`, `description`, `price`, `price_type`, `category`, `status`, `created_at`) VALUES
(1, 'GPS Navigation', 'Satellite navigation system', '5.00', 'per_day', 'equipment', 'active', '2025-08-22 22:14:48'),
(2, 'Child Safety Seat', 'Safety seat for children', '8.00', 'per_day', 'equipment', 'active', '2025-08-22 22:14:48'),
(3, 'Additional Driver', 'Allow additional driver', '15.00', 'per_rental', 'service', 'active', '2025-08-22 22:14:48'),
(4, 'Comprehensive Insurance', 'Full coverage insurance', '12.00', 'per_day', 'insurance', 'active', '2025-08-22 22:14:48'),
(5, 'Roadside Assistance', '24/7 roadside assistance', '6.00', 'per_day', 'service', 'active', '2025-08-22 22:14:48'),
(6, 'WiFi Hotspot', 'Mobile internet connection', '4.00', 'per_day', 'equipment', 'active', '2025-08-22 22:14:48');

-- --------------------------------------------------------

--
-- Table structure for table `finance_reports_cache`
--

CREATE TABLE `finance_reports_cache` (
  `id` int(11) NOT NULL,
  `report_type` varchar(100) NOT NULL,
  `agency_id` int(11) DEFAULT NULL,
  `date_from` date NOT NULL,
  `date_to` date NOT NULL,
  `filters_hash` varchar(32) NOT NULL,
  `report_data` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `expires_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `login_attempts`
--

CREATE TABLE `login_attempts` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `ip` varchar(64) NOT NULL,
  `success` tinyint(1) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `login_attempts`
--

INSERT INTO `login_attempts` (`id`, `email`, `ip`, `success`, `created_at`) VALUES
(1, 'smartestdevelopers@gmail.com', '::1', 0, '2025-11-28 06:25:16'),
(2, 'smartestdevelopers@gmail.com', '::1', 1, '2025-11-28 06:25:47'),
(3, 'smartestdevelopers@gmail.com', '::1', 1, '2025-11-28 20:07:38'),
(4, 'smartestdevelopers@gmail.com', '::1', 1, '2025-11-29 15:02:43'),
(5, 'khizar@gmail.com', '::1', 1, '2025-11-29 15:45:33'),
(6, 'smartestdevelopers@gmail.com', '::1', 1, '2025-11-29 15:46:54'),
(7, 'khizar@gmail.com', '::1', 1, '2025-11-29 15:51:53'),
(8, 'smartestdevelopers@gmail.com', '::1', 1, '2025-11-29 15:53:10'),
(9, 'khizar@gmail.com', '::1', 1, '2025-11-29 15:57:03'),
(10, 'admin@gmail.com', '::1', 0, '2025-11-29 15:58:23'),
(11, 'admin@gmail.com', '::1', 1, '2025-11-29 15:58:32'),
(12, 'shayanshaikh168@gmail.com', '::1', 1, '2025-11-29 16:06:32'),
(13, 'smartestdevelopers@gmail.com', '::1', 1, '2025-11-29 16:06:56'),
(14, 'shayanshaikh168@gmail.com', '::1', 1, '2025-11-29 16:13:20');

-- --------------------------------------------------------

--
-- Table structure for table `newsletter_subscribers`
--

CREATE TABLE `newsletter_subscribers` (
  `id` int(11) NOT NULL,
  `email` varchar(150) NOT NULL,
  `subscribed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('active','unsubscribed') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `newsletter_subscribers`
--

INSERT INTO `newsletter_subscribers` (`id`, `email`, `subscribed_at`, `status`, `created_at`, `updated_at`) VALUES
(1, 'user9@user9.com', '2025-08-25 07:02:34', 'active', '2025-08-25 07:02:34', '2025-08-25 07:02:34'),
(2, 'user10@user10.com', '2025-08-25 07:24:05', 'active', '2025-08-25 07:24:05', '2025-08-25 07:24:05'),
(3, 'user12@user12.com', '2025-08-25 07:32:09', 'active', '2025-08-25 07:32:09', '2025-08-25 07:32:09'),
(4, 'user19@user19.com', '2025-08-25 07:38:28', 'active', '2025-08-25 07:38:28', '2025-08-25 07:38:28'),
(5, 'hr1@smartestdevelopers.com', '2025-08-26 00:39:41', 'active', '2025-08-26 00:39:41', '2025-08-26 00:39:41'),
(6, 'hr3@smartestdevelopers.com', '2025-08-26 00:49:15', 'active', '2025-08-26 00:49:16', '2025-08-26 00:49:16'),
(7, 'hr@smartestdevelopers.com', '2025-08-26 00:55:06', 'active', '2025-08-26 00:55:06', '2025-08-26 00:55:06'),
(8, 'mantaqiilmi@gmail.com', '2025-08-26 22:52:39', 'active', '2025-08-26 22:52:39', '2025-08-26 22:52:39'),
(9, 'hr29@smartestdevelopers.com', '2025-08-29 20:50:32', 'active', '2025-08-29 20:50:32', '2025-08-29 20:50:32'),
(10, 'hr291@smartestdevelopers.com', '2025-08-29 17:50:37', 'active', '2025-08-29 21:04:27', '2025-08-29 22:50:37'),
(15, 'agency@kirastay.com', '2025-08-29 20:13:35', 'active', '2025-08-30 01:13:35', '2025-08-30 01:13:35'),
(16, 'hr310@smartestdevelopers.com', '2025-09-01 18:07:44', 'active', '2025-09-01 20:06:56', '2025-09-01 23:07:44'),
(23, 'hr301@smartestdevelopers.com', '2025-09-01 19:06:24', 'active', '2025-09-01 23:32:14', '2025-09-02 00:06:24'),
(27, 'sageattarfayyaz@gmail.com', '2025-09-02 14:47:01', 'active', '2025-09-02 19:35:42', '2025-09-02 19:47:01'),
(29, 'agency1@kirastay.com', '2025-09-09 17:56:04', 'active', '2025-09-09 17:42:37', '2025-09-09 17:56:04'),
(32, 'shayanshaikh168@gmail.com', '2025-11-02 14:03:21', 'active', '2025-11-02 14:03:12', '2025-11-02 14:03:21'),
(34, 'admin@gmail.com', '2025-11-06 18:46:54', 'active', '2025-11-02 18:57:47', '2025-11-06 18:46:54'),
(36, 'khizar@gmail.com', '2025-11-10 19:09:26', 'active', '2025-11-10 19:09:26', '2025-11-10 19:09:26'),
(37, 'smartestdevelopers@gmail.com', '2025-11-14 02:51:27', 'active', '2025-11-14 02:51:27', '2025-11-14 02:51:27'),
(38, 'Basit1@gmail.com', '2025-11-14 18:14:24', 'active', '2025-11-14 18:14:24', '2025-11-14 18:14:24');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` enum('booking','payment','review','system','promotion') NOT NULL,
  `title` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data`)),
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`notification_id`, `user_id`, `type`, `title`, `message`, `data`, `is_read`, `created_at`) VALUES
(1, 1, 'booking', 'New Reservation Received', 'A new reservation has been made for Toyota Corolla by John Smith', '{\"reservation_id\":2,\"vehicle\":\"Toyota Corolla\",\"customer\":\"John Smith\"}', 1, '2025-09-18 17:57:22'),
(2, 1, '', 'New Agency Registration', 'Morocco Premium Rentals has applied for partnership approval', '{\"agency_name\":\"Morocco Premium Rentals\",\"status\":\"pending\"}', 1, '2025-09-18 10:22:40'),
(3, 1, 'payment', 'Payment Processed', 'Payment of $350 has been successfully processed for reservation #R2025001', '{\"amount\":350,\"reservation_id\":\"R2025001\"}', 1, '2025-09-18 15:54:21'),
(4, 1, 'system', 'System Update', 'System maintenance completed successfully. All services are now operational', '{\"maintenance_type\":\"routine\",\"duration\":\"2 hours\"}', 1, '2025-09-18 17:31:51'),
(5, 1, 'review', 'New Customer Review', 'Customer left a 5-star review for BMW X3 rental experience', '{\"rating\":5,\"vehicle\":\"BMW X3\",\"customer\":\"Sarah Johnson\"}', 1, '2025-09-18 21:30:13'),
(6, 3, 'booking', 'New Booking Request', 'New booking request received for your Honda City vehicle', '{\"vehicle\":\"Honda City\",\"dates\":\"2025-01-25 to 2025-01-27\"}', 0, '2025-09-18 23:23:09'),
(7, 3, 'payment', 'Payment Received', 'Payment of $120 received for booking confirmation', '{\"amount\":120,\"booking_id\":\"B2025001\"}', 0, '2025-09-19 01:58:13'),
(8, 3, 'system', 'Profile Verification', 'Your agency profile has been verified and approved', '{\"status\":\"approved\",\"verification_date\":\"2025-09-19T07:07:50.135Z\"}', 0, '2025-09-18 14:30:24');

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `used` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `payment_id` int(11) NOT NULL,
  `reservation_id` int(11) NOT NULL,
  `payment_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(3) DEFAULT 'USD',
  `processing_fee` decimal(10,2) DEFAULT 0.00,
  `net_amount` decimal(10,2) GENERATED ALWAYS AS (`amount` - `processing_fee`) STORED,
  `payment_type` enum('deposit','full','balance','refund','commission') NOT NULL,
  `method` enum('credit_card','debit_card','stripe','paypal','bank_transfer','cash') NOT NULL,
  `status` enum('pending','authorized','captured','failed','cancelled','refunded') DEFAULT 'pending',
  `authorized_at` timestamp NULL DEFAULT NULL,
  `captured_at` timestamp NULL DEFAULT NULL,
  `failed_reason` text DEFAULT NULL,
  `refunded_at` timestamp NULL DEFAULT NULL,
  `refund_reason` text DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `payment_intent_id` varchar(255) DEFAULT NULL,
  `gateway_response` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `processed_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `pickup_locations`
--

CREATE TABLE `pickup_locations` (
  `location_id` int(11) NOT NULL,
  `agency_id` int(11) NOT NULL,
  `location_name` varchar(150) NOT NULL,
  `type` enum('agency','airport','train_station','bus_station','city_center','hotel') NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `operating_hours` varchar(255) DEFAULT NULL,
  `contact_phone` varchar(20) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `pickup_locations`
--

INSERT INTO `pickup_locations` (`location_id`, `agency_id`, `location_name`, `type`, `address`, `city`, `state`, `country`, `postal_code`, `latitude`, `longitude`, `operating_hours`, `contact_phone`, `status`, `created_at`) VALUES
(1, 2, 'Default Agency Location', 'agency', 'address Line 1', 'Karachi', NULL, 'Pakistan', NULL, NULL, NULL, NULL, NULL, 'active', '2025-08-25 07:01:05');

-- --------------------------------------------------------

--
-- Table structure for table `reservations`
--

CREATE TABLE `reservations` (
  `reservation_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `agency_id` int(11) NOT NULL,
  `vehicle_id` int(11) NOT NULL,
  `pickup_location_id` int(11) NOT NULL,
  `dropoff_location_id` int(11) DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `pickup_time` time DEFAULT NULL,
  `dropoff_time` time DEFAULT NULL,
  `pickup_latitude` decimal(10,8) DEFAULT NULL,
  `pickup_longitude` decimal(10,8) DEFAULT NULL,
  `dropoff_latitude` decimal(10,8) DEFAULT NULL,
  `dropoff_longitude` decimal(10,8) DEFAULT NULL,
  `status` enum('pending','confirmed','active','completed','canceled','no_show') DEFAULT 'pending',
  `cancellation_reason` text DEFAULT NULL,
  `cancellation_deadline` datetime DEFAULT NULL,
  `total_days` int(11) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `extras_total` decimal(10,2) DEFAULT 0.00,
  `tax_amount` decimal(10,2) DEFAULT 0.00,
  `total_price` decimal(10,2) NOT NULL,
  `deposit_paid` decimal(10,2) DEFAULT 0.00,
  `amount_paid` decimal(10,2) DEFAULT 0.00,
  `payment_status` enum('pending','partial','paid','refunded') DEFAULT 'pending',
  `payment_type` enum('deposit','full') DEFAULT 'deposit',
  `deposit_amount` decimal(10,2) DEFAULT 0.00,
  `balance_due` decimal(10,2) DEFAULT 0.00,
  `commission_rate` decimal(5,2) DEFAULT 12.50,
  `platform_commission` decimal(10,2) DEFAULT 0.00,
  `agency_earnings` decimal(10,2) DEFAULT 0.00,
  `refund_amount` decimal(10,2) DEFAULT 0.00,
  `special_requests` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `reservations`
--

INSERT INTO `reservations` (`reservation_id`, `customer_id`, `agency_id`, `vehicle_id`, `pickup_location_id`, `dropoff_location_id`, `start_date`, `end_date`, `pickup_time`, `dropoff_time`, `status`, `cancellation_reason`, `cancellation_deadline`, `total_days`, `subtotal`, `extras_total`, `tax_amount`, `total_price`, `deposit_paid`, `amount_paid`, `payment_status`, `payment_type`, `deposit_amount`, `balance_due`, `commission_rate`, `platform_commission`, `agency_earnings`, `refund_amount`, `special_requests`, `created_at`, `updated_at`) VALUES
(2, 1, 2, 7, 1, 1, '2025-08-25', '2025-08-26', '09:00:00', '09:00:00', 'pending', NULL, NULL, 1, '60.00', '10.00', '8.40', '78.40', '0.00', '0.00', 'paid', 'deposit', '0.00', '0.00', '12.50', '0.00', '0.00', '0.00', 'Special Request', '2025-08-25 07:01:05', '2025-09-01 23:06:05'),
(3, 1, 2, 7, 1, 1, '2025-08-25', '2025-08-26', '09:00:00', '09:00:00', 'pending', NULL, NULL, 1, '60.00', '10.00', '8.40', '78.40', '0.00', '0.00', 'pending', 'deposit', '0.00', '0.00', '12.50', '0.00', '0.00', '0.00', 'Special Request', '2025-08-25 07:02:34', '2025-08-25 07:02:34'),
(4, 2, 2, 8, 1, 1, '2025-08-25', '2025-08-26', '09:00:00', '09:00:00', 'pending', NULL, NULL, 1, '70.00', '15.00', '10.20', '95.20', '0.00', '0.00', 'pending', 'deposit', '0.00', '0.00', '12.50', '0.00', '0.00', '0.00', 'Any specialst Request', '2025-08-25 07:24:05', '2025-08-25 07:24:05'),
(5, 3, 2, 9, 1, 1, '2025-08-25', '2025-08-26', '09:00:00', '09:00:00', 'pending', NULL, NULL, 1, '120.00', '15.00', '19.08', '178.08', '0.00', '0.00', 'pending', 'deposit', '0.00', '0.00', '12.50', '0.00', '0.00', '0.00', 'asdf dsf asdfs fasd fasdf sd fasdf ', '2025-08-25 07:32:09', '2025-08-25 07:32:09'),
(6, 4, 2, 9, 1, 1, '2025-08-25', '2025-08-26', '09:00:00', '09:00:00', 'pending', NULL, NULL, 1, '120.00', '15.00', '19.08', '178.08', '0.00', '0.00', 'pending', 'deposit', '0.00', '0.00', '12.50', '0.00', '0.00', '0.00', 'special requests special requests special requests special requests ', '2025-08-25 07:38:28', '2025-08-25 07:38:28'),
(7, 5, 2, 10, 1, 1, '2025-08-26', '2025-08-27', '09:00:00', '09:00:00', 'pending', NULL, NULL, 1, '190.00', '15.00', '24.60', '229.60', '0.00', '0.00', 'pending', 'deposit', '0.00', '0.00', '12.50', '0.00', '0.00', '0.00', 'testing special request', '2025-08-26 00:39:41', '2025-08-26 00:39:41'),
(8, 7, 2, 10, 1, 1, '2025-08-26', '2025-08-27', '09:00:00', '09:00:00', 'pending', NULL, NULL, 1, '190.00', '15.00', '24.60', '229.60', '0.00', '0.00', 'pending', 'deposit', '0.00', '0.00', '12.50', '0.00', '0.00', '0.00', 'testing special request', '2025-08-26 00:49:15', '2025-08-26 00:49:15'),
(9, 8, 2, 11, 1, 1, '2025-08-26', '2025-08-27', '09:00:00', '09:00:00', 'pending', NULL, NULL, 1, '45.00', '0.00', '5.40', '50.40', '0.00', '0.00', 'pending', 'deposit', '0.00', '0.00', '12.50', '0.00', '0.00', '0.00', NULL, '2025-08-26 00:55:06', '2025-08-26 00:55:06'),
(10, 9, 2, 7, 1, 1, '2025-08-27', '2025-08-29', '09:00:00', '09:00:00', 'pending', NULL, NULL, 2, '120.00', '30.00', '18.00', '168.00', '0.00', '0.00', 'pending', 'deposit', '0.00', '0.00', '12.50', '0.00', '0.00', '0.00', 'Special Request', '2025-08-26 22:52:38', '2025-08-26 22:52:38'),
(11, 12, 1, 1, 1, 1, '2025-08-30', '2025-08-31', '09:00:00', '09:00:00', 'pending', NULL, NULL, 1, '150.00', '15.00', '19.80', '184.80', '0.00', '0.00', 'pending', 'deposit', '0.00', '0.00', '12.50', '0.00', '0.00', '0.00', 'Testomg Special Request', '2025-08-29 20:50:32', '2025-08-29 20:50:32'),
(12, 13, 1, 1, 1, 1, '2025-08-30', '2025-08-31', '09:00:00', '09:00:00', 'pending', NULL, NULL, 1, '150.00', '15.00', '19.80', '184.80', '0.00', '0.00', 'pending', 'deposit', '0.00', '0.00', '12.50', '0.00', '0.00', '0.00', 'special requestion', '2025-08-29 21:04:27', '2025-08-29 21:04:27'),
(13, 13, 1, 1, 1, 1, '2025-08-30', '2025-08-31', '09:00:00', '09:00:00', 'pending', NULL, NULL, 1, '150.00', '15.00', '19.80', '184.80', '0.00', '0.00', 'pending', 'deposit', '0.00', '0.00', '12.50', '0.00', '0.00', '0.00', 'Testing Request Special', '2025-08-29 21:42:54', '2025-08-29 21:42:54'),
(14, 13, 1, 1, 1, 1, '2025-08-30', '2025-08-31', '09:00:00', '09:00:00', 'pending', NULL, NULL, 1, '150.00', '15.00', '19.80', '184.80', '0.00', '0.00', 'pending', 'deposit', '0.00', '0.00', '12.50', '0.00', '0.00', '0.00', 'Any Special Request', '2025-08-29 21:53:38', '2025-08-29 21:53:38'),
(15, 13, 1, 1, 1, 1, '2025-08-30', '2025-08-31', '09:00:00', '09:00:00', 'pending', NULL, NULL, 1, '150.00', '15.00', '19.80', '184.80', '0.00', '0.00', 'pending', 'deposit', '0.00', '0.00', '12.50', '0.00', '0.00', '0.00', 'Special Request', '2025-08-29 22:34:06', '2025-08-29 22:34:06'),
(16, 13, 1, 3, 1, 1, '2025-08-30', '2025-08-31', '09:00:00', '09:00:00', 'pending', NULL, NULL, 1, '150.00', '15.00', '19.80', '184.80', '0.00', '0.00', 'pending', 'deposit', '0.00', '0.00', '12.50', '0.00', '0.00', '0.00', NULL, '2025-08-29 22:50:37', '2025-08-29 22:50:37'),
(17, 1, 3, 13, 1, 1, '2024-01-15', '2024-01-18', '10:00:00', '18:00:00', 'confirmed', NULL, NULL, 3, '30.00', '0.00', '0.00', '35.00', '0.00', '0.00', 'pending', 'deposit', '0.00', '0.00', '12.50', '0.00', '0.00', '0.00', NULL, '2025-08-29 23:58:33', '2025-08-29 23:58:33'),
(18, 2, 3, 13, 1, 1, '2024-02-01', '2024-02-05', '09:00:00', '17:00:00', 'active', NULL, NULL, 4, '40.00', '0.00', '0.00', '45.00', '0.00', '0.00', 'pending', 'deposit', '0.00', '0.00', '12.50', '0.00', '0.00', '0.00', NULL, '2025-08-29 23:58:40', '2025-08-30 01:49:54'),
(19, 1, 3, 13, 1, 1, '2024-01-01', '2024-01-03', '10:00:00', '18:00:00', 'completed', NULL, NULL, 2, '20.00', '0.00', '0.00', '25.00', '0.00', '0.00', 'pending', 'deposit', '0.00', '0.00', '12.50', '0.00', '0.00', '0.00', NULL, '2025-08-29 23:58:40', '2025-08-29 23:58:40'),
(20, 14, 1, 1, 1, 1, '2025-08-30', '2025-08-31', '09:00:00', '09:00:00', 'pending', NULL, NULL, 1, '150.00', '15.00', '19.80', '184.80', '0.00', '0.00', 'pending', 'deposit', '0.00', '0.00', '12.50', '0.00', '0.00', '0.00', 'testing Special Request', '2025-08-30 01:13:35', '2025-08-30 01:13:35'),
(21, 15, 1, 1, 1, 1, '2025-09-02', '2025-09-03', '09:00:00', '09:00:00', 'pending', NULL, NULL, 1, '100.00', '15.00', '13.80', '128.80', '0.00', '0.00', 'pending', 'deposit', '0.00', '0.00', '12.50', '0.00', '0.00', '0.00', 'testing ', '2025-09-01 20:06:56', '2025-09-01 20:06:56'),
(22, 15, 1, 1, 1, 1, '2025-09-02', '2025-09-03', '09:00:00', '09:00:00', 'pending', NULL, NULL, 1, '100.00', '15.00', '13.80', '128.80', '0.00', '0.00', 'pending', 'deposit', '0.00', '0.00', '12.50', '0.00', '0.00', '0.00', 'testing ', '2025-09-01 20:46:26', '2025-09-01 20:46:26'),
(23, 15, 1, 1, 1, 1, '2025-09-02', '2025-09-03', '09:00:00', '09:00:00', 'pending', NULL, NULL, 1, '100.00', '15.00', '13.80', '128.80', '0.00', '0.00', 'pending', 'deposit', '0.00', '0.00', '12.50', '0.00', '0.00', '0.00', 'testing ', '2025-09-01 20:55:43', '2025-09-01 20:55:43'),
(24, 15, 1, 1, 1, 1, '2025-09-02', '2025-09-03', '09:00:00', '09:00:00', 'pending', NULL, NULL, 1, '100.00', '15.00', '13.80', '128.80', '0.00', '0.00', 'pending', 'deposit', '0.00', '0.00', '12.50', '0.00', '0.00', '0.00', 'testing message', '2025-09-01 22:09:25', '2025-09-01 22:09:25'),
(25, 15, 1, 6, 1, 1, '2025-09-02', '2025-09-03', '09:00:00', '09:00:00', 'pending', NULL, NULL, 1, '100.00', '15.00', '13.80', '128.80', '0.00', '0.00', 'pending', 'deposit', '0.00', '0.00', '12.50', '0.00', '0.00', '0.00', 'testing message', '2025-09-01 22:39:52', '2025-09-01 22:39:52'),
(26, 15, 1, 1, 1, 1, '2025-09-02', '2025-09-03', '09:00:00', '09:00:00', 'pending', NULL, NULL, 1, '100.00', '23.00', '14.76', '137.76', '0.00', '0.00', 'paid', 'deposit', '0.00', '0.00', '12.50', '0.00', '0.00', '0.00', 'testing special request', '2025-09-01 22:47:34', '2025-09-01 23:16:45'),
(27, 15, 1, 1, 1, 1, '2025-09-02', '2025-09-03', '09:00:00', '09:00:00', 'pending', NULL, NULL, 1, '100.00', '23.00', '14.76', '137.76', '0.00', '0.00', 'paid', 'deposit', '0.00', '0.00', '12.50', '0.00', '0.00', '0.00', 'testing special request', '2025-09-01 23:07:44', '2025-09-01 23:08:01'),
(28, 16, 1, 1, 1, 1, '2025-09-02', '2025-09-03', '09:00:00', '09:00:00', 'pending', NULL, NULL, 1, '100.00', '133.00', '27.96', '260.96', '0.00', '0.00', 'paid', 'deposit', '0.00', '0.00', '12.50', '0.00', '0.00', '0.00', 'testing', '2025-09-01 23:32:14', '2025-09-01 23:32:35'),
(29, 16, 1, 4, 1, 1, '2025-09-02', '2025-09-03', '09:00:00', '09:00:00', 'pending', NULL, NULL, 1, '100.00', '133.00', '27.96', '260.96', '0.00', '0.00', 'paid', 'deposit', '0.00', '0.00', '12.50', '0.00', '0.00', '0.00', 'testing', '2025-09-01 23:38:54', '2025-09-01 23:39:00'),
(30, 16, 1, 1, 1, 1, '2025-09-02', '2025-09-03', '09:00:00', '09:00:00', 'completed', NULL, NULL, 1, '100.00', '133.00', '27.96', '260.96', '0.00', '0.00', 'paid', 'deposit', '0.00', '0.00', '12.50', '0.00', '0.00', '0.00', 'any special request', '2025-09-01 23:50:47', '2025-09-30 11:35:18'),
(31, 16, 1, 2, 1, 1, '2025-09-02', '2025-09-03', '09:00:00', '09:00:00', 'active', NULL, NULL, 1, '100.00', '88.00', '22.56', '210.56', '0.00', '0.00', 'pending', 'deposit', '0.00', '0.00', '12.50', '0.00', '0.00', '0.00', 'testing address line 1', '2025-09-02 00:06:23', '2025-11-29 15:56:00'),
(32, 10, 1, 1, 1, 1, '2025-09-03', '2025-09-04', '09:00:00', '09:00:00', 'active', NULL, NULL, 1, '100.00', '40.00', '16.80', '156.80', '0.00', '0.00', 'pending', 'deposit', '0.00', '0.00', '12.50', '0.00', '0.00', '0.00', 'testing special request', '2025-09-02 19:35:42', '2025-11-29 15:54:42'),
(33, 10, 1, 1, 1, 1, '2025-09-03', '2025-09-04', '09:00:00', '09:00:00', 'active', NULL, NULL, 1, '100.00', '133.00', '27.96', '260.96', '0.00', '0.00', 'pending', 'deposit', '0.00', '0.00', '12.50', '0.00', '0.00', '0.00', 'Special Request', '2025-09-02 19:47:00', '2025-11-29 15:54:50'),
(34, 17, 1, 2, 1, 1, '2025-09-09', '2025-09-10', '09:00:00', '09:00:00', 'active', NULL, NULL, 1, '100.00', '133.00', '27.96', '260.96', '0.00', '0.00', 'pending', 'deposit', '0.00', '0.00', '12.50', '0.00', '0.00', '0.00', 'lkjljlj', '2025-09-09 17:42:36', '2025-09-30 11:39:39'),
(35, 17, 1, 1, 1, 1, '2025-09-09', '2025-09-10', '09:00:00', '09:00:00', 'active', NULL, NULL, 1, '100.00', '0.00', '12.00', '112.00', '0.00', '0.00', 'pending', 'deposit', '0.00', '0.00', '12.50', '0.00', '0.00', '0.00', 'lkjljlj', '2025-09-09 17:51:46', '2025-09-30 11:36:56'),
(36, 17, 1, 1, 1, 1, '2025-09-09', '2025-09-10', '09:00:00', '09:00:00', 'active', NULL, NULL, 1, '100.00', '0.00', '12.00', '112.00', '0.00', '0.00', 'pending', 'deposit', '0.00', '0.00', '12.50', '0.00', '0.00', '0.00', NULL, '2025-09-09 17:56:04', '2025-09-30 11:36:49'),
(39, 19, 1, 1, 1, 1, '2025-11-04', '2025-11-07', '09:00:00', '09:00:00', 'active', NULL, NULL, 3, '150.00', '0.00', '18.00', '168.00', '0.00', '0.00', 'pending', 'deposit', '0.00', '0.00', '12.50', '0.00', '0.00', '0.00', 'Car must be new and wash', '2025-11-02 18:57:47', '2025-11-14 15:11:56'),
(40, 19, 1, 1, 1, 1, '2025-11-11', '2025-11-20', '09:00:00', '09:00:00', 'completed', NULL, NULL, 9, '450.00', '0.00', '54.00', '504.00', '0.00', '0.00', 'pending', 'deposit', '0.00', '0.00', '12.50', '0.00', '0.00', '0.00', NULL, '2025-11-06 18:46:54', '2025-11-29 15:54:34'),
(41, 20, 1, 1, 1, 1, '2025-11-11', '2025-11-14', '09:00:00', '09:00:00', 'completed', NULL, NULL, 3, '100.00', '96.00', '23.52', '219.52', '0.00', '0.00', 'pending', 'deposit', '0.00', '0.00', '12.50', '0.00', '0.00', '0.00', 'Hello Dear, I want fully working Air Conditioner', '2025-11-10 19:09:26', '2025-11-12 21:16:14'),
(42, 21, 1, 3, 1, 1, '2025-11-14', '2025-11-16', '09:00:00', '09:00:00', 'active', NULL, NULL, 2, '100.00', '0.00', '12.00', '112.00', '0.00', '0.00', 'pending', 'deposit', '0.00', '0.00', '12.50', '0.00', '0.00', '0.00', NULL, '2025-11-14 02:51:27', '2025-11-29 15:54:31'),
(43, 22, 1, 1, 1, 1, '2025-11-15', '2025-11-17', '09:00:00', '09:00:00', 'active', NULL, NULL, 2, '100.00', '0.00', '12.00', '112.00', '0.00', '0.00', 'pending', 'deposit', '0.00', '0.00', '12.50', '0.00', '0.00', '0.00', NULL, '2025-11-14 18:14:24', '2025-11-29 15:54:29');

-- --------------------------------------------------------

--
-- Table structure for table `reservation_extras`
--

CREATE TABLE `reservation_extras` (
  `reservation_id` int(11) NOT NULL,
  `extra_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 1,
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `reservation_extras`
--

INSERT INTO `reservation_extras` (`reservation_id`, `extra_id`, `quantity`, `unit_price`, `total_price`) VALUES
(2, 2, 1, '8.00', '8.00'),
(3, 2, 1, '8.00', '8.00'),
(4, 1, 1, '5.00', '5.00'),
(5, 1, 1, '5.00', '5.00'),
(6, 1, 1, '5.00', '5.00'),
(7, 1, 1, '5.00', '5.00'),
(8, 1, 1, '5.00', '5.00'),
(10, 1, 1, '5.00', '5.00'),
(11, 1, 1, '5.00', '5.00'),
(12, 1, 1, '5.00', '5.00'),
(13, 1, 1, '5.00', '5.00'),
(14, 1, 1, '5.00', '5.00'),
(15, 1, 1, '5.00', '5.00'),
(16, 1, 1, '5.00', '5.00'),
(20, 1, 1, '5.00', '5.00'),
(21, 1, 1, '5.00', '5.00'),
(22, 1, 1, '5.00', '5.00'),
(23, 1, 1, '5.00', '5.00'),
(24, 1, 1, '5.00', '5.00'),
(25, 1, 1, '5.00', '5.00'),
(26, 1, 1, '5.00', '5.00'),
(26, 6, 1, '4.00', '4.00'),
(27, 1, 1, '5.00', '5.00'),
(27, 6, 1, '4.00', '4.00'),
(28, 1, 1, '5.00', '5.00'),
(28, 2, 1, '8.00', '8.00'),
(28, 3, 1, '15.00', '15.00'),
(28, 4, 1, '12.00', '12.00'),
(28, 6, 1, '4.00', '4.00'),
(29, 1, 1, '5.00', '5.00'),
(29, 2, 1, '8.00', '8.00'),
(29, 3, 1, '15.00', '15.00'),
(29, 4, 1, '12.00', '12.00'),
(29, 6, 1, '4.00', '4.00'),
(30, 1, 1, '5.00', '5.00'),
(30, 2, 1, '8.00', '8.00'),
(30, 3, 1, '15.00', '15.00'),
(30, 4, 1, '12.00', '12.00'),
(30, 6, 1, '4.00', '4.00'),
(31, 1, 1, '5.00', '5.00'),
(31, 2, 1, '8.00', '8.00'),
(31, 3, 1, '15.00', '15.00'),
(31, 4, 1, '12.00', '12.00'),
(31, 6, 1, '4.00', '4.00'),
(32, 1, 1, '5.00', '5.00'),
(32, 3, 1, '15.00', '15.00'),
(33, 1, 1, '5.00', '5.00'),
(33, 2, 1, '8.00', '8.00'),
(33, 3, 1, '15.00', '15.00'),
(33, 4, 1, '12.00', '12.00'),
(33, 6, 1, '4.00', '4.00'),
(34, 1, 1, '5.00', '5.00'),
(34, 2, 1, '8.00', '8.00'),
(34, 3, 1, '15.00', '15.00'),
(34, 4, 1, '12.00', '12.00'),
(34, 6, 1, '4.00', '4.00'),
(41, 1, 1, '5.00', '5.00'),
(41, 3, 1, '15.00', '15.00'),
(41, 6, 1, '4.00', '4.00');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `review_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `agency_id` int(11) NOT NULL,
  `vehicle_id` int(11) DEFAULT NULL,
  `reservation_id` int(11) NOT NULL,
  `overall_rating` int(11) DEFAULT NULL CHECK (`overall_rating` between 1 and 5),
  `vehicle_rating` int(11) DEFAULT NULL CHECK (`vehicle_rating` between 1 and 5),
  `service_rating` int(11) DEFAULT NULL CHECK (`service_rating` between 1 and 5),
  `value_rating` int(11) DEFAULT NULL CHECK (`value_rating` between 1 and 5),
  `title` varchar(200) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `pros` text DEFAULT NULL,
  `cons` text DEFAULT NULL,
  `recommend` tinyint(1) DEFAULT 1,
  `verified` tinyint(1) DEFAULT 0,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `admin_response` text DEFAULT NULL,
  `helpful_votes` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`review_id`, `customer_id`, `agency_id`, `vehicle_id`, `reservation_id`, `overall_rating`, `vehicle_rating`, `service_rating`, `value_rating`, `title`, `comment`, `pros`, `cons`, `recommend`, `verified`, `status`, `admin_response`, `helpful_votes`, `created_at`, `updated_at`) VALUES
(41, 1, 1, 6, 4, 4, 4, 4, 4, 'Good Experience Overall', 'Had a pleasant experience with this rental. Vehicle was clean and service was professional.', 'Clean vehicle, professional service', 'Could be more competitive pricing', 1, 1, 'pending', NULL, 4, '2025-08-26 01:06:30', '2025-08-26 01:28:08'),
(42, 2, 1, 7, 5, 5, 5, 5, 4, 'Will Definitely Book Again', 'Outstanding experience from start to finish. The team went above and beyond to ensure our trip was perfect.', 'Exceptional service, quality vehicle, attention to detail', 'Minor delay during pickup', 1, 1, 'pending', NULL, 1, '2025-08-26 01:06:30', '2025-08-26 01:28:08'),
(43, 1, 1, 1, 2, 5, 5, 5, 4, 'Excellent Toyota Experience', 'Had an amazing experience with this Toyota Camry. Very smooth ride and great fuel efficiency. The staff was professional and the pickup process was seamless.', 'Clean vehicle, excellent fuel economy, professional staff, punctual service', 'Could use more leg room in the back', 1, 1, 'approved', NULL, 12, '2025-08-11 01:08:03', '2025-08-26 01:08:03'),
(44, 2, 1, 1, 3, 4, 4, 4, 5, 'Great Value for Money', 'Rented this car for a week-long business trip. Very reliable and comfortable. Great value compared to other rental companies.', 'Affordable pricing, reliable performance, good customer service', 'Interior could be more modern', 1, 1, 'approved', NULL, 8, '2025-08-14 01:08:03', '2025-08-26 01:08:03'),
(45, 3, 1, 2, 4, 4, 3, 5, 4, 'Reliable but Basic', 'The car served its purpose well. Not the most luxurious but definitely reliable. Staff was very helpful throughout the rental period.', 'Reliable engine, helpful staff, easy booking process', 'Basic interior features, no advanced tech', 1, 1, 'approved', NULL, 6, '2025-08-18 01:08:03', '2025-08-26 01:08:03'),
(46, 4, 1, 2, 5, 5, 5, 4, 4, 'Perfect Family Car', 'Rented this for our family vacation. Spacious and comfortable with excellent safety features. Kids loved the smooth ride.', 'Spacious interior, safety features, comfortable seating, good trunk space', 'Fuel consumption could be better', 1, 1, 'approved', NULL, 15, '2025-08-06 01:08:03', '2025-08-26 01:08:03'),
(47, 5, 1, 3, 6, 3, 3, 4, 3, 'Average Experience', 'Car was okay, nothing special. Had some minor issues with the air conditioning but overall serviceable for city driving.', 'Decent performance, responsive customer service', 'AC issues, interior showing wear and tear', 1, 1, 'approved', NULL, 3, '2025-08-20 01:08:03', '2025-08-26 01:08:03'),
(48, 1, 1, 3, 7, 5, 5, 5, 5, 'Outstanding Honda Accord', 'This Honda Accord exceeded all my expectations! Incredibly smooth drive, excellent features, and top-notch service from the rental team.', 'Premium features, smooth handling, excellent customer service, spotless condition', 'None that I can think of', 1, 1, 'approved', NULL, 24, '2025-08-21 01:08:03', '2025-08-26 01:08:03'),
(49, 2, 1, 4, 8, 4, 4, 4, 4, 'Solid Choice for Business', 'Used this for client meetings around the city. Professional appearance and reliable performance. Would definitely rent again.', 'Professional appearance, reliable, good for business use', 'Could use better sound system', 1, 1, 'approved', NULL, 7, '2025-08-08 01:08:03', '2025-08-26 01:08:03'),
(50, 3, 1, 4, 9, 5, 4, 5, 4, 'Great SUV for Mountain Trip', 'Took this SUV for a mountain adventure. Handled rough terrain beautifully and had plenty of space for our gear. Highly recommend!', 'Excellent off-road capability, spacious, good ground clearance, reliable', 'Fuel consumption on highways', 1, 1, 'approved', NULL, 18, '2025-08-16 01:08:03', '2025-08-26 01:08:03'),
(51, 4, 1, 5, 2, 4, 4, 3, 4, 'Good but Service Could Improve', 'The vehicle itself was great, but had to wait longer than expected during pickup. Once on the road, everything was smooth.', 'Powerful engine, comfortable ride, good safety features', 'Long wait times during pickup, could use better organization', 1, 1, 'approved', NULL, 5, '2025-08-12 01:08:03', '2025-08-26 01:08:03'),
(52, 5, 1, 5, 3, 5, 5, 5, 5, 'Luxury at Its Best', 'Absolutely phenomenal experience! This luxury sedan made our anniversary trip unforgettable. Premium features and impeccable service.', 'Luxury features, premium interior, exceptional service, smooth performance', 'Premium pricing, but worth every penny', 1, 1, 'approved', NULL, 31, '2025-08-23 01:08:03', '2025-08-26 01:08:03'),
(53, 1, 1, 6, 4, 4, 5, 4, 3, 'High-End Experience', 'Beautiful car with top-tier features. Service was good though a bit pricey. Perfect for special occasions.', 'Stunning design, high-end features, premium comfort', 'Expensive, limited availability', 1, 1, 'approved', NULL, 9, '2025-08-19 01:08:03', '2025-08-26 01:08:03'),
(54, 2, 1, 7, 5, 5, 5, 4, 4, 'Excellent Choice for Long Drives', 'Drove this car for over 500 miles and it was incredibly comfortable. Great fuel efficiency and smooth handling on highways.', 'Comfortable for long drives, excellent fuel efficiency, smooth handling', 'Road noise at high speeds', 1, 1, 'approved', NULL, 14, '2025-08-17 01:08:03', '2025-08-26 01:08:03'),
(55, 3, 1, 8, 6, 2, 2, 3, 2, 'Disappointing Experience', 'Car had several issues including a noisy engine and poor air conditioning. Expected better for the price paid.', 'Staff tried to be helpful', 'Noisy engine, poor AC, overpriced for condition', 0, 1, 'approved', NULL, 1, '2025-08-13 01:08:03', '2025-08-26 01:08:03'),
(56, 4, 1, 9, 7, 3, 3, 2, 3, 'Below Average Service', 'Vehicle was okay but service was disappointing. Long wait times and unhelpful staff made the experience frustrating.', 'Car was functional', 'Poor customer service, long wait times, unprofessional staff', 0, 1, 'approved', NULL, 1, '2025-08-07 01:08:03', '2025-08-26 01:28:08'),
(57, 5, 1, 10, 8, 4, 4, 5, 5, 'Best Value in Its Class', 'Outstanding value for money. The car performed flawlessly and the customer service was exceptional. Will definitely book again.', 'Great value, reliable performance, excellent customer service', 'Basic interior design', 1, 1, 'approved', NULL, 11, '2025-08-22 01:08:03', '2025-08-26 01:08:03'),
(58, 1, 1, 11, 9, 5, 5, 5, 4, 'Amazing Weekend Getaway Car', 'Just returned from an amazing weekend trip. This car made the journey comfortable and enjoyable. Great experience overall!', 'Comfortable ride, reliable, good features, professional service', 'Could use better smartphone integration', 1, 1, 'approved', NULL, 6, '2025-08-25 01:08:03', '2025-08-26 01:08:03'),
(59, 2, 1, 1, 2, 5, 5, 5, 5, 'Exceptional Service and Vehicle', 'Everything was perfect from booking to return. The car was in pristine condition and performed flawlessly. Highly recommended!', 'Pristine condition, flawless performance, exceptional service, easy process', 'None whatsoever', 1, 1, 'approved', NULL, 22, '2025-08-26 01:08:03', '2025-08-26 01:08:03'),
(60, 3, 1, 6, 3, 4, 4, 4, 4, 'Good Experience Overall', 'Had a pleasant experience with this rental. Vehicle was clean and service was professional.', 'Clean vehicle, professional service', 'Could be more competitive pricing', 1, 1, 'pending', NULL, 3, '2025-08-26 01:08:03', '2025-08-26 01:28:08'),
(61, 4, 1, 7, 4, 5, 5, 5, 4, 'Will Definitely Book Again', 'Outstanding experience from start to finish. The team went above and beyond to ensure our trip was perfect.', 'Exceptional service, quality vehicle, attention to detail', 'Minor delay during pickup', 1, 1, 'pending', NULL, 3, '2025-08-26 01:08:03', '2025-08-26 01:28:08'),
(80, 4, 1, 1, 2, 5, 5, 4, 5, 'Perfect City Car', 'Great for city driving, easy to park and very fuel efficient. Excellent customer service throughout.', 'Fuel efficient, easy parking, great service', 'Small trunk space', 1, 1, 'approved', NULL, 8, '2025-08-23 01:28:07', '2025-08-26 01:28:07'),
(81, 5, 1, 2, 3, 4, 4, 4, 4, 'Stylish and Reliable', 'Modern interior and smooth ride. Perfect for weekend trips around the city.', 'Modern design, smooth handling', 'Could use more rear space', 1, 1, 'approved', NULL, 12, '2025-08-21 01:28:07', '2025-08-26 01:28:07'),
(82, 1, 1, 3, 4, 5, 5, 5, 4, 'Excellent SUV Choice', 'Perfect for family trips. Spacious, reliable, and comfortable for long drives.', 'Spacious, reliable, comfortable', 'Higher fuel consumption', 1, 1, 'approved', NULL, 15, '2025-08-19 01:28:07', '2025-08-26 01:28:07'),
(83, 3, 1, 3, 5, 4, 4, 5, 4, 'Great Adventure Vehicle', 'Took this on a mountain trip - handled beautifully and plenty of space for gear.', 'Good off-road capability, spacious', 'Price could be better', 1, 1, 'approved', NULL, 9, '2025-08-14 01:28:07', '2025-08-26 01:28:07'),
(84, 2, 1, 4, 6, 5, 5, 4, 3, 'Luxury Experience', 'Amazing driving experience! Premium feel and powerful performance.', 'Luxurious, powerful, premium features', 'Expensive, premium fuel required', 1, 1, 'approved', NULL, 11, '2025-08-24 01:28:07', '2025-08-26 01:28:07'),
(85, 4, 1, 5, 7, 4, 4, 4, 5, 'Great Value Option', 'Excellent value for money. Basic but reliable and gets the job done.', 'Affordable, reliable, spacious trunk', 'Basic interior features', 1, 1, 'approved', NULL, 6, '2025-08-18 01:28:07', '2025-08-26 01:28:07'),
(86, 1, 1, 7, 2, 4, 4, 5, 4, 'Reliable Daily Driver', 'Perfect for business trips. Reliable Honda quality and good fuel economy.', 'Reliable, good fuel economy, practical', 'Could use more power', 1, 1, 'approved', NULL, 7, '2025-08-20 01:28:07', '2025-08-26 01:28:07'),
(87, 5, 1, 7, 3, 5, 4, 5, 5, 'Excellent Service', 'Great car and even better service! Clean, comfortable, and affordable.', 'Great value, clean, comfortable', 'Interior could be more modern', 1, 1, 'approved', NULL, 13, '2025-08-22 01:28:07', '2025-08-26 01:28:07'),
(88, 3, 1, 8, 4, 4, 4, 4, 5, 'Classic Reliable Choice', 'You can always count on a Corolla. Reliable, efficient, and comfortable.', 'Very reliable, efficient, comfortable', 'Somewhat uninspiring', 1, 1, 'approved', NULL, 8, '2025-08-16 01:28:07', '2025-08-26 01:28:07'),
(89, 2, 1, 8, 5, 3, 3, 4, 4, 'Decent but Basic', 'Gets the job done but nothing exciting. Good for basic transportation.', 'Reliable, affordable', 'Basic features, uninspiring', 1, 1, 'approved', NULL, 3, '2025-08-12 01:28:07', '2025-08-26 01:28:07'),
(90, 4, 1, 9, 6, 4, 4, 4, 4, 'Good Family SUV', 'Perfect size for family trips. Spacious and good visibility.', 'Spacious, family-friendly, good visibility', 'Road noise, could use more power', 1, 1, 'approved', NULL, 10, '2025-08-17 01:28:07', '2025-08-26 01:28:07'),
(91, 1, 1, 9, 7, 5, 4, 5, 4, 'Exceeded Expectations', 'Great SUV with excellent service. Perfect for our family needs.', 'Spacious, reliable, good service', 'Higher fuel consumption', 1, 1, 'approved', NULL, 14, '2025-08-25 01:28:07', '2025-08-26 01:28:07'),
(92, 5, 1, 10, 8, 5, 5, 4, 4, 'Premium Sedan Experience', 'Beautiful car with smooth ride. Perfect balance of luxury and practicality.', 'Smooth ride, premium features, reliable', 'Price premium, premium fuel', 1, 1, 'approved', NULL, 16, '2025-08-15 01:28:07', '2025-08-26 01:28:07'),
(93, 3, 1, 10, 9, 4, 4, 4, 4, 'Professional Choice', 'Great for business use. Professional appearance and comfortable interior.', 'Professional look, comfortable, reliable', 'Higher cost', 1, 1, 'approved', NULL, 7, '2025-08-13 01:28:07', '2025-08-26 01:28:07'),
(94, 2, 1, 11, 2, 4, 4, 5, 5, 'Good Overall Experience', 'Reliable vehicle with excellent customer service. Good value for the price.', 'Reliable, great service, good value', 'Basic interior', 1, 1, 'approved', NULL, 9, '2025-08-11 01:28:07', '2025-08-26 01:28:07'),
(95, 1, 1, 2, 4, 2, 2, 3, 3, 'Issues with Vehicle', 'Car had some maintenance issues and interior was not as clean as expected.', 'Staff tried to help', 'Poor maintenance, cleanliness issues', 0, 1, 'approved', NULL, 4, '2025-08-10 01:28:07', '2025-08-26 01:28:08'),
(96, 4, 1, 6, 8, 3, 4, 2, 2, 'Service Problems', 'Vehicle was okay but service was disappointing. Long wait and unfriendly staff.', 'Decent car', 'Poor service, long wait times', 0, 1, 'approved', NULL, 3, '2025-08-08 01:28:07', '2025-08-26 01:28:08');

-- --------------------------------------------------------

--
-- Table structure for table `system_settings`
--

CREATE TABLE `system_settings` (
  `setting_id` int(11) NOT NULL,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `type` enum('text','number','boolean','json') DEFAULT 'text',
  `category` varchar(50) DEFAULT 'general',
  `display_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `system_settings`
--

INSERT INTO `system_settings` (`setting_id`, `setting_key`, `setting_value`, `description`, `type`, `category`, `display_order`, `is_active`, `updated_at`) VALUES
(1, 'site_name', 'KIRASTAY Rentals', 'Main site name displayed in header and branding', 'text', 'general', 1, 1, '2025-09-19 10:02:32'),
(2, 'site_description', 'Premium car rental service', 'Website description', 'text', 'general', 0, 1, '2025-08-22 22:14:48'),
(3, 'default_commission', '15.00', 'Default commission rate for agencies', 'number', 'general', 0, 1, '2025-08-22 22:14:48'),
(4, 'booking_cancellation_hours', '24', 'Hours before pickup for free cancellation', 'number', 'general', 0, 1, '2025-08-22 22:14:48'),
(5, 'max_rental_days', '30', 'Maximum rental period in days', 'number', 'general', 0, 1, '2025-08-22 22:14:48'),
(6, 'min_driver_age', '21', 'Minimum age for drivers', 'number', 'general', 0, 1, '2025-08-22 22:14:48'),
(7, 'google_maps_api_key', '', 'Google Maps API key for Places Autocomplete', 'text', 'maps', 1, 1, '2025-09-19 09:44:16'),
(9, 'default_currency', 'MAD', 'Default currency for pricing', 'text', 'general', 6, 1, '2025-09-19 10:02:32'),
(10, 'currency_symbol', 'DH', 'Currency symbol to display', 'text', 'general', 7, 1, '2025-09-19 10:02:32'),
(12, 'site_tagline', 'Your Premier Vehicle Rental Partner', 'Site tagline/slogan', 'text', 'general', 2, 1, '2025-09-19 10:02:32'),
(15, 'contact_phone', '+212 123 456 789', 'Main contact phone number', 'text', 'contact', 10, 1, '2025-09-19 10:02:32'),
(16, 'contact_email', 'info@kirastay.com', 'Main contact email', 'text', 'contact', 11, 1, '2025-09-19 10:02:32'),
(17, 'business_address', 'Casablanca, Morocco', 'Main business address', 'text', 'contact', 13, 1, '2025-09-19 10:02:32'),
(18, 'location_autocomplete_enabled', 'true', 'Enable location autocomplete using OpenStreetMap', 'boolean', 'maps', 60, 1, '2025-09-19 10:02:32'),
(19, 'default_map_center_lat', '33.5731', 'Default map center latitude (Casablanca)', 'text', 'maps', 62, 1, '2025-09-19 10:02:32'),
(20, 'default_map_center_lng', '-7.5898', 'Default map center longitude (Casablanca)', 'text', 'maps', 63, 1, '2025-09-19 10:02:32'),
(21, 'booking_advance_days', '180', 'Maximum days in advance for booking', 'number', 'booking', 20, 1, '2025-09-19 10:02:32'),
(22, 'minimum_driver_age', '21', 'Minimum age for drivers', 'number', 'booking', 26, 1, '2025-09-19 10:02:32'),
(23, 'accept_cash_payments', 'true', 'Accept cash payments', 'boolean', 'payment', 35, 1, '2025-09-19 10:02:32'),
(24, 'accept_card_payments', 'true', 'Accept card payments', 'boolean', 'payment', 36, 1, '2025-09-19 10:02:32');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `role` enum('customer','admin','agency_owner') NOT NULL DEFAULT 'customer',
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive','suspended') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `email_verified` tinyint(1) DEFAULT 0,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `verification_token` varchar(255) DEFAULT NULL,
  `verification_token_expires_at` timestamp NULL DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expires` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `role`, `first_name`, `last_name`, `email`, `password_hash`, `phone`, `date_of_birth`, `address`, `city`, `state`, `country`, `postal_code`, `profile_image`, `status`, `created_at`, `updated_at`, `email_verified`, `email_verified_at`, `verification_token`, `verification_token_expires_at`, `reset_token`, `reset_token_expires`) VALUES
(1, 'admin', 'muhammad ', 'wasif', 'smartestdevelopers@gmail.com', '$2a$12$8wEDy574Vh6iS70LbroOqei0HgSligDC2P8jXZO.fhjR5/.QcdECW', '03167278987', NULL, 'HCB 200 downtown dubai', 'dubai', NULL, 'Pakistan', NULL, NULL, 'active', '2025-08-22 22:14:48', '2025-11-14 02:51:27', 1, '2025-08-26 23:23:44', NULL, NULL, NULL, NULL),
(2, 'agency_owner', 'John', 'Doe', 'test1756034218720@example.com', '$2a$12$9f.lI61XuAbmVtvNmWDqBOQnu/B7V5UWfNi5eOy98TF175Zg85dT2', '+212600123456', NULL, '123 Test Street', 'Marrakech', NULL, 'Morocco', NULL, NULL, 'active', '2025-08-24 11:16:59', '2025-08-24 11:16:59', 0, NULL, NULL, NULL, NULL, NULL),
(3, 'agency_owner', 'agency', 'kirastay', 'agency@kirastay.com', '$2a$12$eseAe4qaJ1.SaKScTa2lKOsNxjbydHSz6SgMYGOSddMmfQuESGfS6', '12345678', NULL, 'testing address line 1', 'Karachi', NULL, 'Italy', NULL, NULL, 'active', '2025-08-24 11:17:24', '2025-09-07 20:01:37', 1, '2025-08-26 23:24:08', NULL, NULL, NULL, NULL),
(4, 'agency_owner', 'agency', '', 'agency2@kirastay.com', '$2a$12$MKZ3I.Ez5s5gGa9.HQl1nOaC8GXLxppjc5CtkpgIUqt9QvTvygWLm', '+212600212', NULL, ' Street Number', 'Hyderabad', NULL, 'Algeria', NULL, NULL, 'active', '2025-08-24 11:25:01', '2025-08-24 11:25:01', 0, NULL, NULL, NULL, NULL, NULL),
(5, 'agency_owner', 'Debug', 'User', 'debug1756034831596@example.com', '$2a$12$zSa4alEcH3IylTYVh/tskOvWDWM2patX.PNcs4ns84Fic4kigOVyy', '+212600111222', NULL, '789 Debug Street', 'Rabat', NULL, 'Morocco', NULL, NULL, 'active', '2025-08-24 11:27:13', '2025-08-24 11:27:13', 0, NULL, NULL, NULL, NULL, NULL),
(6, 'agency_owner', 'DB', 'Test', 'dbtest1756034944392@example.com', '$2a$12$GopD2dmhk4VmK2UnhQhLIO4cpABNXcE.QtMArY/AwZ.qdZc0MoDlq', '+212600000000', NULL, 'Test Street', 'Test City', NULL, 'Morocco', NULL, NULL, 'active', '2025-08-24 11:29:05', '2025-08-24 11:29:05', 0, NULL, NULL, NULL, NULL, NULL),
(7, 'customer', 'Test', 'User', 'testauth1756035378074@example.com', '$2a$12$pZoUsFuPeXC1zAeaILPQ2upkS38gkhL4xGO2vDHRldtr7zghBrAJ.', '+212600555666', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2025-08-24 11:36:18', '2025-08-24 11:36:18', 0, NULL, NULL, NULL, NULL, NULL),
(8, 'customer', 'user', 'User', 'user@user.com', '$2a$12$fL1mSDiDHhcXypRxu61JaOyhYmvNG8tFQLgem7N.Ue5Mj09fpLRIC', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2025-08-24 11:36:42', '2025-08-26 23:24:08', 1, '2025-08-26 23:24:08', NULL, NULL, NULL, NULL),
(100, 'agency_owner', 'Premium', 'Rentals', 'agency@example.com', '$2b$10$hash_here', '+212600123456', NULL, NULL, 'Casablanca', NULL, 'Morocco', NULL, NULL, 'active', '2025-08-24 20:46:18', '2025-08-24 20:46:18', 0, NULL, NULL, NULL, NULL, NULL),
(101, 'agency_owner', 'Karachi', 'Motors', 'karachi@example.com', '$2a$12$HtR77XWyQRQor4nAgyuHRutGgjfcNYI9hWmXDzADb7pqJINIgSx8O', '+92300123456', NULL, NULL, 'Karachi', NULL, 'Pakistan', NULL, NULL, 'active', '2025-08-25 04:49:55', '2025-09-01 21:25:32', 0, NULL, NULL, NULL, NULL, NULL),
(102, 'customer', 'user9', 'user9', 'user9@user9.com', '$2a$12$tB8GPOsiP6Orfynx8fXKo.ohggoSxPmpGhC5iLRPsz5Xl/jlUl3HW', '123456789', NULL, 'address Line 1', 'Karachi', NULL, 'Pakistan', NULL, NULL, 'active', '2025-08-25 06:31:53', '2025-09-01 21:25:32', 0, NULL, NULL, NULL, NULL, NULL),
(103, 'customer', 'user10', 'user10', 'user10@user10.com', '$2a$12$tGMj/4YYwT9Ynb95jET7eOpInXfvNd.DG3FCT9Hz9OWagPe3xG3SW', '12345789', NULL, 'address Line 1', 'Karachi', NULL, 'Switzerland', NULL, NULL, 'active', '2025-08-25 07:24:04', '2025-09-01 21:25:32', 0, NULL, NULL, NULL, NULL, NULL),
(104, 'customer', 'user12', 'user12', 'user12@user12.com', '$2a$12$L2WBy7jOWzwMg3eN2sjEhOfGsjz5ZXMmeOFoLNM./GN2fOlGbBc46', '123456789', NULL, 'Addres Line 1', 'Karachi', NULL, 'Switzerland', NULL, NULL, 'active', '2025-08-25 07:32:09', '2025-09-01 21:25:32', 0, NULL, NULL, NULL, NULL, NULL),
(105, 'customer', 'user19', 'user19', 'user19@user19.com', '$2a$12$fL1mSDiDHhcXypRxu61JaOyhYmvNG8tFQLgem7N.Ue5Mj09fpLRIC', '123456789', NULL, 'address line 1', 'Karachi', NULL, 'Switzerland', NULL, NULL, 'active', '2025-08-25 07:38:28', '2025-08-25 07:47:37', 0, NULL, NULL, NULL, NULL, NULL),
(106, 'customer', 'faiz', 'User', 'mantaqiilmi@gmail.com', '$2b$12$EjGzDoVHZrUOyl5bS8q5auT5dA77s3UfqIuMvb.0/GG5BeqMnpi3K', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2025-08-25 14:28:52', '2025-08-26 22:47:55', 1, NULL, NULL, NULL, NULL, NULL),
(108, 'customer', 'faiz', 'awan', 'hr1@smartestdevelopers.com', '$2a$12$NEpRKhn09KsJ1eIAjEH0reQ//qYsD74wi2JrYM39wTxmSS/0N2pau', '123465789', NULL, 'address line 1', 'Karachi', NULL, 'Pakistan', NULL, NULL, 'active', '2025-08-26 00:39:37', '2025-08-26 00:39:37', 0, NULL, '1bfc616cd4b16f2261b850a519cc1b5e95d8491ce02eee263c16d629bfe81e09', '2025-08-27 00:39:36', NULL, NULL),
(110, 'customer', 'faiz', 'awan', 'hr2@smartestdevelopers.com', '$2a$12$eL3Fi92XlQjbjPKa/8CqNuHWKUw.dBSHeyjZuxTPQxZAD2GStGL3q', '123465789', NULL, 'address line 1', 'Karachi', NULL, 'Pakistan', NULL, NULL, 'active', '2025-08-26 00:45:12', '2025-08-26 00:45:12', 0, NULL, 'a6336a0d3616a068dfcb58709704c751263b12e12cbbe831cb5f84c5e77a01e7', '2025-08-27 00:45:11', NULL, NULL),
(112, 'customer', 'faiz', 'awan', 'hr3@smartestdevelopers.com', '$2a$12$RiKjAYAtwRmv.QwafzleMuowrCdOiTTr.fQOBYpirlFZMwh.mIqym', '123465789', NULL, 'address line 1', 'Karachi', NULL, 'Pakistan', NULL, NULL, 'active', '2025-08-26 00:49:12', '2025-08-26 00:49:12', 0, NULL, '3716daa8c961a66a4797e3e19fb83629d935945d4a9a984ddf79dde5831d855c', '2025-08-27 00:49:11', NULL, NULL),
(113, 'customer', 'Faiz', 'Awan', 'hr@smartestdevelopers.com', '$2a$12$2dYIJVrE1GxYW9aLHsJ.R.apns1CaAt3qTmODs07Vf38rzAewDT6G', '123465789', NULL, 'Saddar, Doctor Line', 'Hyderabad', NULL, 'Pakistan', NULL, NULL, 'active', '2025-08-26 00:55:03', '2025-08-26 23:24:08', 1, '2025-08-26 23:24:08', 'bce779bfe96bba3ab116f75cab3a2f0af2e4230071b559b8b2010370c174ff7a', '2025-08-27 00:55:02', NULL, NULL),
(114, 'customer', 'user888', 'User', 'user888@gmail.com', '$2a$12$Lo.ZVBljONgDwx/KAGzlJujSt9TfsGaHd8p2VmD.gSYYtGIbjeDNW', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2025-08-28 16:48:13', '2025-08-28 16:48:13', 0, NULL, NULL, NULL, NULL, NULL),
(115, 'customer', 'user666', 'User', 'user666@gmail.com', '$2a$12$PEC3ol23AanTqQw/2cMFxuRuSUqvR3AXvr3LKhvQeRUb070v.IqWu', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2025-08-28 17:05:57', '2025-08-28 17:05:57', 0, NULL, NULL, NULL, NULL, NULL),
(116, 'customer', 'Testing', 'User', 'hr27@smartestdevelopers.com', '$2a$12$8B1gbIbjVLA8oEjyegStMe3VFxcwFylvsVxtpmsSluSqP95WWlcxO', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2025-08-29 19:03:29', '2025-08-29 19:03:29', 0, NULL, NULL, NULL, NULL, NULL),
(117, 'customer', 'testing', 'User', 'faiz981@smartestdevelopers.com', '$2a$12$nmsUnzPsYW76RIMtw6.rS.7.9C2leM5pMVBjWN6Q1daEc9jIFh/BC', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2025-08-29 19:07:31', '2025-08-29 19:07:31', 0, NULL, NULL, NULL, NULL, NULL),
(118, 'customer', 'Faiz', 'Awan', 'sageattarfayyaz@gmail.com', '$2a$12$its0NoeBvjRkod1w/GTTi.bL5hE0B6OHFoaGNu7CIo3jp1y3lxCE6', '123456789', NULL, 'Saddar, Doctor Line', 'Hyderabad', NULL, 'Pakistan', NULL, NULL, 'active', '2025-08-29 19:11:01', '2025-09-02 19:47:00', 0, NULL, NULL, NULL, NULL, NULL),
(119, 'customer', 'faiz', 'awan', 'faiz26@smartestdevelopers.com', '$2a$12$XSDSh0GzwdwL8VaJvK41zeaUW70JbYZC2Dx/xNwTUJ0TNgf6ORU.C', '12346789', NULL, 'testing address line 1', 'Karachi', NULL, 'Mexico', NULL, NULL, 'active', '2025-08-29 19:15:39', '2025-08-29 20:24:49', 0, NULL, NULL, NULL, NULL, NULL),
(120, 'customer', 'hr28@smartestdevelopers.com', 'User', 'hr28@smartestdevelopers.com', '$2a$12$/wSEYraAdNJiaapGzNkkv.0QaydeXBB5oNnbKhR.QvWAhsfxqH82e', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2025-08-29 19:59:15', '2025-08-29 19:59:15', 0, NULL, NULL, NULL, NULL, NULL),
(121, 'customer', 'test', 'test', 'hr29@smartestdevelopers.com', '$2a$12$G0jq3plDkqKPXXqwZSVibujJqMh/lJVbK11xEBaxWj3W/hvmsJ3Iq', '23456789', NULL, 'address line 1', 'Karachi', NULL, 'Netherlands', NULL, NULL, 'active', '2025-08-29 20:50:32', '2025-08-29 20:50:32', 0, NULL, NULL, NULL, NULL, NULL),
(122, 'customer', 'user', 'user', 'hr291@smartestdevelopers.com', '$2a$12$qKFKk5iO/279GPeYtwR2Ge5IwukcDCP/Csks7bQhr50L8k4CtqKOK', '12346789', '2025-08-30', 'addres line 1', 'Karachi', NULL, 'Argentina', NULL, NULL, 'active', '2025-08-29 21:01:17', '2025-08-29 22:50:37', 0, NULL, NULL, NULL, NULL, NULL),
(123, 'customer', 'faiz', 'awan', 'contact@smartestdevelopers.com', '$2a$12$UFKuRY7r1tOatE2ocAEqF.qBKOyOal9cNDThDxH6g5IX2tNMty0Q2', '12346789', '2025-09-01', NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2025-09-01 18:17:34', '2025-09-01 18:17:34', 0, NULL, NULL, NULL, NULL, NULL),
(124, 'customer', 'hr292', 'hr292', 'hr292@smartestdevelopers.com', '$2a$12$BKIbhgpHRmXSyJNyq055cOBIPMSHVk.Ixa6frCWKcfzAJy8ADEgZa', '123456789', '2025-09-01', NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2025-09-01 18:46:28', '2025-09-01 18:46:28', 0, NULL, NULL, NULL, NULL, NULL),
(125, 'customer', 'new', 'new', 'hr310@smartestdevelopers.com', '$2a$12$GOHavvHdOpTEvNwNfA5EjOlNYOqVxeLMZy4g7QSRqzobpSdK7lncy', '123456789', NULL, 'address line 1', 'Karachi', NULL, 'Mexico', NULL, NULL, 'active', '2025-09-01 20:06:56', '2025-09-01 23:07:44', 0, NULL, NULL, NULL, NULL, NULL),
(126, 'customer', 'testing', 'testing', 'hr301@smartestdevelopers.com', '$2a$12$quEVLsH8BwsoERpjF18zmupMeWyyo4VDSi54DRMU7NchizPdreDuK', '123456789', NULL, 'address line 1', 'Karachi', NULL, 'Sweden', NULL, NULL, 'active', '2025-09-01 23:32:14', '2025-09-02 00:06:23', 0, NULL, NULL, NULL, NULL, NULL),
(127, 'customer', 'newnew3', 'newnew3', 'newnew@new.com', '$2a$12$eseAe4qaJ1.SaKScTa2lKOsNxjbydHSz6SgMYGOSddMmfQuESGfS6', '12346789', '2025-09-08', NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2025-09-07 19:23:15', '2025-09-07 19:23:15', 0, NULL, NULL, NULL, NULL, NULL),
(128, 'agency_owner', 'faysal', 'charredi', 'agency1@kirastay.com', '$2a$12$yTTjbrP8bmfYI0suxGDU6eYk6p.N0Hzf81klUlSVPzSElkgcqAQOq', '123456789', NULL, 'address line 1', 'Karachi', NULL, 'Mexico', NULL, NULL, 'active', '2025-09-09 10:45:27', '2025-09-09 17:56:04', 0, NULL, NULL, NULL, NULL, NULL),
(129, 'agency_owner', 'Agency3', 'Owner', 'agency3@kirastay.com', '$2a$12$lbcx5GAurebl6z99BgkVpuTE5zwpqzxGNg9r9KGtzw/TVPNvXKQdi', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2025-09-09 10:45:28', '2025-09-09 10:45:28', 0, NULL, NULL, NULL, NULL, NULL),
(130, 'agency_owner', 'Agency4', 'Owner', 'agency4@kirastay.com', '$2a$12$ZppPmQHbyUa2sNppzRQ96ufc5P0U0viOJCkqydk46pkbOGyiHt6R2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2025-09-09 10:45:29', '2025-09-09 10:45:29', 0, NULL, NULL, NULL, NULL, NULL),
(131, 'agency_owner', 'Agency5', 'Owner', 'agency5@kirastay.com', '$2a$12$FKGJL6WNGMW.tjyuL0SQ9.mNYRxDNMs524uWWp6wzIDuLX8sF9LRa', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2025-09-09 10:45:30', '2025-09-09 10:45:30', 0, NULL, NULL, NULL, NULL, NULL),
(132, 'customer', 'admin', 'admin', 'admin@admin.com', '$2a$12$9HrKIEs4BDAYpotPB6bRuOn0YJfL.boOleo91kIvx2KbI1ctGZk/u', '1223456789', '2025-09-22', NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2025-09-22 08:56:01', '2025-09-22 08:56:01', 0, NULL, NULL, NULL, NULL, NULL),
(133, 'customer', 'faiz', 'awan', 'hr520@smartestdevvelopers.com', '$2a$12$eIPR5KsF5p1jHeYxmlRbluSFFOO5jVDKut37jFmH7JmIApekXF6Aa', '123456789', '2025-09-03', NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2025-10-04 14:54:56', '2025-10-04 14:54:56', 0, NULL, NULL, NULL, NULL, NULL),
(135, 'customer', 'muhammad', 'kashif', 'admin@gmail.com', '$2a$12$mljJmhoHBflQ8iy/kmXIZOzyXRNcSGOcOKFV8onz38ErAAN.B9oxS', '03234578456', NULL, 'hac 287 ', 'hyderabad', NULL, 'Pakistan', NULL, NULL, 'active', '2025-11-02 18:52:49', '2025-11-06 18:46:54', 0, NULL, NULL, NULL, NULL, NULL),
(136, 'customer', 'admin1', 'User', 'admin1@gmail.com', '$2a$12$yNy86b2FBNQA6zvyUQRqDOiI8bfQ6kkM0KZ6UHuR.N3jchNzn7DZC', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'suspended', '2025-11-09 12:41:41', '2025-11-23 13:16:53', 0, NULL, NULL, NULL, NULL, NULL),
(138, 'agency_owner', 'Muhammad', 'Shayan', 'ali@gmail.com', '$2a$12$TlUhQFIseltRxnGAqhfpM.c0h9e.o2N2JlnlrPcTCZcUUJQSt02zu', '+923167286342', NULL, 'kacha qila shah faisal coloney', 'hyderabad', NULL, 'Morocco', NULL, NULL, 'active', '2025-11-10 18:47:58', '2025-11-10 18:47:58', 0, NULL, NULL, NULL, NULL, NULL),
(139, 'customer', 'bilal', 'User', 'bilal@gmail.com', '$2a$12$kGJ4Z4zEn..0ER0UxnJcROV0ZKLIQynI5dVyU3QIVZJzHgs5uEqSO', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2025-11-10 19:06:09', '2025-11-10 19:06:09', 0, NULL, NULL, NULL, NULL, NULL),
(140, 'customer', 'Muhammad', 'Aslam', 'khizar@gmail.com', '$2a$12$1DS.Yn.Sbrg5w9ei6R1.7.18vYwiyKq7bnxAASnS87PCuWm3nQbrO', '129301209', NULL, 'kacha qila shah faisal coloney', 'hyderabad', NULL, 'Pakistan', NULL, NULL, 'active', '2025-11-10 19:06:23', '2025-11-10 19:09:26', 0, NULL, NULL, NULL, NULL, NULL),
(141, 'agency_owner', 'muhammad', 'Bilal1', 'Basit1@gmail.com', '$2a$12$8wEDy574Vh6iS70LbroOqei0HgSligDC2P8jXZO.fhjR5/.QcdECW', '129301209', NULL, 'kacha qila shah faisal coloney', 'hyderabad', NULL, 'Pakistan', NULL, NULL, 'inactive', '2025-11-10 19:54:25', '2025-11-23 13:16:48', 0, NULL, NULL, NULL, NULL, NULL),
(142, 'customer', 'Muhammad', 'Zubair', 'zubair@gmail.com', '$2a$10$VUMZV9p.Ec2zrRO8.T.VCOvh8DIdHfDogxlP09zhoZDRK9pHfAT16', '129301209', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2025-11-16 18:57:12', '2025-11-16 18:57:12', 0, NULL, NULL, NULL, NULL, NULL),
(145, 'customer', 'Aslam', 'chaudry', 'ac@gmail.com', '$2a$10$OPfd/BT0r7iwHA84rGRTFOCbH56VyHgCgsBxlByHlWbEtXoBXbTBC', '03234578456', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2025-11-23 13:13:24', '2025-11-23 13:13:24', 0, NULL, NULL, NULL, NULL, NULL),
(146, 'customer', 'shayanshaikh168', 'User', 'shayanshaikh168@gmail.com', '$2a$12$RTsOlKa9wHJAHMhf4mM.buuxcr9GxvpVsbiqyVwaMWEtrTN4DR4Si', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2025-11-24 15:43:22', '2025-11-29 16:13:05', 0, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `vehicles`
--

CREATE TABLE `vehicles` (
  `id` int(11) NOT NULL,
  `make` varchar(50) NOT NULL,
  `model` varchar(100) NOT NULL,
  `year` int(11) NOT NULL,
  `daily_rate` decimal(10,2) DEFAULT NULL,
  `price_usd` int(11) DEFAULT NULL,
  `mileage` int(11) DEFAULT NULL,
  `location` varchar(150) DEFAULT NULL,
  `energy` varchar(50) DEFAULT NULL,
  `gear_type` varchar(50) DEFAULT NULL,
  `seats` int(11) DEFAULT NULL,
  `doors` int(11) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `body_type` varchar(100) DEFAULT NULL,
  `trim` varchar(150) DEFAULT NULL,
  `images` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `source` varchar(100) DEFAULT NULL,
  `source_url` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` enum('active','inactive') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `vehicles`
--

INSERT INTO `vehicles` (`id`, `make`, `model`, `year`, `daily_rate`, `price_usd`, `mileage`, `location`, `energy`, `gear_type`, `seats`, `doors`, `color`, `body_type`, `trim`, `images`, `description`, `source`, `source_url`, `created_at`, `updated_at`, `status`) VALUES
(1, 'Acura', 'ADX', 2024, '1347.00', 40395, NULL, 'Acura of Berlin', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Acura_ADX_2024_1763901245262.jpg\"]', '2026 Acura Integra A-Spec Technology', 'cars.com', NULL, '2025-09-08 00:31:45', '2025-11-23 07:34:05', ''),
(2, 'Acura', 'ADX', 2025, '1347.00', 40395, NULL, 'Acura of Berlin', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Acura_ADX_2025_1763901252514.jpg\"]', '2026 Acura Integra A-Spec Technology', 'cars.com', NULL, '2025-09-08 00:31:45', '2025-11-23 07:34:13', ''),
(3, 'Acura', 'CL', 1997, '1532.00', 45950, NULL, 'Precision Acura', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Acura_CL_1997_1763901259835.jpg\"]', '2025 Acura ADX w/A-Spec Advance Package', 'cars.com', NULL, '2025-09-08 00:31:45', '2025-11-24 03:28:49', ''),
(4, 'Acura', 'CL', 1998, '1532.00', 45950, NULL, 'Precision Acura', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Acura_CL_1998_1763901268345.jpg\"]', '2025 Acura ADX w/A-Spec Advance Package', 'cars.com', NULL, '2025-09-08 00:31:45', '2025-11-23 07:34:28', 'active'),
(5, 'Acura', 'CL', 1999, '1532.00', 45950, NULL, 'Precision Acura', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Acura_CL_1999_1763901274693.jpg\"]', '2025 Acura ADX w/A-Spec Advance Package', 'cars.com', NULL, '2025-09-08 00:31:45', '2025-11-23 07:34:35', 'active'),
(6, 'Acura', 'CL', 2000, '1347.00', 40395, NULL, 'Acura of Berlin', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Acura_CL_2000_1763901281776.jpg\"]', '2026 Acura Integra A-Spec Technology', 'cars.com', NULL, '2025-09-08 00:31:45', '2025-11-23 07:34:42', 'active'),
(7, 'Acura', 'CL', 2001, '1347.00', 40395, NULL, 'Acura of Berlin', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Acura_CL_2001_1763901289099.jpg\"]', '2026 Acura Integra A-Spec Technology', 'cars.com', NULL, '2025-09-08 00:31:45', '2025-11-23 07:34:49', 'active'),
(8, 'Acura', 'CL', 2002, '1532.00', 45950, NULL, 'Precision Acura', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Acura_CL_2002_1763901296585.jpg\"]', '2025 Acura ADX w/A-Spec Advance Package', 'cars.com', NULL, '2025-09-08 00:31:45', '2025-11-23 07:34:57', 'active'),
(9, 'Acura', 'CL', 2003, '1532.00', 45950, NULL, 'Precision Acura', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Acura_CL_2003_1763901305470.jpg\"]', '2025 Acura ADX w/A-Spec Advance Package', 'cars.com', NULL, '2025-09-08 00:31:45', '2025-11-23 07:35:05', 'active'),
(10, 'Acura', 'ILX', 2013, '1532.00', 45950, NULL, 'Precision Acura', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Acura_ILX_2013_1763901312960.jpg\"]', '2025 Acura ADX w/A-Spec Advance Package', 'cars.com', NULL, '2025-09-08 00:31:45', '2025-11-23 07:35:13', 'active'),
(11, 'Acura', 'ILX', 2014, '1532.00', 45950, NULL, 'Precision Acura', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Acura_ILX_2014_1763901319647.jpg\"]', '2025 Acura ADX w/A-Spec Advance Package', 'cars.com', NULL, '2025-09-08 00:31:45', '2025-11-23 07:35:20', 'active'),
(12, 'Acura', 'ILX', 2015, '1347.00', 40395, NULL, 'Acura of Berlin', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Acura_ILX_2015_1763901326680.jpg\"]', '2026 Acura Integra A-Spec Technology', 'cars.com', NULL, '2025-09-08 00:31:45', '2025-11-23 07:35:27', 'active'),
(13, 'Acura', 'ILX', 2016, '1532.00', 45950, NULL, 'Precision Acura', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Acura_ILX_2016_1763901333604.jpg\"]', '2025 Acura ADX w/A-Spec Advance Package', 'cars.com', NULL, '2025-09-08 00:31:45', '2025-11-23 07:35:34', 'active'),
(14, 'Acura', 'ILX', 2017, '1532.00', 45950, NULL, 'Precision Acura', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Acura_ILX_2017_1763901340616.jpg\"]', '2025 Acura ADX w/A-Spec Advance Package', 'cars.com', NULL, '2025-09-08 00:31:45', '2025-11-23 07:35:41', 'active'),
(15, 'Acura', 'ILX', 2018, '1347.00', 40395, NULL, 'Acura of Berlin', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Acura_ILX_2018_1763901347027.jpg\"]', '2026 Acura Integra A-Spec Technology', 'cars.com', NULL, '2025-09-08 00:31:45', '2025-11-23 07:35:47', 'active'),
(16, 'Acura', 'ILX', 2019, '1347.00', 40395, NULL, 'Acura of Berlin', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Acura_ILX_2019_1763901354485.jpg\"]', '2026 Acura Integra A-Spec Technology', 'cars.com', NULL, '2025-09-08 00:31:45', '2025-11-23 07:35:54', 'active'),
(17, 'Acura', 'ILX', 2020, '1532.00', 45950, NULL, 'Precision Acura', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Acura_ILX_2020_1763901362972.jpg\"]', '2025 Acura ADX w/A-Spec Advance Package', 'cars.com', NULL, '2025-09-08 00:31:45', '2025-11-23 07:36:03', 'active'),
(18, 'Acura', 'ILX', 2021, '1532.00', 45950, NULL, 'Precision Acura', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Acura_ILX_2021_1763901370260.jpg\"]', '2025 Acura ADX w/A-Spec Advance Package', 'cars.com', NULL, '2025-09-08 00:31:45', '2025-11-23 07:36:10', 'active'),
(19, 'Acura', 'ILX', 2022, '1532.00', 45950, NULL, 'Precision Acura', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Acura_ILX_2022_1763901376635.jpg\"]', '2025 Acura ADX w/A-Spec Advance Package', 'cars.com', NULL, '2025-09-08 00:31:45', '2025-11-23 07:36:17', 'active'),
(20, 'Acura', 'Integra', 2023, '1532.00', 45950, NULL, 'Precision Acura', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Acura_Integra_2023_1763901385025.jpg\"]', '2025 Acura ADX w/A-Spec Advance Package', 'cars.com', NULL, '2025-09-08 00:31:45', '2025-11-23 07:36:25', 'active'),
(21, 'Acura', 'Integra', 2024, '1532.00', 45950, NULL, 'Precision Acura', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Acura_Integra_2024_1763901393317.jpg\"]', '2025 Acura ADX w/A-Spec Advance Package', 'cars.com', NULL, '2025-09-08 00:31:45', '2025-11-23 07:36:33', 'active'),
(22, 'Acura', 'Integra', 2025, '1532.00', 45950, NULL, 'Precision Acura', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Acura_Integra_2025_1763901401532.jpg\"]', '2025 Acura ADX w/A-Spec Advance Package', 'cars.com', NULL, '2025-09-08 00:31:45', '2025-11-23 07:36:42', 'active'),
(23, 'Acura', 'MDX', 2001, '1532.00', 45950, NULL, 'Precision Acura', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Acura_MDX_2001_1763901409016.jpg\"]', '2025 Acura ADX w/A-Spec Advance Package', 'cars.com', NULL, '2025-09-08 00:31:45', '2025-11-23 07:36:49', 'active'),
(24, 'Acura', 'MDX', 2002, '1532.00', 45950, NULL, 'Precision Acura', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Acura_MDX_2002_1763901416444.jpg\"]', '2025 Acura ADX w/A-Spec Advance Package', 'cars.com', NULL, '2025-09-08 00:31:45', '2025-11-23 07:36:56', 'active'),
(25, 'Acura', 'MDX', 2003, '1532.00', 45950, NULL, 'Precision Acura', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Acura_MDX_2003_1763901423557.jpg\"]', '2025 Acura ADX w/A-Spec Advance Package', 'cars.com', NULL, '2025-09-08 00:31:45', '2025-11-23 07:37:04', 'active'),
(26, 'Acura', 'MDX', 2004, '1532.00', 45950, NULL, 'Precision Acura', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Acura_MDX_2004_1763901430966.jpg\"]', '2025 Acura ADX w/A-Spec Advance Package', 'cars.com', NULL, '2025-09-08 00:31:45', '2025-11-23 07:37:11', 'active'),
(27, 'Acura', 'MDX', 2005, '1347.00', 40395, NULL, 'Acura of Berlin', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Acura_MDX_2005_1763901437255.jpg\"]', '2026 Acura Integra A-Spec Technology', 'cars.com', NULL, '2025-09-08 00:31:45', '2025-11-23 07:37:17', 'active'),
(28, 'Acura', 'MDX', 2006, '1347.00', 40395, NULL, 'Acura of Berlin', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Acura_MDX_2006_1763901445001.jpg\"]', '2026 Acura Integra A-Spec Technology', 'cars.com', NULL, '2025-09-08 00:31:45', '2025-11-23 07:37:25', 'active'),
(29, 'Acura', 'MDX', 2007, '1532.00', 45950, NULL, 'Precision Acura', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Acura_MDX_2007_1763901451581.jpg\"]', '2025 Acura ADX w/A-Spec Advance Package', 'cars.com', NULL, '2025-09-08 00:31:45', '2025-11-23 07:37:32', 'active'),
(30, 'Acura', 'MDX', 2008, '1532.00', 45950, NULL, 'Precision Acura', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Acura_MDX_2008_1763901459718.jpg\"]', '2025 Acura ADX w/A-Spec Advance Package', 'cars.com', NULL, '2025-09-08 00:31:45', '2025-11-23 07:37:40', 'active'),
(31, 'Acura', 'MDX', 2009, '1347.00', 40395, NULL, 'Acura of Berlin', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Acura_MDX_2009_1763901467041.jpg\"]', '2026 Acura Integra A-Spec Technology', 'cars.com', NULL, '2025-09-08 00:31:45', '2025-11-23 07:37:47', 'active'),
(32, 'Acura', 'MDX', 2010, '1532.00', 45950, NULL, 'Precision Acura', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Acura_MDX_2010_1763901473925.jpg\"]', '2025 Acura ADX w/A-Spec Advance Package', 'cars.com', NULL, '2025-09-08 00:31:45', '2025-11-23 07:37:54', 'active'),
(33, 'Acura', 'MDX', 2011, '1532.00', 45950, NULL, 'Precision Acura', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Acura_MDX_2011_1763901482810.jpg\"]', '2025 Acura ADX w/A-Spec Advance Package', 'cars.com', NULL, '2025-09-08 00:31:45', '2025-11-23 07:38:03', 'active'),
(34, 'Acura', 'MDX', 2012, '1532.00', 45950, NULL, 'Precision Acura', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Acura_MDX_2012_1763901490179.jpg\"]', '2025 Acura ADX w/A-Spec Advance Package', 'cars.com', NULL, '2025-09-08 00:31:45', '2025-11-23 07:38:10', 'active'),
(35, 'Acura', 'MDX', 2013, '1532.00', 45950, NULL, 'Precision Acura', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Acura_MDX_2013_1763901497792.jpg\"]', '2025 Acura ADX w/A-Spec Advance Package', 'cars.com', NULL, '2025-09-08 00:31:45', '2025-11-23 07:38:18', 'active'),
(36, 'Acura', 'MDX', 2014, '1532.00', 45950, NULL, 'Precision Acura', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Acura_MDX_2014_1763901505708.jpg\"]', '2025 Acura ADX w/A-Spec Advance Package', 'cars.com', NULL, '2025-09-08 00:31:45', '2025-11-23 07:38:26', 'active'),
(37, 'Acura', 'MDX', 2015, '1532.00', 45950, NULL, 'Precision Acura', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Acura_MDX_2015_1763901512719.jpg\"]', '2025 Acura ADX w/A-Spec Advance Package', 'cars.com', NULL, '2025-09-08 00:31:45', '2025-11-23 07:38:33', 'active'),
(38, 'Acura', 'MDX', 2016, '1347.00', 40395, NULL, 'Acura of Berlin', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Acura_MDX_2016_1763901519911.jpg\"]', '2026 Acura Integra A-Spec Technology', 'cars.com', NULL, '2025-09-08 00:31:45', '2025-11-23 07:38:40', 'active'),
(39, 'Acura', 'MDX', 2017, '1347.00', 40395, NULL, 'Acura of Berlin', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Acura_MDX_2017_1763901528332.jpg\"]', '2026 Acura Integra A-Spec Technology', 'cars.com', NULL, '2025-09-08 00:31:45', '2025-11-23 07:38:48', 'active'),
(40, 'Acura', 'MDX', 2018, '1532.00', 45950, NULL, 'Precision Acura', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Acura_MDX_2018_1763901536127.jpg\"]', '2025 Acura ADX w/A-Spec Advance Package', 'cars.com', NULL, '2025-09-08 00:31:45', '2025-11-23 07:38:56', 'active'),
(41, 'Acura', 'MDX', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(42, 'Acura', 'MDX', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(43, 'Acura', 'MDX', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(44, 'Acura', 'MDX', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(45, 'Acura', 'MDX', 2023, '1299.00', 38983, 26645, 'Acura of Berlin', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[\"/images/cars/Acura_MDX_2023_1763904958504.jpg\"]', NULL, 'cars.com', 'https://www.cars.com/vehicledetail/49100478-9bb1-49d1-ad76-6d3698143c2b/', '2025-09-08 00:31:45', '2025-11-23 08:35:59', 'active'),
(46, 'Acura', 'MDX', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(47, 'Acura', 'MDX', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(48, 'Acura', 'NSX', 1991, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(49, 'Acura', 'NSX', 1992, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(50, 'Acura', 'NSX', 1993, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(51, 'Acura', 'NSX', 1994, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(52, 'Acura', 'NSX', 1995, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(53, 'Acura', 'NSX', 1996, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(54, 'Acura', 'NSX', 1997, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(55, 'Acura', 'NSX', 1998, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(56, 'Acura', 'NSX', 1999, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(57, 'Acura', 'NSX', 2000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(58, 'Acura', 'NSX', 2001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(59, 'Acura', 'NSX', 2002, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(60, 'Acura', 'NSX', 2003, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(61, 'Acura', 'NSX', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(62, 'Acura', 'NSX', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(63, 'Acura', 'NSX', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(64, 'Acura', 'NSX', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(65, 'Acura', 'NSX', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(66, 'Acura', 'NSX', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(67, 'Acura', 'NSX', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(68, 'Acura', 'NSX', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(69, 'Acura', 'RDX', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(70, 'Acura', 'RDX', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(71, 'Acura', 'RDX', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(72, 'Acura', 'RDX', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(73, 'Acura', 'RDX', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(74, 'Acura', 'RDX', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(75, 'Acura', 'RDX', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(76, 'Acura', 'RDX', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(77, 'Acura', 'RDX', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(78, 'Acura', 'RDX', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(79, 'Acura', 'RDX', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(80, 'Acura', 'RDX', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(81, 'Acura', 'RDX', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(82, 'Acura', 'RDX', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(83, 'Acura', 'RDX', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(84, 'Acura', 'RDX', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(85, 'Acura', 'RDX', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(86, 'Acura', 'RDX', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(87, 'Acura', 'RDX', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(88, 'Acura', 'RL', 1996, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(89, 'Acura', 'RL', 1997, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(90, 'Acura', 'RL', 1998, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(91, 'Acura', 'RL', 1999, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(92, 'Acura', 'RL', 2000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(93, 'Acura', 'RL', 2001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(94, 'Acura', 'RL', 2002, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(95, 'Acura', 'RL', 2003, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(96, 'Acura', 'RL', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(97, 'Acura', 'RL', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(98, 'Acura', 'RL', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(99, 'Acura', 'RL', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(100, 'Acura', 'RL', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(101, 'Acura', 'RL', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(102, 'Acura', 'RL', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(103, 'Acura', 'RL', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(104, 'Acura', 'RL', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(105, 'Acura', 'RLX', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(106, 'Acura', 'RLX', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(107, 'Acura', 'RLX', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(108, 'Acura', 'RLX', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(109, 'Acura', 'RLX', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(110, 'Acura', 'RLX', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(111, 'Acura', 'RLX', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(112, 'Acura', 'RLX', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(113, 'Acura', 'TL', 1996, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(114, 'Acura', 'TL', 1997, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(115, 'Acura', 'TL', 1998, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(116, 'Acura', 'TL', 1999, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(117, 'Acura', 'TL', 2000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(118, 'Acura', 'TL', 2001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(119, 'Acura', 'TL', 2002, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(120, 'Acura', 'TL', 2003, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(121, 'Acura', 'TL', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(122, 'Acura', 'TL', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(123, 'Acura', 'TL', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(124, 'Acura', 'TL', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(125, 'Acura', 'TL', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(126, 'Acura', 'TL', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(127, 'Acura', 'TL', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(128, 'Acura', 'TL', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(129, 'Acura', 'TL', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(130, 'Acura', 'TL', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(131, 'Acura', 'TL', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(132, 'Acura', 'TLX', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(133, 'Acura', 'TLX', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(134, 'Acura', 'TLX', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(135, 'Acura', 'TLX', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(136, 'Acura', 'TLX', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(137, 'Acura', 'TLX', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(138, 'Acura', 'TLX', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(139, 'Acura', 'TLX', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(140, 'Acura', 'TLX', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(141, 'Acura', 'TLX', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(142, 'Acura', 'TLX', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(143, 'Acura', 'TSX', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(144, 'Acura', 'TSX', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(145, 'Acura', 'TSX', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(146, 'Acura', 'TSX', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(147, 'Acura', 'TSX', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(148, 'Acura', 'TSX', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(149, 'Acura', 'TSX', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(150, 'Acura', 'TSX', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(151, 'Acura', 'TSX', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(152, 'Acura', 'TSX', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(153, 'Acura', 'TSX', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(154, 'Acura', 'ZDX', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(155, 'Acura', 'ZDX', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(156, 'Acura', 'ZDX', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(157, 'Acura', 'ZDX', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(158, 'Alfa Romeo', '4C', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(159, 'Alfa Romeo', '4C', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(160, 'Alfa Romeo', '4C', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(161, 'Alfa Romeo', '4C', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(162, 'Alfa Romeo', '4C', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(163, 'Alfa Romeo', '4C', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(164, 'Alfa Romeo', '4C', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(165, 'Alfa Romeo', '4C', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(166, 'Alfa Romeo', 'Giulia', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(167, 'Alfa Romeo', 'Giulia', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(168, 'Alfa Romeo', 'Giulia', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(169, 'Alfa Romeo', 'Giulia', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(170, 'Alfa Romeo', 'Giulia', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(171, 'Alfa Romeo', 'Giulia', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(172, 'Alfa Romeo', 'Giulia', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(173, 'Alfa Romeo', 'Giulia', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(174, 'Alfa Romeo', 'Giulia', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(175, 'Alfa Romeo', 'Giulia', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(176, 'Alfa Romeo', 'Stelvio', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(177, 'Alfa Romeo', 'Stelvio', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(178, 'Alfa Romeo', 'Stelvio', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(179, 'Alfa Romeo', 'Stelvio', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(180, 'Alfa Romeo', 'Stelvio', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(181, 'Alfa Romeo', 'Stelvio', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(182, 'Alfa Romeo', 'Stelvio', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(183, 'Alfa Romeo', 'Stelvio', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(184, 'Alfa Romeo', 'Stelvio', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(185, 'Alfa Romeo', 'Tonale', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(186, 'Alfa Romeo', 'Tonale', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(187, 'Alfa Romeo', 'Tonale', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(188, 'Aston Martin', 'DB11', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(189, 'Aston Martin', 'DB11', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(190, 'Aston Martin', 'DB11', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(191, 'Aston Martin', 'DB11', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(192, 'Aston Martin', 'DB11', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(193, 'Aston Martin', 'DB11', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(194, 'Aston Martin', 'DB11', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(195, 'Aston Martin', 'DBX', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(196, 'Aston Martin', 'DBX', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(197, 'Aston Martin', 'DBX', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(198, 'Aston Martin', 'DBX', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(199, 'Aston Martin', 'DBX', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(200, 'Aston Martin', 'DBX', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(201, 'Aston Martin', 'Rapide', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(202, 'Aston Martin', 'Rapide', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(203, 'Aston Martin', 'Rapide', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(204, 'Aston Martin', 'Rapide', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(205, 'Aston Martin', 'Rapide', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(206, 'Aston Martin', 'Rapide', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(207, 'Aston Martin', 'Rapide', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(208, 'Aston Martin', 'Rapide', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(209, 'Aston Martin', 'Rapide', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(210, 'Aston Martin', 'Rapide', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(211, 'Aston Martin', 'Rapide', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(212, 'Aston Martin', 'Vanquish', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(213, 'Aston Martin', 'Vanquish', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(214, 'Aston Martin', 'Vanquish', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(215, 'Aston Martin', 'Vanquish', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(216, 'Aston Martin', 'Vanquish', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(217, 'Aston Martin', 'Vanquish', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(218, 'Aston Martin', 'Vantage', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(219, 'Aston Martin', 'Vantage', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(220, 'Aston Martin', 'Vantage', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(221, 'Aston Martin', 'Vantage', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(222, 'Aston Martin', 'Vantage', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(223, 'Aston Martin', 'Vantage', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(224, 'Aston Martin', 'Vantage', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(225, 'Aston Martin', 'Vantage', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(226, 'Aston Martin', 'Vantage', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(227, 'Aston Martin', 'Vantage', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(228, 'Aston Martin', 'Vantage', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(229, 'Aston Martin', 'Vantage', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(230, 'Aston Martin', 'Vantage', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(231, 'Aston Martin', 'Vantage', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(232, 'Aston Martin', 'Vantage', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(233, 'Aston Martin', 'Vantage', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(234, 'Aston Martin', 'Vantage', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(235, 'Aston Martin', 'Vantage', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(236, 'Aston Martin', 'Vantage', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(237, 'Aston Martin', 'Vantage', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(238, 'Aston Martin', 'Vantage', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(239, 'Audi', 'A1', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(240, 'Audi', 'A1', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(241, 'Audi', 'A1', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(242, 'Audi', 'A1', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(243, 'Audi', 'A1', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(244, 'Audi', 'A1', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(245, 'Audi', 'A1', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(246, 'Audi', 'A1', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(247, 'Audi', 'A1', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(248, 'Audi', 'A1', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(249, 'Audi', 'A1', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(250, 'Audi', 'A1', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(251, 'Audi', 'A1', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(252, 'Audi', 'A1', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(253, 'Audi', 'A1', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(254, 'Audi', 'A3', 1997, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(255, 'Audi', 'A3', 1998, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active');
INSERT INTO `vehicles` (`id`, `make`, `model`, `year`, `daily_rate`, `price_usd`, `mileage`, `location`, `energy`, `gear_type`, `seats`, `doors`, `color`, `body_type`, `trim`, `images`, `description`, `source`, `source_url`, `created_at`, `updated_at`, `status`) VALUES
(256, 'Audi', 'A3', 1999, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(257, 'Audi', 'A3', 2000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(258, 'Audi', 'A3', 2001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(259, 'Audi', 'A3', 2002, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(260, 'Audi', 'A3', 2003, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(261, 'Audi', 'A3', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(262, 'Audi', 'A3', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(263, 'Audi', 'A3', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(264, 'Audi', 'A3', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(265, 'Audi', 'A3', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(266, 'Audi', 'A3', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(267, 'Audi', 'A3', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(268, 'Audi', 'A3', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(269, 'Audi', 'A3', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(270, 'Audi', 'A3', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(271, 'Audi', 'A3', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(272, 'Audi', 'A3', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(273, 'Audi', 'A3', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(274, 'Audi', 'A3', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(275, 'Audi', 'A3', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(276, 'Audi', 'A3', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(277, 'Audi', 'A3', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(278, 'Audi', 'A3', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(279, 'Audi', 'A3', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(280, 'Audi', 'A3', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(281, 'Audi', 'A3', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(282, 'Audi', 'A3', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(283, 'Audi', 'A4', 1996, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(284, 'Audi', 'A4', 1997, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(285, 'Audi', 'A4', 1998, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(286, 'Audi', 'A4', 1999, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(287, 'Audi', 'A4', 2000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(288, 'Audi', 'A4', 2001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(289, 'Audi', 'A4', 2002, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(290, 'Audi', 'A4', 2003, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(291, 'Audi', 'A4', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(292, 'Audi', 'A4', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(293, 'Audi', 'A4', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(294, 'Audi', 'A4', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(295, 'Audi', 'A4', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(296, 'Audi', 'A4', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(297, 'Audi', 'A4', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(298, 'Audi', 'A4', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(299, 'Audi', 'A4', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(300, 'Audi', 'A4', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(301, 'Audi', 'A4', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(302, 'Audi', 'A4', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(303, 'Audi', 'A4', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(304, 'Audi', 'A4', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(305, 'Audi', 'A4', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(306, 'Audi', 'A4', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(307, 'Audi', 'A4', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(308, 'Audi', 'A4', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(309, 'Audi', 'A4', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(310, 'Audi', 'A4', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(311, 'Audi', 'A4', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(312, 'Audi', 'A4', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(313, 'Audi', 'A5', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(314, 'Audi', 'A5', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(315, 'Audi', 'A5', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(316, 'Audi', 'A5', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(317, 'Audi', 'A5', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(318, 'Audi', 'A5', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(319, 'Audi', 'A5', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(320, 'Audi', 'A5', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(321, 'Audi', 'A5', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(322, 'Audi', 'A5', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(323, 'Audi', 'A5', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(324, 'Audi', 'A5', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(325, 'Audi', 'A5', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(326, 'Audi', 'A5', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(327, 'Audi', 'A5', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(328, 'Audi', 'A5', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(329, 'Audi', 'A5', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(330, 'Audi', 'A5', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(331, 'Audi', 'A6', 1995, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(332, 'Audi', 'A6', 1996, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(333, 'Audi', 'A6', 1997, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(334, 'Audi', 'A6', 1998, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(335, 'Audi', 'A6', 1999, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(336, 'Audi', 'A6', 2000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(337, 'Audi', 'A6', 2001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(338, 'Audi', 'A6', 2002, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(339, 'Audi', 'A6', 2003, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(340, 'Audi', 'A6', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(341, 'Audi', 'A6', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(342, 'Audi', 'A6', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(343, 'Audi', 'A6', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(344, 'Audi', 'A6', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(345, 'Audi', 'A6', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(346, 'Audi', 'A6', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(347, 'Audi', 'A6', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(348, 'Audi', 'A6', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(349, 'Audi', 'A6', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(350, 'Audi', 'A6', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(351, 'Audi', 'A6', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(352, 'Audi', 'A6', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(353, 'Audi', 'A6', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(354, 'Audi', 'A6', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(355, 'Audi', 'A6', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(356, 'Audi', 'A6', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(357, 'Audi', 'A6', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(358, 'Audi', 'A6', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(359, 'Audi', 'A6', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(360, 'Audi', 'A6', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(361, 'Audi', 'A6', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(362, 'Audi', 'A7', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(363, 'Audi', 'A7', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(364, 'Audi', 'A7', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(365, 'Audi', 'A7', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(366, 'Audi', 'A7', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(367, 'Audi', 'A7', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(368, 'Audi', 'A7', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(369, 'Audi', 'A7', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(370, 'Audi', 'A7', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(371, 'Audi', 'A7', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(372, 'Audi', 'A7', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(373, 'Audi', 'A7', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(374, 'Audi', 'A7', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(375, 'Audi', 'A7', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(376, 'Audi', 'A8', 1994, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(377, 'Audi', 'A8', 1995, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(378, 'Audi', 'A8', 1996, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(379, 'Audi', 'A8', 1997, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(380, 'Audi', 'A8', 1998, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(381, 'Audi', 'A8', 1999, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(382, 'Audi', 'A8', 2000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(383, 'Audi', 'A8', 2001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(384, 'Audi', 'A8', 2002, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(385, 'Audi', 'A8', 2003, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(386, 'Audi', 'A8', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(387, 'Audi', 'A8', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(388, 'Audi', 'A8', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(389, 'Audi', 'A8', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(390, 'Audi', 'A8', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(391, 'Audi', 'A8', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(392, 'Audi', 'A8', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(393, 'Audi', 'A8', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(394, 'Audi', 'A8', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(395, 'Audi', 'A8', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(396, 'Audi', 'A8', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(397, 'Audi', 'A8', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(398, 'Audi', 'A8', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(399, 'Audi', 'A8', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(400, 'Audi', 'A8', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(401, 'Audi', 'A8', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(402, 'Audi', 'A8', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(403, 'Audi', 'A8', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(404, 'Audi', 'A8', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(405, 'Audi', 'A8', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(406, 'Audi', 'A8', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(407, 'Audi', 'A8', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(408, 'Audi', 'e-tron', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(409, 'Audi', 'e-tron', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(410, 'Audi', 'e-tron', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(411, 'Audi', 'e-tron', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(412, 'Audi', 'e-tron', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(413, 'Audi', 'e-tron', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(414, 'Audi', 'e-tron', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(415, 'Audi', 'e-tron GT', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(416, 'Audi', 'e-tron GT', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(417, 'Audi', 'e-tron GT', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(418, 'Audi', 'e-tron GT', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(419, 'Audi', 'e-tron GT', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(420, 'Audi', 'Q1', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(421, 'Audi', 'Q1', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(422, 'Audi', 'Q1', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(423, 'Audi', 'Q1', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(424, 'Audi', 'Q1', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(425, 'Audi', 'Q1', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(426, 'Audi', 'Q1', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(427, 'Audi', 'Q1', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(428, 'Audi', 'Q1', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(429, 'Audi', 'Q3', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(430, 'Audi', 'Q3', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(431, 'Audi', 'Q3', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(432, 'Audi', 'Q3', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(433, 'Audi', 'Q3', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(434, 'Audi', 'Q3', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(435, 'Audi', 'Q3', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(436, 'Audi', 'Q3', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(437, 'Audi', 'Q3', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(438, 'Audi', 'Q3', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(439, 'Audi', 'Q3', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(440, 'Audi', 'Q3', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(441, 'Audi', 'Q3', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(442, 'Audi', 'Q3', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(443, 'Audi', 'Q3', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(444, 'Audi', 'Q4 e-tron', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(445, 'Audi', 'Q4 e-tron', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(446, 'Audi', 'Q4 e-tron', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(447, 'Audi', 'Q4 e-tron', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(448, 'Audi', 'Q4 e-tron', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(449, 'Audi', 'Q5', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(450, 'Audi', 'Q5', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(451, 'Audi', 'Q5', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(452, 'Audi', 'Q5', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(453, 'Audi', 'Q5', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(454, 'Audi', 'Q5', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(455, 'Audi', 'Q5', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(456, 'Audi', 'Q5', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(457, 'Audi', 'Q5', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(458, 'Audi', 'Q5', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(459, 'Audi', 'Q5', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(460, 'Audi', 'Q5', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(461, 'Audi', 'Q5', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(462, 'Audi', 'Q5', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(463, 'Audi', 'Q5', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(464, 'Audi', 'Q5', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(465, 'Audi', 'Q5', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(466, 'Audi', 'Q7', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(467, 'Audi', 'Q7', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(468, 'Audi', 'Q7', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(469, 'Audi', 'Q7', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(470, 'Audi', 'Q7', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(471, 'Audi', 'Q7', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(472, 'Audi', 'Q7', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(473, 'Audi', 'Q7', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(474, 'Audi', 'Q7', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(475, 'Audi', 'Q7', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(476, 'Audi', 'Q7', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(477, 'Audi', 'Q7', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(478, 'Audi', 'Q7', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(479, 'Audi', 'Q7', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(480, 'Audi', 'Q7', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(481, 'Audi', 'Q7', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(482, 'Audi', 'Q7', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(483, 'Audi', 'Q7', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(484, 'Audi', 'Q7', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(485, 'Audi', 'Q7', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(486, 'Audi', 'Q8', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(487, 'Audi', 'Q8', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(488, 'Audi', 'Q8', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(489, 'Audi', 'Q8', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(490, 'Audi', 'Q8', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(491, 'Audi', 'Q8', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(492, 'Audi', 'Q8', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(493, 'Audi', 'Q8', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(494, 'Audi', 'R8', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(495, 'Audi', 'R8', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(496, 'Audi', 'R8', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(497, 'Audi', 'R8', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(498, 'Audi', 'R8', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(499, 'Audi', 'R8', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(500, 'Audi', 'R8', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(501, 'Audi', 'R8', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(502, 'Audi', 'R8', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(503, 'Audi', 'R8', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(504, 'Audi', 'R8', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(505, 'Audi', 'R8', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(506, 'Audi', 'R8', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(507, 'Audi', 'R8', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(508, 'Audi', 'R8', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(509, 'Audi', 'R8', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(510, 'Audi', 'R8', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(511, 'Audi', 'R8', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(512, 'Audi', 'R8', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(513, 'Audi', 'RS3', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(514, 'Audi', 'RS3', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(515, 'Audi', 'RS3', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(516, 'Audi', 'RS3', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(517, 'Audi', 'RS3', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(518, 'Audi', 'RS3', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(519, 'Audi', 'RS3', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(520, 'Audi', 'RS3', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(521, 'Audi', 'RS3', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(522, 'Audi', 'RS3', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(523, 'Audi', 'RS3', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(524, 'Audi', 'RS3', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(525, 'Audi', 'RS3', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(526, 'Audi', 'RS3', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(527, 'Audi', 'RS3', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(528, 'Audi', 'RS4', 2000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(529, 'Audi', 'RS4', 2001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(530, 'Audi', 'RS4', 2002, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(531, 'Audi', 'RS4', 2003, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(532, 'Audi', 'RS4', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(533, 'Audi', 'RS4', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(534, 'Audi', 'RS4', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(535, 'Audi', 'RS4', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(536, 'Audi', 'RS4', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(537, 'Audi', 'RS4', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(538, 'Audi', 'RS4', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(539, 'Audi', 'RS4', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(540, 'Audi', 'RS4', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(541, 'Audi', 'RS4', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(542, 'Audi', 'RS4', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(543, 'Audi', 'RS4', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(544, 'Audi', 'RS4', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(545, 'Audi', 'RS4', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active');
INSERT INTO `vehicles` (`id`, `make`, `model`, `year`, `daily_rate`, `price_usd`, `mileage`, `location`, `energy`, `gear_type`, `seats`, `doors`, `color`, `body_type`, `trim`, `images`, `description`, `source`, `source_url`, `created_at`, `updated_at`, `status`) VALUES
(546, 'Audi', 'RS4', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(547, 'Audi', 'RS4', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(548, 'Audi', 'RS4', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(549, 'Audi', 'RS5', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(550, 'Audi', 'RS5', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(551, 'Audi', 'RS5', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(552, 'Audi', 'RS5', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(553, 'Audi', 'RS5', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(554, 'Audi', 'RS5', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(555, 'Audi', 'RS5', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(556, 'Audi', 'RS5', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(557, 'Audi', 'RS5', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(558, 'Audi', 'RS5', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(559, 'Audi', 'RS5', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(560, 'Audi', 'RS5', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(561, 'Audi', 'RS5', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(562, 'Audi', 'RS5', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(563, 'Audi', 'RS5', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(564, 'Audi', 'RS6', 2003, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(565, 'Audi', 'RS6', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(566, 'Audi', 'RS6', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(567, 'Audi', 'RS6', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(568, 'Audi', 'RS6', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(569, 'Audi', 'RS6', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(570, 'Audi', 'RS6', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(571, 'Audi', 'RS6', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(572, 'Audi', 'RS6', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(573, 'Audi', 'RS6', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(574, 'Audi', 'RS6', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(575, 'Audi', 'RS6', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(576, 'Audi', 'RS6', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(577, 'Audi', 'RS6', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(578, 'Audi', 'RS6', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(579, 'Audi', 'RS6', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(580, 'Audi', 'RS6', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(581, 'Audi', 'RS6', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(582, 'Audi', 'RS7', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(583, 'Audi', 'RS7', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(584, 'Audi', 'RS7', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(585, 'Audi', 'RS7', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(586, 'Audi', 'RS7', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(587, 'Audi', 'RS7', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(588, 'Audi', 'RS7', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(589, 'Audi', 'RS7', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(590, 'Audi', 'RS7', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(591, 'Audi', 'RS7', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(592, 'Audi', 'RS7', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(593, 'Audi', 'RS7', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(594, 'Audi', 'RS7', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(595, 'Audi', 'RSQ8', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(596, 'Audi', 'RSQ8', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(597, 'Audi', 'RSQ8', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(598, 'Audi', 'RSQ8', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(599, 'Audi', 'RSQ8', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(600, 'Audi', 'RSQ8', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(601, 'Audi', 'RSQ8', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(602, 'Audi', 'S3', 1999, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(603, 'Audi', 'S3', 2000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(604, 'Audi', 'S3', 2001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(605, 'Audi', 'S3', 2002, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(606, 'Audi', 'S3', 2003, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(607, 'Audi', 'S3', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(608, 'Audi', 'S3', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(609, 'Audi', 'S3', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(610, 'Audi', 'S3', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(611, 'Audi', 'S3', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(612, 'Audi', 'S3', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(613, 'Audi', 'S3', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(614, 'Audi', 'S3', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(615, 'Audi', 'S3', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(616, 'Audi', 'S3', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(617, 'Audi', 'S3', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(618, 'Audi', 'S3', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(619, 'Audi', 'S3', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(620, 'Audi', 'S3', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(621, 'Audi', 'S3', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(622, 'Audi', 'S3', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(623, 'Audi', 'S3', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(624, 'Audi', 'S3', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(625, 'Audi', 'S3', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(626, 'Audi', 'S3', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(627, 'Audi', 'S4', 1992, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(628, 'Audi', 'S4', 1993, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(629, 'Audi', 'S4', 1994, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(630, 'Audi', 'S4', 2000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(631, 'Audi', 'S4', 2001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(632, 'Audi', 'S4', 2002, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(633, 'Audi', 'S4', 2003, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(634, 'Audi', 'S4', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(635, 'Audi', 'S4', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(636, 'Audi', 'S4', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(637, 'Audi', 'S4', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(638, 'Audi', 'S4', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(639, 'Audi', 'S4', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(640, 'Audi', 'S4', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(641, 'Audi', 'S4', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(642, 'Audi', 'S4', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(643, 'Audi', 'S4', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(644, 'Audi', 'S4', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(645, 'Audi', 'S4', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(646, 'Audi', 'S4', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(647, 'Audi', 'S4', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(648, 'Audi', 'S4', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(649, 'Audi', 'S4', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(650, 'Audi', 'S4', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(651, 'Audi', 'S4', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(652, 'Audi', 'S4', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(653, 'Audi', 'S4', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(654, 'Audi', 'S4', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(655, 'Audi', 'S4', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(656, 'Audi', 'S5', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(657, 'Audi', 'S5', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(658, 'Audi', 'S5', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(659, 'Audi', 'S5', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(660, 'Audi', 'S5', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(661, 'Audi', 'S5', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(662, 'Audi', 'S5', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(663, 'Audi', 'S5', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(664, 'Audi', 'S5', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(665, 'Audi', 'S5', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(666, 'Audi', 'S5', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(667, 'Audi', 'S5', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(668, 'Audi', 'S5', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(669, 'Audi', 'S5', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(670, 'Audi', 'S5', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(671, 'Audi', 'S5', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(672, 'Audi', 'S5', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(673, 'Audi', 'S5', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(674, 'Audi', 'S6', 1995, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(675, 'Audi', 'S6', 1996, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(676, 'Audi', 'S6', 1997, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(677, 'Audi', 'S6', 1999, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(678, 'Audi', 'S6', 2000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(679, 'Audi', 'S6', 2001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(680, 'Audi', 'S6', 2002, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(681, 'Audi', 'S6', 2003, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(682, 'Audi', 'S6', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(683, 'Audi', 'S6', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(684, 'Audi', 'S6', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(685, 'Audi', 'S6', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(686, 'Audi', 'S6', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(687, 'Audi', 'S6', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(688, 'Audi', 'S6', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(689, 'Audi', 'S6', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(690, 'Audi', 'S6', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(691, 'Audi', 'S6', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(692, 'Audi', 'S6', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(693, 'Audi', 'S6', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(694, 'Audi', 'S6', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(695, 'Audi', 'S6', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(696, 'Audi', 'S6', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(697, 'Audi', 'S6', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(698, 'Audi', 'S6', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(699, 'Audi', 'S6', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(700, 'Audi', 'S6', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(701, 'Audi', 'S7', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(702, 'Audi', 'S7', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(703, 'Audi', 'S7', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(704, 'Audi', 'S7', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(705, 'Audi', 'S7', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(706, 'Audi', 'S7', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(707, 'Audi', 'S7', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(708, 'Audi', 'S7', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(709, 'Audi', 'S7', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(710, 'Audi', 'S7', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(711, 'Audi', 'S7', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(712, 'Audi', 'S7', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(713, 'Audi', 'S7', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(714, 'Audi', 'S7', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(715, 'Audi', 'S8', 1996, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(716, 'Audi', 'S8', 1997, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(717, 'Audi', 'S8', 1998, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(718, 'Audi', 'S8', 1999, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(719, 'Audi', 'S8', 2000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(720, 'Audi', 'S8', 2001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(721, 'Audi', 'S8', 2002, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(722, 'Audi', 'S8', 2003, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(723, 'Audi', 'S8', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(724, 'Audi', 'S8', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(725, 'Audi', 'S8', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(726, 'Audi', 'S8', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(727, 'Audi', 'S8', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(728, 'Audi', 'S8', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(729, 'Audi', 'S8', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(730, 'Audi', 'S8', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(731, 'Audi', 'S8', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(732, 'Audi', 'S8', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(733, 'Audi', 'S8', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(734, 'Audi', 'S8', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(735, 'Audi', 'S8', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(736, 'Audi', 'S8', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(737, 'Audi', 'S8', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(738, 'Audi', 'S8', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(739, 'Audi', 'S8', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(740, 'Audi', 'SQ5', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(741, 'Audi', 'SQ5', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(742, 'Audi', 'SQ5', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(743, 'Audi', 'SQ5', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(744, 'Audi', 'SQ5', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(745, 'Audi', 'SQ5', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(746, 'Audi', 'SQ5', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(747, 'Audi', 'SQ5', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(748, 'Audi', 'SQ5', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(749, 'Audi', 'SQ5', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(750, 'Audi', 'SQ5', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(751, 'Audi', 'SQ7', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(752, 'Audi', 'SQ7', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(753, 'Audi', 'SQ7', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(754, 'Audi', 'SQ7', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(755, 'Audi', 'SQ7', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(756, 'Audi', 'SQ7', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(757, 'Audi', 'SQ7', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(758, 'Audi', 'SQ7', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(759, 'Audi', 'SQ7', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(760, 'Audi', 'SQ8', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(761, 'Audi', 'SQ8', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(762, 'Audi', 'SQ8', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(763, 'Audi', 'SQ8', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(764, 'Audi', 'SQ8', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(765, 'Audi', 'SQ8', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(766, 'Audi', 'SQ8', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(767, 'Audi', 'TT', 1998, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(768, 'Audi', 'TT', 1999, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(769, 'Audi', 'TT', 2000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(770, 'Audi', 'TT', 2001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(771, 'Audi', 'TT', 2002, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(772, 'Audi', 'TT', 2003, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(773, 'Audi', 'TT', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(774, 'Audi', 'TT', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(775, 'Audi', 'TT', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(776, 'Audi', 'TT', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(777, 'Audi', 'TT', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(778, 'Audi', 'TT', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(779, 'Audi', 'TT', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(780, 'Audi', 'TT', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(781, 'Audi', 'TT', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(782, 'Audi', 'TT', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(783, 'Audi', 'TT', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(784, 'Audi', 'TT', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(785, 'Audi', 'TT', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(786, 'Audi', 'TT', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(787, 'Audi', 'TT', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(788, 'Audi', 'TT', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(789, 'Audi', 'TT', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(790, 'Audi', 'TT', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(791, 'Audi', 'TT', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(792, 'BMW', '1 Series', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(793, 'BMW', '1 Series', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(794, 'BMW', '1 Series', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(795, 'BMW', '1 Series', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(796, 'BMW', '1 Series', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(797, 'BMW', '1 Series', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(798, 'BMW', '1 Series', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(799, 'BMW', '1 Series', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(800, 'BMW', '1 Series', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(801, 'BMW', '1 Series', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(802, 'BMW', '1 Series', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(803, 'BMW', '1 Series', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(804, 'BMW', '1 Series', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(805, 'BMW', '1 Series', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(806, 'BMW', '1 Series', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(807, 'BMW', '1 Series', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(808, 'BMW', '1 Series', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(809, 'BMW', '1 Series', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(810, 'BMW', '2 Series', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(811, 'BMW', '2 Series', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(812, 'BMW', '2 Series', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(813, 'BMW', '2 Series', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(814, 'BMW', '2 Series', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(815, 'BMW', '2 Series', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(816, 'BMW', '2 Series', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(817, 'BMW', '2 Series', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(818, 'BMW', '2 Series', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(819, 'BMW', '2 Series', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(820, 'BMW', '2 Series', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(821, 'BMW', '2 Series', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(822, 'BMW', '3 Series', 1992, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(823, 'BMW', '3 Series', 1993, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(824, 'BMW', '3 Series', 1994, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(825, 'BMW', '3 Series', 1995, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(826, 'BMW', '3 Series', 1996, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(827, 'BMW', '3 Series', 1997, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(828, 'BMW', '3 Series', 1998, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(829, 'BMW', '3 Series', 1999, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(830, 'BMW', '3 Series', 2000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(831, 'BMW', '3 Series', 2001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(832, 'BMW', '3 Series', 2002, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(833, 'BMW', '3 Series', 2003, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(834, 'BMW', '3 Series', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active');
INSERT INTO `vehicles` (`id`, `make`, `model`, `year`, `daily_rate`, `price_usd`, `mileage`, `location`, `energy`, `gear_type`, `seats`, `doors`, `color`, `body_type`, `trim`, `images`, `description`, `source`, `source_url`, `created_at`, `updated_at`, `status`) VALUES
(835, 'BMW', '3 Series', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(836, 'BMW', '3 Series', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(837, 'BMW', '3 Series', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(838, 'BMW', '3 Series', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(839, 'BMW', '3 Series', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(840, 'BMW', '3 Series', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(841, 'BMW', '3 Series', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(842, 'BMW', '3 Series', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(843, 'BMW', '3 Series', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(844, 'BMW', '3 Series', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(845, 'BMW', '3 Series', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(846, 'BMW', '3 Series', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(847, 'BMW', '3 Series', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(848, 'BMW', '3 Series', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(849, 'BMW', '3 Series', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(850, 'BMW', '3 Series', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(851, 'BMW', '3 Series', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(852, 'BMW', '3 Series', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(853, 'BMW', '3 Series', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(854, 'BMW', '3 Series', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(855, 'BMW', '3 Series', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(856, 'BMW', '4 Series', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(857, 'BMW', '4 Series', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(858, 'BMW', '4 Series', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(859, 'BMW', '4 Series', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(860, 'BMW', '4 Series', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(861, 'BMW', '4 Series', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(862, 'BMW', '4 Series', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(863, 'BMW', '4 Series', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(864, 'BMW', '4 Series', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(865, 'BMW', '4 Series', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(866, 'BMW', '4 Series', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(867, 'BMW', '4 Series', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(868, 'BMW', '4 Series', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(869, 'BMW', '5 Series', 1988, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(870, 'BMW', '5 Series', 1989, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(871, 'BMW', '5 Series', 1990, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(872, 'BMW', '5 Series', 1991, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(873, 'BMW', '5 Series', 1992, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(874, 'BMW', '5 Series', 1993, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(875, 'BMW', '5 Series', 1994, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(876, 'BMW', '5 Series', 1995, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(877, 'BMW', '5 Series', 1996, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(878, 'BMW', '5 Series', 1997, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(879, 'BMW', '5 Series', 1998, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(880, 'BMW', '5 Series', 1999, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(881, 'BMW', '5 Series', 2000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(882, 'BMW', '5 Series', 2001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(883, 'BMW', '5 Series', 2002, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(884, 'BMW', '5 Series', 2003, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(885, 'BMW', '5 Series', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(886, 'BMW', '5 Series', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(887, 'BMW', '5 Series', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(888, 'BMW', '5 Series', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(889, 'BMW', '5 Series', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(890, 'BMW', '5 Series', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(891, 'BMW', '5 Series', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(892, 'BMW', '5 Series', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(893, 'BMW', '5 Series', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(894, 'BMW', '5 Series', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(895, 'BMW', '5 Series', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(896, 'BMW', '5 Series', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(897, 'BMW', '5 Series', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(898, 'BMW', '5 Series', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(899, 'BMW', '5 Series', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(900, 'BMW', '5 Series', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(901, 'BMW', '5 Series', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(902, 'BMW', '5 Series', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(903, 'BMW', '5 Series', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(904, 'BMW', '5 Series', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(905, 'BMW', '5 Series', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(906, 'BMW', '5 Series', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(907, 'BMW', '6 Series', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(908, 'BMW', '6 Series', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(909, 'BMW', '6 Series', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(910, 'BMW', '6 Series', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(911, 'BMW', '6 Series', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(912, 'BMW', '6 Series', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(913, 'BMW', '6 Series', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(914, 'BMW', '6 Series', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(915, 'BMW', '6 Series', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(916, 'BMW', '6 Series', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(917, 'BMW', '6 Series', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(918, 'BMW', '6 Series', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(919, 'BMW', '6 Series', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(920, 'BMW', '6 Series', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(921, 'BMW', '6 Series', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(922, 'BMW', '7 Series', 1987, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(923, 'BMW', '7 Series', 1988, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(924, 'BMW', '7 Series', 1989, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(925, 'BMW', '7 Series', 1990, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(926, 'BMW', '7 Series', 1991, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(927, 'BMW', '7 Series', 1992, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(928, 'BMW', '7 Series', 1993, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(929, 'BMW', '7 Series', 1994, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(930, 'BMW', '7 Series', 1995, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(931, 'BMW', '7 Series', 1996, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(932, 'BMW', '7 Series', 1997, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(933, 'BMW', '7 Series', 1998, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(934, 'BMW', '7 Series', 1999, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(935, 'BMW', '7 Series', 2000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(936, 'BMW', '7 Series', 2001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(937, 'BMW', '7 Series', 2002, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(938, 'BMW', '7 Series', 2003, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(939, 'BMW', '7 Series', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(940, 'BMW', '7 Series', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(941, 'BMW', '7 Series', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(942, 'BMW', '7 Series', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(943, 'BMW', '7 Series', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(944, 'BMW', '7 Series', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(945, 'BMW', '7 Series', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(946, 'BMW', '7 Series', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(947, 'BMW', '7 Series', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(948, 'BMW', '7 Series', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(949, 'BMW', '7 Series', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(950, 'BMW', '7 Series', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(951, 'BMW', '7 Series', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(952, 'BMW', '7 Series', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(953, 'BMW', '7 Series', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(954, 'BMW', '7 Series', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(955, 'BMW', '7 Series', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(956, 'BMW', '7 Series', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(957, 'BMW', '7 Series', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(958, 'BMW', '7 Series', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(959, 'BMW', '7 Series', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(960, 'BMW', '7 Series', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(961, 'BMW', '8 Series', 1990, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(962, 'BMW', '8 Series', 1991, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(963, 'BMW', '8 Series', 1992, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(964, 'BMW', '8 Series', 1993, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(965, 'BMW', '8 Series', 1994, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(966, 'BMW', '8 Series', 1995, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(967, 'BMW', '8 Series', 1996, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(968, 'BMW', '8 Series', 1997, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(969, 'BMW', '8 Series', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(970, 'BMW', '8 Series', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(971, 'BMW', '8 Series', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(972, 'BMW', '8 Series', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(973, 'BMW', '8 Series', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(974, 'BMW', '8 Series', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(975, 'BMW', '8 Series', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(976, 'BMW', 'i3', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(977, 'BMW', 'i3', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(978, 'BMW', 'i3', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(979, 'BMW', 'i3', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(980, 'BMW', 'i3', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(981, 'BMW', 'i3', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(982, 'BMW', 'i3', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(983, 'BMW', 'i3', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(984, 'BMW', 'i3', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(985, 'BMW', 'i4', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(986, 'BMW', 'i4', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(987, 'BMW', 'i4', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(988, 'BMW', 'i4', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(989, 'BMW', 'i4', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(990, 'BMW', 'i7', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(991, 'BMW', 'i7', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(992, 'BMW', 'i7', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(993, 'BMW', 'i7', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(994, 'BMW', 'i8', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(995, 'BMW', 'i8', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(996, 'BMW', 'i8', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(997, 'BMW', 'i8', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(998, 'BMW', 'i8', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(999, 'BMW', 'i8', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1000, 'BMW', 'i8', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1001, 'BMW', 'iX', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1002, 'BMW', 'iX', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1003, 'BMW', 'iX', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1004, 'BMW', 'iX', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1005, 'BMW', 'iX', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1006, 'BMW', 'iX3', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1007, 'BMW', 'iX3', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1008, 'BMW', 'iX3', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1009, 'BMW', 'iX3', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1010, 'BMW', 'iX3', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1011, 'BMW', 'iX3', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1012, 'BMW', 'M2', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1013, 'BMW', 'M2', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1014, 'BMW', 'M2', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1015, 'BMW', 'M2', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1016, 'BMW', 'M2', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1017, 'BMW', 'M2', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1018, 'BMW', 'M2', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1019, 'BMW', 'M2', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1020, 'BMW', 'M2', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1021, 'BMW', 'M2', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1022, 'BMW', 'M3', 1992, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1023, 'BMW', 'M3', 1993, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1024, 'BMW', 'M3', 1994, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1025, 'BMW', 'M3', 1995, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1026, 'BMW', 'M3', 1996, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1027, 'BMW', 'M3', 1997, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1028, 'BMW', 'M3', 1998, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1029, 'BMW', 'M3', 1999, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1030, 'BMW', 'M3', 2001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1031, 'BMW', 'M3', 2002, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1032, 'BMW', 'M3', 2003, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1033, 'BMW', 'M3', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1034, 'BMW', 'M3', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1035, 'BMW', 'M3', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1036, 'BMW', 'M3', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1037, 'BMW', 'M3', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1038, 'BMW', 'M3', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1039, 'BMW', 'M3', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1040, 'BMW', 'M3', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1041, 'BMW', 'M3', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1042, 'BMW', 'M3', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1043, 'BMW', 'M3', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1044, 'BMW', 'M3', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1045, 'BMW', 'M3', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1046, 'BMW', 'M3', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1047, 'BMW', 'M3', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1048, 'BMW', 'M3', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1049, 'BMW', 'M3', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1050, 'BMW', 'M3', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1051, 'BMW', 'M3', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1052, 'BMW', 'M3', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1053, 'BMW', 'M3', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1054, 'BMW', 'M4', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1055, 'BMW', 'M4', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1056, 'BMW', 'M4', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1057, 'BMW', 'M4', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1058, 'BMW', 'M4', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1059, 'BMW', 'M4', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1060, 'BMW', 'M4', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1061, 'BMW', 'M4', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1062, 'BMW', 'M4', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1063, 'BMW', 'M4', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1064, 'BMW', 'M4', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1065, 'BMW', 'M4', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1066, 'BMW', 'M5', 1988, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1067, 'BMW', 'M5', 1989, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1068, 'BMW', 'M5', 1990, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1069, 'BMW', 'M5', 1991, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1070, 'BMW', 'M5', 1992, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1071, 'BMW', 'M5', 1993, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1072, 'BMW', 'M5', 2000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1073, 'BMW', 'M5', 2001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1074, 'BMW', 'M5', 2002, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1075, 'BMW', 'M5', 2003, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1076, 'BMW', 'M5', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1077, 'BMW', 'M5', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1078, 'BMW', 'M5', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1079, 'BMW', 'M5', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1080, 'BMW', 'M5', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1081, 'BMW', 'M5', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1082, 'BMW', 'M5', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1083, 'BMW', 'M5', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1084, 'BMW', 'M5', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1085, 'BMW', 'M5', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1086, 'BMW', 'M5', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1087, 'BMW', 'M5', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1088, 'BMW', 'M5', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1089, 'BMW', 'M5', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1090, 'BMW', 'M5', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1091, 'BMW', 'M5', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1092, 'BMW', 'M5', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1093, 'BMW', 'M5', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1094, 'BMW', 'M5', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1095, 'BMW', 'M6', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1096, 'BMW', 'M6', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1097, 'BMW', 'M6', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1098, 'BMW', 'M6', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1099, 'BMW', 'M6', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1100, 'BMW', 'M6', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1101, 'BMW', 'M6', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1102, 'BMW', 'M6', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1103, 'BMW', 'M6', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1104, 'BMW', 'M6', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1105, 'BMW', 'M6', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1106, 'BMW', 'M6', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1107, 'BMW', 'M6', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1108, 'BMW', 'M8', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1109, 'BMW', 'M8', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1110, 'BMW', 'M8', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1111, 'BMW', 'M8', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1112, 'BMW', 'M8', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1113, 'BMW', 'M8', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1114, 'BMW', 'M8', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1115, 'BMW', 'X1', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1116, 'BMW', 'X1', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1117, 'BMW', 'X1', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1118, 'BMW', 'X1', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1119, 'BMW', 'X1', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1120, 'BMW', 'X1', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active');
INSERT INTO `vehicles` (`id`, `make`, `model`, `year`, `daily_rate`, `price_usd`, `mileage`, `location`, `energy`, `gear_type`, `seats`, `doors`, `color`, `body_type`, `trim`, `images`, `description`, `source`, `source_url`, `created_at`, `updated_at`, `status`) VALUES
(1121, 'BMW', 'X1', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1122, 'BMW', 'X1', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1123, 'BMW', 'X1', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1124, 'BMW', 'X1', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1125, 'BMW', 'X1', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1126, 'BMW', 'X1', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1127, 'BMW', 'X1', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1128, 'BMW', 'X1', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1129, 'BMW', 'X1', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1130, 'BMW', 'X1', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1131, 'BMW', 'X2', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1132, 'BMW', 'X2', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1133, 'BMW', 'X2', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1134, 'BMW', 'X2', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1135, 'BMW', 'X2', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1136, 'BMW', 'X2', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1137, 'BMW', 'X2', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1138, 'BMW', 'X2', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1139, 'BMW', 'X3', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1140, 'BMW', 'X3', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1141, 'BMW', 'X3', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1142, 'BMW', 'X3', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1143, 'BMW', 'X3', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1144, 'BMW', 'X3', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1145, 'BMW', 'X3', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1146, 'BMW', 'X3', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1147, 'BMW', 'X3', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1148, 'BMW', 'X3', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1149, 'BMW', 'X3', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1150, 'BMW', 'X3', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1151, 'BMW', 'X3', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1152, 'BMW', 'X3', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1153, 'BMW', 'X3', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1154, 'BMW', 'X3', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1155, 'BMW', 'X3', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1156, 'BMW', 'X3', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1157, 'BMW', 'X3', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1158, 'BMW', 'X3', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1159, 'BMW', 'X3', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1160, 'BMW', 'X3', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1161, 'BMW', 'X4', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1162, 'BMW', 'X4', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1163, 'BMW', 'X4', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1164, 'BMW', 'X4', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1165, 'BMW', 'X4', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1166, 'BMW', 'X4', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1167, 'BMW', 'X4', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1168, 'BMW', 'X4', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1169, 'BMW', 'X4', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1170, 'BMW', 'X4', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1171, 'BMW', 'X4', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1172, 'BMW', 'X4', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1173, 'BMW', 'X5', 2000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1174, 'BMW', 'X5', 2001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1175, 'BMW', 'X5', 2002, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1176, 'BMW', 'X5', 2003, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1177, 'BMW', 'X5', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1178, 'BMW', 'X5', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1179, 'BMW', 'X5', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1180, 'BMW', 'X5', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1181, 'BMW', 'X5', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1182, 'BMW', 'X5', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1183, 'BMW', 'X5', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1184, 'BMW', 'X5', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1185, 'BMW', 'X5', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1186, 'BMW', 'X5', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1187, 'BMW', 'X5', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1188, 'BMW', 'X5', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1189, 'BMW', 'X5', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1190, 'BMW', 'X5', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1191, 'BMW', 'X5', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1192, 'BMW', 'X5', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1193, 'BMW', 'X5', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1194, 'BMW', 'X5', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1195, 'BMW', 'X5', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1196, 'BMW', 'X5', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1197, 'BMW', 'X5', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1198, 'BMW', 'X5', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1199, 'BMW', 'X6', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1200, 'BMW', 'X6', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1201, 'BMW', 'X6', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1202, 'BMW', 'X6', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1203, 'BMW', 'X6', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1204, 'BMW', 'X6', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1205, 'BMW', 'X6', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1206, 'BMW', 'X6', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1207, 'BMW', 'X6', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1208, 'BMW', 'X6', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1209, 'BMW', 'X6', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1210, 'BMW', 'X6', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1211, 'BMW', 'X6', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1212, 'BMW', 'X6', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1213, 'BMW', 'X6', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1214, 'BMW', 'X6', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1215, 'BMW', 'X6', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1216, 'BMW', 'X6', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1217, 'BMW', 'X7', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1218, 'BMW', 'X7', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1219, 'BMW', 'X7', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1220, 'BMW', 'X7', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1221, 'BMW', 'X7', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1222, 'BMW', 'X7', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1223, 'BMW', 'X7', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1224, 'BMW', 'Z3', 1996, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1225, 'BMW', 'Z3', 1997, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1226, 'BMW', 'Z3', 1998, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1227, 'BMW', 'Z3', 1999, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1228, 'BMW', 'Z3', 2000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1229, 'BMW', 'Z3', 2001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1230, 'BMW', 'Z3', 2002, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1231, 'BMW', 'Z4', 2003, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1232, 'BMW', 'Z4', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1233, 'BMW', 'Z4', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1234, 'BMW', 'Z4', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1235, 'BMW', 'Z4', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1236, 'BMW', 'Z4', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1237, 'BMW', 'Z4', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1238, 'BMW', 'Z4', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1239, 'BMW', 'Z4', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1240, 'BMW', 'Z4', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1241, 'BMW', 'Z4', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1242, 'BMW', 'Z4', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1243, 'BMW', 'Z4', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1244, 'BMW', 'Z4', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1245, 'BMW', 'Z4', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1246, 'BMW', 'Z4', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1247, 'BMW', 'Z4', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1248, 'BMW', 'Z4', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1249, 'BMW', 'Z4', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1250, 'BMW', 'Z4', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1251, 'BMW', 'Z4', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1252, 'Buick', 'Cascada', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1253, 'Buick', 'Cascada', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1254, 'Buick', 'Cascada', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1255, 'Buick', 'Cascada', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1256, 'Buick', 'Enclave', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1257, 'Buick', 'Enclave', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1258, 'Buick', 'Enclave', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1259, 'Buick', 'Enclave', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1260, 'Buick', 'Enclave', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1261, 'Buick', 'Enclave', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1262, 'Buick', 'Enclave', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1263, 'Buick', 'Enclave', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1264, 'Buick', 'Enclave', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1265, 'Buick', 'Enclave', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1266, 'Buick', 'Enclave', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1267, 'Buick', 'Enclave', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1268, 'Buick', 'Enclave', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1269, 'Buick', 'Enclave', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1270, 'Buick', 'Enclave', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1271, 'Buick', 'Enclave', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1272, 'Buick', 'Enclave', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1273, 'Buick', 'Enclave', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1274, 'Buick', 'Encore', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1275, 'Buick', 'Encore', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1276, 'Buick', 'Encore', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1277, 'Buick', 'Encore', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1278, 'Buick', 'Encore', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1279, 'Buick', 'Encore', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1280, 'Buick', 'Encore', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1281, 'Buick', 'Encore', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1282, 'Buick', 'Encore', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1283, 'Buick', 'Encore', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1284, 'Buick', 'Encore GX', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1285, 'Buick', 'Encore GX', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1286, 'Buick', 'Encore GX', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1287, 'Buick', 'Encore GX', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1288, 'Buick', 'Encore GX', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1289, 'Buick', 'Encore GX', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1290, 'Buick', 'Envision', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1291, 'Buick', 'Envision', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1292, 'Buick', 'Envision', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1293, 'Buick', 'Envision', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1294, 'Buick', 'Envision', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1295, 'Buick', 'Envision', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1296, 'Buick', 'Envision', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1297, 'Buick', 'Envision', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1298, 'Buick', 'Envision', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1299, 'Buick', 'Envision', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1300, 'Buick', 'LaCrosse', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1301, 'Buick', 'LaCrosse', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1302, 'Buick', 'LaCrosse', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1303, 'Buick', 'LaCrosse', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1304, 'Buick', 'LaCrosse', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1305, 'Buick', 'LaCrosse', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1306, 'Buick', 'LaCrosse', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1307, 'Buick', 'LaCrosse', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1308, 'Buick', 'LaCrosse', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1309, 'Buick', 'LaCrosse', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1310, 'Buick', 'LaCrosse', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1311, 'Buick', 'LaCrosse', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1312, 'Buick', 'LaCrosse', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1313, 'Buick', 'LaCrosse', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1314, 'Buick', 'LaCrosse', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1315, 'Buick', 'Park Avenue', 1991, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1316, 'Buick', 'Park Avenue', 1992, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1317, 'Buick', 'Park Avenue', 1993, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1318, 'Buick', 'Park Avenue', 1994, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1319, 'Buick', 'Park Avenue', 1995, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1320, 'Buick', 'Park Avenue', 1996, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1321, 'Buick', 'Park Avenue', 1997, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1322, 'Buick', 'Park Avenue', 1998, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1323, 'Buick', 'Park Avenue', 1999, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1324, 'Buick', 'Park Avenue', 2000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1325, 'Buick', 'Park Avenue', 2001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1326, 'Buick', 'Park Avenue', 2002, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1327, 'Buick', 'Park Avenue', 2003, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1328, 'Buick', 'Park Avenue', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1329, 'Buick', 'Park Avenue', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1330, 'Buick', 'Regal', 1988, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1331, 'Buick', 'Regal', 1989, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1332, 'Buick', 'Regal', 1990, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1333, 'Buick', 'Regal', 1991, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1334, 'Buick', 'Regal', 1992, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1335, 'Buick', 'Regal', 1993, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1336, 'Buick', 'Regal', 1994, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1337, 'Buick', 'Regal', 1995, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1338, 'Buick', 'Regal', 1996, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1339, 'Buick', 'Regal', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1340, 'Buick', 'Regal', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1341, 'Buick', 'Regal', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1342, 'Buick', 'Regal', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1343, 'Buick', 'Regal', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1344, 'Buick', 'Regal', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1345, 'Buick', 'Regal', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1346, 'Buick', 'Regal', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1347, 'Buick', 'Regal', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1348, 'Buick', 'Regal', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1349, 'Buick', 'Verano', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1350, 'Buick', 'Verano', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1351, 'Buick', 'Verano', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1352, 'Buick', 'Verano', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1353, 'Buick', 'Verano', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1354, 'Buick', 'Verano', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1355, 'Cadillac', 'ATS', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1356, 'Cadillac', 'ATS', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1357, 'Cadillac', 'ATS', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1358, 'Cadillac', 'ATS', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1359, 'Cadillac', 'ATS', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1360, 'Cadillac', 'ATS', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1361, 'Cadillac', 'ATS', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1362, 'Cadillac', 'CT4', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1363, 'Cadillac', 'CT4', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1364, 'Cadillac', 'CT4', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1365, 'Cadillac', 'CT4', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1366, 'Cadillac', 'CT4', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1367, 'Cadillac', 'CT4', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1368, 'Cadillac', 'CT5', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1369, 'Cadillac', 'CT5', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1370, 'Cadillac', 'CT5', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1371, 'Cadillac', 'CT5', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1372, 'Cadillac', 'CT5', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1373, 'Cadillac', 'CT5', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1374, 'Cadillac', 'CT6', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1375, 'Cadillac', 'CT6', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1376, 'Cadillac', 'CT6', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1377, 'Cadillac', 'CT6', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1378, 'Cadillac', 'CT6', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1379, 'Cadillac', 'CTS', 2003, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1380, 'Cadillac', 'CTS', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1381, 'Cadillac', 'CTS', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1382, 'Cadillac', 'CTS', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1383, 'Cadillac', 'CTS', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1384, 'Cadillac', 'CTS', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1385, 'Cadillac', 'CTS', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1386, 'Cadillac', 'CTS', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1387, 'Cadillac', 'CTS', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1388, 'Cadillac', 'CTS', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1389, 'Cadillac', 'CTS', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1390, 'Cadillac', 'CTS', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1391, 'Cadillac', 'CTS', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1392, 'Cadillac', 'CTS', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1393, 'Cadillac', 'CTS', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1394, 'Cadillac', 'CTS', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1395, 'Cadillac', 'CTS', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1396, 'Cadillac', 'DeVille', 1994, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1397, 'Cadillac', 'DeVille', 1995, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1398, 'Cadillac', 'DeVille', 1996, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1399, 'Cadillac', 'DeVille', 1997, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1400, 'Cadillac', 'DeVille', 1998, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1401, 'Cadillac', 'DeVille', 1999, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1402, 'Cadillac', 'DeVille', 2000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1403, 'Cadillac', 'DeVille', 2001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1404, 'Cadillac', 'DeVille', 2002, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active');
INSERT INTO `vehicles` (`id`, `make`, `model`, `year`, `daily_rate`, `price_usd`, `mileage`, `location`, `energy`, `gear_type`, `seats`, `doors`, `color`, `body_type`, `trim`, `images`, `description`, `source`, `source_url`, `created_at`, `updated_at`, `status`) VALUES
(1405, 'Cadillac', 'DeVille', 2003, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1406, 'Cadillac', 'DeVille', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1407, 'Cadillac', 'DeVille', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1408, 'Cadillac', 'DTS', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1409, 'Cadillac', 'DTS', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1410, 'Cadillac', 'DTS', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1411, 'Cadillac', 'DTS', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1412, 'Cadillac', 'DTS', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1413, 'Cadillac', 'DTS', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1414, 'Cadillac', 'Eldorado', 1992, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1415, 'Cadillac', 'Eldorado', 1993, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1416, 'Cadillac', 'Eldorado', 1994, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1417, 'Cadillac', 'Eldorado', 1995, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1418, 'Cadillac', 'Eldorado', 1996, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1419, 'Cadillac', 'Eldorado', 1997, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1420, 'Cadillac', 'Eldorado', 1998, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1421, 'Cadillac', 'Eldorado', 1999, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1422, 'Cadillac', 'Eldorado', 2000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1423, 'Cadillac', 'Eldorado', 2001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1424, 'Cadillac', 'Eldorado', 2002, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1425, 'Cadillac', 'Escalade', 1999, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1426, 'Cadillac', 'Escalade', 2000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1427, 'Cadillac', 'Escalade', 2002, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1428, 'Cadillac', 'Escalade', 2003, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1429, 'Cadillac', 'Escalade', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1430, 'Cadillac', 'Escalade', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1431, 'Cadillac', 'Escalade', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1432, 'Cadillac', 'Escalade', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1433, 'Cadillac', 'Escalade', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1434, 'Cadillac', 'Escalade', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1435, 'Cadillac', 'Escalade', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1436, 'Cadillac', 'Escalade', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1437, 'Cadillac', 'Escalade', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1438, 'Cadillac', 'Escalade', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1439, 'Cadillac', 'Escalade', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1440, 'Cadillac', 'Escalade', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1441, 'Cadillac', 'Escalade', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1442, 'Cadillac', 'Escalade', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1443, 'Cadillac', 'Escalade', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1444, 'Cadillac', 'Escalade', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1445, 'Cadillac', 'Escalade', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1446, 'Cadillac', 'Escalade', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1447, 'Cadillac', 'Escalade', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1448, 'Cadillac', 'Escalade', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1449, 'Cadillac', 'Escalade', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1450, 'Cadillac', 'Escalade', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1451, 'Cadillac', 'LYRIQ', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1452, 'Cadillac', 'LYRIQ', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1453, 'Cadillac', 'LYRIQ', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1454, 'Cadillac', 'LYRIQ', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1455, 'Cadillac', 'SRX', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1456, 'Cadillac', 'SRX', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1457, 'Cadillac', 'SRX', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1458, 'Cadillac', 'SRX', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1459, 'Cadillac', 'SRX', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1460, 'Cadillac', 'SRX', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1461, 'Cadillac', 'SRX', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1462, 'Cadillac', 'SRX', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1463, 'Cadillac', 'SRX', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1464, 'Cadillac', 'SRX', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1465, 'Cadillac', 'SRX', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1466, 'Cadillac', 'SRX', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1467, 'Cadillac', 'SRX', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1468, 'Cadillac', 'STS', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1469, 'Cadillac', 'STS', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1470, 'Cadillac', 'STS', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1471, 'Cadillac', 'STS', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1472, 'Cadillac', 'STS', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1473, 'Cadillac', 'STS', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1474, 'Cadillac', 'STS', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1475, 'Cadillac', 'XLR', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1476, 'Cadillac', 'XLR', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1477, 'Cadillac', 'XLR', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1478, 'Cadillac', 'XLR', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1479, 'Cadillac', 'XLR', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1480, 'Cadillac', 'XLR', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1481, 'Cadillac', 'XT4', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1482, 'Cadillac', 'XT4', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1483, 'Cadillac', 'XT4', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1484, 'Cadillac', 'XT4', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1485, 'Cadillac', 'XT4', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1486, 'Cadillac', 'XT4', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1487, 'Cadillac', 'XT4', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1488, 'Cadillac', 'XT5', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1489, 'Cadillac', 'XT5', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1490, 'Cadillac', 'XT5', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1491, 'Cadillac', 'XT5', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1492, 'Cadillac', 'XT5', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1493, 'Cadillac', 'XT5', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1494, 'Cadillac', 'XT5', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1495, 'Cadillac', 'XT5', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1496, 'Cadillac', 'XT5', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1497, 'Cadillac', 'XT6', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1498, 'Cadillac', 'XT6', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1499, 'Cadillac', 'XT6', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1500, 'Cadillac', 'XT6', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1501, 'Cadillac', 'XT6', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1502, 'Cadillac', 'XT6', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1503, 'Chevrolet', 'Avalanche', 2002, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1504, 'Chevrolet', 'Avalanche', 2003, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1505, 'Chevrolet', 'Avalanche', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1506, 'Chevrolet', 'Avalanche', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1507, 'Chevrolet', 'Avalanche', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1508, 'Chevrolet', 'Avalanche', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1509, 'Chevrolet', 'Avalanche', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1510, 'Chevrolet', 'Avalanche', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1511, 'Chevrolet', 'Avalanche', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1512, 'Chevrolet', 'Avalanche', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1513, 'Chevrolet', 'Avalanche', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1514, 'Chevrolet', 'Avalanche', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1515, 'Chevrolet', 'Blazer', 1992, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1516, 'Chevrolet', 'Blazer', 1993, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1517, 'Chevrolet', 'Blazer', 1994, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1518, 'Chevrolet', 'Blazer', 1995, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1519, 'Chevrolet', 'Blazer', 1996, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1520, 'Chevrolet', 'Blazer', 1997, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1521, 'Chevrolet', 'Blazer', 1998, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1522, 'Chevrolet', 'Blazer', 1999, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1523, 'Chevrolet', 'Blazer', 2000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1524, 'Chevrolet', 'Blazer', 2001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1525, 'Chevrolet', 'Blazer', 2002, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1526, 'Chevrolet', 'Blazer', 2003, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1527, 'Chevrolet', 'Blazer', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1528, 'Chevrolet', 'Blazer', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1529, 'Chevrolet', 'Blazer', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1530, 'Chevrolet', 'Blazer', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1531, 'Chevrolet', 'Blazer', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1532, 'Chevrolet', 'Blazer', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1533, 'Chevrolet', 'Blazer', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1534, 'Chevrolet', 'Blazer', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1535, 'Chevrolet', 'Blazer', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1536, 'Chevrolet', 'Bolt EV', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1537, 'Chevrolet', 'Bolt EV', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1538, 'Chevrolet', 'Bolt EV', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1539, 'Chevrolet', 'Bolt EV', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1540, 'Chevrolet', 'Bolt EV', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1541, 'Chevrolet', 'Bolt EV', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1542, 'Chevrolet', 'Bolt EV', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1543, 'Chevrolet', 'Bolt EV', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1544, 'Chevrolet', 'Bolt EV', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1545, 'Chevrolet', 'Bolt EUV', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1546, 'Chevrolet', 'Bolt EUV', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1547, 'Chevrolet', 'Bolt EUV', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1548, 'Chevrolet', 'Bolt EUV', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1549, 'Chevrolet', 'Camaro', 1993, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1550, 'Chevrolet', 'Camaro', 1994, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1551, 'Chevrolet', 'Camaro', 1995, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1552, 'Chevrolet', 'Camaro', 1996, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1553, 'Chevrolet', 'Camaro', 1997, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1554, 'Chevrolet', 'Camaro', 1998, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1555, 'Chevrolet', 'Camaro', 1999, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1556, 'Chevrolet', 'Camaro', 2000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1557, 'Chevrolet', 'Camaro', 2001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1558, 'Chevrolet', 'Camaro', 2002, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1559, 'Chevrolet', 'Camaro', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1560, 'Chevrolet', 'Camaro', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1561, 'Chevrolet', 'Camaro', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1562, 'Chevrolet', 'Camaro', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1563, 'Chevrolet', 'Camaro', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1564, 'Chevrolet', 'Camaro', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1565, 'Chevrolet', 'Camaro', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1566, 'Chevrolet', 'Camaro', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1567, 'Chevrolet', 'Camaro', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1568, 'Chevrolet', 'Camaro', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1569, 'Chevrolet', 'Camaro', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1570, 'Chevrolet', 'Camaro', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1571, 'Chevrolet', 'Camaro', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1572, 'Chevrolet', 'Camaro', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1573, 'Chevrolet', 'Camaro', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1574, 'Chevrolet', 'Captiva', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1575, 'Chevrolet', 'Captiva', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1576, 'Chevrolet', 'Captiva', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1577, 'Chevrolet', 'Captiva', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1578, 'Chevrolet', 'Colorado', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1579, 'Chevrolet', 'Colorado', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1580, 'Chevrolet', 'Colorado', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1581, 'Chevrolet', 'Colorado', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1582, 'Chevrolet', 'Colorado', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1583, 'Chevrolet', 'Colorado', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1584, 'Chevrolet', 'Colorado', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1585, 'Chevrolet', 'Colorado', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1586, 'Chevrolet', 'Colorado', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1587, 'Chevrolet', 'Colorado', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1588, 'Chevrolet', 'Colorado', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1589, 'Chevrolet', 'Colorado', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1590, 'Chevrolet', 'Colorado', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1591, 'Chevrolet', 'Colorado', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1592, 'Chevrolet', 'Colorado', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1593, 'Chevrolet', 'Colorado', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1594, 'Chevrolet', 'Colorado', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1595, 'Chevrolet', 'Colorado', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1596, 'Chevrolet', 'Colorado', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1597, 'Chevrolet', 'Colorado', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1598, 'Chevrolet', 'Corvette', 1984, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1599, 'Chevrolet', 'Corvette', 1985, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1600, 'Chevrolet', 'Corvette', 1986, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1601, 'Chevrolet', 'Corvette', 1987, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1602, 'Chevrolet', 'Corvette', 1988, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1603, 'Chevrolet', 'Corvette', 1989, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1604, 'Chevrolet', 'Corvette', 1990, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1605, 'Chevrolet', 'Corvette', 1991, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1606, 'Chevrolet', 'Corvette', 1992, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1607, 'Chevrolet', 'Corvette', 1993, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1608, 'Chevrolet', 'Corvette', 1994, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1609, 'Chevrolet', 'Corvette', 1995, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1610, 'Chevrolet', 'Corvette', 1996, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1611, 'Chevrolet', 'Corvette', 1997, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1612, 'Chevrolet', 'Corvette', 1998, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1613, 'Chevrolet', 'Corvette', 1999, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1614, 'Chevrolet', 'Corvette', 2000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1615, 'Chevrolet', 'Corvette', 2001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1616, 'Chevrolet', 'Corvette', 2002, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1617, 'Chevrolet', 'Corvette', 2003, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1618, 'Chevrolet', 'Corvette', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1619, 'Chevrolet', 'Corvette', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1620, 'Chevrolet', 'Corvette', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1621, 'Chevrolet', 'Corvette', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1622, 'Chevrolet', 'Corvette', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1623, 'Chevrolet', 'Corvette', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1624, 'Chevrolet', 'Corvette', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1625, 'Chevrolet', 'Corvette', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1626, 'Chevrolet', 'Corvette', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1627, 'Chevrolet', 'Corvette', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1628, 'Chevrolet', 'Corvette', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1629, 'Chevrolet', 'Corvette', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1630, 'Chevrolet', 'Corvette', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1631, 'Chevrolet', 'Corvette', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1632, 'Chevrolet', 'Corvette', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1633, 'Chevrolet', 'Corvette', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1634, 'Chevrolet', 'Corvette', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1635, 'Chevrolet', 'Corvette', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1636, 'Chevrolet', 'Corvette', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1637, 'Chevrolet', 'Corvette', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1638, 'Chevrolet', 'Corvette', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1639, 'Chevrolet', 'Corvette', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1640, 'Chevrolet', 'Cruze', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1641, 'Chevrolet', 'Cruze', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1642, 'Chevrolet', 'Cruze', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1643, 'Chevrolet', 'Cruze', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1644, 'Chevrolet', 'Cruze', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1645, 'Chevrolet', 'Cruze', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1646, 'Chevrolet', 'Cruze', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1647, 'Chevrolet', 'Cruze', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1648, 'Chevrolet', 'Cruze', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1649, 'Chevrolet', 'Equinox', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1650, 'Chevrolet', 'Equinox', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1651, 'Chevrolet', 'Equinox', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1652, 'Chevrolet', 'Equinox', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1653, 'Chevrolet', 'Equinox', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1654, 'Chevrolet', 'Equinox', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1655, 'Chevrolet', 'Equinox', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1656, 'Chevrolet', 'Equinox', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1657, 'Chevrolet', 'Equinox', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1658, 'Chevrolet', 'Equinox', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1659, 'Chevrolet', 'Equinox', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1660, 'Chevrolet', 'Equinox', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1661, 'Chevrolet', 'Equinox', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1662, 'Chevrolet', 'Equinox', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1663, 'Chevrolet', 'Equinox', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1664, 'Chevrolet', 'Equinox', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1665, 'Chevrolet', 'Equinox', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1666, 'Chevrolet', 'Equinox', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1667, 'Chevrolet', 'Equinox', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1668, 'Chevrolet', 'Equinox', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1669, 'Chevrolet', 'Equinox', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1670, 'Chevrolet', 'Express', 1996, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1671, 'Chevrolet', 'Express', 1997, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1672, 'Chevrolet', 'Express', 1998, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1673, 'Chevrolet', 'Express', 1999, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1674, 'Chevrolet', 'Express', 2000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1675, 'Chevrolet', 'Express', 2001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1676, 'Chevrolet', 'Express', 2002, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1677, 'Chevrolet', 'Express', 2003, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1678, 'Chevrolet', 'Express', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active');
INSERT INTO `vehicles` (`id`, `make`, `model`, `year`, `daily_rate`, `price_usd`, `mileage`, `location`, `energy`, `gear_type`, `seats`, `doors`, `color`, `body_type`, `trim`, `images`, `description`, `source`, `source_url`, `created_at`, `updated_at`, `status`) VALUES
(1679, 'Chevrolet', 'Express', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1680, 'Chevrolet', 'Express', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1681, 'Chevrolet', 'Express', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1682, 'Chevrolet', 'Express', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1683, 'Chevrolet', 'Express', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1684, 'Chevrolet', 'Express', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1685, 'Chevrolet', 'Express', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1686, 'Chevrolet', 'Express', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1687, 'Chevrolet', 'Express', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1688, 'Chevrolet', 'Express', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1689, 'Chevrolet', 'Express', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1690, 'Chevrolet', 'Express', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1691, 'Chevrolet', 'Express', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1692, 'Chevrolet', 'Express', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1693, 'Chevrolet', 'Express', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1694, 'Chevrolet', 'Express', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1695, 'Chevrolet', 'Express', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1696, 'Chevrolet', 'Express', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1697, 'Chevrolet', 'Express', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1698, 'Chevrolet', 'Express', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1699, 'Chevrolet', 'Express', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1700, 'Chevrolet', 'Impala', 1994, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1701, 'Chevrolet', 'Impala', 1995, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1702, 'Chevrolet', 'Impala', 1996, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1703, 'Chevrolet', 'Impala', 2000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1704, 'Chevrolet', 'Impala', 2001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1705, 'Chevrolet', 'Impala', 2002, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1706, 'Chevrolet', 'Impala', 2003, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1707, 'Chevrolet', 'Impala', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1708, 'Chevrolet', 'Impala', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1709, 'Chevrolet', 'Impala', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1710, 'Chevrolet', 'Impala', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1711, 'Chevrolet', 'Impala', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1712, 'Chevrolet', 'Impala', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1713, 'Chevrolet', 'Impala', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1714, 'Chevrolet', 'Impala', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1715, 'Chevrolet', 'Impala', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1716, 'Chevrolet', 'Impala', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1717, 'Chevrolet', 'Impala', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1718, 'Chevrolet', 'Impala', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1719, 'Chevrolet', 'Impala', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1720, 'Chevrolet', 'Impala', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1721, 'Chevrolet', 'Impala', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1722, 'Chevrolet', 'Impala', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1723, 'Chevrolet', 'Impala', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1724, 'Chevrolet', 'Malibu', 1997, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1725, 'Chevrolet', 'Malibu', 1998, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1726, 'Chevrolet', 'Malibu', 1999, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1727, 'Chevrolet', 'Malibu', 2000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1728, 'Chevrolet', 'Malibu', 2001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1729, 'Chevrolet', 'Malibu', 2002, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1730, 'Chevrolet', 'Malibu', 2003, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1731, 'Chevrolet', 'Malibu', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1732, 'Chevrolet', 'Malibu', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1733, 'Chevrolet', 'Malibu', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1734, 'Chevrolet', 'Malibu', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1735, 'Chevrolet', 'Malibu', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1736, 'Chevrolet', 'Malibu', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1737, 'Chevrolet', 'Malibu', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1738, 'Chevrolet', 'Malibu', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1739, 'Chevrolet', 'Malibu', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1740, 'Chevrolet', 'Malibu', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1741, 'Chevrolet', 'Malibu', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1742, 'Chevrolet', 'Malibu', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1743, 'Chevrolet', 'Malibu', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1744, 'Chevrolet', 'Malibu', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1745, 'Chevrolet', 'Malibu', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1746, 'Chevrolet', 'Malibu', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1747, 'Chevrolet', 'Malibu', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1748, 'Chevrolet', 'Malibu', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1749, 'Chevrolet', 'Silverado', 1999, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1750, 'Chevrolet', 'Silverado', 2000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1751, 'Chevrolet', 'Silverado', 2001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1752, 'Chevrolet', 'Silverado', 2002, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1753, 'Chevrolet', 'Silverado', 2003, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1754, 'Chevrolet', 'Silverado', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1755, 'Chevrolet', 'Silverado', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1756, 'Chevrolet', 'Silverado', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1757, 'Chevrolet', 'Silverado', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1758, 'Chevrolet', 'Silverado', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1759, 'Chevrolet', 'Silverado', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1760, 'Chevrolet', 'Silverado', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1761, 'Chevrolet', 'Silverado', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1762, 'Chevrolet', 'Silverado', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1763, 'Chevrolet', 'Silverado', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1764, 'Chevrolet', 'Silverado', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1765, 'Chevrolet', 'Silverado', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1766, 'Chevrolet', 'Silverado', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1767, 'Chevrolet', 'Silverado', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1768, 'Chevrolet', 'Silverado', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1769, 'Chevrolet', 'Silverado', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1770, 'Chevrolet', 'Silverado', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1771, 'Chevrolet', 'Silverado', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1772, 'Chevrolet', 'Silverado', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1773, 'Chevrolet', 'Silverado', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1774, 'Chevrolet', 'Silverado', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1775, 'Chevrolet', 'Silverado', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1776, 'Chevrolet', 'Sonic', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1777, 'Chevrolet', 'Sonic', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1778, 'Chevrolet', 'Sonic', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1779, 'Chevrolet', 'Sonic', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1780, 'Chevrolet', 'Sonic', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1781, 'Chevrolet', 'Sonic', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1782, 'Chevrolet', 'Sonic', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1783, 'Chevrolet', 'Sonic', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1784, 'Chevrolet', 'Sonic', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1785, 'Chevrolet', 'Spark', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1786, 'Chevrolet', 'Spark', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1787, 'Chevrolet', 'Spark', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1788, 'Chevrolet', 'Spark', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1789, 'Chevrolet', 'Spark', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1790, 'Chevrolet', 'Spark', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1791, 'Chevrolet', 'Spark', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1792, 'Chevrolet', 'Spark', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1793, 'Chevrolet', 'Spark', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1794, 'Chevrolet', 'Spark', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1795, 'Chevrolet', 'Suburban', 1992, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1796, 'Chevrolet', 'Suburban', 1993, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1797, 'Chevrolet', 'Suburban', 1994, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1798, 'Chevrolet', 'Suburban', 1995, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1799, 'Chevrolet', 'Suburban', 1996, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1800, 'Chevrolet', 'Suburban', 1997, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1801, 'Chevrolet', 'Suburban', 1998, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1802, 'Chevrolet', 'Suburban', 1999, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1803, 'Chevrolet', 'Suburban', 2000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1804, 'Chevrolet', 'Suburban', 2001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1805, 'Chevrolet', 'Suburban', 2002, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1806, 'Chevrolet', 'Suburban', 2003, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1807, 'Chevrolet', 'Suburban', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1808, 'Chevrolet', 'Suburban', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1809, 'Chevrolet', 'Suburban', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1810, 'Chevrolet', 'Suburban', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1811, 'Chevrolet', 'Suburban', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1812, 'Chevrolet', 'Suburban', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1813, 'Chevrolet', 'Suburban', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1814, 'Chevrolet', 'Suburban', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1815, 'Chevrolet', 'Suburban', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1816, 'Chevrolet', 'Suburban', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1817, 'Chevrolet', 'Suburban', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1818, 'Chevrolet', 'Suburban', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1819, 'Chevrolet', 'Suburban', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1820, 'Chevrolet', 'Suburban', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1821, 'Chevrolet', 'Suburban', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1822, 'Chevrolet', 'Suburban', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1823, 'Chevrolet', 'Suburban', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1824, 'Chevrolet', 'Suburban', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1825, 'Chevrolet', 'Suburban', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1826, 'Chevrolet', 'Suburban', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1827, 'Chevrolet', 'Suburban', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1828, 'Chevrolet', 'Suburban', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1829, 'Chevrolet', 'Tahoe', 1995, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1830, 'Chevrolet', 'Tahoe', 1996, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1831, 'Chevrolet', 'Tahoe', 1997, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1832, 'Chevrolet', 'Tahoe', 1998, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1833, 'Chevrolet', 'Tahoe', 1999, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1834, 'Chevrolet', 'Tahoe', 2000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1835, 'Chevrolet', 'Tahoe', 2001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1836, 'Chevrolet', 'Tahoe', 2002, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1837, 'Chevrolet', 'Tahoe', 2003, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1838, 'Chevrolet', 'Tahoe', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1839, 'Chevrolet', 'Tahoe', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1840, 'Chevrolet', 'Tahoe', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1841, 'Chevrolet', 'Tahoe', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1842, 'Chevrolet', 'Tahoe', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1843, 'Chevrolet', 'Tahoe', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1844, 'Chevrolet', 'Tahoe', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1845, 'Chevrolet', 'Tahoe', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1846, 'Chevrolet', 'Tahoe', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1847, 'Chevrolet', 'Tahoe', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1848, 'Chevrolet', 'Tahoe', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1849, 'Chevrolet', 'Tahoe', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1850, 'Chevrolet', 'Tahoe', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1851, 'Chevrolet', 'Tahoe', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1852, 'Chevrolet', 'Tahoe', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1853, 'Chevrolet', 'Tahoe', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1854, 'Chevrolet', 'Tahoe', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1855, 'Chevrolet', 'Tahoe', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1856, 'Chevrolet', 'Tahoe', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1857, 'Chevrolet', 'Tahoe', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1858, 'Chevrolet', 'Tahoe', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1859, 'Chevrolet', 'Tahoe', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1860, 'Chevrolet', 'Traverse', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1861, 'Chevrolet', 'Traverse', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1862, 'Chevrolet', 'Traverse', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1863, 'Chevrolet', 'Traverse', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1864, 'Chevrolet', 'Traverse', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1865, 'Chevrolet', 'Traverse', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1866, 'Chevrolet', 'Traverse', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1867, 'Chevrolet', 'Traverse', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1868, 'Chevrolet', 'Traverse', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1869, 'Chevrolet', 'Traverse', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1870, 'Chevrolet', 'Traverse', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1871, 'Chevrolet', 'Traverse', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1872, 'Chevrolet', 'Traverse', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1873, 'Chevrolet', 'Traverse', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1874, 'Chevrolet', 'Traverse', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1875, 'Chevrolet', 'Traverse', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1876, 'Chevrolet', 'Traverse', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1877, 'Chevrolet', 'Trax', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1878, 'Chevrolet', 'Trax', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1879, 'Chevrolet', 'Trax', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1880, 'Chevrolet', 'Trax', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1881, 'Chevrolet', 'Trax', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1882, 'Chevrolet', 'Trax', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1883, 'Chevrolet', 'Trax', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1884, 'Chevrolet', 'Trax', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1885, 'Chevrolet', 'Trailblazer', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1886, 'Chevrolet', 'Trailblazer', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1887, 'Chevrolet', 'Trailblazer', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1888, 'Chevrolet', 'Trailblazer', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1889, 'Chevrolet', 'Trailblazer', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1890, 'Chevrolet', 'Volt', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1891, 'Chevrolet', 'Volt', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1892, 'Chevrolet', 'Volt', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1893, 'Chevrolet', 'Volt', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1894, 'Chevrolet', 'Volt', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1895, 'Chevrolet', 'Volt', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1896, 'Chevrolet', 'Volt', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1897, 'Chevrolet', 'Volt', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1898, 'Chevrolet', 'Volt', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1899, 'Chrysler', '200', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1900, 'Chrysler', '200', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1901, 'Chrysler', '200', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1902, 'Chrysler', '200', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1903, 'Chrysler', '200', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1904, 'Chrysler', '200', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1905, 'Chrysler', '200', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1906, 'Chrysler', '300', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1907, 'Chrysler', '300', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1908, 'Chrysler', '300', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1909, 'Chrysler', '300', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1910, 'Chrysler', '300', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1911, 'Chrysler', '300', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1912, 'Chrysler', '300', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1913, 'Chrysler', '300', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1914, 'Chrysler', '300', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1915, 'Chrysler', '300', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1916, 'Chrysler', '300', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1917, 'Chrysler', '300', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1918, 'Chrysler', '300', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1919, 'Chrysler', '300', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1920, 'Chrysler', '300', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1921, 'Chrysler', '300', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1922, 'Chrysler', '300', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1923, 'Chrysler', '300', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1924, 'Chrysler', '300', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1925, 'Chrysler', 'Aspen', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1926, 'Chrysler', 'Aspen', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1927, 'Chrysler', 'Aspen', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1928, 'Chrysler', 'Concorde', 1993, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1929, 'Chrysler', 'Concorde', 1994, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1930, 'Chrysler', 'Concorde', 1995, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1931, 'Chrysler', 'Concorde', 1996, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1932, 'Chrysler', 'Concorde', 1997, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1933, 'Chrysler', 'Concorde', 1998, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1934, 'Chrysler', 'Concorde', 1999, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1935, 'Chrysler', 'Concorde', 2000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1936, 'Chrysler', 'Concorde', 2001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1937, 'Chrysler', 'Concorde', 2002, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1938, 'Chrysler', 'Concorde', 2003, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1939, 'Chrysler', 'Concorde', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1940, 'Chrysler', 'Crossfire', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1941, 'Chrysler', 'Crossfire', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1942, 'Chrysler', 'Crossfire', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1943, 'Chrysler', 'Crossfire', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1944, 'Chrysler', 'Crossfire', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1945, 'Chrysler', 'LHS', 1994, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1946, 'Chrysler', 'LHS', 1995, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1947, 'Chrysler', 'LHS', 1996, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1948, 'Chrysler', 'LHS', 1997, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1949, 'Chrysler', 'LHS', 1999, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1950, 'Chrysler', 'LHS', 2000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1951, 'Chrysler', 'LHS', 2001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1952, 'Chrysler', 'Pacifica', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active');
INSERT INTO `vehicles` (`id`, `make`, `model`, `year`, `daily_rate`, `price_usd`, `mileage`, `location`, `energy`, `gear_type`, `seats`, `doors`, `color`, `body_type`, `trim`, `images`, `description`, `source`, `source_url`, `created_at`, `updated_at`, `status`) VALUES
(1953, 'Chrysler', 'Pacifica', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1954, 'Chrysler', 'Pacifica', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1955, 'Chrysler', 'Pacifica', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1956, 'Chrysler', 'Pacifica', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1957, 'Chrysler', 'Pacifica', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1958, 'Chrysler', 'Pacifica', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1959, 'Chrysler', 'Pacifica', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1960, 'Chrysler', 'Pacifica', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1961, 'Chrysler', 'Pacifica', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1962, 'Chrysler', 'Pacifica', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1963, 'Chrysler', 'Pacifica', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1964, 'Chrysler', 'Pacifica', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1965, 'Chrysler', 'Pacifica', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1966, 'Chrysler', 'PT Cruiser', 2001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1967, 'Chrysler', 'PT Cruiser', 2002, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1968, 'Chrysler', 'PT Cruiser', 2003, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1969, 'Chrysler', 'PT Cruiser', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1970, 'Chrysler', 'PT Cruiser', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1971, 'Chrysler', 'PT Cruiser', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1972, 'Chrysler', 'PT Cruiser', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1973, 'Chrysler', 'PT Cruiser', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1974, 'Chrysler', 'PT Cruiser', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1975, 'Chrysler', 'PT Cruiser', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1976, 'Chrysler', 'Sebring', 1995, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1977, 'Chrysler', 'Sebring', 1996, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1978, 'Chrysler', 'Sebring', 1997, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1979, 'Chrysler', 'Sebring', 1998, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1980, 'Chrysler', 'Sebring', 1999, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1981, 'Chrysler', 'Sebring', 2000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1982, 'Chrysler', 'Sebring', 2001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1983, 'Chrysler', 'Sebring', 2002, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1984, 'Chrysler', 'Sebring', 2003, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1985, 'Chrysler', 'Sebring', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1986, 'Chrysler', 'Sebring', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1987, 'Chrysler', 'Sebring', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1988, 'Chrysler', 'Sebring', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1989, 'Chrysler', 'Sebring', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1990, 'Chrysler', 'Sebring', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1991, 'Chrysler', 'Sebring', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1992, 'Chrysler', 'Town & Country', 1990, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1993, 'Chrysler', 'Town & Country', 1991, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1994, 'Chrysler', 'Town & Country', 1992, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1995, 'Chrysler', 'Town & Country', 1993, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1996, 'Chrysler', 'Town & Country', 1994, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1997, 'Chrysler', 'Town & Country', 1995, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1998, 'Chrysler', 'Town & Country', 1996, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(1999, 'Chrysler', 'Town & Country', 1997, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2000, 'Chrysler', 'Town & Country', 1998, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2001, 'Chrysler', 'Town & Country', 1999, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2002, 'Chrysler', 'Town & Country', 2000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2003, 'Chrysler', 'Town & Country', 2001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2004, 'Chrysler', 'Town & Country', 2002, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2005, 'Chrysler', 'Town & Country', 2003, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2006, 'Chrysler', 'Town & Country', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2007, 'Chrysler', 'Town & Country', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2008, 'Chrysler', 'Town & Country', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2009, 'Chrysler', 'Town & Country', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2010, 'Chrysler', 'Town & Country', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2011, 'Chrysler', 'Town & Country', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2012, 'Chrysler', 'Town & Country', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2013, 'Chrysler', 'Town & Country', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2014, 'Chrysler', 'Town & Country', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2015, 'Chrysler', 'Town & Country', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2016, 'Chrysler', 'Town & Country', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2017, 'Chrysler', 'Town & Country', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2018, 'Chrysler', 'Town & Country', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2019, 'Chrysler', 'Voyager', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2020, 'Chrysler', 'Voyager', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2021, 'Chrysler', 'Voyager', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2022, 'Dacia', 'Duster', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2023, 'Dacia', 'Duster', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2024, 'Dacia', 'Duster', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2025, 'Dacia', 'Duster', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2026, 'Dacia', 'Duster', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2027, 'Dacia', 'Duster', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2028, 'Dacia', 'Duster', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2029, 'Dacia', 'Duster', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2030, 'Dacia', 'Duster', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2031, 'Dacia', 'Duster', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2032, 'Dacia', 'Duster', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2033, 'Dacia', 'Duster', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2034, 'Dacia', 'Duster', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2035, 'Dacia', 'Duster', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2036, 'Dacia', 'Duster', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2037, 'Dacia', 'Duster', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2038, 'Dacia', 'Logan', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2039, 'Dacia', 'Logan', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2040, 'Dacia', 'Logan', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2041, 'Dacia', 'Logan', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2042, 'Dacia', 'Logan', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2043, 'Dacia', 'Logan', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2044, 'Dacia', 'Logan', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2045, 'Dacia', 'Logan', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2046, 'Dacia', 'Logan', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2047, 'Dacia', 'Logan', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2048, 'Dacia', 'Logan', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2049, 'Dacia', 'Logan', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2050, 'Dacia', 'Logan', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2051, 'Dacia', 'Logan', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2052, 'Dacia', 'Logan', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2053, 'Dacia', 'Logan', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2054, 'Dacia', 'Logan', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2055, 'Dacia', 'Logan', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2056, 'Dacia', 'Logan', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2057, 'Dacia', 'Logan', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2058, 'Dacia', 'Logan', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2059, 'Dacia', 'Sandero', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2060, 'Dacia', 'Sandero', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2061, 'Dacia', 'Sandero', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2062, 'Dacia', 'Sandero', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2063, 'Dacia', 'Sandero', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2064, 'Dacia', 'Sandero', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2065, 'Dacia', 'Sandero', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2066, 'Dacia', 'Sandero', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2067, 'Dacia', 'Sandero', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2068, 'Dacia', 'Sandero', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2069, 'Dacia', 'Sandero', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2070, 'Dacia', 'Sandero', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2071, 'Dacia', 'Sandero', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2072, 'Dacia', 'Sandero', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2073, 'Dacia', 'Sandero', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2074, 'Dacia', 'Sandero', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2075, 'Dacia', 'Sandero', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2076, 'Dacia', 'Sandero', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2077, 'Dacia', 'Spring', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2078, 'Dacia', 'Spring', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2079, 'Dacia', 'Spring', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2080, 'Dacia', 'Spring', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2081, 'Dacia', 'Spring', 2025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2082, 'Dodge', 'Avenger', 1995, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2083, 'Dodge', 'Avenger', 1996, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2084, 'Dodge', 'Avenger', 1997, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2085, 'Dodge', 'Avenger', 1998, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2086, 'Dodge', 'Avenger', 1999, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2087, 'Dodge', 'Avenger', 2000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2088, 'Dodge', 'Avenger', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2089, 'Dodge', 'Avenger', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2090, 'Dodge', 'Avenger', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2091, 'Dodge', 'Avenger', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2092, 'Dodge', 'Avenger', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2093, 'Dodge', 'Avenger', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2094, 'Dodge', 'Avenger', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2095, 'Dodge', 'Challenger', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2096, 'Dodge', 'Challenger', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2097, 'Dodge', 'Challenger', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2098, 'Dodge', 'Challenger', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2099, 'Dodge', 'Challenger', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2100, 'Dodge', 'Challenger', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2101, 'Dodge', 'Challenger', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2102, 'Dodge', 'Challenger', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2103, 'Dodge', 'Challenger', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2104, 'Dodge', 'Challenger', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2105, 'Dodge', 'Challenger', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2106, 'Dodge', 'Challenger', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2107, 'Dodge', 'Challenger', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2108, 'Dodge', 'Challenger', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2109, 'Dodge', 'Challenger', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2110, 'Dodge', 'Challenger', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2111, 'Dodge', 'Charger', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2112, 'Dodge', 'Charger', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2113, 'Dodge', 'Charger', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2114, 'Dodge', 'Charger', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2115, 'Dodge', 'Charger', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2116, 'Dodge', 'Charger', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2117, 'Dodge', 'Charger', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2118, 'Dodge', 'Charger', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2119, 'Dodge', 'Charger', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2120, 'Dodge', 'Charger', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2121, 'Dodge', 'Charger', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2122, 'Dodge', 'Charger', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2123, 'Dodge', 'Charger', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2124, 'Dodge', 'Charger', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2125, 'Dodge', 'Charger', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2126, 'Dodge', 'Charger', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2127, 'Dodge', 'Charger', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2128, 'Dodge', 'Charger', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2129, 'Dodge', 'Dakota', 1987, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2130, 'Dodge', 'Dakota', 1988, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2131, 'Dodge', 'Dakota', 1989, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2132, 'Dodge', 'Dakota', 1990, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2133, 'Dodge', 'Dakota', 1991, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2134, 'Dodge', 'Dakota', 1992, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2135, 'Dodge', 'Dakota', 1993, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2136, 'Dodge', 'Dakota', 1994, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2137, 'Dodge', 'Dakota', 1995, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2138, 'Dodge', 'Dakota', 1996, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2139, 'Dodge', 'Dakota', 1997, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2140, 'Dodge', 'Dakota', 1998, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2141, 'Dodge', 'Dakota', 1999, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2142, 'Dodge', 'Dakota', 2000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2143, 'Dodge', 'Dakota', 2001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2144, 'Dodge', 'Dakota', 2002, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2145, 'Dodge', 'Dakota', 2003, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2146, 'Dodge', 'Dakota', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2147, 'Dodge', 'Dakota', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2148, 'Dodge', 'Dakota', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2149, 'Dodge', 'Dakota', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2150, 'Dodge', 'Dakota', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2151, 'Dodge', 'Dakota', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2152, 'Dodge', 'Dakota', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2153, 'Dodge', 'Dakota', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2154, 'Dodge', 'Dart', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2155, 'Dodge', 'Dart', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2156, 'Dodge', 'Dart', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2157, 'Dodge', 'Dart', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2158, 'Dodge', 'Durango', 1998, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2159, 'Dodge', 'Durango', 1999, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2160, 'Dodge', 'Durango', 2000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2161, 'Dodge', 'Durango', 2001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2162, 'Dodge', 'Durango', 2002, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2163, 'Dodge', 'Durango', 2003, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2164, 'Dodge', 'Durango', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2165, 'Dodge', 'Durango', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2166, 'Dodge', 'Durango', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2167, 'Dodge', 'Durango', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2168, 'Dodge', 'Durango', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2169, 'Dodge', 'Durango', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2170, 'Dodge', 'Durango', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2171, 'Dodge', 'Durango', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2172, 'Dodge', 'Durango', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2173, 'Dodge', 'Durango', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2174, 'Dodge', 'Durango', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2175, 'Dodge', 'Durango', 2021, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2176, 'Dodge', 'Durango', 2022, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2177, 'Dodge', 'Durango', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2178, 'Dodge', 'Grand Caravan', 1987, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2179, 'Dodge', 'Grand Caravan', 1988, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2180, 'Dodge', 'Grand Caravan', 1989, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2181, 'Dodge', 'Grand Caravan', 1990, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2182, 'Dodge', 'Grand Caravan', 1991, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2183, 'Dodge', 'Grand Caravan', 1992, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2184, 'Dodge', 'Grand Caravan', 1993, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2185, 'Dodge', 'Grand Caravan', 1994, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2186, 'Dodge', 'Grand Caravan', 1995, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2187, 'Dodge', 'Grand Caravan', 1996, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2188, 'Dodge', 'Grand Caravan', 1997, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2189, 'Dodge', 'Grand Caravan', 1998, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2190, 'Dodge', 'Grand Caravan', 1999, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2191, 'Dodge', 'Grand Caravan', 2000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2192, 'Dodge', 'Grand Caravan', 2001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2193, 'Dodge', 'Grand Caravan', 2002, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2194, 'Dodge', 'Grand Caravan', 2003, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2195, 'Dodge', 'Grand Caravan', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2196, 'Dodge', 'Grand Caravan', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2197, 'Dodge', 'Grand Caravan', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2198, 'Dodge', 'Grand Caravan', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2199, 'Dodge', 'Grand Caravan', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2200, 'Dodge', 'Grand Caravan', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2201, 'Dodge', 'Grand Caravan', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2202, 'Dodge', 'Grand Caravan', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2203, 'Dodge', 'Grand Caravan', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2204, 'Dodge', 'Grand Caravan', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2205, 'Dodge', 'Grand Caravan', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2206, 'Dodge', 'Grand Caravan', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2207, 'Dodge', 'Grand Caravan', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2208, 'Dodge', 'Grand Caravan', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2209, 'Dodge', 'Grand Caravan', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2210, 'Dodge', 'Grand Caravan', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2211, 'Dodge', 'Grand Caravan', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2212, 'Dodge', 'Journey', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2213, 'Dodge', 'Journey', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2214, 'Dodge', 'Journey', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2215, 'Dodge', 'Journey', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2216, 'Dodge', 'Journey', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2217, 'Dodge', 'Journey', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2218, 'Dodge', 'Journey', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2219, 'Dodge', 'Journey', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2220, 'Dodge', 'Journey', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2221, 'Dodge', 'Journey', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2222, 'Dodge', 'Journey', 2019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2223, 'Dodge', 'Journey', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2224, 'Dodge', 'Magnum', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2225, 'Dodge', 'Magnum', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2226, 'Dodge', 'Magnum', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2227, 'Dodge', 'Magnum', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2228, 'Dodge', 'Nitro', 2007, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active');
INSERT INTO `vehicles` (`id`, `make`, `model`, `year`, `daily_rate`, `price_usd`, `mileage`, `location`, `energy`, `gear_type`, `seats`, `doors`, `color`, `body_type`, `trim`, `images`, `description`, `source`, `source_url`, `created_at`, `updated_at`, `status`) VALUES
(2229, 'Dodge', 'Nitro', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2230, 'Dodge', 'Nitro', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2231, 'Dodge', 'Nitro', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2232, 'Dodge', 'Nitro', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2233, 'Dodge', 'Nitro', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2234, 'Dodge', 'Ram 1500', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2235, 'Dodge', 'Ram 1500', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2236, 'Dodge', 'Ram 1500', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2237, 'Dodge', 'Ram 1500', 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2238, 'Dodge', 'Ram 1500', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2239, 'Dodge', 'Ram 1500', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2240, 'Dodge', 'Ram 1500', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2241, 'Dodge', 'Ram 1500', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2242, 'Dodge', 'Ram 1500', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2243, 'Dodge', 'Ram 1500', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2244, 'Dodge', 'Stratus', 1995, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2245, 'Dodge', 'Stratus', 1996, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2246, 'Dodge', 'Stratus', 1997, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2247, 'Dodge', 'Stratus', 1998, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2248, 'Dodge', 'Stratus', 1999, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2249, 'Dodge', 'Stratus', 2000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2250, 'Dodge', 'Stratus', 2001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2251, 'Dodge', 'Stratus', 2002, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2252, 'Dodge', 'Stratus', 2003, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2253, 'Dodge', 'Stratus', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2254, 'Dodge', 'Stratus', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2255, 'Dodge', 'Stratus', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2256, 'Dodge', 'Viper', 1992, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2257, 'Dodge', 'Viper', 1993, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2258, 'Dodge', 'Viper', 1994, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2259, 'Dodge', 'Viper', 1995, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2260, 'Dodge', 'Viper', 1996, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2261, 'Dodge', 'Viper', 1997, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2262, 'Dodge', 'Viper', 1998, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2263, 'Dodge', 'Viper', 1999, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2264, 'Dodge', 'Viper', 2000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2265, 'Dodge', 'Viper', 2001, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2266, 'Dodge', 'Viper', 2002, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2267, 'Dodge', 'Viper', 2003, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2268, 'Dodge', 'Viper', 2004, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2269, 'Dodge', 'Viper', 2005, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2270, 'Dodge', 'Viper', 2006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2271, 'Dodge', 'Viper', 2008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2272, 'Dodge', 'Viper', 2009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2273, 'Dodge', 'Viper', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2274, 'Dodge', 'Viper', 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2275, 'Dodge', 'Viper', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2276, 'Dodge', 'Viper', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2277, 'Dodge', 'Viper', 2016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2278, 'Dodge', 'Viper', 2017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 00:31:45', '2025-09-08 00:31:45', 'active'),
(2279, 'Acura', 'MDX', 2026, '1865.00', 55950, NULL, 'Acura of Berlin', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Acura_MDX_2026_1757408329453.jpg\"]', '2026 Acura MDX', 'cars.com', 'https://www.cars.com/vehicledetail/8d712df4-1c2f-4dde-868d-2b5944ddf469/', '2025-09-09 13:58:50', '2025-09-09 14:36:58', 'active'),
(2280, 'Honda', 'Civic Sport', 2025, '911.00', 27343, 8869, 'Acura of Berlin', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Honda_Civic_Sport_2025_1757408330429.jpg\"]', '2025 Honda Civic Sport', 'cars.com', 'https://www.cars.com/vehicledetail/71934ccf-c76e-4c88-b41d-ce8b23d94019/', '2025-09-09 13:58:50', '2025-09-09 13:58:50', 'active'),
(2281, 'MINI', 'Countryman Cooper S', 2023, '985.00', 29544, 23142, 'Planet Honda', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/MINI_Countryman_Cooper_S_2023_1757408330809.jpg\"]', '2023 MINI Countryman Cooper S', 'cars.com', 'https://www.cars.com/vehicledetail/66a61f6e-8416-4e48-8298-0e34f7e80c9f/', '2025-09-09 13:58:51', '2025-09-09 14:37:00', 'active'),
(2282, 'Kia', 'Telluride S', 2022, '1163.00', 34876, 26069, 'Jerry Ward Autoplex', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Kia_Telluride_S_2022_1757408331011.jpg\"]', '2022 Kia Telluride S', 'cars.com', 'https://www.cars.com/vehicledetail/807c95cc-caec-4b6a-bbd4-dbb1100ac093/', '2025-09-09 13:58:51', '2025-09-09 14:37:01', 'active'),
(2283, 'Volkswagen', 'Atlas 2.0T SEL Premium R-Line 4MOTION', 2024, '1360.00', 40795, 11288, 'AutoNation Toyota Pinellas Park', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Volkswagen_Atlas_2.0T_SEL_Premium_R-Line_4MOTION_2024_1757408331362.jpg\"]', '2024 Volkswagen Atlas 2.0T SEL Premium R-Line 4MOTION', 'cars.com', 'https://www.cars.com/vehicledetail/e017acba-b43e-4bce-a1ea-dbd9cfb52bc9/', '2025-09-09 13:58:51', '2025-09-09 14:37:02', 'active'),
(2284, 'GMC', 'Sierra 1500 SLT', 2023, '1733.00', 51998, 17505, 'INFINITI of Sarasota', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/GMC_Sierra_1500_SLT_2023_1757408331560.jpg\"]', '2023 GMC Sierra 1500 SLT', 'cars.com', 'https://www.cars.com/vehicledetail/91440b87-e11a-4f0d-ab93-2ba7f0739bb2/', '2025-09-09 13:58:51', '2025-09-09 14:37:03', 'active'),
(2285, 'Honda', 'Civic Sport', 2023, '855.00', 25649, 20568, 'Star Chevrolet', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Honda_Civic_Sport_2023_1757408331762.jpg\"]', '2023 Honda Civic Sport', 'cars.com', 'https://www.cars.com/vehicledetail/8264d542-5482-4598-bfd6-fb7af933ec38/', '2025-09-09 13:58:51', '2025-09-09 14:37:06', 'active'),
(2286, 'Mitsubishi', 'Outlander Sport SE', 2024, '731.00', 21934, 27091, 'Freedom Chrysler Dodge Jeep Ram Fiat by Ed Morse', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Mitsubishi_Outlander_Sport_SE_2024_1757408331980.jpg\"]', '2024 Mitsubishi Outlander Sport SE', 'cars.com', 'https://www.cars.com/vehicledetail/97cc9d2f-9ef1-4df8-8991-cfb566997005/', '2025-09-09 13:58:52', '2025-09-09 14:37:08', 'active'),
(2287, 'Subaru', 'Outback Touring', 2023, '1043.00', 31294, 12597, 'Gettel Toyota Gainesville', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Subaru_Outback_Touring_2023_1757408332200.jpg\"]', '2023 Subaru Outback Touring', 'cars.com', 'https://www.cars.com/vehicledetail/a114ef11-883e-4d78-9035-064b16b97419/', '2025-09-09 13:58:52', '2025-09-09 14:37:11', 'active'),
(2288, 'Chevrolet', 'Silverado 1500 RST', 2019, '933.00', 27982, 144481, 'BMW of Raleigh', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Chevrolet_Silverado_1500_RST_2019_1757408332410.jpg\"]', '2019 Chevrolet Silverado 1500 RST', 'cars.com', 'https://www.cars.com/vehicledetail/f3464766-0728-4711-a789-8c6e974a6ff9/', '2025-09-09 13:58:52', '2025-09-09 14:37:11', 'active'),
(2289, 'Hyundai', 'SANTA FE SE', 2026, '1338.00', 40135, NULL, 'Boucher Hyundai of Janesville', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Hyundai_SANTA_FE_SE_2026_1757408332657.jpg\"]', '2026 Hyundai SANTA FE SE', 'cars.com', 'https://www.cars.com/vehicledetail/5d14ea68-8ae6-49d3-b9a7-60339111accf/', '2025-09-09 13:58:53', '2025-09-09 14:37:12', 'active'),
(2290, 'Lincoln', 'Nautilus Reserve', 2025, '2335.00', 70055, NULL, 'Joe Machens Ford', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Lincoln_Nautilus_Reserve_2025_1757408333081.jpg\"]', '2025 Lincoln Nautilus Reserve', 'cars.com', 'https://www.cars.com/vehicledetail/b741aaa2-5f09-46ad-b2f1-cd00d5826390/', '2025-09-09 13:58:53', '2025-09-09 14:37:13', 'active'),
(2291, 'Chrysler', 'Pacifica Limited', 2026, '1789.00', 53660, NULL, 'Arrigo Chrysler Dodge Jeep Ram FIAT of Ft. Pierce', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Chrysler_Pacifica_Limited_2026_1757408333587.jpg\"]', '2026 Chrysler Pacifica Limited', 'cars.com', 'https://www.cars.com/vehicledetail/4a3312e4-8631-4cbc-aaca-3251f68d86c8/', '2025-09-09 13:58:53', '2025-09-09 14:37:15', 'active'),
(2292, 'Chrysler', 'Pacifica L', 2025, '1205.00', 36159, NULL, 'Arrigo Dodge Chrysler Jeep Ram West Palm', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Chrysler_Pacifica_L_2025_1757408333892.jpg\"]', '2025 Chrysler Pacifica L', 'cars.com', 'https://www.cars.com/vehicledetail/cbc3dbb1-f813-481c-b5a7-d5db78c1b40d/', '2025-09-09 13:58:54', '2025-09-09 14:37:16', 'active'),
(2293, 'Honda', 'Pilot EX-L', 2025, '1578.00', 47349, NULL, 'Luther Mankato Honda', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Honda_Pilot_EX-L_2025_1757408334332.jpg\"]', '2025 Honda Pilot EX-L', 'cars.com', 'https://www.cars.com/vehicledetail/c9ed1603-3cb0-4784-b565-661896cca988/', '2025-09-09 13:58:54', '2025-09-09 14:37:17', 'active'),
(2294, 'Chevrolet', 'Tahoe LS', 2025, '2186.00', 65590, NULL, 'Chevrolet GMC of Fairbanks', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Chevrolet_Tahoe_LS_2025_1757408334570.png\"]', '2025 Chevrolet Tahoe LS', 'cars.com', 'https://www.cars.com/vehicledetail/da606d83-6d13-462a-8c30-54e5c82a7b3b/', '2025-09-09 13:58:55', '2025-09-09 14:37:19', 'active'),
(2295, 'Nissan', 'Altima 2.5 SL', 2024, '867.00', 25999, 15869, 'Pearson Nissan of Ocala', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Nissan_Altima_2.5_SL_2024_1757408335359.jpg\"]', '2024 Nissan Altima 2.5 SL', 'cars.com', 'https://www.cars.com/vehicledetail/43c1557a-b1a8-4633-ab50-2bfb02b16d13/', '2025-09-09 13:58:55', '2025-09-09 14:37:19', 'active'),
(2296, 'INFINITI', 'QX60 Base', 2018, '333.00', 10000, 145073, 'Herrin-Gear INFINITI', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/INFINITI_QX60_Base_2018_1757408335767.jpg\"]', '2018 INFINITI QX60 Base', 'cars.com', 'https://www.cars.com/vehicledetail/b4d0f258-9f3d-4f54-94cf-87da8b6faff0/', '2025-09-09 13:58:56', '2025-09-09 14:37:20', 'active'),
(2297, 'Cadillac', 'XT5 Premium Luxury', 2024, '1028.00', 30850, 37126, 'Patriot Chrysler Dodge Jeep Ram of McAlester', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Cadillac_XT5_Premium_Luxury_2024_1757408336123.jpg\"]', '2024 Cadillac XT5 Premium Luxury', 'cars.com', 'https://www.cars.com/vehicledetail/7dfa0803-99f3-47e7-aada-8bb6a41114c5/', '2025-09-09 13:58:56', '2025-11-23 08:36:03', 'active'),
(2298, 'Tesla', 'Model 3 Long Range', 2022, '936.00', 28094, 32803, 'Bob Caldwell Chrysler Jeep Dodge RAM', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Tesla_Model_3_Long_Range_2022_1757408336422.jpg\"]', '2022 Tesla Model 3 Long Range', 'cars.com', 'https://www.cars.com/vehicledetail/9936167d-db10-4d7a-b0a8-04bcb04895fc/', '2025-09-09 13:58:56', '2025-09-09 14:37:21', 'active'),
(2299, 'RAM', '2500 Big Horn', 2024, '1756.00', 52674, 27443, 'Stevenson-Hendrick Honda Wilmington', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/RAM_2500_Big_Horn_2024_1757408336636.jpg\"]', '2024 RAM 2500 Big Horn', 'cars.com', 'https://www.cars.com/vehicledetail/ce68120a-45cb-4593-8c60-12e6b61e0ea4/', '2025-09-09 13:58:56', '2025-09-09 14:37:27', 'active'),
(2300, 'Cadillac', 'Escalade Sport', 2021, '2118.00', 63537, 38722, 'Subaru of Utica', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Cadillac_Escalade_Sport_2021_1757408336855.jpg\"]', '2021 Cadillac Escalade Sport', 'cars.com', 'https://www.cars.com/vehicledetail/370dcba6-26e5-4cc0-94cc-2145da7ea4cc/', '2025-09-09 13:58:57', '2025-09-09 14:37:28', 'active'),
(2301, 'Jeep', 'Grand Cherokee Limited', 2025, '1758.00', 52735, NULL, 'Bayside Chrysler Jeep Dodge RAM', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Jeep_Grand_Cherokee_Limited_2025_1757410618381.jpg\"]', '2025 Jeep Grand Cherokee Limited', 'cars.com', 'https://www.cars.com/vehicledetail/c668037c-e0d2-46d4-839c-64d401847de9/', '2025-09-09 14:36:59', '2025-09-09 14:36:59', 'active'),
(2302, 'RAM', '1500 Big Horn/Lone Star', 2024, '1197.00', 35911, 55394, 'AutoNation Ford Orange Park', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/default-car.jpg\"]', '2024 RAM 1500 Big Horn/Lone Star', 'cars.com', 'https://www.cars.com/vehicledetail/cea67b7d-6fa1-4342-93b2-8507be78bb43/', '2025-09-09 14:37:29', '2025-09-09 14:37:29', 'active'),
(2303, 'Mercedes-Benz', 'GLC 300 4MATIC Coupe', 2026, '2327.00', 69800, NULL, 'Mercedes-Benz of Reno', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Mercedes-Benz_GLC_300_4MATIC_Coupe_2026_1757410649612.jpg\"]', '2026 Mercedes-Benz GLC 300 4MATIC Coupe', 'cars.com', 'https://www.cars.com/vehicledetail/b9872bb6-482d-4a04-812c-0a81a78a32b2/', '2025-09-09 14:37:30', '2025-09-09 14:37:30', 'active'),
(2304, 'Alfa', 'Romeo Giulia Ti', 2022, '752.00', 22557, 28419, 'Rountree Moore Ford Lincoln', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Alfa_Romeo_Giulia_Ti_2022_1757410650338.jpg\"]', '2022 Alfa Romeo Giulia Ti', 'cars.com', 'https://www.cars.com/vehicledetail/413aa3f4-5225-4ba8-a495-d1e6eeb26cad/', '2025-09-09 14:37:30', '2025-09-09 14:37:30', 'active'),
(2305, 'Audi', 'Q5 55 S line Premium', 2022, '1029.00', 30870, 52106, 'Sanders Ford of Jacksonville', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Audi_Q5_55_S_line_Premium_2022_1757410650997.jpg\"]', '2022 Audi Q5 55 S line Premium', 'cars.com', 'https://www.cars.com/vehicledetail/710e603b-5f65-4632-bfe2-c9a2befbcd71/', '2025-09-09 14:37:31', '2025-09-09 14:37:31', 'active'),
(2306, 'Kia', 'Sorento S', 2023, '898.00', 26948, 41762, 'Star Chevrolet', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Kia_Sorento_S_2023_1757410651685.jpg\"]', '2023 Kia Sorento S', 'cars.com', 'https://www.cars.com/vehicledetail/3b8affc0-e3c5-4fb5-a179-610f3f4ed2fb/', '2025-09-09 14:37:32', '2025-09-09 14:37:32', 'active'),
(2307, 'Volkswagen', 'Atlas 2.0T SE', 2022, '827.00', 24798, 51940, 'Star Chevrolet', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Volkswagen_Atlas_2.0T_SE_2022_1757410652291.jpg\"]', '2022 Volkswagen Atlas 2.0T SE', 'cars.com', 'https://www.cars.com/vehicledetail/f1f120d8-62ae-418d-b861-6a27eb3a8ace/', '2025-09-09 14:37:32', '2025-09-09 14:37:32', 'active'),
(2308, 'GMC', 'Yukon Denali', 2021, '1967.00', 58999, 94278, 'Chevrolet GMC of Fairbanks', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/GMC_Yukon_Denali_2021_1757410652926.png\"]', '2021 GMC Yukon Denali', 'cars.com', 'https://www.cars.com/vehicledetail/1a9086eb-7643-4c0f-9485-39a8f014e34d/', '2025-09-09 14:37:34', '2025-09-09 14:37:34', 'active'),
(2309, 'Jeep', 'Wrangler Rubicon', 2016, '700.00', 20995, 92381, 'Carville\'s Auto Mart', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Jeep_Wrangler_Rubicon_2016_1757410654371.jpg\"]', '2016 Jeep Wrangler Rubicon', 'cars.com', 'https://www.cars.com/vehicledetail/e940e303-d260-41b6-8a49-c14f073db99c/', '2025-09-09 14:37:36', '2025-09-09 14:37:36', 'active'),
(2310, 'Tesla', 'Model 3 Standard Range Plus', 2019, '583.00', 17500, 76894, 'Van Horn Chrysler Dodge Jeep RAM of Manitowoc', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Tesla_Model_3_Standard_Range_Plus_2019_1757410656097.jpg\"]', '2019 Tesla Model 3 Standard Range Plus', 'cars.com', 'https://www.cars.com/vehicledetail/005b3746-8ab7-4abb-aa8b-437c7577e61c/', '2025-09-09 14:37:37', '2025-09-09 14:37:37', 'active'),
(2311, 'Audi', 'Q5 45 S line Premium Plus', 2023, '1230.00', 36900, 20976, 'Moore Buick GMC', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Audi_Q5_45_S_line_Premium_Plus_2023_1757410657910.jpg\"]', '2023 Audi Q5 45 S line Premium Plus', 'cars.com', 'https://www.cars.com/vehicledetail/49795eb7-299f-4117-94a3-04b2dc36c1fa/', '2025-09-09 14:37:41', '2025-09-09 14:37:41', 'active'),
(2312, 'Chevrolet', 'Silverado 1500 High Country', 2020, '1417.00', 42500, 52584, 'Napleton\'s Auto Park Of Urbana', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Chevrolet_Silverado_1500_High_Country_2020_1757410661126.jpg\"]', '2020 Chevrolet Silverado 1500 High Country', 'cars.com', 'https://www.cars.com/vehicledetail/975d2667-a0bd-4bee-9653-c02a76fd6f57/', '2025-09-09 14:37:42', '2025-09-09 14:37:42', 'active'),
(2313, 'Lexus', 'GX 460 Premium', 2020, '1300.00', 38999, 51709, 'Lithia Toyota of Abilene', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Lexus_GX_460_Premium_2020_1757410662732.jpg\"]', '2020 Lexus GX 460 Premium', 'cars.com', 'https://www.cars.com/vehicledetail/3c4f9e84-9b55-4028-97d5-81ce99d7deb4/', '2025-09-09 14:37:43', '2025-09-09 14:37:43', 'active'),
(2314, 'Hyundai', 'PALISADE Calligraphy Night Edition', 2024, '1620.00', 48599, 5000, 'Mastrovito Hyundai', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Hyundai_PALISADE_Calligraphy_Night_Edition_2024_1757410663340.jpg\"]', '2024 Hyundai PALISADE Calligraphy Night Edition', 'cars.com', 'https://www.cars.com/vehicledetail/90eb6088-63ba-41ba-9035-b4f53ff91700/', '2025-09-09 14:37:44', '2025-09-09 14:37:44', 'active'),
(2315, 'Cadillac', 'XT5 Premium Luxury', 2022, '1033.00', 30995, 30214, 'Laurel BMW of Westmont', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Cadillac_XT5_Premium_Luxury_2022_1757410664044.jpg\"]', '2022 Cadillac XT5 Premium Luxury', 'cars.com', 'https://www.cars.com/vehicledetail/ce34639f-8044-420c-b2dc-c835d113218d/', '2025-09-09 14:37:45', '2025-09-09 14:37:45', 'active'),
(2316, 'Mitsubishi', 'Outlander PHEV SEL', 2025, '1421.00', 42632, NULL, 'RC Hill Mitsubishi-DeLand', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Mitsubishi_Outlander_PHEV_SEL_2025_1757410665637.jpg\"]', '2025 Mitsubishi Outlander PHEV SEL', 'cars.com', 'https://www.cars.com/vehicledetail/d65cc3e1-f2d8-4f5f-babc-b8da3cf94973/', '2025-09-09 14:37:46', '2025-09-09 14:37:46', 'active'),
(2317, 'Chrysler', 'Pacifica L', 2026, '1199.00', 35960, NULL, 'Lake City Chrysler Dodge Jeep Ram', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Chrysler_Pacifica_L_2026_1757410666282.jpg\"]', '2026 Chrysler Pacifica L', 'cars.com', 'https://www.cars.com/vehicledetail/fdf17e55-7e2d-4236-8104-7effe3e9cdbf/', '2025-09-09 14:37:47', '2025-11-23 08:36:08', 'active'),
(2318, 'Nissan', 'Rogue SV', 2023, '712.00', 21358, 29201, 'AutoNation Toyota Leesburg', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Nissan_Rogue_SV_2023_1757410667268.jpg\"]', '2023 Nissan Rogue SV', 'cars.com', 'https://www.cars.com/vehicledetail/6d057eb5-2071-4c19-83c2-6f2116eeb1d6/', '2025-09-09 14:37:48', '2025-09-09 14:37:48', 'active'),
(2319, 'Toyota', 'Camry SE', 2022, '966.00', 28990, 16797, 'Mike Murphy Ford', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Toyota_Camry_SE_2022_1757410668277.jpg\"]', '2022 Toyota Camry SE', 'cars.com', 'https://www.cars.com/vehicledetail/e4916b0d-7dc9-4e2e-ac6a-3de1b1014bb1/', '2025-09-09 14:37:48', '2025-09-09 14:37:48', 'active'),
(2320, 'Jeep', 'Grand Cherokee Sterling Edition', 2018, '652.00', 19562, 72201, 'AutoNation Honda Tucson Auto Mall', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Jeep_Grand_Cherokee_Sterling_Edition_2018_1757410668951.jpg\"]', '2018 Jeep Grand Cherokee Sterling Edition', 'cars.com', 'https://www.cars.com/vehicledetail/ca908a9c-fd2e-4fb4-889c-2cac79a09a12/', '2025-09-09 14:37:50', '2025-09-09 14:37:50', 'active'),
(2321, 'Hyundai', 'SANTA FE Ultimate 2.0T', 2019, '646.00', 19386, 93411, 'Cumberland Toyota', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Hyundai_SANTA_FE_Ultimate_2.0T_2019_1757410670168.jpg\"]', '2019 Hyundai SANTA FE Ultimate 2.0T', 'cars.com', 'https://www.cars.com/vehicledetail/8692e548-5c19-4ad5-9749-8a905c550202/', '2025-09-09 14:37:50', '2025-09-09 14:37:50', 'active'),
(2322, 'Honda', 'Civic EX', 2020, '633.00', 18999, 47182, 'Honda of Manhasset', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Honda_Civic_EX_2020_1763897719635.jpg\"]', '2020 Honda Civic EX', 'cars.com', 'https://www.cars.com/vehicledetail/a4e45dc1-8db8-40a5-8846-1964e3647280/', '2025-11-23 06:35:20', '2025-11-23 06:35:20', 'active'),
(2323, 'Volkswagen', 'Atlas 2.0T SEL', 2025, '1735.00', 52056, NULL, 'Hamilton Volkswagen', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Volkswagen_Atlas_2.0T_SEL_2025_1763897720413.jpg\"]', '2025 Volkswagen Atlas 2.0T SEL', 'cars.com', 'https://www.cars.com/vehicledetail/f220dfc1-92bf-4c3d-b5e5-30e988499273/', '2025-11-23 06:35:21', '2025-11-23 08:33:59', 'active'),
(2324, 'RAM', '1500 Big Horn/Lone Star', 2025, '1533.00', 45995, 21051, 'Grayson BMW', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/RAM_1500_Big_Horn_Lone_Star_2025_1763897721160.jpg\"]', '2025 RAM 1500 Big Horn/Lone Star', 'cars.com', 'https://www.cars.com/vehicledetail/8407e8d4-b353-483f-b94a-7635e57d18ff/', '2025-11-23 06:35:21', '2025-11-23 08:35:59', 'active'),
(2325, 'Buick', 'Enclave Essence', 2022, '923.00', 27699, 40339, 'McGrath Acura of Morton Grove', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Buick_Enclave_Essence_2022_1763897721876.jpg\"]', '2022 Buick Enclave Essence', 'cars.com', 'https://www.cars.com/vehicledetail/f6efe355-6cf5-4b66-a003-70c5006567be/', '2025-11-23 06:35:22', '2025-11-23 08:36:00', 'active'),
(2326, 'MINI', 'Countryman S', 2025, '1033.00', 30995, 20959, 'Volkswagen of Gainesville', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/MINI_Countryman_S_2025_1763897722576.jpg\"]', '2025 MINI Countryman S', 'cars.com', 'https://www.cars.com/vehicledetail/966b256b-04b9-463d-9bdf-07200699e575/', '2025-11-23 06:35:23', '2025-11-23 08:36:00', 'active'),
(2327, 'Cadillac', 'Escalade Premium Luxury Platinum', 2024, '2833.00', 84992, 34179, 'Jaguar Land Rover Fort Lauderdale', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Cadillac_Escalade_Premium_Luxury_Platinum_2024_1763897723317.jpg\"]', '2024 Cadillac Escalade Premium Luxury Platinum', 'cars.com', 'https://www.cars.com/vehicledetail/6c5a6013-7983-46d8-b1eb-dc4e4d305eed/', '2025-11-23 06:35:23', '2025-11-23 08:36:01', 'active'),
(2328, 'Chrysler', 'Pacifica Touring-L Plus', 2017, '500.00', 14999, 108000, 'Chevrolet GMC of Fairbanks', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Chrysler_Pacifica_Touring-L_Plus_2017_1763897723909.png\"]', '2017 Chrysler Pacifica Touring-L Plus', 'cars.com', 'https://www.cars.com/vehicledetail/358ccc36-92fc-4c0f-9d63-74993a7d54f4/', '2025-11-23 06:35:25', '2025-11-23 08:36:02', 'active'),
(2329, 'Hyundai', 'PALISADE SEL', 2025, '1182.00', 35471, 39281, 'Richmond Ford Lincoln', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Hyundai_PALISADE_SEL_2025_1763897725124.jpg\"]', '2025 Hyundai PALISADE SEL', 'cars.com', 'https://www.cars.com/vehicledetail/4b075851-1886-4251-b6d6-8a89d4b6ba03/', '2025-11-23 06:35:25', '2025-11-23 08:36:03', 'active'),
(2330, 'RAM', '2500 Limited', 2019, '1568.00', 47036, 75400, 'Honda of Kenosha', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/RAM_2500_Limited_2019_1763897725807.jpg\"]', '2019 RAM 2500 Limited', 'cars.com', 'https://www.cars.com/vehicledetail/ba262500-4ceb-4acb-b3c6-364a45a13119/', '2025-11-23 06:35:26', '2025-11-23 08:36:03', 'active'),
(2331, 'Buick', 'Envision FWD Essence', 2021, '625.00', 18738, 70548, 'Lake City GMC', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Buick_Envision_FWD_Essence_2021_1763897726432.jpg\"]', '2021 Buick Envision FWD Essence', 'cars.com', 'https://www.cars.com/vehicledetail/d6f36aac-7ea7-48f9-a986-1af2075099a8/', '2025-11-23 06:35:27', '2025-11-23 08:36:04', 'active'),
(2332, 'Buick', 'Envista Avenir FWD', 2025, '1032.00', 30960, NULL, 'Banks Chevy GMC Buick', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Buick_Envista_Avenir_FWD_2025_1763897727142.jpg\"]', '2025 Buick Envista Avenir FWD', 'cars.com', 'https://www.cars.com/vehicledetail/aa7262cf-4136-4dba-b5fa-6b778e5c4ff1/', '2025-11-23 06:35:27', '2025-11-23 08:36:04', 'active'),
(2333, 'Toyota', 'Tacoma SR5', 2025, '1532.00', 45953, NULL, 'Waite Toyota', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Toyota_Tacoma_SR5_2025_1763897727922.jpg\"]', '2025 Toyota Tacoma SR5', 'cars.com', 'https://www.cars.com/vehicledetail/319d9df3-9cf3-42a0-80f1-9eca3fe316ec/', '2025-11-23 06:35:28', '2025-11-23 08:36:05', 'active'),
(2334, 'BMW', 'X7 xDrive40i', 2026, '3022.00', 90655, NULL, 'Galleria BMW', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/BMW_X7_xDrive40i_2026_1763897728541.jpg\"]', '2026 BMW X7 xDrive40i', 'cars.com', 'https://www.cars.com/vehicledetail/9d75fcf1-1c92-4625-a633-5255c5ee7668/', '2025-11-23 06:35:29', '2025-11-23 08:36:06', 'active'),
(2335, 'Lincoln', 'Nautilus Reserve', 2026, '2363.00', 70895, NULL, 'Courtesy Ford - Portland', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Lincoln_Nautilus_Reserve_2026_1763897729195.jpg\"]', '2026 Lincoln Nautilus Reserve', 'cars.com', 'https://www.cars.com/vehicledetail/945c67c0-89e0-448c-8488-8c6ae8e75780/', '2025-11-23 06:35:29', '2025-11-23 08:36:06', 'active'),
(2336, 'Mercedes-Benz', 'GLC 300 Base 4MATIC', 2026, '1946.00', 58385, NULL, 'Mercedes-Benz of Albuquerque', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Mercedes-Benz_GLC_300_Base_4MATIC_2026_1763897729777.jpg\"]', '2026 Mercedes-Benz GLC 300 Base 4MATIC', 'cars.com', 'https://www.cars.com/vehicledetail/8185d983-b206-4f18-b148-8106891483dc/', '2025-11-23 06:35:30', '2025-11-23 08:36:07', 'active'),
(2337, 'RAM', '2500 Laramie', 2024, '1968.00', 59048, 4436, 'Gainesville Chrysler Dodge Jeep RAM', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/RAM_2500_Laramie_2024_1763897730513.jpg\"]', '2024 RAM 2500 Laramie', 'cars.com', 'https://www.cars.com/vehicledetail/4860f82a-eab6-4750-aefa-7ca765f00f18/', '2025-11-23 06:35:31', '2025-11-23 08:36:07', 'active'),
(2338, 'Dodge', 'Charger GT', 2023, '700.00', 20995, 49995, 'Sunrise Ford', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Dodge_Charger_GT_2023_1763897731161.jpg\"]', '2023 Dodge Charger GT', 'cars.com', 'https://www.cars.com/vehicledetail/08726ac0-6f25-4826-a5b0-5660be366a93/', '2025-11-23 06:35:31', '2025-11-23 08:36:08', 'active'),
(2339, 'Alfa', 'Romeo Stelvio Ti', 2023, '850.00', 25487, 39087, 'EchoPark Automotive Houston', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Alfa_Romeo_Stelvio_Ti_2023_1763897731783.jpg\"]', '2023 Alfa Romeo Stelvio Ti', 'cars.com', 'https://www.cars.com/vehicledetail/8b9cb6c7-cd90-47e3-b49e-46ce22406fea/', '2025-11-23 06:35:32', '2025-11-23 08:36:08', 'active'),
(2340, 'RAM', '2500 Tradesman', 2023, '1332.00', 39962, 9400, 'Heller Ford', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/RAM_2500_Tradesman_2023_1763897732399.jpg\"]', '2023 RAM 2500 Tradesman', 'cars.com', 'https://www.cars.com/vehicledetail/bc9b4f01-8d1a-4467-bfbd-e7527b5755c0/', '2025-11-23 06:35:33', '2025-11-23 08:36:09', 'active'),
(2341, 'Kia', 'Sorento LX', 2023, '740.00', 22188, 30675, 'Haldeman Subaru', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Kia_Sorento_LX_2023_1763897733045.jpg\"]', '2023 Kia Sorento LX', 'cars.com', 'https://www.cars.com/vehicledetail/4111bae1-a9ed-4238-9248-8f42acd77f28/', '2025-11-23 06:35:33', '2025-11-23 06:35:33', 'active'),
(2342, 'Subaru', 'Outback Limited', 2023, '963.00', 28888, 10333, 'Haldeman Subaru', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Subaru_Outback_Limited_2023_1763897733773.jpg\"]', '2023 Subaru Outback Limited', 'cars.com', 'https://www.cars.com/vehicledetail/aed28bc8-851f-4f22-86f7-7303c801bf8d/', '2025-11-23 06:35:34', '2025-11-23 08:36:09', 'active'),
(2343, 'Jeep', 'Wrangler Sport S', 2024, '1130.00', 33895, 25766, 'Seminole Toyota', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Jeep_Wrangler_Sport_S_2024_1763897734587.jpg\"]', '2024 Jeep Wrangler Sport S', 'cars.com', 'https://www.cars.com/vehicledetail/7760ee52-0c47-48b4-b550-66b2c13a9fcf/', '2025-11-23 06:35:35', '2025-11-23 08:36:11', 'active'),
(2344, 'Lexus', 'TX 350 Premium', 2026, '2211.00', 66343, NULL, 'Butler Lexus', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Lexus_TX_350_Premium_2026_1763897735237.jpg\"]', '2026 Lexus TX 350 Premium', 'cars.com', 'https://www.cars.com/vehicledetail/c99ef35e-62f0-4f6f-97b1-aa3df097464b/', '2025-11-23 06:35:35', '2025-11-23 08:36:11', 'active'),
(2345, 'RAM', '1500 Rebel', 2024, '1663.00', 49900, 24245, 'Byers Toyota', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/RAM_1500_Rebel_2024_1763897735993.jpg\"]', '2024 RAM 1500 Rebel', 'cars.com', 'https://www.cars.com/vehicledetail/d210d5d9-c8ba-4d51-9124-002c5555ad99/', '2025-11-23 06:35:36', '2025-11-23 08:36:12', 'active'),
(2346, 'Buick', 'Enclave AWD Avenir', 2022, '1067.00', 31997, 53054, 'Aaron Ford of Escondido', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Buick_Enclave_AWD_Avenir_2022_1763897736661.jpg\"]', '2022 Buick Enclave AWD Avenir', 'cars.com', 'https://www.cars.com/vehicledetail/a949f456-88b3-47e0-8a1d-40a1cca01a0b/', '2025-11-23 06:35:37', '2025-11-23 08:36:12', 'active'),
(2347, 'Chrysler', '300 S', 2019, '657.00', 19700, 61175, 'Palmen Motors of Kenosha', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Chrysler_300_S_2019_1763897737283.jpg\"]', '2019 Chrysler 300 S', 'cars.com', 'https://www.cars.com/vehicledetail/67bb8eaa-2c89-4742-b091-95e449fc3da1/', '2025-11-23 06:35:38', '2025-11-23 08:36:13', 'active'),
(2348, 'Mazda', 'Mazda3 FWD w/Preferred Package', 2025, '733.00', 21995, 20772, 'Toyota of Katy', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Mazda_Mazda3_FWD_w_Preferred_Package_2025_1763897738025.jpg\"]', '2025 Mazda Mazda3 FWD w/Preferred Package', 'cars.com', 'https://www.cars.com/vehicledetail/2b171b87-aeba-4a3b-b9f2-bb73abf2a6b2/', '2025-11-23 06:35:38', '2025-11-23 08:36:13', 'active'),
(2349, 'Mazda', 'Mazda3 AWD w/Premium Package', 2023, '816.00', 24485, 23368, 'Colonial Honda of Dartmouth', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Mazda_Mazda3_AWD_w_Premium_Package_2023_1763897738725.jpg\"]', '2023 Mazda Mazda3 AWD w/Premium Package', 'cars.com', 'https://www.cars.com/vehicledetail/60421201-f545-4bfd-b056-95dcd71aac1c/', '2025-11-23 06:35:39', '2025-11-23 08:36:14', 'active'),
(2350, 'Acura', 'RDX A-Spec', 2019, '1067.00', 32000, 35530, 'McMullen Ford', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Acura_RDX_A-Spec_2019_1763897739390.jpg\"]', '2019 Acura RDX A-Spec', 'cars.com', 'https://www.cars.com/vehicledetail/62a614bd-9666-4da9-a62d-1a204cc53dd3/', '2025-11-23 06:35:40', '2025-11-23 08:36:14', 'active'),
(2351, 'Buick', 'Envision Avenir', 2025, '1263.00', 37900, 4601, 'MotorWorld Pre-Owned', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Buick_Envision_Avenir_2025_1763897740093.jpg\"]', '2025 Buick Envision Avenir', 'cars.com', 'https://www.cars.com/vehicledetail/34737c36-6cda-4368-8dc8-75dc79b93d5e/', '2025-11-23 06:35:40', '2025-11-23 08:36:15', 'active'),
(2352, 'Mitsubishi', 'Outlander SE', 2024, '816.00', 24467, 43159, 'Germain Toyota', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Mitsubishi_Outlander_SE_2024_1763897740752.jpg\"]', '2024 Mitsubishi Outlander SE', 'cars.com', 'https://www.cars.com/vehicledetail/082ef633-cf43-40e0-9c11-01cad6f1d224/', '2025-11-23 06:35:41', '2025-11-23 08:36:15', 'active'),
(2353, 'FIAT', '500 Pop', 2019, '465.00', 13959, 26983, 'Sansone Rt 1 Auto Mall', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/FIAT_500_Pop_2019_1763897741372.jpg\"]', '2019 FIAT 500 Pop', 'cars.com', 'https://www.cars.com/vehicledetail/dbe0c01a-36c7-47a7-a7c6-595af8f522f9/', '2025-11-23 06:35:42', '2025-11-23 08:36:16', 'active'),
(2354, 'Honda', 'Civic Sport', 2024, '830.00', 24888, 16734, 'Davis Acura', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Honda_Civic_Sport_2024_1763897742131.jpg\"]', '2024 Honda Civic Sport', 'cars.com', 'https://www.cars.com/vehicledetail/94ab853e-d3c7-49dd-ab73-f07d0b017105/', '2025-11-23 06:35:42', '2025-11-23 08:36:17', 'active'),
(2355, 'Tesla', 'Model 3 Long Range', 2018, '767.00', 23000, 96720, 'Elder Mitsubishi - Killeen', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Tesla_Model_3_Long_Range_2018_1763897742899.jpg\"]', '2018 Tesla Model 3 Long Range', 'cars.com', 'https://www.cars.com/vehicledetail/ac72bba9-280b-4c3c-96a6-841eec44b7b7/', '2025-11-23 06:35:43', '2025-11-23 08:36:17', 'active'),
(2356, 'Honda', 'Pilot Elite', 2025, '1844.00', 55329, NULL, 'Luther Mankato Honda', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Honda_Pilot_Elite_2025_1763897743647.jpg\"]', '2025 Honda Pilot Elite', 'cars.com', 'https://www.cars.com/vehicledetail/f8421f32-c40b-40f6-93c3-ba1934d755ab/', '2025-11-23 06:35:44', '2025-11-23 08:36:19', 'active'),
(2357, 'MINI', 'Countryman Cooper S ALL4', 2026, '1532.00', 45945, NULL, 'BMW of Fort Wayne/MINI of Fort Wayne', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/MINI_Countryman_Cooper_S_ALL4_2026_1763897744384.jpg\"]', '2026 MINI Countryman Cooper S ALL4', 'cars.com', 'https://www.cars.com/vehicledetail/f92cca5c-ac4a-47d1-91fe-c2838cfd513a/', '2025-11-23 06:35:45', '2025-11-23 08:36:19', 'active'),
(2358, 'Nissan', 'Rogue Platinum', 2023, '928.00', 27846, 15342, 'Gainesville Chrysler Dodge Jeep RAM', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Nissan_Rogue_Platinum_2023_1763897745132.jpg\"]', '2023 Nissan Rogue Platinum', 'cars.com', 'https://www.cars.com/vehicledetail/3aeb2c15-a189-4eb4-8c12-6f31c328ff4e/', '2025-11-23 06:35:45', '2025-11-23 08:36:20', 'active'),
(2359, 'Chevrolet', 'Silverado 1500 Custom Trail Boss', 2022, '1227.00', 36799, 36872, 'Elkins Chevrolet', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Chevrolet_Silverado_1500_Custom_Trail_Boss_2022_1763901596237.jpg\"]', '2022 Chevrolet Silverado 1500 Custom Trail Boss', 'cars.com', 'https://www.cars.com/vehicledetail/0ec267f9-1186-4547-967c-14fe80d6fb0f/', '2025-11-23 07:39:57', '2025-11-23 07:39:57', 'active'),
(2360, 'Audi', 'Q5 40 Premium Plus', 2023, '1044.00', 31310, 15882, 'Audi Great Neck', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Audi_Q5_40_Premium_Plus_2023_1763904839114.jpg\"]', '2023 Audi Q5 40 Premium Plus', 'cars.com', 'https://www.cars.com/vehicledetail/baea895b-0832-4bb0-9c95-76b912384ba3/', '2025-11-23 08:33:59', '2025-11-23 08:35:58', 'active'),
(2361, 'Acura', 'RDX Technology Package', 2023, '1267.00', 37998, 22008, 'Acura of Berlin', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Acura_RDX_Technology_Package_2023_1763904851559.jpg\"]', '2023 Acura RDX Technology Package', 'cars.com', 'https://www.cars.com/vehicledetail/6cb87a33-d694-405b-b44c-60ca73e80cf4/', '2025-11-23 08:34:12', '2025-11-23 08:36:10', 'active'),
(2362, 'RAM', '1500 Big Horn/Lone Star', 2020, '832.00', 24952, 69720, 'Kings Ford', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/RAM_1500_Big_Horn_Lone_Star_2020_1763904861029.jpg\"]', '2020 RAM 1500 Big Horn/Lone Star', 'cars.com', 'https://www.cars.com/vehicledetail/caaf70f0-b024-4554-ac5e-b0d5706aebd6/', '2025-11-23 08:34:21', '2025-11-23 08:36:20', 'active'),
(2363, 'INEOS', 'Grenadier AWD', 2024, '2151.00', 64540, 29433, 'Mercedes-Benz of Manchester', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/INEOS_Grenadier_AWD_2024_1763904861720.jpg\"]', '2024 INEOS Grenadier AWD', 'cars.com', 'https://www.cars.com/vehicledetail/38dd0c87-7ea3-43b7-9b8c-b8c872f09f63/', '2025-11-23 08:34:22', '2025-11-23 08:36:21', 'active'),
(2364, 'Maserati', 'Grecale Modena', 2025, '3249.00', 97480, NULL, 'Naples Luxury Imports', 'Gasoline', 'Automatic', 5, 4, 'Unknown', NULL, NULL, '[\"/images/cars/Maserati_Grecale_Modena_2025_1763904862405.jpg\"]', '2025 Maserati Grecale Modena', 'cars.com', 'https://www.cars.com/vehicledetail/1ffd36f8-87b3-4d98-b9e8-529c96109fa4/', '2025-11-23 08:34:23', '2025-11-23 08:36:21', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_catalog`
--

CREATE TABLE `vehicle_catalog` (
  `id` int(11) NOT NULL,
  `make` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  `year` year(4) NOT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `image_alt_text` varchar(255) DEFAULT NULL,
  `scraped_at` timestamp NULL DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_categories`
--

CREATE TABLE `vehicle_categories` (
  `category_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `vehicle_categories`
--

INSERT INTO `vehicle_categories` (`category_id`, `name`, `description`, `icon`, `created_at`) VALUES
(1, 'Economy', 'Small, fuel-efficient cars perfect for city driving', 'car', '2025-08-22 22:14:48'),
(2, 'Compact', 'Slightly larger than economy with more comfort', 'car', '2025-08-22 22:14:48'),
(3, 'SUV', 'Sport Utility Vehicles for families and adventure', 'suv', '2025-08-22 22:14:48'),
(4, 'Luxury', 'Premium vehicles with high-end features', 'star', '2025-08-22 22:14:48'),
(5, 'Van', 'Large vehicles for groups and cargo', 'van', '2025-08-22 22:14:48'),
(6, 'Truck', 'Heavy-duty vehicles for commercial use', 'truck', '2025-08-22 22:14:48'),
(7, 'Sedan', 'Sedan vehicles', NULL, '2025-08-25 10:40:15'),
(8, 'Hatchback', 'Hatchback vehicles', NULL, '2025-08-25 10:40:16'),
(9, 'Pickup', 'Pickup vehicles', NULL, '2025-08-25 10:40:17'),
(10, 'Sports', 'Sports vehicles', NULL, '2025-08-25 10:40:19'),
(11, 'Electric', 'Electric vehicles', NULL, '2025-08-25 10:40:20'),
(12, 'Minivan', 'Minivan vehicles', NULL, '2025-08-25 10:40:29'),
(13, 'Convertible', 'Convertible vehicles', NULL, '2025-08-25 10:40:29');

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_images`
--

CREATE TABLE `vehicle_images` (
  `id` int(11) NOT NULL,
  `vehicle_catalog_id` int(11) NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `image_type` enum('main','interior','exterior','detail') DEFAULT 'main',
  `alt_text` varchar(255) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `scraped_source` varchar(100) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `wishlists`
--

CREATE TABLE `wishlists` (
  `wishlist_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `vehicle_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `agencies`
--
ALTER TABLE `agencies`
  ADD PRIMARY KEY (`agency_id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD KEY `idx_agencies_status` (`status`),
  ADD KEY `idx_agencies_user_id` (`user_id`);

--
-- Indexes for table `agency_vehicles`
--
ALTER TABLE `agency_vehicles`
  ADD PRIMARY KEY (`vehicle_id`),
  ADD UNIQUE KEY `vehicle_number` (`vehicle_number`),
  ADD KEY `agency_id` (`agency_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `idx_agency_vehicles_agency_id` (`agency_id`),
  ADD KEY `idx_agency_vehicles_vehicle_id` (`vehicle_id`),
  ADD KEY `idx_agency_vehicles_type` (`type`),
  ADD KEY `idx_agency_vehicles_brand` (`brand`),
  ADD KEY `idx_agency_vehicles_energy` (`energy`);

--
-- Indexes for table `cars`
--
ALTER TABLE `cars`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `car_booking_searches`
--
ALTER TABLE `car_booking_searches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `car_categories`
--
ALTER TABLE `car_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `car_features`
--
ALTER TABLE `car_features`
  ADD PRIMARY KEY (`id`),
  ADD KEY `car_id` (`car_id`);

--
-- Indexes for table `chat_attachments`
--
ALTER TABLE `chat_attachments`
  ADD PRIMARY KEY (`attachment_id`),
  ADD KEY `message_id` (`message_id`);

--
-- Indexes for table `chat_conversations`
--
ALTER TABLE `chat_conversations`
  ADD PRIMARY KEY (`conversation_id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `status` (`status`),
  ADD KEY `last_message_at` (`last_message_at`);

--
-- Indexes for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `conversation_id` (`conversation_id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `reply_to_message_id` (`reply_to_message_id`),
  ADD KEY `reservation_id` (`reservation_id`),
  ADD KEY `created_at` (`created_at`),
  ADD KEY `is_deleted` (`is_deleted`);

--
-- Indexes for table `chat_message_reads`
--
ALTER TABLE `chat_message_reads`
  ADD PRIMARY KEY (`message_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `chat_participants`
--
ALTER TABLE `chat_participants`
  ADD PRIMARY KEY (`conversation_id`,`user_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `is_active` (`is_active`);

--
-- Indexes for table `commission_records`
--
ALTER TABLE `commission_records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reservation_id` (`reservation_id`),
  ADD KEY `idx_agency_status` (`agency_id`,`status`),
  ADD KEY `idx_payment_date` (`payment_date`),
  ADD KEY `idx_created_date` (`created_at`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`customer_id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `email_logs`
--
ALTER TABLE `email_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `email_queue`
--
ALTER TABLE `email_queue`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `email_rate_limits`
--
ALTER TABLE `email_rate_limits`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_limit` (`email`,`template_key`,`window_start`);

--
-- Indexes for table `email_templates`
--
ALTER TABLE `email_templates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `template_key` (`template_key`);

--
-- Indexes for table `email_unsubscribes`
--
ALTER TABLE `email_unsubscribes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `extras`
--
ALTER TABLE `extras`
  ADD PRIMARY KEY (`extra_id`);

--
-- Indexes for table `finance_reports_cache`
--
ALTER TABLE `finance_reports_cache`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `login_attempts`
--
ALTER TABLE `login_attempts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_email_created_at` (`email`,`created_at`);

--
-- Indexes for table `newsletter_subscribers`
--
ALTER TABLE `newsletter_subscribers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_token` (`token`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD UNIQUE KEY `payment_intent_id` (`payment_intent_id`),
  ADD KEY `reservation_id` (`reservation_id`),
  ADD KEY `processed_by` (`processed_by`),
  ADD KEY `idx_payments_date` (`payment_date`),
  ADD KEY `idx_payments_status` (`status`),
  ADD KEY `idx_payments_type` (`payment_type`),
  ADD KEY `idx_payments_method` (`method`),
  ADD KEY `idx_payments_reservation_status` (`reservation_id`,`status`);

--
-- Indexes for table `pickup_locations`
--
ALTER TABLE `pickup_locations`
  ADD PRIMARY KEY (`location_id`),
  ADD KEY `agency_id` (`agency_id`);

--
-- Indexes for table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`reservation_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `agency_id` (`agency_id`),
  ADD KEY `vehicle_id` (`vehicle_id`),
  ADD KEY `pickup_location_id` (`pickup_location_id`),
  ADD KEY `dropoff_location_id` (`dropoff_location_id`),
  ADD KEY `idx_reservations_status` (`status`),
  ADD KEY `idx_reservations_dates` (`start_date`,`end_date`),
  ADD KEY `idx_reservations_created_at` (`created_at`),
  ADD KEY `idx_reservations_payment_status` (`payment_status`),
  ADD KEY `idx_reservations_customer_status` (`customer_id`,`status`),
  ADD KEY `idx_reservations_agency_status` (`agency_id`,`status`),
  ADD KEY `idx_reservations_status_dates` (`status`,`start_date`,`end_date`);

--
-- Indexes for table `reservation_extras`
--
ALTER TABLE `reservation_extras`
  ADD PRIMARY KEY (`reservation_id`,`extra_id`),
  ADD KEY `extra_id` (`extra_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `agency_id` (`agency_id`),
  ADD KEY `vehicle_id` (`vehicle_id`),
  ADD KEY `reservation_id` (`reservation_id`);

--
-- Indexes for table `system_settings`
--
ALTER TABLE `system_settings`
  ADD PRIMARY KEY (`setting_id`),
  ADD UNIQUE KEY `setting_key` (`setting_key`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_verification_token` (`verification_token`),
  ADD KEY `idx_email_verified` (`email_verified`),
  ADD KEY `idx_users_email` (`email`),
  ADD KEY `idx_users_role` (`role`),
  ADD KEY `idx_users_status` (`status`),
  ADD KEY `idx_users_email_status` (`email`,`status`);

--
-- Indexes for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_vehicle` (`make`,`model`,`year`),
  ADD KEY `idx_make` (`make`),
  ADD KEY `idx_model` (`model`),
  ADD KEY `idx_year` (`year`),
  ADD KEY `idx_vehicles_make_model` (`make`,`model`),
  ADD KEY `idx_vehicles_year` (`year`),
  ADD KEY `idx_vehicles_source` (`source`),
  ADD KEY `idx_vehicles_status` (`status`),
  ADD KEY `idx_vehicles_created_at` (`created_at`);

--
-- Indexes for table `vehicle_catalog`
--
ALTER TABLE `vehicle_catalog`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_make_model_year` (`make`,`model`,`year`),
  ADD KEY `idx_make` (`make`),
  ADD KEY `idx_model` (`model`),
  ADD KEY `idx_year` (`year`);

--
-- Indexes for table `vehicle_categories`
--
ALTER TABLE `vehicle_categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `vehicle_images`
--
ALTER TABLE `vehicle_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_catalog_type` (`vehicle_catalog_id`,`image_type`),
  ADD KEY `idx_sort_order` (`sort_order`);

--
-- Indexes for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD PRIMARY KEY (`wishlist_id`),
  ADD UNIQUE KEY `unique_user_vehicle` (`user_id`,`vehicle_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_vehicle_id` (`vehicle_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `agencies`
--
ALTER TABLE `agencies`
  MODIFY `agency_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `agency_vehicles`
--
ALTER TABLE `agency_vehicles`
  MODIFY `vehicle_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `cars`
--
ALTER TABLE `cars`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `car_booking_searches`
--
ALTER TABLE `car_booking_searches`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `car_categories`
--
ALTER TABLE `car_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `car_features`
--
ALTER TABLE `car_features`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chat_attachments`
--
ALTER TABLE `chat_attachments`
  MODIFY `attachment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chat_conversations`
--
ALTER TABLE `chat_conversations`
  MODIFY `conversation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `chat_messages`
--
ALTER TABLE `chat_messages`
  MODIFY `message_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `commission_records`
--
ALTER TABLE `commission_records`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `email_logs`
--
ALTER TABLE `email_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `email_queue`
--
ALTER TABLE `email_queue`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `email_rate_limits`
--
ALTER TABLE `email_rate_limits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `email_templates`
--
ALTER TABLE `email_templates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `email_unsubscribes`
--
ALTER TABLE `email_unsubscribes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `extras`
--
ALTER TABLE `extras`
  MODIFY `extra_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `finance_reports_cache`
--
ALTER TABLE `finance_reports_cache`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `login_attempts`
--
ALTER TABLE `login_attempts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `newsletter_subscribers`
--
ALTER TABLE `newsletter_subscribers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pickup_locations`
--
ALTER TABLE `pickup_locations`
  MODIFY `location_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `reservation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;

--
-- AUTO_INCREMENT for table `system_settings`
--
ALTER TABLE `system_settings`
  MODIFY `setting_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=147;

--
-- AUTO_INCREMENT for table `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2365;

--
-- AUTO_INCREMENT for table `vehicle_catalog`
--
ALTER TABLE `vehicle_catalog`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vehicle_categories`
--
ALTER TABLE `vehicle_categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `vehicle_images`
--
ALTER TABLE `vehicle_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `wishlists`
--
ALTER TABLE `wishlists`
  MODIFY `wishlist_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `agencies`
--
ALTER TABLE `agencies`
  ADD CONSTRAINT `agencies_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `agency_vehicles`
--
ALTER TABLE `agency_vehicles`
  ADD CONSTRAINT `agency_vehicles_ibfk_1` FOREIGN KEY (`agency_id`) REFERENCES `agencies` (`agency_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `agency_vehicles_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `vehicle_categories` (`category_id`);

--
-- Constraints for table `cars`
--
ALTER TABLE `cars`
  ADD CONSTRAINT `cars_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `car_categories` (`id`);

--
-- Constraints for table `car_features`
--
ALTER TABLE `car_features`
  ADD CONSTRAINT `car_features_ibfk_1` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `chat_attachments`
--
ALTER TABLE `chat_attachments`
  ADD CONSTRAINT `chat_attachments_ibfk_1` FOREIGN KEY (`message_id`) REFERENCES `chat_messages` (`message_id`) ON DELETE CASCADE;

--
-- Constraints for table `chat_conversations`
--
ALTER TABLE `chat_conversations`
  ADD CONSTRAINT `chat_conversations_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD CONSTRAINT `chat_messages_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `chat_conversations` (`conversation_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chat_messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chat_messages_ibfk_3` FOREIGN KEY (`reply_to_message_id`) REFERENCES `chat_messages` (`message_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `chat_messages_ibfk_4` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`reservation_id`) ON DELETE SET NULL;

--
-- Constraints for table `chat_message_reads`
--
ALTER TABLE `chat_message_reads`
  ADD CONSTRAINT `chat_message_reads_ibfk_1` FOREIGN KEY (`message_id`) REFERENCES `chat_messages` (`message_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chat_message_reads_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `chat_participants`
--
ALTER TABLE `chat_participants`
  ADD CONSTRAINT `chat_participants_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `chat_conversations` (`conversation_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chat_participants_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `commission_records`
--
ALTER TABLE `commission_records`
  ADD CONSTRAINT `commission_records_ibfk_1` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`reservation_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `commission_records_ibfk_2` FOREIGN KEY (`agency_id`) REFERENCES `agencies` (`agency_id`) ON DELETE CASCADE;

--
-- Constraints for table `customers`
--
ALTER TABLE `customers`
  ADD CONSTRAINT `customers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`reservation_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`processed_by`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `pickup_locations`
--
ALTER TABLE `pickup_locations`
  ADD CONSTRAINT `pickup_locations_ibfk_1` FOREIGN KEY (`agency_id`) REFERENCES `agencies` (`agency_id`) ON DELETE CASCADE;

--
-- Constraints for table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`agency_id`) REFERENCES `agencies` (`agency_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reservations_ibfk_3` FOREIGN KEY (`vehicle_id`) REFERENCES `agency_vehicles` (`vehicle_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reservations_ibfk_4` FOREIGN KEY (`pickup_location_id`) REFERENCES `pickup_locations` (`location_id`),
  ADD CONSTRAINT `reservations_ibfk_5` FOREIGN KEY (`dropoff_location_id`) REFERENCES `pickup_locations` (`location_id`);

--
-- Constraints for table `reservation_extras`
--
ALTER TABLE `reservation_extras`
  ADD CONSTRAINT `reservation_extras_ibfk_1` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`reservation_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reservation_extras_ibfk_2` FOREIGN KEY (`extra_id`) REFERENCES `extras` (`extra_id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`agency_id`) REFERENCES `agencies` (`agency_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`vehicle_id`) REFERENCES `agency_vehicles` (`vehicle_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `reviews_ibfk_4` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`reservation_id`) ON DELETE CASCADE;

--
-- Constraints for table `vehicle_images`
--
ALTER TABLE `vehicle_images`
  ADD CONSTRAINT `vehicle_images_ibfk_1` FOREIGN KEY (`vehicle_catalog_id`) REFERENCES `vehicle_catalog` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD CONSTRAINT `fk_wishlist_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_wishlist_vehicle` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
