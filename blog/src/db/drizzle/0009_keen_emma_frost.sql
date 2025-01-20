ALTER TABLE `SiteSettings` MODIFY COLUMN `created_at` timestamp DEFAULT '2024-12-07 16:40:23.056';--> statement-breakpoint
ALTER TABLE `VerificationTokens` MODIFY COLUMN `user_id` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `Users` ADD `account_status` varchar(30) DEFAULT 'active';