CREATE DATABASE IF NOT EXISTS fontina;

USE fontina;

-- ****************** SqlDBM: MySQL ******************;
-- ***************************************************;


-- ************************************** `students`

CREATE TABLE IF NOT EXISTS `students`
(
 `id`                        varchar(64) NOT NULL ,
 `firstName`                 text NOT NULL ,
 `lastName`                  text NOT NULL ,
 `dateOfBirth`               date NOT NULL ,
 `emailAddress`              mediumtext NOT NULL ,
 `createdAt`                 datetime NOT NULL ,
 `lastModifiedAt`             datetime NULL ,
 `profileImageURL`           mediumtext NULL ,
 `anticipatedGraduationDate` date NOT NULL ,
 `enrolledAt`                mediumtext NOT NULL ,
 `entityName`                text NOT NULL ,
 `entityVersion`             text NOT NULL ,
 `isAccountActivated`        boolean NOT NULL ,
 `status`                    text NULL ,

PRIMARY KEY (`id`)
);

INSERT INTO students (id, firstName, lastName, dateOfBirth, emailAddress, createdAt, lastModifiedAt, profileImageURL, anticipatedGraduationDate, enrolledAt, entityName, entityVersion, isAccountActivated, status)
VALUES ('1d2b3f93-804b-4e02-94ad-2eec6b90997d', 'Tony', 'Stark', '1000-01-01', 'tstark@avengers.io', '1000-01-01 00:00:00', NULL, 'https://via.placeholder.com/150', '1004-05-30', 'P.S. 118', 'student', '0.0.1', false, NULL);  


-- ************************************** `sponsors`

CREATE TABLE IF NOT EXISTS `sponsors`
(
 `id`                 varchar(64) NOT NULL ,
 `firstName`          text NOT NULL ,
 `lastName`           text NOT NULL ,
 `emailAddress`       mediumtext NOT NULL ,
 `createdAt`          datetime NOT NULL ,
 `lastModifiedAt`     datetime NULL ,
 `profileImageURL`    mediumtext NULL ,
 `entityName`         text NOT NULL ,
 `entityVersion`      text NOT NULL ,
 `isAccountActivated` boolean NOT NULL ,
 `status`             text NULL ,

PRIMARY KEY (`id`)
);

-- ************************************** `student_sponsors`

CREATE TABLE IF NOT EXISTS `student_sponsors`
(
 `sponsor_id` varchar(64) NOT NULL ,
 `student_id` varchar(64) NOT NULL ,

KEY `fkIdx_35` (`sponsor_id`),
CONSTRAINT `FK_35` FOREIGN KEY `fkIdx_35` (`sponsor_id`) REFERENCES `sponsors` (`id`),
KEY `fkIdx_41` (`student_id`),
CONSTRAINT `FK_41` FOREIGN KEY `fkIdx_41` (`student_id`) REFERENCES `students` (`id`)
);





