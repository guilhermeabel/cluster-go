CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `document` varchar(255) NOT NULL,
  `document_type` varchar(255),
  `name` varchar(255),
  `email` varchar(255) NOT NULL,
  `phone` varchar(255),
  `password` varchar(255),
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- Index by email
CREATE UNIQUE INDEX `email` ON `users` (`email`);

CREATE TABLE `user_contacts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `contact_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- Index by user_id and contact_id
CREATE UNIQUE INDEX `user_contact` ON `user_contacts` (`user_id`, `contact_id`);

CREATE TABLE `contacts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `name` varchar(255),
  `email` varchar(255),
  `phone` varchar(255),
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- Index by user_id
CREATE UNIQUE INDEX `user_id` ON `contacts` (`user_id`);

-- Populate data
INSERT INTO `users` (`id`,`document`, `name`,`phone`, `email`, `password`) VALUES
(1,'000.000.000-91', 'Admin', '55555555', 'admin@gmail.com', '123456');

INSERT INTO `contacts` (`user_id`, `name`, `email`, `phone`) VALUES
(1, 'Contact 1', 'contact1@mail.com', '123456789'),
(1, 'Contact 2', 'contact2@mail.com', '123456789');

INSERT INTO `user_contacts` (`user_id`, `contact_id`) VALUES
(1, 1),
(1, 2);



