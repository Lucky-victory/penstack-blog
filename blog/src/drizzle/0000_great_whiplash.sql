CREATE TABLE `Comments` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`content` text,
	`post_id` bigint NOT NULL,
	`author_id` int NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `Comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Posts` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`title` varchar(255) DEFAULT 'No title',
	`content` longtext,
	`summary` varchar(255),
	`post_id` varchar(255),
	`slug` varchar(255) NOT NULL,
	`status` enum('draft','published','deleted') DEFAULT 'draft',
	`author_id` int NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `Posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Replies` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`content` text,
	`comment_id` bigint NOT NULL,
	`author_id` int NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `Replies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255),
	`bio` varchar(255),
	`username` varchar(255),
	`avatar` varchar(255),
	`role` enum('admin','editor','user') DEFAULT 'user',
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `Users_id` PRIMARY KEY(`id`)
);
