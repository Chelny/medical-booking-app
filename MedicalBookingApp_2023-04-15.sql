# ************************************************************
# Sequel Ace SQL dump
# Version 20046
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# Host: localhost (MySQL 8.0.32)
# Database: MedicalBookingApp
# Generation Time: 2023-04-16 00:11:03 +0000
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
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `doctor_id` int NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `patient_id` (`patient_id`),
  KEY `doctor_id` (`doctor_id`),
  CONSTRAINT `fk_appointment_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `Doctor` (`id`),
  CONSTRAINT `fk_appointment_patient` FOREIGN KEY (`patient_id`) REFERENCES `Patient` (`id`),
  CONSTRAINT `ck_appointment_start_date_before_end_date` CHECK ((`start_date` <= `end_date`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;



# Dump of table Contact
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Contact`;

CREATE TABLE `Contact` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
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
  CONSTRAINT `fk_contact_user` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3;

LOCK TABLES `Contact` WRITE;
/*!40000 ALTER TABLE `Contact` DISABLE KEYS */;

INSERT INTO `Contact` (`id`, `user_id`, `address`, `address_line2`, `city`, `region`, `country`, `postal_code`, `phone_number`, `phone_ext`, `created_at`, `updated_at`)
VALUES
	(1,1,'12345 Admin',NULL,'Montréal','QC','CA','H0H0H0','5140000000',NULL,'2000-01-01 05:00:00','2000-01-01 10:00:00'),
	(2,2,'47 Brie',NULL,'Laval','QC','CA','H0H0H0','5141111111','','2023-03-27 01:19:41','2023-03-27 01:19:41'),
	(3,3,'1990 Avéoles','Apt. 6','Brossard','QC','CA','H0H0H0','5142222222','','2023-03-27 01:24:21','2023-03-27 01:24:21'),
	(4,4,'985 Merlot',NULL,'Montreal-Nord','QC','CA','H0H0H0','5146438323','1204','2023-03-27 01:31:39','2023-03-27 01:31:39'),
	(5,5,'1125 Dorough',NULL,'Montreal-West','QC','CA','H0H0H0','5149841284','5573','2023-03-27 01:34:02','2023-03-27 01:34:02'),
	(6,6,'646 29e avenue',NULL,'Beaconsfield','QC','CA','H0H0H0','5147368245','8524','2023-03-27 01:36:11','2023-03-27 01:36:11'),
	(7,7,'651 29e avenue',NULL,'Beaconsfield','QC','CA','H0H0H0','5147453253','2552','2023-03-27 01:37:21','2023-03-27 01:37:21'),
	(8,8,'1294 Transcanadienne',NULL,'Dorval','QC','CA','H0H0H0','5146462386','7535','2023-03-27 01:39:41','2023-03-27 01:39:41'),
	(9,9,'8880 Shaughnessy','','Montréal','QC','CA','H0H0H0','5147231718','','2023-03-27 01:44:14','2023-03-27 01:44:14'),
	(10,10,'68 Jamaicaway','','Boston','MA','US','12345','7184673466','','2023-03-27 01:47:42','2023-03-27 01:47:42');

/*!40000 ALTER TABLE `Contact` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table Doctor
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Doctor`;

CREATE TABLE `Doctor` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `department_id` int NOT NULL,
  `image_name` varchar(255) DEFAULT NULL,
  `start_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `end_date` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `department_id` (`department_id`),
  CONSTRAINT `fk_doctor_doctordepartment` FOREIGN KEY (`department_id`) REFERENCES `DoctorDepartment` (`id`),
  CONSTRAINT `fk_doctor_user` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ck_doctor_start_date_before_end_date` CHECK (((`end_date` is null) or ((`end_date` is not null) and (`start_date` <= `end_date`))))
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;

LOCK TABLES `Doctor` WRITE;
/*!40000 ALTER TABLE `Doctor` DISABLE KEYS */;

INSERT INTO `Doctor` (`id`, `user_id`, `department_id`, `image_name`, `start_date`, `end_date`, `created_at`, `updated_at`)
VALUES
	(1,4,4,NULL,'2023-03-27 01:31:39',NULL,'2023-03-27 01:31:39','2023-03-27 01:31:39'),
	(2,5,1,NULL,'2023-03-27 01:34:02',NULL,'2023-03-27 01:34:02','2023-03-27 01:34:02'),
	(3,6,1,NULL,'2023-03-27 01:36:11',NULL,'2023-03-27 01:36:11','2023-03-27 01:36:11'),
	(4,7,2,NULL,'2023-03-27 01:37:21',NULL,'2023-03-27 01:37:21','2023-03-27 01:37:21'),
	(5,8,6,NULL,'2023-03-27 01:39:41',NULL,'2023-03-27 01:39:41','2023-03-27 01:39:41');

