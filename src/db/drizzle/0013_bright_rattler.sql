ALTER TABLE `SiteSettings` MODIFY COLUMN `created_at` timestamp DEFAULT (now());--> statement-breakpoint
ALTER TABLE `SiteSettings` MODIFY COLUMN `updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `UserSocials` ADD `updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP;