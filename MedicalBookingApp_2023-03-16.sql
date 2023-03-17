# ************************************************************
# Sequel Ace SQL dump
# Version 20046
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# Host: localhost (MySQL 5.7.39)
# Database: MedicalBookingApp
# Generation Time: 2023-03-16 18:37:50 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE='NO_AUTO_VALUE_ON_ZERO', SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table Appointment
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Appointment`;

CREATE TABLE `Appointment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `patient_id` int(11) NOT NULL,
  `doctor_id` int(11) NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `patient_id` (`patient_id`),
  KEY `doctor_id` (`doctor_id`),
  CONSTRAINT `appointment_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `Patient` (`id`),
  CONSTRAINT `appointment_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `Doctor` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `Appointment` WRITE;
/*!40000 ALTER TABLE `Appointment` DISABLE KEYS */;

INSERT INTO `Appointment` (`id`, `patient_id`, `doctor_id`, `reason`, `start_date`, `end_date`, `notes`, `created_at`, `updated_at`)
VALUES
	(1,4,1,'Headache','2023-02-14 06:30:00','2023-02-14 06:45:00',NULL,'2022-11-13 19:13:29','2023-03-16 14:28:35'),
	(2,4,2,NULL,'2023-03-31 10:00:00','2023-03-31 11:00:00',NULL,'2022-11-13 19:15:10','2023-03-16 14:31:02');

/*!40000 ALTER TABLE `Appointment` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table Contact
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Contact`;

CREATE TABLE `Contact` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `address` varchar(255) NOT NULL,
  `address_line2` varchar(255) DEFAULT NULL,
  `city` varchar(255) NOT NULL,
  `region` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL,
  `postal_code` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `phone_ext` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `contact_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `Contact` WRITE;
/*!40000 ALTER TABLE `Contact` DISABLE KEYS */;

INSERT INTO `Contact` (`id`, `user_id`, `address`, `address_line2`, `city`, `region`, `country`, `postal_code`, `phone_number`, `phone_ext`, `created_at`, `updated_at`)
VALUES
	(1,1,'1234 Main','','Montréal','QC','CA','H0H0H0','5140000000','','2022-10-30 14:04:17','2022-10-30 14:04:17'),
	(2,2,'54328 Principale','apt. 11','Montréal','QC','CA','HAHAHA','5144672197','7454','2022-10-30 17:26:27','2022-10-30 17:26:27'),
	(3,3,'54328 Principale','apt. 11','Saint-Basile-le-Grand','QC','CA','HAHAHA','5143296724','7455','2022-11-01 00:26:25','2022-11-01 00:26:25'),
	(5,4,'1468 99e avenue','','St-Eustache','QC','CA','HAHAHA','4505645620','','2022-11-01 00:30:26','2023-03-16 14:32:46'),
	(6,5,'5465 Principale','','Rosemère','QC','CA','HAHAHA','4506563346','','2022-11-03 22:35:20','2023-03-16 14:35:54'),
	(7,6,'6373 Rodeo Dr','','Los Angeles ','CA','USA','90210','5464649944','','2022-11-06 00:21:48','2023-03-16 14:32:33'),
	(8,21,'5465 Principale','','Bois-des-Filion','QC','CA','HAHAHA','4506663346','','2022-11-06 00:57:08','2023-03-16 14:34:21'),
	(9,26,'627 Koli','','Denver','CO','USA','87647','2184466438','','2022-11-06 01:16:29','2023-03-16 14:33:57'),
	(10,27,'5465 Principale',NULL,'Repentigny','QC','CA','HAHAHA','4506663346',NULL,'2022-11-07 00:06:34','2023-03-16 14:32:22'),
	(12,29,'5465 Principale',NULL,'Repentigny','QC','CA','HAHAHA','4506663346',NULL,'2022-11-07 00:15:06','2023-03-16 14:32:24'),
	(13,30,'363 Testing','','Testing','NL','CAN','H2H1X9','5464488484','','2022-11-07 00:35:41','2023-03-16 14:32:19'),
	(14,31,'4354 Legendre','apt. 15','Longueuil','QC','CA','H0H0H0','5143739524','666','2022-11-14 00:36:03','2023-03-16 14:33:13');

/*!40000 ALTER TABLE `Contact` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table Department
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Department`;

CREATE TABLE `Department` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `appointment_time` int(11) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `Department` WRITE;
/*!40000 ALTER TABLE `Department` DISABLE KEYS */;