/*!40000 ALTER TABLE `Doctor` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table DoctorDepartment
# ------------------------------------------------------------

DROP TABLE IF EXISTS `DoctorDepartment`;

CREATE TABLE `DoctorDepartment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `duration` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `ck_doctordepartment_duration` CHECK ((`duration` between 15 and 60))
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3;

LOCK TABLES `DoctorDepartment` WRITE;
/*!40000 ALTER TABLE `DoctorDepartment` DISABLE KEYS */;

INSERT INTO `DoctorDepartment` (`id`, `name`, `duration`, `created_at`, `updated_at`)
VALUES
	(1,'DENTIST',30,'2000-01-01 05:00:00','2000-01-01 10:00:00'),
	(2,'DENTUROLOGIST',60,'2000-01-01 05:00:00','2000-01-01 10:00:00'),
	(3,'DERMATOLOGIST',15,'2000-01-01 05:00:00','2000-01-01 10:00:00'),
	(4,'FAMILY_DOCTOR',15,'2000-01-01 05:00:00','2000-01-01 10:00:00'),
	(5,'OPTOMETRIST',30,'2000-01-01 05:00:00','2000-01-01 10:00:00'),
	(6,'PEDIATRICIAN',60,'2000-01-01 05:00:00','2000-01-01 10:00:00'),
	(7,'PLASTIC_SURGEON',60,'2000-01-01 05:00:00','2000-01-01 10:00:00'),
	(8,'PSYCHOLOGIST',60,'2000-01-01 05:00:00','2000-01-01 10:00:00');

/*!40000 ALTER TABLE `DoctorDepartment` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table DoctorSchedule
# ------------------------------------------------------------

DROP TABLE IF EXISTS `DoctorSchedule`;

CREATE TABLE `DoctorSchedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `doctor_id` int NOT NULL,
  `weekday` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `doctor_id` (`doctor_id`),
  CONSTRAINT `fk_doctorschedule_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `Doctor` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ck_doctorschedule_weekday` CHECK ((`weekday` between 1 and 7))
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb3;

LOCK TABLES `DoctorSchedule` WRITE;
/*!40000 ALTER TABLE `DoctorSchedule` DISABLE KEYS */;

INSERT INTO `DoctorSchedule` (`id`, `doctor_id`, `weekday`, `created_at`, `updated_at`)
VALUES
	(1,4,1,'2023-04-05 21:32:00','2023-04-10 21:53:40'),
	(2,4,3,'2023-04-05 21:32:00','2023-04-10 21:53:48'),
	(3,4,5,'2023-04-05 21:35:53','2023-04-10 21:53:50'),
	(4,2,4,'2023-04-12 16:23:24','2023-04-12 20:23:24'),
	(5,2,5,'2023-04-12 16:23:48','2023-04-12 20:23:48'),
	(6,2,6,'2023-04-12 16:23:59','2023-04-12 20:23:59'),
	(7,2,7,'2023-04-12 16:24:07','2023-04-12 20:24:07'),
	(8,3,1,'2023-04-12 16:24:23','2023-04-12 20:24:23'),
	(9,3,2,'2023-04-12 16:24:26','2023-04-12 20:24:26'),
	(10,3,3,'2023-04-12 16:24:28','2023-04-12 20:24:28'),
	(11,3,4,'2023-04-12 16:24:30','2023-04-12 20:24:30'),
	(12,3,5,'2023-04-12 16:24:33','2023-04-12 20:24:33');

/*!40000 ALTER TABLE `DoctorSchedule` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table Patient
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Patient`;

CREATE TABLE `Patient` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `medical_id` varchar(255) NOT NULL,
  `height` varchar(255) DEFAULT NULL,
  `weight` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `medical_id` (`medical_id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `fk_patient_user` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;

LOCK TABLES `Patient` WRITE;
/*!40000 ALTER TABLE `Patient` DISABLE KEYS */;

INSERT INTO `Patient` (`id`, `user_id`, `medical_id`, `height`, `weight`, `created_at`, `updated_at`)
VALUES
	(1,9,'DUCH-0622-CHELD','','','2023-03-27 01:44:14','2023-03-27 01:44:14'),
	(2,10,'MCGI-0519-MICHM','1.73','65','2023-03-27 01:47:42','2023-03-27 01:47:42');

