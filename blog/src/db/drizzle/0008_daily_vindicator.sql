CREATE TABLE `VerificationTokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires` datetime NOT NULL,
	CONSTRAINT `VerificationTokens_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `SiteSettings` MODIFY COLUMN `created_at` timestamp DEFAULT '2024-12-05 22:20:34.292';--> statement-breakpoint
ALTER TABLE `Users` ADD `email_verified` boolean DEFAULT false;