INSERT INTO `Department` (`id`, `title`, `appointment_time`, `created_at`, `updated_at`)
VALUES
	(1,'FAMILY_MEDICINE',15,'2000-01-01 00:00:00','2022-11-19 12:58:41'),
	(2,'CARDIOLOGY',60,'2000-01-01 00:00:00','2022-11-19 12:58:43'),
	(3,'DERMATOLOGY',60,'2000-01-01 00:00:00','2022-11-19 12:59:00'),
	(4,'RADIOLOGY',60,'2000-01-01 00:00:00','2022-11-19 12:59:10'),
	(5,'NEUROLOGY',60,'2000-01-01 00:00:00','2022-11-19 12:59:19'),
	(6,'GYNECOLOGY',45,'2000-01-01 00:00:00','2022-11-19 12:59:31'),
	(7,'GASTROENTEROLOGY',60,'2000-01-01 00:00:00','2022-11-19 12:59:49'),
	(8,'OPHTHALMOLOGY',45,'2000-01-01 00:00:00','2022-11-19 12:59:51'),
	(9,'REHABILITATION',60,'2000-01-01 00:00:00','2022-11-19 13:00:15'),
	(10,'ONCOLOGY',90,'2000-01-01 00:00:00','2022-11-19 13:00:17'),
	(11,'RESPIROLOGY',30,'2000-01-01 00:00:00','2022-11-19 13:00:34'),
	(12,'UROLOGY',30,'2000-01-01 00:00:00','2022-11-19 13:00:44'),
	(13,'RHEUMATOLOGY',60,'2000-01-01 00:00:00','2022-11-19 13:01:04'),
	(14,'PSYCHIATRY',60,'2000-01-01 00:00:00','2022-11-19 13:01:17'),
	(15,'PLASTIC_SURGERY',60,'2000-01-01 00:00:00','2022-11-19 13:01:19');

/*!40000 ALTER TABLE `Department` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table Doctor
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Doctor`;

CREATE TABLE `Doctor` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `department_id` int(11) NOT NULL,
  `image_name` varchar(255) DEFAULT NULL,
  `start_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `end_date` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `department_id` (`department_id`),
  CONSTRAINT `doctor_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `Department` (`id`),
  CONSTRAINT `doctor_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `Doctor` WRITE;
/*!40000 ALTER TABLE `Doctor` DISABLE KEYS */;

INSERT INTO `Doctor` (`id`, `user_id`, `department_id`, `image_name`, `start_date`, `end_date`, `created_at`, `updated_at`)
VALUES
	(1,2,1,NULL,'2021-01-05 00:00:00',NULL,'2022-11-13 19:12:47','2022-11-13 19:12:47'),
	(2,3,4,NULL,'2022-05-18 00:00:00',NULL,'2022-11-13 19:13:01','2022-11-13 19:13:01'),
	(3,31,7,NULL,'2022-03-21 10:15:30',NULL,'2022-11-14 00:36:03','2022-11-14 00:36:03');

/*!40000 ALTER TABLE `Doctor` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table Patient
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Patient`;

CREATE TABLE `Patient` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `medical_id` varchar(255) NOT NULL,
  `height` varchar(255) DEFAULT NULL,
  `weight` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `medical_id` (`medical_id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `patient_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `Patient` WRITE;
/*!40000 ALTER TABLE `Patient` DISABLE KEYS */;

INSERT INTO `Patient` (`id`, `user_id`, `medical_id`, `height`, `weight`, `created_at`, `updated_at`)
VALUES
	(1,27,'ADBF-1234-FGENJ','1.56','12','2022-11-07 00:06:34','2022-11-07 00:06:34'),
	(3,29,'ADBF-1234-FGEUJ','1.56','','2022-11-07 00:15:06','2022-11-07 00:15:06'),
	(4,30,'ADBF-1234-FGEUX','1.73','','2022-11-07 00:35:41','2022-11-07 16:09:38'),
	(5,4,'GHJJ-1737-GJSJS','1.56','','2022-11-06 20:36:12','2022-11-07 16:09:27');

/*!40000 ALTER TABLE `Patient` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table Role
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Role`;

CREATE TABLE `Role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `Role` WRITE;
/*!40000 ALTER TABLE `Role` DISABLE KEYS */;

INSERT INTO `Role` (`id`, `title`, `created_at`, `updated_at`)
VALUES
	(1,'Admin','2000-01-01 00:00:00','2000-01-01 00:00:00'),
	(2,'Doctor','2000-01-01 00:00:00','2000-01-01 00:00:00'),
	(3,'Patient','2000-01-01 00:00:00','2000-01-01 00:00:00');