/*!40000 ALTER TABLE `Patient` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table User
# ------------------------------------------------------------

DROP TABLE IF EXISTS `User`;

CREATE TABLE `User` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `gender` enum('F','M','O') NOT NULL,
  `birth_date` datetime NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` int NOT NULL DEFAULT '3',
  `language` varchar(255) NOT NULL DEFAULT 'EN',
  `active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `fk_user_userrole` FOREIGN KEY (`role_id`) REFERENCES `UserRole` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3;

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;

INSERT INTO `User` (`id`, `first_name`, `last_name`, `gender`, `birth_date`, `email`, `username`, `password`, `role_id`, `language`, `active`, `created_at`, `updated_at`)
VALUES
	(1,'Admin','Admin','O','2000-01-01 05:00:00','admin@medical-booking.app','admin','$2b$12$yv1Gqi0cffpnP.C1pEE3euQFusSCrGObbd7mo7FRrpkajf4biAdfG',1,'EN',1,'2000-01-01 05:00:00','2000-01-01 10:00:00'),
	(2,'Marjorie','Toussaint','F','1986-09-11 04:00:00','m.toussaint@medical-booking.app','marjo','$2b$12$i7IQYMAEBpc.stq3KlnrA.gdh3CBXkH3rr.N/n20klIseEMFcO/8a',1,'FR',1,'2023-03-27 01:19:41','2023-04-04 21:36:16'),
	(3,'Pierre-Marie','Georges','M','1988-06-21 04:00:00','pm.georges@medical-booking.app','jorge','$2b$12$qVANrGq9wuI4YRpTwplD.ue1pJlCwXS.Y5rOsnU2mBCtyOr1mSfBq',1,'EN',1,'2023-03-27 01:24:21','2023-04-04 21:36:17'),
	(4,'Marie','Joly','F','1978-10-14 04:00:00','m.joly@example.local','mariejoly','$2b$12$3t5cR1LMcJ/XmsE98LnmeeT5MvsRWZfrZODm77tqe6UYIxpAsDy/C',2,'EN',1,'2023-03-27 01:31:39','2023-04-04 21:36:18'),
	(5,'Roch','Marchant','M','1983-11-04 05:00:00','r.marchant@example.local','r_marchant','$2b$12$MuO4J80aBQTDXa5Y9XWVju24q3y6Gbb77T0C8GgRskLd2qndYoCDW',2,'FR',1,'2023-03-27 01:34:02','2023-04-04 21:36:19'),
	(6,'Michèle','Lord-Bertrand','F','1979-02-14 05:00:00','m.lord-bertrand@example.local','dr.mlb','$2b$12$G7RUPzSP/2XTDVxNob4hoe7ZAfJQAQcTUE6Kx5H4GRlONaS9qi3tS',2,'EN',1,'2023-03-27 01:36:11','2023-04-15 14:39:05'),
	(7,'Robert','Norbert','M','1979-02-14 05:00:00','r.norbert@example.local',NULL,'$2b$12$NfNFb3nUOLZNmcodiwHHg.CtEGyEpCspWH4VXjI1GB5VfYgIJbS1i',2,'EN',1,'2023-03-27 01:37:21','2023-04-15 14:38:02'),
	(8,'Marie Pascale','Michon','F','1981-02-11 05:00:00','mp.michon@example.local',NULL,'$2b$12$fAEZNzAfzkvZ6am2ZqtXA.gRRlysMI8XR2Co5YEeCllAvks2C0N9i',2,'EN',1,'2023-03-27 01:39:41','2023-04-15 14:37:58'),
	(9,'Chelny','Duchel','F','1980-06-22 04:00:00','chelny@example.local','chelny','$2b$12$G5u5R9cWmhn8sFQwcEGn1.FFxEXWBnKMZ9qSqlbGbAQ2Q6BCagCtG',3,'FR',1,'2023-03-27 01:44:14','2023-04-04 21:36:22'),
	(10,'Michelle','McGill','F','1985-05-19 04:00:00','michelle_mcgill85@example.local','michelle_mcgill85','$2b$12$76lzmnQvXnDInw2/sjBQF.wDUnc5iCkK59Lzm5VbvZxAywwRSmLOW',3,'EN',0,'2023-03-27 01:47:42','2023-04-05 17:44:09');

/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table UserRole
# ------------------------------------------------------------

DROP TABLE IF EXISTS `UserRole`;

CREATE TABLE `UserRole` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;

LOCK TABLES `UserRole` WRITE;
/*!40000 ALTER TABLE `UserRole` DISABLE KEYS */;

INSERT INTO `UserRole` (`id`, `title`, `created_at`, `updated_at`)
VALUES
	(1,'Admin','2000-01-01 05:00:00','2000-01-01 05:00:00'),
	(2,'Doctor','2000-01-01 05:00:00','2000-01-01 05:00:00'),
	(3,'Patient','2000-01-01 05:00:00','2000-01-01 05:00:00');

/*!40000 ALTER TABLE `UserRole` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