/*!40000 ALTER TABLE `Role` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table User
# ------------------------------------------------------------

DROP TABLE IF EXISTS `User`;

CREATE TABLE `User` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `gender` enum('F','M','O') NOT NULL,
  `birth_date` date NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` int(11) NOT NULL DEFAULT '3',
  `language` varchar(255) DEFAULT 'EN',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `Role` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;

INSERT INTO `User` (`id`, `first_name`, `last_name`, `gender`, `birth_date`, `email`, `username`, `password`, `role_id`, `language`, `created_at`, `updated_at`)
VALUES
	(1,'Admin','Admin','O','2000-01-01','admin@medical-booking.app','admin','$2b$12$yv1Gqi0cffpnP.C1pEE3euQFusSCrGObbd7mo7FRrpkajf4biAdfG',1,'EN','2022-10-30 14:04:17','2023-03-16 14:18:21'),
	(2,'Zandra','Donatas','F','1981-11-02','z.donatas+dev@medical-booking.app',NULL,'$2b$12$eDfiiKN1lNFaaLfIbkGi/eFElEQs8oiUuDLs27.94zH0BydCC/ICe',2,'FR','2022-10-30 17:26:27','2023-03-16 14:19:34'),
	(3,'Gundisalvus','Putra','M','1981-11-02','g.putra@medical-booking.app','dr.gputra','$2b$12$.NR/MqgLVYKr1VVgl9t8GuQojPSIqp6qaCpCDRweGw9FtTXgf1dde',2,'EN','2022-11-01 00:26:25','2023-03-16 14:24:54'),
	(4,'Wongani','Charley','F','1998-11-19','worigami85@hotmail.local','norigami','$2b$12$/D2AqpIWyeaTUvEZuY.wHu1OGII2I11Jii0r/GTLJiSJ0UBG5AXRS',3,'FR','2022-11-01 00:30:26','2023-03-16 14:22:14'),
	(5,'Norbert','Robert','M','1985-01-02','r_o_b_e_r_t@caramail.local','robnor','$2b$12$r1GyqBFgg.bNQG8wtAlONeDD7VTVJTw4Oh5L/r3k28PdS4NTQNAOC',3,'EN','2022-11-03 22:35:20','2023-03-16 14:24:38'),
	(6,'Nicole','Kidman','F','1971-03-23','nicole.kidman@gmail.local','KidmanNicole','$2b$12$A2sg3Bq0Q6PSOli6IWfss.q84Dl..q2R9DsNjwqhGdnKho8EfNs5y',3,'EN','2022-11-06 00:21:48','2023-03-16 14:24:29'),
	(21,'Madonna','Ciccone','F','1962-01-02','madonna@sympatico.local',NULL,'$2b$12$XPAojWB0iGpW/yp66WMYQe9NKm3cyjtNX3kR54T6U9Rs8wMovM1DW',3,'EN','2022-11-06 00:57:08','2023-03-16 14:26:05'),
	(26,'Baby Théodore','Wakins','M','1960-01-14','baby_face__1960@hotmail.local',NULL,'$2b$12$ConwTvwY0TvGFUiEpjcyo.pqez//qrCrszMDpC9yUhNrfDdCzcATi',3,'EN','2022-11-06 01:16:29','2023-03-16 14:23:37'),
	(27,'Céçille','Dubois','F','2007-12-03','cece.dubois07@sympatico.local','cece.dubois07','$2b$12$3x/RtUHKFjT6SmqH6DiIoe99Fj8JySgglIjn5EwLeSo3CEuohcAN.',3,'EN','2022-11-07 00:06:34','2023-03-16 14:21:18'),
	(29,'Madonna','Ciccone','F','1962-01-02','madonna+clone@sympatico.local','la_madonne3','$2b$12$.fviiDkf4k/pl.499z11.ORnjxGKeXZVYX5pxf.bZqRVSnwLzTvRa',3,'EN','2022-11-07 00:15:06','2023-03-16 14:26:07'),
	(30,'Michelle','Rose','F','1991-06-21','michelle.larose@gmail.local','mitch_the_rose','$2b$12$7xU15rmu6DRmUHVSdAGj2.GX20D1xjhBKFPcQ1TYSh/OeqBuCszDi',3,'FR','2022-11-07 00:35:41','2023-03-16 14:24:00'),
	(31,'Mélanie','Dubois','F','1984-06-23','m.dubois@medical-booking.app',NULL,'$2b$12$Kgk7HCa6pjs4PTptB2rcSuh3l4JQIdHTCi07K7iOmM/iMi0hhBbJq',2,'FR','2022-11-14 00:36:03','2023-03-16 14:19:44');

/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
